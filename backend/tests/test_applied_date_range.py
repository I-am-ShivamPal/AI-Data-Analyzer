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


DATASET_PATH = "data/sample_sales.csv"


print("=" * 70)
print("APPLIED DATE RANGE TEST")
print("=" * 70)


import duckdb
connection = duckdb.connect()
columns_result = connection.execute(
    f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET_PATH}')"
).fetchall()
connection.close()
columns = [row[0] for row in columns_result]

schema_mapper = SchemaMapper(columns)
schema = schema_mapper.get_result()

query_executor = QueryExecutor(
    dataset_path=DATASET_PATH,
    schema_mapper=schema_mapper
)

analysis_executor = AnalysisExecutor(
    query_executor=query_executor
)


# ---------------------------------------------------------
# TEST 1: March
# ---------------------------------------------------------

print("\nTEST 1: What was the total revenue in March?")

intent1 = {
    "operation": "total",
    "entity": "dataset",
    "metric": "revenue",
    "filters": {
        "date": "March"
    }
}

result1 = analysis_executor.execute(intent1)

print(result1["applied_date_range"])

assert result1["applied_date_range"] == {
    "start": "2024-03-01",
    "end": "2024-03-31"
}


# ---------------------------------------------------------
# TEST 2: March in Virginia
# ---------------------------------------------------------

print("\nTEST 2: What was the total revenue in March in Virginia?")

intent2 = {
    "operation": "total",
    "entity": "dataset",
    "metric": "revenue",
    "filters": {
        "date": "March",
        "location": "Virginia"
    }
}

result2 = analysis_executor.execute(intent2)

print("Filters:", result2["filters"])
print("Applied Date Range:", result2["applied_date_range"])

assert result2["filters"] == {
    "date": "March",
    "location": "Virginia"
}
assert result2["applied_date_range"] == {
    "start": "2024-03-01",
    "end": "2024-03-31"
}


query_executor.close()

print("\n" + "=" * 70)
print("APPLIED DATE RANGE TEST PASSED")
print("=" * 70)
