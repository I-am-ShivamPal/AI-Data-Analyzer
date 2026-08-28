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

# Set up executor
csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "sample_sales.csv"))

import duckdb
connection = duckdb.connect()
columns_result = connection.execute(
    f"DESCRIBE SELECT * FROM read_csv_auto('{csv_path}')"
).fetchall()
connection.close()
columns = [row[0] for row in columns_result]

mapper = SchemaMapper(columns)
mapper.map_columns()

query_executor = QueryExecutor(
    dataset_path=csv_path,
    schema_mapper=mapper
)

analysis_executor = AnalysisExecutor(query_executor)

tests = [
    {
        "name": "1D product",
        "intent": {
            "operation": "group",
            "entity": "product",
            "group_by": ["product"],
            "metric": "revenue",
            "limit": None,
            "filters": {}
        }
    },
    {
        "name": "2D product location",
        "intent": {
            "operation": "group",
            "entity": "product",
            "group_by": [
                "product",
                "location"
            ],
            "metric": "revenue",
            "limit": None,
            "filters": {}
        }
    },
    {
        "name": "2D product channel",
        "intent": {
            "operation": "group",
            "entity": "product",
            "group_by": [
                "product",
                "channel"
            ],
            "metric": "quantity",
            "limit": None,
            "filters": {}
        }
    },
    {
        "name": "2D + date",
        "intent": {
            "operation": "group",
            "entity": "product",
            "group_by": [
                "product",
                "location"
            ],
            "metric": "revenue",
            "limit": None,
            "filters": {
                "date": "March"
            }
        }
    },
    {
        "name": "3D",
        "intent": {
            "operation": "group",
            "entity": "product",
            "group_by": [
                "product",
                "location",
                "channel"
            ],
            "metric": "revenue",
            "limit": None,
            "filters": {}
        }
    }
]

print("--- Multi-Dimensional Grouping Tests ---\n")

for test in tests:
    print(f"Testing: {test['name']}")
    try:
        result = analysis_executor.execute(test["intent"])
        
        # Display the first two results for brevity
        results = result.get("result", [])
        print(f"  Rows returned: {len(results)}")
        if results:
            print("  Top 2 rows:")
            for row in results[:2]:
                print(f"    {row}")
        print("  OK\n")
    except Exception as e:
        print(f"  FAILED: {e}\n")

print("Testing invalid dimensions:")
invalid_intent = {
    "operation": "group",
    "entity": "product",
    "group_by": [
        "product",
        "branch"
    ],
    "metric": "revenue",
    "limit": None,
    "filters": {}
}
try:
    analysis_executor.execute(invalid_intent)
    print("  FAILED: Should have rejected invalid dimension")
except Exception as e:
    print(f"  Correctly rejected:\n  {e}\n")


