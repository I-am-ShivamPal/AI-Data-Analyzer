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
from app.data_engine.question_parser import QuestionParser
from app.data_engine.answer_generator import AnswerGenerator
from app.data_engine.result_context_builder import ResultContextBuilder
from app.ai.qwen_model import get_qwen_model


DATASET_PATH = "data/sample_sales.csv"


print("=" * 70)
print("DATE FILTERED END-TO-END TEST")
print("=" * 70)


# ---------------------------------------------------------
# STEP 1: Build schema
# ---------------------------------------------------------

print("\nSTEP 1: Building semantic schema")
print("-" * 70)

import duckdb
connection = duckdb.connect()
columns_result = connection.execute(
    f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET_PATH}')"
).fetchall()
connection.close()
columns = [row[0] for row in columns_result]

schema_mapper = SchemaMapper(columns)
schema = schema_mapper.get_result()

print("Schema ready.")


# ---------------------------------------------------------
# STEP 2: Query Executor
# ---------------------------------------------------------

print("\nSTEP 2: Creating Query Executor")
print("-" * 70)

query_executor = QueryExecutor(
    dataset_path=DATASET_PATH,
    schema_mapper=schema_mapper
)

print("Query Executor ready.")


# ---------------------------------------------------------
# STEP 3: Analysis Executor
# ---------------------------------------------------------

print("\nSTEP 3: Creating Analysis Executor")
print("-" * 70)

analysis_executor = AnalysisExecutor(
    query_executor=query_executor
)

print("Analysis Executor ready.")


# ---------------------------------------------------------
# STEP 4: Question Parser
# ---------------------------------------------------------

print("\nSTEP 4: Loading Question Parser")
print("-" * 70)

qwen = get_qwen_model()

question_parser = QuestionParser(
    qwen=qwen,
    schema=schema
)

print("Question Parser ready.")


# ---------------------------------------------------------
# STEP 5: Result Context Builder
# ---------------------------------------------------------

print("\nSTEP 5: Creating Result Context Builder")
print("-" * 70)

row_count = query_executor.row_count()

context_builder = ResultContextBuilder(
    schema=schema,
    dataset_path=DATASET_PATH,
    row_count=row_count
)

print("Result Context Builder ready.")


# ---------------------------------------------------------
# STEP 6: Answer Generator
# ---------------------------------------------------------

print("\nSTEP 6: Creating Answer Generator")
print("-" * 70)

answer_generator = AnswerGenerator(qwen=qwen)

print("Answer Generator ready.")


# ---------------------------------------------------------
# QUESTIONS
# ---------------------------------------------------------

questions = [
    "What was the total revenue in March?",
    "What was the total revenue in March in Virginia?",
    "Which product generated the highest revenue in March?",
    "Which product generated the highest revenue in March in Virginia?",
]


# ---------------------------------------------------------
# EXECUTION
# ---------------------------------------------------------

for index, question in enumerate(questions, 1):

    print("\n")
    print("=" * 70)
    print(f"QUESTION {index}")
    print("=" * 70)

    print(question)


    # -----------------------------------------------------
    # Parse
    # -----------------------------------------------------

    print("\n[1] PARSING QUESTION")
    print("-" * 70)

    intent = question_parser.parse(
        question,
        schema=schema
    )

    print("INTENT:")
    print(intent)


    # -----------------------------------------------------
    # Execute
    # -----------------------------------------------------

    print("\n[2] EXECUTING REAL DATA ANALYSIS")
    print("-" * 70)

    verified_result = analysis_executor.execute(
        intent
    )

    print("VERIFIED RESULT:")
    print(verified_result)


    # -----------------------------------------------------
    # Context
    # -----------------------------------------------------

    print("\n[3] BUILDING RESULT CONTEXT")
    print("-" * 70)

    result_context = context_builder.build_context(
        question=question,
        result=verified_result
    )

    print("RESULT CONTEXT:")
    print(result_context)


    # -----------------------------------------------------
    # Answer
    # -----------------------------------------------------

    print("\n[4] GENERATING FINAL ANSWER")
    print("-" * 70)

    answer = answer_generator.generate(
        result_context
    )

    print("\nFINAL ANSWER:")
    print(answer)


# ---------------------------------------------------------
# CLEANUP
# ---------------------------------------------------------

query_executor.close()

print("\n")
print("=" * 70)
print("DATE FILTERED END-TO-END TEST COMPLETED")
print("=" * 70)
