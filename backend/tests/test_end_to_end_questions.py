"""
AI DATA ANALYZER
STEP 7 - MULTI-QUESTION END-TO-END TEST

Tests:

User Question
    ↓
Qwen Question Parser
    ↓
Analysis Executor
    ↓
Query Executor
    ↓
Result Context Builder
    ↓
Qwen Answer Generator
    ↓
Final Answer
"""

import json
import time
import duckdb
import sys
import os

# Add parent directory to path to import app module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.query_executor import QueryExecutor
from app.data_engine.question_parser import QuestionParser
from app.data_engine.analysis_executor import AnalysisExecutor
from app.data_engine.result_context_builder import ResultContextBuilder
from app.data_engine.answer_generator import AnswerGenerator


DATASET_PATH = "data/sample_sales.csv"


# ============================================================
# QUESTIONS TO TEST
# ============================================================

QUESTIONS = [
    "Which product generated the highest revenue?",

    "Which product sold the most units?",

    "Which location generated the highest revenue?",

    "Which ordering channel generated the highest revenue?",

    "Show revenue by product.",

    "Show revenue by location.",

    "Show revenue by channel.",

    "How many orders are there?",

    "How many customers are there?",

    "What is the total revenue?",

    "What is the total number of units sold?",

    "Give me an overview of this dataset.",

    "Which branch generated the highest revenue?",
]


# ============================================================
# STEP 1
# LOAD DATASET SCHEMA
# ============================================================

print("=" * 70)
print("AI DATA ANALYZER - MULTI-QUESTION END-TO-END TEST")
print("=" * 70)

print("\nSTEP 1: Loading dataset schema...")
print("-" * 70)

connection = duckdb.connect()

columns_result = connection.execute(
    f"""
    DESCRIBE
    SELECT *
    FROM read_csv_auto('{DATASET_PATH}')
    """
).fetchall()

connection.close()

columns = [row[0] for row in columns_result]


print("Dataset columns:")

for column in columns:
    print(f"  - {column}")


# ============================================================
# STEP 2
# BUILD SEMANTIC SCHEMA
# ============================================================

print("\nSTEP 2: Building semantic schema...")
print("-" * 70)

mapper = SchemaMapper(columns)

schema = mapper.get_result()

print(
    json.dumps(
        schema,
        indent=2,
        default=str,
    )
)


# ============================================================
# STEP 3
# LOAD QWEN QUESTION PARSER
# ============================================================

print("\nSTEP 3: Loading Qwen Question Parser...")
print("-" * 70)

question_parser = QuestionParser()

print("Question Parser ready.")


# ============================================================
# STEP 4
# CREATE QUERY EXECUTOR + ANALYSIS EXECUTOR
# ============================================================

print("\nSTEP 4: Creating Query + Analysis Executors...")
print("-" * 70)

query_executor = QueryExecutor(
    dataset_path=DATASET_PATH,
    schema_mapper=mapper,
)

analysis_executor = AnalysisExecutor(
    query_executor=query_executor,
)

print("Query Executor ready.")
print("Analysis Executor ready.")


# ============================================================
# STEP 5
# CREATE CONTEXT BUILDER
# ============================================================

print("\nSTEP 5: Creating Result Context Builder...")
print("-" * 70)

row_count = query_executor.row_count()

context_builder = ResultContextBuilder(
    schema=schema,
    dataset_path=DATASET_PATH,
    row_count=row_count,
)

print("Context Builder ready.")


# ============================================================
# STEP 6
# LOAD ANSWER GENERATOR
# ============================================================

print("\nSTEP 6: Loading Qwen Answer Generator...")
print("-" * 70)

answer_generator = AnswerGenerator()

print("Answer Generator ready.")


# ============================================================
# RESULT TRACKING
# ============================================================

successful_tests = 0
failed_tests = 0

results = []


# ============================================================
# STEP 7
# RUN ALL QUESTIONS
# ============================================================

for index, question in enumerate(
    QUESTIONS,
    start=1,
):

    print("\n")
    print("=" * 70)
    print(f"QUESTION {index}/{len(QUESTIONS)}")
    print("=" * 70)

    print("\nUSER QUESTION")
    print("-" * 70)

    print(question)

    start_time = time.time()

    try:

        # ----------------------------------------------------
        # QWEN QUESTION PARSER
        # ----------------------------------------------------

        print("\nQWEN INTENT")
        print("-" * 70)

        intent = question_parser.parse(
            question=question,
            schema=schema,
        )

        print(
            json.dumps(
                intent,
                indent=2,
            )
        )

        # ----------------------------------------------------
        # ANALYSIS EXECUTOR
        # ----------------------------------------------------

        print("\nEXECUTING REAL DATA ANALYSIS...")
        print("-" * 70)

        verified_result = analysis_executor.execute(
            intent
        )

        print("\nVERIFIED RESULT")

        print(
            json.dumps(
                verified_result,
                indent=2,
                default=str,
            )
        )

        # ----------------------------------------------------
        # RESULT CONTEXT
        # ----------------------------------------------------

        print("\nBUILDING TRUSTED CONTEXT...")
        print("-" * 70)

        context = context_builder.build_context(
            question=question,
            result=verified_result,
        )

        print(
            json.dumps(
                context,
                indent=2,
                default=str,
            )
        )

        # ----------------------------------------------------
        # QWEN ANSWER
        # ----------------------------------------------------

        print("\nQWEN FINAL ANSWER")
        print("-" * 70)

        answer = answer_generator.generate(
            context
        )

        print(answer)

        # ----------------------------------------------------
        # SUCCESS
        # ----------------------------------------------------

        elapsed = time.time() - start_time

        successful_tests += 1

        results.append(
            {
                "question": question,
                "status": "SUCCESS",
                "intent": intent,
                "result": verified_result,
                "answer": answer,
                "time_seconds": round(
                    elapsed,
                    2,
                ),
            }
        )

        print(
            f"\n[PASS] Question {index} completed "
            f"in {elapsed:.2f} seconds."
        )

    except Exception as error:

        failed_tests += 1

        results.append(
            {
                "question": question,
                "status": "FAILED",
                "error": str(error),
            }
        )

        print("\n[FAIL] QUESTION FAILED")
        print("-" * 70)

        print(type(error).__name__)
        print(str(error))


# ============================================================
# CLEANUP
# ============================================================

print("\n")
print("=" * 70)
print("CLEANING UP MODELS")
print("=" * 70)

question_parser.unload()
answer_generator.unload()


# ============================================================
# FINAL SUMMARY
# ============================================================

print("\n")
print("=" * 70)
print("FINAL TEST SUMMARY")
print("=" * 70)

print(f"Total questions : {len(QUESTIONS)}")
print(f"Successful      : {successful_tests}")
print(f"Failed          : {failed_tests}")


print("\nQUESTION STATUS")
print("-" * 70)

for item in results:

    status_symbol = (
        "[PASS]"
        if item["status"] == "SUCCESS"
        else "[FAIL]"
    )

    print(
        f"{status_symbol} "
        f"{item['status']} - "
        f"{item['question']}"
    )


print("\n")


if failed_tests == 0:

    print("=" * 70)
    print("ALL END-TO-END QUESTIONS PASSED")
    print("=" * 70)

else:

    print("=" * 70)
    print("SOME END-TO-END QUESTIONS FAILED")
    print("=" * 70)
