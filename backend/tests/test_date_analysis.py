import os
import sys

sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

import duckdb
from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.query_executor import QueryExecutor


DATASET = "data/sample_sales.csv"

# Load columns via duckdb first for SchemaMapper
connection = duckdb.connect()
columns_result = connection.execute(f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET}')").fetchall()
connection.close()
columns = [row[0] for row in columns_result]

schema_mapper = SchemaMapper(columns)

query_executor = QueryExecutor(
    dataset_path=DATASET,
    schema_mapper=schema_mapper,
)

print("=" * 70)
print("DATE ANALYSIS TEST")
print("=" * 70)

print("\nDATE RANGE")
print("-" * 70)

result = query_executor.date_range()

print(result)

assert result["start"] is not None
assert result["end"] is not None

print("\nTEST PASSED")

query_executor.close()
