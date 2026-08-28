import os
import sys

sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

import duckdb
from app.data_engine.question_parser import QuestionParser
from app.data_engine.answer_generator import AnswerGenerator
from app.data_engine.result_context_builder import ResultContextBuilder
from app.data_engine.analysis_pipeline import AnalysisPipeline

from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.query_executor import QueryExecutor
from app.data_engine.analysis_executor import AnalysisExecutor
from app.ai.qwen_model import get_qwen_model, unload_qwen_model


DATASET = "data/sample_sales.csv"


print("=" * 70)
print("AI DATA ANALYZER - FULL END-TO-END PIPELINE")
print("=" * 70)


# --------------------------------------------------
# STEP 1: Schema
# --------------------------------------------------

print("\nSTEP 1: Building schema...")

connection = duckdb.connect()
columns_result = connection.execute(f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET}')").fetchall()
connection.close()
columns = [row[0] for row in columns_result]

schema_mapper = SchemaMapper(columns)
schema = schema_mapper.get_result()

print("Schema ready.")


# --------------------------------------------------
# STEP 2: Query Executor
# --------------------------------------------------

print("\nSTEP 2: Creating Query Executor...")

query_executor = QueryExecutor(
    dataset_path=DATASET,
    schema_mapper=schema_mapper,
)

print("Query Executor ready.")


# --------------------------------------------------
# STEP 3: Analysis Executor
# --------------------------------------------------

print("\nSTEP 3: Creating Analysis Executor...")

analysis_executor = AnalysisExecutor(
    query_executor=query_executor
)

print("Analysis Executor ready.")


# --------------------------------------------------
# STEP 4: Qwen parser
# --------------------------------------------------

print("\nSTEP 4: Loading Qwen Question Parser...")

qwen = get_qwen_model()

question_parser = QuestionParser(
    qwen=qwen,
    schema=schema
)

print("Question Parser ready.")


# --------------------------------------------------
# STEP 5: Result context
# --------------------------------------------------

print("\nSTEP 5: Creating Result Context Builder...")

result_context_builder = ResultContextBuilder(
    schema=schema,
    dataset_path=DATASET,
    row_count=query_executor.row_count(),
)

print("Result Context Builder ready.")


# --------------------------------------------------
# STEP 6: Answer generator
# --------------------------------------------------

print("\nSTEP 6: Creating Answer Generator...")

answer_generator = AnswerGenerator(qwen=qwen)

print("Answer Generator ready.")


# --------------------------------------------------
# STEP 7: Complete pipeline
# --------------------------------------------------

pipeline = AnalysisPipeline(
    question_parser=question_parser,
    analysis_executor=analysis_executor,
    result_context_builder=result_context_builder,
    answer_generator=answer_generator,
)


# --------------------------------------------------
# TEST QUESTIONS
# --------------------------------------------------

questions = [
    "Which product generated the highest revenue?",
    "Which product sold the most units?",
    "Which location generated the highest revenue?",
    "Which channel generated the highest revenue?",
    "What is the total revenue?",
    "How many customers are there?",
    "Give me an overview of the dataset.",
]


# --------------------------------------------------
# Run
# --------------------------------------------------

for index, question in enumerate(questions, start=1):

    print("\n" + "=" * 70)
    print(f"QUESTION {index}")
    print("=" * 70)

    print(question)

    try:
        result = pipeline.run(question)

        print("\nINTENT")
        print("-" * 70)
        print(result["intent"])

        print("\nVERIFIED RESULT")
        print("-" * 70)
        print(result["verified_result"])

        print("\nFINAL ANSWER")
        print("-" * 70)
        print(result["answer"])

    except Exception as exc:
        print("\nERROR")
        print("-" * 70)
        print(type(exc).__name__, str(exc))


# --------------------------------------------------
# Cleanup
# --------------------------------------------------

print("\nCleaning up...")

unload_qwen_model()
query_executor.close()

print("\n" + "=" * 70)
print("END-TO-END TEST COMPLETED")
print("=" * 70)
