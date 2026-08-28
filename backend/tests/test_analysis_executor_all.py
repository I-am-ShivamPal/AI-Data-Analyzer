"""
AI DATA ANALYZER - TEST EXECUTOR ALL
"""
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import duckdb
from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.query_executor import QueryExecutor
from app.data_engine.analysis_executor import AnalysisExecutor

DATASET_PATH = "data/sample_sales.csv"

def test_all_intents():
    print("Testing AnalysisExecutor without Qwen...")

    # Set up
    connection = duckdb.connect()
    columns_result = connection.execute(f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET_PATH}')").fetchall()
    connection.close()
    columns = [row[0] for row in columns_result]

    mapper = SchemaMapper(columns)
    
    tests = [
        {
            "operation": "group",
            "entity": "product",
            "group_by": ["product"],
            "metric": "revenue",
            "limit": 1,
            "sort_order": "desc",
        },
        {
            "operation": "group",
            "entity": "product",
            "group_by": ["product"],
            "metric": "quantity",
            "limit": 1,
            "sort_order": "desc",
        },
        {
            "operation": "group",
            "entity": "location",
            "group_by": ["location"],
            "metric": "revenue",
            "limit": 1,
            "sort_order": "desc",
        },
        {
            "operation": "group",
            "entity": "channel",
            "group_by": ["channel"],
            "metric": "revenue",
            "limit": 3,
            "sort_order": "asc",
        },
        {
            "operation": "group",
            "entity": "product",
            "metric": "revenue",
            "limit": None,
        },
        {
            "operation": "group",
            "entity": "location",
            "metric": "revenue",
            "limit": None,
        },
        {
            "operation": "group",
            "entity": "channel",
            "metric": "revenue",
            "limit": None,
        },
        {
            "operation": "count",
            "entity": "order",
            "metric": None,
            "limit": None,
        },
        {
            "operation": "count",
            "entity": "customer",
            "metric": None,
            "limit": None,
        },
        {
            "operation": "total",
            "entity": "dataset",
            "metric": "revenue",
            "limit": None,
        },
        {
            "operation": "total",
            "entity": "dataset",
            "metric": "quantity",
            "limit": None,
        },
        {
            "operation": "overview",
            "entity": "dataset",
            "metric": None,
            "limit": None,
        },
    ]

    with QueryExecutor(dataset_path=DATASET_PATH, schema_mapper=mapper) as query_executor:
        executor = AnalysisExecutor(query_executor)
        
        for i, intent in enumerate(tests):
            print(f"\n--- Test {i+1}: {intent['operation']} | {intent['entity']} | {intent['metric']} ---")
            try:
                result = executor.execute(intent)
                print(f"Success! Operation returned:")
                
                # Check for "top" results since it's an array and might be empty
                if isinstance(result.get("result"), list) and len(result["result"]) > 0:
                    print(result["result"][0])
                elif isinstance(result.get("result"), list) and len(result["result"]) <= 3:
                    print(result["result"])
                elif isinstance(result.get("result"), list):
                    print(f"List of {len(result['result'])} items.")
                    print("Sample:", result["result"][0])
                else:
                    print(result["result"])
            except Exception as e:
                print(f"FAILED: {e}")

if __name__ == "__main__":
    test_all_intents()
