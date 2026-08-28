import os
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import duckdb

from app.db.connection import get_db
from app.db.models import User, Dataset
from app.api.dependencies import get_current_user
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.services.dataset_service import STORAGE_DIR

# Data Engine imports
from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.query_executor import QueryExecutor
from app.data_engine.analysis_executor import AnalysisExecutor
from app.data_engine.question_parser import QuestionParser
from app.data_engine.answer_generator import AnswerGenerator
from app.data_engine.result_context_builder import ResultContextBuilder
from app.data_engine.analysis_pipeline import AnalysisPipeline
from app.ai.qwen_model import get_qwen_model

router = APIRouter()

@router.post("", response_model=AnalysisResponse)
def analyze_dataset(
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Perform a deterministic AI analysis on a user's dataset.
    """
    # 1. Ownership & Status Validation
    dataset = db.query(Dataset).filter(
        Dataset.id == request.dataset_id,
        Dataset.user_id == current_user.id
    ).first()
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or access denied."
        )
        
    if dataset.status != "ready":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Dataset is not ready for analysis. Status: {dataset.status}"
        )
        
    # 2. Path Security & File Verification
    stored_filename = dataset.stored_filename
    
    # Path traversal protection is inherently handled because we retrieve the filename from PostgreSQL.
    # To be extremely safe, we extract just the name.
    safe_filename = Path(stored_filename).name
    file_path = STORAGE_DIR / safe_filename
    
    # Resolve to absolute path and verify it stays inside STORAGE_DIR
    try:
        resolved_path = file_path.resolve()
        if not str(resolved_path).startswith(str(STORAGE_DIR.resolve())):
            raise HTTPException(status_code=400, detail="Invalid file path.")
    except Exception:
        raise HTTPException(status_code=404, detail="Dataset file resolving failed.")
        
    if not resolved_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Physical dataset file does not exist."
        )
        
    query_executor = None
    try:
        # 3. Dynamic Schema Extraction
        con = duckdb.connect(':memory:')
        try:
            desc = con.execute(f"SELECT * FROM read_csv_auto('{str(resolved_path)}') LIMIT 0").description
            columns = [col[0] for col in desc]
        finally:
            con.close()
            
        # 4. Engine Instantiation
        schema_mapper = SchemaMapper(columns=columns)
        schema = schema_mapper.get_result()
        
        query_executor = QueryExecutor(dataset_path=str(resolved_path), schema_mapper=schema_mapper)
        analysis_executor = AnalysisExecutor(query_executor=query_executor)
        
        # 5. Shared Qwen Model
        qwen = get_qwen_model()
        
        question_parser = QuestionParser(qwen=qwen, schema=schema)
        answer_generator = AnswerGenerator(qwen=qwen)
        
        row_count = dataset.row_count
        if row_count is None:
            try:
                row_count = query_executor.row_count()
            except Exception:
                row_count = 0
                
        result_context_builder = ResultContextBuilder(
            schema=schema,
            dataset_path=str(resolved_path),
            row_count=row_count
        )
        
        pipeline = AnalysisPipeline(
            question_parser=question_parser,
            analysis_executor=analysis_executor,
            result_context_builder=result_context_builder,
            answer_generator=answer_generator
        )
        
        # 6. Execute Analysis
        pipeline_result = pipeline.run(request.question)
        
        # 7. Construct Response Structure
        # The result from pipeline.run is:
        # { "answer": str, "data": List[Dict], "intent": Dict, "context": Dict }
        # Note: intent can be None if failed parsing, but pipeline throws ValueError usually
        intent = pipeline_result.get("intent", {})
        
        # Determine actual rows analyzed if available from query_executor context, 
        # otherwise use the metadata row count.
        rows_analyzed = dataset.row_count or 0
        
        response = {
            "dataset": {
                "id": dataset.id,
                "filename": dataset.original_filename,
                "rows_analyzed": rows_analyzed
            },
            "question": request.question,
            "intent": intent,
            "result": pipeline_result.get("data", []),
            "resolved_context": pipeline_result.get("context", {}),
            "answer": pipeline_result.get("answer", "")
        }
        
        return response
        
    except ValueError as ve:
        # Usually from parsing, schema missing columns, or invalid filters
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Log this internally in a real app, don't expose stack traces
        import logging
        logging.error(f"Analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An unexpected analysis error occurred.")
        
    finally:
        # 8. DuckDB Lifecycle Management
        if query_executor and hasattr(query_executor, 'connection'):
            try:
                query_executor.connection.close()
            except Exception:
                pass
