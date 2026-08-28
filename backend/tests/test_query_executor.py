"""
AI DATA ANALYZER - QUERY EXECUTOR TEST
"""

import json
import sys
import os

# Add parent directory to path to import app module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.data_engine.schema_mapper import SchemaMapper
from app.data_engine.query_executor import QueryExecutor


DATASET_PATH = "data/sample_sales.csv"


print("=" * 70)
print("AI DATA ANALYZER - QUERY EXECUTOR TEST")
print("=" * 70)


# ------------------------------------------------------------------
# Step 1: Read dataset columns
# ------------------------------------------------------------------

print("\nSTEP 1: Loading dataset schema...")

import duckdb

connection = duckdb.connect()

columns_result = connection.execute(
    f"""
    DESCRIBE SELECT *
    FROM read_csv_auto('{DATASET_PATH}')
    """
).fetchall()

connection.close()

columns = [row[0] for row in columns_result]

print("Columns:")
for column in columns:
    print(f"  - {column}")


# ------------------------------------------------------------------
# Step 2: Build semantic mapping
# ------------------------------------------------------------------

print("\nSTEP 2: Building semantic schema mapping...")

mapper = SchemaMapper(columns)

schema = mapper.get_result()

print(json.dumps(schema, indent=2, default=str))


# ------------------------------------------------------------------
# Step 3: Create query executor
# ------------------------------------------------------------------

print("\nSTEP 3: Creating query executor...")

engine = QueryExecutor(
    dataset_path=DATASET_PATH,
    schema_mapper=mapper,
)

print("Query executor initialized successfully.")


# ------------------------------------------------------------------
# Step 4: Row count
# ------------------------------------------------------------------

print("\nSTEP 4: ROW COUNT")
print("-" * 70)

row_count = engine.row_count()

print(f"Total rows: {row_count}")

assert row_count == 11000


# ------------------------------------------------------------------
# Step 5: Total revenue
# ------------------------------------------------------------------

print("\nSTEP 5: TOTAL REVENUE")
print("-" * 70)

total_revenue = engine.total_revenue()

print(json.dumps(total_revenue, indent=2))

assert total_revenue["value"] > 0


# ------------------------------------------------------------------
# Step 6: Revenue by product
# ------------------------------------------------------------------

print("\nSTEP 6: REVENUE BY PRODUCT")
print("-" * 70)

product_revenue = engine.revenue_by_product(limit=5)

print(json.dumps(product_revenue, indent=2))

assert len(product_revenue) > 0

assert product_revenue[0]["revenue"] >= product_revenue[-1]["revenue"]


# ------------------------------------------------------------------
# Step 7: Top product
# ------------------------------------------------------------------

print("\nSTEP 7: TOP PRODUCT BY REVENUE")
print("-" * 70)

top_product = engine.top_product_by_revenue()

print(json.dumps(top_product, indent=2))

assert top_product["result"] is not None

assert top_product["result"]["product"] is not None

assert top_product["result"]["revenue"] > 0


# ------------------------------------------------------------------
# Step 8: Units sold
# ------------------------------------------------------------------

print("\nSTEP 8: UNITS SOLD BY PRODUCT")
print("-" * 70)

units = engine.units_sold_by_product(limit=5)

print(json.dumps(units, indent=2))

assert len(units) > 0


# ------------------------------------------------------------------
# Step 9: Orders
# ------------------------------------------------------------------

print("\nSTEP 9: ORDERS BY PRODUCT")
print("-" * 70)

orders = engine.orders_by_product(limit=5)

print(json.dumps(orders, indent=2))

assert len(orders) > 0


# ------------------------------------------------------------------
# Step 10: Location revenue
# ------------------------------------------------------------------

print("\nSTEP 10: REVENUE BY LOCATION")
print("-" * 70)

location_revenue = engine.revenue_by_location(limit=5)

print(json.dumps(location_revenue, indent=2))

assert len(location_revenue) > 0


# ------------------------------------------------------------------
# Step 11: Channel revenue
# ------------------------------------------------------------------

print("\nSTEP 11: REVENUE BY CHANNEL")
print("-" * 70)

channel_revenue = engine.revenue_by_channel(limit=5)

print(json.dumps(channel_revenue, indent=2))

assert len(channel_revenue) > 0


# ------------------------------------------------------------------
# Step 12: Dataset overview
# ------------------------------------------------------------------

print("\nSTEP 12: DATASET OVERVIEW")
print("-" * 70)

overview = engine.overview()

print(json.dumps(overview, indent=2, default=str))

assert overview["row_count"] == 11000
assert overview["total_revenue"] > 0


# ------------------------------------------------------------------
# Cleanup
# ------------------------------------------------------------------

engine.close()


print("\n" + "=" * 70)
print("ALL QUERY EXECUTOR TESTS COMPLETED SUCCESSFULLY")
print("=" * 70)
