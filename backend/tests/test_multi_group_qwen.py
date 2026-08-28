import os
import sys

sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.query_executor import QueryExecutor
from app.data_engine.analysis_executor import AnalysisExecutor
from app.ai.qwen_model import QwenModel
from app.data_engine.question_parser import QuestionParser
from app.data_engine.result_context_builder import ResultContextBuilder
from app.data_engine.answer_generator import AnswerGenerator
from app.data_engine.analysis_pipeline import AnalysisPipeline
import duckdb

csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "sample_sales.csv"))

connection = duckdb.connect()
columns_result = connection.execute(
    f"DESCRIBE SELECT * FROM read_csv_auto('{csv_path}')"
).fetchall()
row_count = connection.execute(
    f"SELECT COUNT(*) FROM read_csv_auto('{csv_path}')"
).fetchone()[0]
connection.close()

columns = [row[0] for row in columns_result]

mapper = SchemaMapper(columns)
schema = mapper.get_result()

query_executor = QueryExecutor(
    dataset_path=csv_path,
    schema_mapper=mapper
)

analysis_executor = AnalysisExecutor(query_executor)

qwen = QwenModel()

question_parser = QuestionParser(
    qwen=qwen,
    schema=schema
)

result_context_builder = ResultContextBuilder(
    schema=schema,
    dataset_path=csv_path,
    row_count=row_count
)

answer_generator = AnswerGenerator(qwen=qwen)

pipeline = AnalysisPipeline(
    question_parser=question_parser,
    analysis_executor=analysis_executor,
    result_context_builder=result_context_builder,
    answer_generator=answer_generator
)

questions = [
    "Show revenue by product and location.",
    "Show units sold by product and channel.",
    "Show revenue by product and location in March.",
    "Show revenue by product and channel in Virginia.",
    "Show revenue by product, location and channel in March in Virginia."
]

print("--- Multi-Dimensional Qwen Pipeline Tests ---\n")

for question in questions:
    print(f"User: {question}")
    try:
        response = pipeline.run(question)
        
        print("\n[Intent]")
        print(response.get("intent"))
        
        print(f"\n[Data Rows Returned]: {len(response.get('data', []))}")
        
        print("\n[Qwen Answer]")
        print(response.get("answer"))
        print("-" * 50 + "\n")
    except Exception as e:
        print(f"FAILED: {e}\n" + "-" * 50 + "\n")
