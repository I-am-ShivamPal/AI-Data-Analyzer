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
print("FILTERED GROUP QUERY TEST")
print("=" * 70)


# ---------------------------------------------------------
# Schema
# ---------------------------------------------------------

import duckdb
connection = duckdb.connect()
columns_result = connection.execute(
    f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET_PATH}')"
).fetchall()
connection.close()
columns = [row[0] for row in columns_result]

schema_mapper = SchemaMapper(columns)
schema = schema_mapper.get_result()

print("\nSchema ready.")


# ---------------------------------------------------------
# Query executor
# ---------------------------------------------------------

query_executor = QueryExecutor(
    dataset_path=DATASET_PATH,
    schema_mapper=schema_mapper
)

print("Query Executor ready.")


# ---------------------------------------------------------
# Analysis executor
# ---------------------------------------------------------

analysis_executor = AnalysisExecutor(
    query_executor=query_executor
)

print("Analysis Executor ready.")


# ---------------------------------------------------------
# TEST 1
# ---------------------------------------------------------

print("\n")
print("TEST 1: Revenue by product")
print("-" * 70)

intent = {
    "operation": "group",
    "entity": "product",
    "metric": "revenue",
    "limit": None,
    "filters": {}
}

result = analysis_executor.execute(intent)

print(result)


# ---------------------------------------------------------
# TEST 2
# ---------------------------------------------------------

print("\n")
print("TEST 2: Revenue by product in March")
print("-" * 70)

intent = {
    "operation": "group",
    "entity": "product",
    "metric": "revenue",
    "limit": None,
    "filters": {
        "date": "March"
    }
}

result = analysis_executor.execute(intent)

print(result)


# ---------------------------------------------------------
# TEST 3
# ---------------------------------------------------------

print("\n")
print("TEST 3: Revenue by product in March + Virginia")
print("-" * 70)

intent = {
    "operation": "group",
    "entity": "product",
    "metric": "revenue",
    "limit": None,
    "filters": {
        "date": "March",
        "location": "Virginia"
    }
}

result = analysis_executor.execute(intent)

print(result)


# ---------------------------------------------------------
# TEST 4
# ---------------------------------------------------------

print("\n")
print("TEST 4: Revenue by product in March + Virginia + Website")
print("-" * 70)

intent = {
    "operation": "group",
    "entity": "product",
    "metric": "revenue",
    "limit": None,
    "filters": {
        "date": "March",
        "location": "Virginia",
        "channel": "Website"
    }
}

result = analysis_executor.execute(intent)

print(result)


query_executor.close()


print("\n")
print("=" * 70)
print("FILTERED GROUP QUERY TEST COMPLETED")
print("=" * 70)
