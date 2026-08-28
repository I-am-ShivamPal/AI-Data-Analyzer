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
print("RESOLVED CONTEXT TEST")
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
# TEST 1: Virginia
# ---------------------------------------------------------

print("\nTEST 1: Revenue in Virginia")

intent1 = {
    "operation": "total",
    "entity": "dataset",
    "metric": "revenue",
    "filters": {
        "location": "Virginia"
    }
}

result1 = analysis_executor.execute(intent1)

print(result1["resolved_context"])

assert result1["resolved_context"] == {
    "location": "Virginia"
}


# ---------------------------------------------------------
# TEST 2: March
# ---------------------------------------------------------

print("\nTEST 2: Revenue in March")

intent2 = {
    "operation": "total",
    "entity": "dataset",
    "metric": "revenue",
    "filters": {
        "date": "March"
    }
}

result2 = analysis_executor.execute(intent2)

print(result2["resolved_context"])

assert result2["resolved_context"] == {
    "date": "March",
    "applied_date_range": {
        "start": "2024-03-01",
        "end": "2024-03-31"
    }
}

# ---------------------------------------------------------
# TEST 3: March + Virginia + Website
# ---------------------------------------------------------

print("\nTEST 3: Revenue in March + Virginia + Website")

intent3 = {
    "operation": "total",
    "entity": "dataset",
    "metric": "revenue",
    "filters": {
        "date": "March",
        "location": "Virginia",
        "channel": "Website"
    }
}

result3 = analysis_executor.execute(intent3)

print(result3["resolved_context"])

assert result3["resolved_context"] == {
    "date": "March",
    "location": "Virginia",
    "channel": "Website",
    "applied_date_range": {
        "start": "2024-03-01",
        "end": "2024-03-31"
    }
}


query_executor.close()

print("\n" + "=" * 70)
print("RESOLVED CONTEXT TEST PASSED")
print("=" * 70)
