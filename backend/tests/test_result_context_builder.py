"""
AI DATA ANALYZER - RESULT CONTEXT BUILDER TEST
"""

import json
import sys
import os

# Add parent directory to path to import app module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import duckdb
from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.question_parser import QuestionParser
from app.data_engine.query_executor import QueryExecutor
from app.data_engine.analysis_executor import AnalysisExecutor
from app.data_engine.result_context_builder import ResultContextBuilder

DATASET_PATH = "data/sample_sales.csv"

def test_context_builder():
    print("======================================================================")
    print("AI DATA ANALYZER - RESULT CONTEXT BUILDER TEST")
    print("======================================================================\n")

    # 1. Read columns
    connection = duckdb.connect()
    columns_result = connection.execute(f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET_PATH}')").fetchall()
    connection.close()
    columns = [row[0] for row in columns_result]

    # 2. Build Schema
    mapper = SchemaMapper(columns)
    schema = mapper.get_result()

    # 3. Parse Question
    question = "Which product generated the highest revenue?"
    print("USER QUESTION")
    print("-" * 70)
    print(f"\n{question}\n")
    
    parser = QuestionParser()
    intent = parser.parse(question=question, schema=schema)
    parser.unload()
    
    print("QWEN INTENT")
    print("-" * 70)
    print(f"\n{json.dumps(intent, indent=2)}\n")
    
    # 4. Execute Analysis
    print("EXECUTING REAL DATA ANALYSIS...")
    print("-" * 70)
    with QueryExecutor(dataset_path=DATASET_PATH, schema_mapper=mapper) as query_executor:
        analysis_executor = AnalysisExecutor(query_executor=query_executor)
        analysis_result = analysis_executor.execute(intent)
        
        # Get actual data to pass to context builder
        actual_result = analysis_result.get("result", analysis_result)
        
        row_count = query_executor.row_count()
        
    print("\nVERIFIED RESULT")
    print("-" * 70)
    print(f"\n{json.dumps(actual_result, indent=2)}\n")
        
    # 5. Build Context
    print("RESULT CONTEXT BUILDER")
    print("-" * 70)
    
    builder = ResultContextBuilder(
        schema=schema, 
        dataset_path=DATASET_PATH, 
        row_count=row_count
    )
    
    structured_context = builder.build_context(
        question=question, 
        result=actual_result
    )
    
    print("\nSTRUCTURED CONTEXT")
    print("-" * 70)
    print(f"\n{json.dumps(structured_context, indent=2)}\n")

    print("======================================================================")
    print("TEST COMPLETED SUCCESSFULLY")
    print("======================================================================")

if __name__ == "__main__":
    test_context_builder()
