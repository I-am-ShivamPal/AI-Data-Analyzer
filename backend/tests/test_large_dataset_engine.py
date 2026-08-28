import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.data_engine.large_dataset_engine import (
    LargeDatasetEngine
)

import json


print("=" * 70)
print("AI DATA ANALYZER - LARGE DATASET ENGINE TEST")
print("=" * 70)

file_path = "data/sample_sales.csv"

engine = LargeDatasetEngine(file_path)


# --------------------------------------------------
# TEST 1: SCHEMA
# --------------------------------------------------

print("\nTEST 1: DATASET SCHEMA")

schema = engine.get_schema()

print(
    json.dumps(
        schema,
        indent=4
    )
)


# --------------------------------------------------
# TEST 2: ROW COUNT
# --------------------------------------------------

print("\nTEST 2: ROW COUNT")

rows = engine.count_rows()

print(
    f"Total rows: {rows}"
)


# --------------------------------------------------
# TEST 3: SAMPLE
# --------------------------------------------------

print("\nTEST 3: SAMPLE DATA")

sample = engine.get_sample(3)

print(
    json.dumps(
        sample,
        indent=4,
        default=str
    )
)


# --------------------------------------------------
# TEST 4: NUMERIC SUMMARY
# --------------------------------------------------

print("\nTEST 4: NUMERIC SUMMARY")

summary = engine.get_numeric_summary()

print(
    json.dumps(
        summary,
        indent=4,
        default=str
    )
)


# --------------------------------------------------
# TEST 5: DUCKDB SQL
# --------------------------------------------------

print("\nTEST 5: DUCKDB SQL QUERY")

query = """
SELECT
    product_name,
    ROUND(SUM(product_price), 2) AS total_sales,
    COUNT(*) AS orders
FROM dataset
GROUP BY product_name
ORDER BY total_sales DESC
LIMIT 5
"""

result = engine.duckdb_query(query)

print(
    json.dumps(
        result,
        indent=4,
        default=str
    )
)


print("\n" + "=" * 70)
print("ALL LARGE DATASET ENGINE TESTS COMPLETED")
print("=" * 70)