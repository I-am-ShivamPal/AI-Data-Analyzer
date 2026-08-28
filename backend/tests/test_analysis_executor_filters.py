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


DATASET = "data/sample_sales.csv"


print("=" * 70)
print("ANALYSIS EXECUTOR FILTER TEST")
print("=" * 70)

import duckdb

connection = duckdb.connect()
columns_result = connection.execute(
    f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET}')"
).fetchall()
connection.close()
columns = [row[0] for row in columns_result]

mapper = SchemaMapper(columns)
schema = mapper.get_result()

query_executor = QueryExecutor(
    dataset_path=DATASET,
    schema_mapper=mapper
)

analysis_executor = AnalysisExecutor(
    query_executor=query_executor
)


# ---------------------------------------------------------
# TEST 1
# ---------------------------------------------------------

print("\nTEST 1")
print("Highest revenue product in Virginia")
print("-" * 70)

intent = {
    "operation": "group",
    "entity": "product",
    "group_by": ["product"],
    "metric": "revenue",
    "limit": 1,
    "sort_order": "desc",
    "filters": {
        "location": "Virginia"
    }
}

result = analysis_executor.execute(intent)

print(result)

assert result["filters"]["location"] == "Virginia"


# ---------------------------------------------------------
# TEST 2
# ---------------------------------------------------------

print("\nTEST 2")
print("Highest revenue product in Virginia + Website")
print("-" * 70)

intent = {
    "operation": "group",
    "entity": "product",
    "group_by": ["product"],
    "metric": "revenue",
    "limit": 1,
    "sort_order": "desc",
    "filters": {
        "location": "Virginia",
        "channel": "Website"
    }
}

result = analysis_executor.execute(intent)

print(result)

assert result["filters"]["location"] == "Virginia"
assert result["filters"]["channel"] == "Website"


# ---------------------------------------------------------
# TEST 3
# ---------------------------------------------------------

print("\nTEST 3")
print("Total revenue in Virginia")
print("-" * 70)

intent = {
    "operation": "total",
    "entity": "dataset",
    "metric": "revenue",
    "limit": None,
    "filters": {
        "location": "Virginia"
    }
}

result = analysis_executor.execute(intent)

print(result)

assert result["result"]["value"] >= 0


# ---------------------------------------------------------
# TEST 4
# ---------------------------------------------------------

print("\nTEST 4")
print("Total units in Virginia")
print("-" * 70)

intent = {
    "operation": "total",
    "entity": "dataset",
    "metric": "quantity",
    "limit": None,
    "filters": {
        "location": "Virginia"
    }
}

result = analysis_executor.execute(intent)

print(result)

assert result["result"]["value"] >= 0


query_executor.close()


print("\n" + "=" * 70)
print("ANALYSIS EXECUTOR FILTER TEST PASSED")
print("=" * 70)
