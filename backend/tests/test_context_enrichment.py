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


print("=" * 70)
print("AI DATA ANALYZER - CONTEXT ENRICHMENT TEST")
print("=" * 70)


# ---------------------------------------------------------
# Schema
# ---------------------------------------------------------

print("\nSTEP 1: Building schema...")

connection = duckdb.connect()
columns_result = connection.execute(f"DESCRIBE SELECT * FROM read_csv_auto('{DATASET}')").fetchall()
connection.close()
columns = [row[0] for row in columns_result]

schema_mapper = SchemaMapper(columns)


# ---------------------------------------------------------
# Query executor
# ---------------------------------------------------------

print("\nSTEP 2: Creating QueryExecutor...")

query_executor = QueryExecutor(
    dataset_path=DATASET,
    schema_mapper=schema_mapper,
)


# ---------------------------------------------------------
# Real analysis
# ---------------------------------------------------------

print("\nSTEP 3: Getting top product...")

result = query_executor.top_product_by_revenue()

print("\nRAW RESULT")
print("-" * 70)
print(result)


# ---------------------------------------------------------
# Enrichment
# ---------------------------------------------------------

print("\nSTEP 4: Enriching result...")

enriched = query_executor.enrich_result_context(
    result
)

print("\nENRICHED RESULT")
print("-" * 70)

import json

print(
    json.dumps(
        enriched,
        indent=2,
        default=str,
    )
)


# ---------------------------------------------------------
# Validation
# ---------------------------------------------------------

print("\nSTEP 5: Validation")
print("-" * 70)

assert "date_range" in enriched

assert enriched["date_range"]["start"] is not None
assert enriched["date_range"]["end"] is not None

assert "available_dimensions" in enriched

assert enriched["available_dimensions"]["product"] is True
assert enriched["available_dimensions"]["location"] is True
assert enriched["available_dimensions"]["customer"] is True
assert enriched["available_dimensions"]["channel"] is True

assert enriched["available_dimensions"]["branch"] is False
assert enriched["available_dimensions"]["category"] is False

print("Date range detected: OK")
print("Product detected: OK")
print("Location detected: OK")
print("Customer detected: OK")
print("Channel detected: OK")
print("Branch correctly marked unavailable: OK")
print("Category correctly marked unavailable: OK")


# ---------------------------------------------------------
# Cleanup
# ---------------------------------------------------------

query_executor.close()

print("\n" + "=" * 70)
print("TEST COMPLETED SUCCESSFULLY")
print("=" * 70)
