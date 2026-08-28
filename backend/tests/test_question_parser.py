"""
AI DATA ANALYZER - QUESTION PARSER TEST
"""

import json
import sys
import os

# Add parent directory to path to import app module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import duckdb

from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.question_parser import QuestionParser


DATASET_PATH = "data/sample_sales.csv"


print("=" * 70)
print("AI DATA ANALYZER - QUESTION PARSER TEST")
print("=" * 70)


# ---------------------------------------------------------
# Step 1: Read dataset columns
# ---------------------------------------------------------

print("\nSTEP 1: Reading dataset schema...")

connection = duckdb.connect()

columns_result = connection.execute(
    f"""
    DESCRIBE SELECT *
    FROM read_csv_auto('{DATASET_PATH}')
    """
).fetchall()

connection.close()

columns = [row[0] for row in columns_result]

print("Dataset columns:")

for column in columns:
    print(f"  - {column}")


# ---------------------------------------------------------
# Step 2: Build semantic schema
# ---------------------------------------------------------

print("\nSTEP 2: Building semantic schema...")

mapper = SchemaMapper(columns)

schema = mapper.get_result()

print(
    json.dumps(
        schema,
        indent=2,
        default=str,
    )
)


# ---------------------------------------------------------
# Step 3: Load Qwen
# ---------------------------------------------------------

print("\nSTEP 3: Loading Qwen question parser...")

parser = QuestionParser()


# ---------------------------------------------------------
# Test questions
# ---------------------------------------------------------

questions = [
    "Which product generated the highest revenue?",

    "Which location sold the most units?",

    "Show revenue by channel.",
]


# ---------------------------------------------------------
# Run questions
# ---------------------------------------------------------

for index, question in enumerate(
    questions,
    start=1,
):

    print("\n" + "=" * 70)

    print(f"QUESTION {index}")

    print("=" * 70)

    print(question)

    print("\nParsing question...")

    intent = parser.parse(
        question=question,
        schema=schema,
    )

    print("\nSTRUCTURED INTENT")
    print("-" * 70)

    print(
        json.dumps(
            intent,
            indent=2,
        )
    )

    # Basic validation.
    assert "operation" in intent
    assert "entity" in intent
    assert "metric" in intent
    assert "limit" in intent


# ---------------------------------------------------------
# Cleanup
# ---------------------------------------------------------

print("\nCleaning up Qwen...")

parser.unload()


print("\n" + "=" * 70)
print("TEST COMPLETED SUCCESSFULLY")
print("=" * 70)
