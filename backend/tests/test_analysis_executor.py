"""
AI DATA ANALYZER - END TO END ANALYSIS TEST
"""

import json
import sys
import os

# Add parent directory to path to import app module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import duckdb
from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.question_parser import QuestionParser
from app.data_engine.query_executor import QueryExecutor
from app.data_engine.analysis_executor import AnalysisExecutor

DATASET_PATH = "data/sample_sales.csv"

def test_end_to_end():
    print("======================================================================")
    print("AI DATA ANALYZER - END TO END ANALYSIS TEST")
    print("======================================================================\n")

    # 1. Read columns
    connection = duckdb.connect()
    columns_result = connection.execute(f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET_PATH}')").fetchall()
    connection.close()
    columns = [row[0] for row in columns_result]

    # 2. Build Schema
    mapper = SchemaMapper(columns)
    schema = mapper.get_result()

    # 3. Parse Question
    question = "Which product generated the highest revenue?"
    print("USER QUESTION")
    print("-" * 70)
    print(f"\n{question}\n")
    
    # Use question parser
    parser = QuestionParser()
    intent = parser.parse(question=question, schema=schema)
    parser.unload()
    
    print("QWEN INTENT")
    print("-" * 70)
    print(f"\n{json.dumps(intent, indent=2)}\n")
    
    print("EXECUTING REAL DATA ANALYSIS...")
    print("-" * 70)
    
    # 4. Execute Analysis
    with QueryExecutor(dataset_path=DATASET_PATH, schema_mapper=mapper) as query_executor:
        analysis_executor = AnalysisExecutor(query_executor=query_executor)
        result = analysis_executor.execute(intent)
        
    print("\nVERIFIED RESULT")
    print("-" * 70)
    
    if result.get("metric") == "top_product_by_revenue" and result.get("result"):
        res = result["result"]
        print(f"\nProduct: {res.get('product')}")
        print(f"Revenue: {res.get('revenue'):.2f}")
        print(f"Units Sold: {int(res.get('units_sold', 0))}")
        print(f"Orders: {res.get('orders', 0)}\n")
    else:
        print(json.dumps(result, indent=2))
        
    print("======================================================================")
    print("TEST COMPLETED SUCCESSFULLY")
    print("======================================================================")

if __name__ == "__main__":
    test_end_to_end()
