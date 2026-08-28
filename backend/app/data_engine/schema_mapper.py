"""
Semantic Schema Mapper

Converts raw dataset column names into standard semantic meanings.

Example:

    product_name -> product
    product_price -> price
    number_of_ordered_items -> quantity
    customer_name -> customer

The mapper is intentionally rule-based for obvious column names.
LLM-based semantic mapping can be added later for ambiguous columns.
"""

from __future__ import annotations

import re
from typing import Dict, List, Optional, Any


class SchemaMapper:
    """
    Maps raw dataset columns to standardized semantic fields.
    """

    # Standard semantic fields and their possible column-name patterns.
    FIELD_PATTERNS = {
        "product": [
            "product",
            "product_name",
            "productname",
            "item",
            "item_name",
            "itemname",
            "product_title",
        ],

        "product_id": [
            "product_id",
            "productid",
            "item_id",
            "itemid",
            "sku",
            "product_code",
            "productcode",
        ],

        "price": [
            "price",
            "product_price",
            "unit_price",
            "unitprice",
            "item_price",
            "selling_price",
            "sale_price",
            "cost",
            "unit_cost",
        ],

        "quantity": [
            "quantity",
            "qty",
            "units",
            "unit_sold",
            "units_sold",
            "number_of_ordered_items",
            "ordered_items",
            "order_quantity",
        ],

        "revenue": [
            "revenue",
            "sales",
            "sales_amount",
            "sales_value",
            "total_sales",
            "total_revenue",
            "revenue_amount",
        ],

        "date": [
            "date",
            "order_date",
            "orderdate",
            "sale_date",
            "saledate",
            "transaction_date",
            "transactiondate",
            "created_at",
            "created_date",
            "timestamp",
        ],

        "location": [
            "location",
            "region",
            "area",
            "state",
            "city",
            "country",
            "territory",
        ],

        "latitude": [
            "latitude",
            "lat",
        ],

        "longitude": [
            "longitude",
            "lon",
            "lng",
            "long",
        ],

        "branch": [
            "branch",
            "branch_name",
            "branchname",
            "store",
            "store_name",
            "store_id",
            "outlet",
            "outlet_name",
        ],

        "customer": [
            "customer",
            "customer_name",
            "customername",
            "client",
            "client_name",
            "buyer",
            "buyer_name",
        ],

        "status": [
            "status",
            "order_status",
            "orderstatus",
            "payment_status",
            "delivery_status",
        ],

        "channel": [
            "channel",
            "ordering_channel",
            "order_channel",
            "sales_channel",
            "channel_of_ordering",
            "platform",
        ],

        "category": [
            "category",
            "product_category",
            "productcategory",
            "type",
            "product_type",
        ],
    }

    # Derived metrics that can be calculated even when
    # the actual column does not exist.
    DERIVED_METRICS = {
        "revenue": {
            "required_fields": ["price", "quantity"],
            "formula": "price * quantity",
            "description": "Total revenue calculated from price multiplied by quantity.",
        },

        "average_order_value": {
            "required_fields": ["revenue"],
            "formula": "revenue / order_count",
            "description": "Average revenue per order.",
        },
    }

    def __init__(self, columns: List[str]):
        self.columns = columns
        self.mapping: Dict[str, Optional[str]] = {}
        self.confidence: Dict[str, float] = {}

    @staticmethod
    def normalize_column_name(column: str) -> str:
        """
        Normalize a column name for comparison.

        Examples:

            "Product Name" -> "product_name"
            "Product-Name" -> "product_name"
            "ProductName"  -> "productname"
        """

        value = str(column).strip().lower()

        # Replace spaces and hyphens with underscores.
        value = re.sub(r"[\s\-]+", "_", value)

        # Remove other special characters.
        value = re.sub(r"[^a-z0-9_]", "", value)

        return value

    def _find_exact_match(self, field: str) -> Optional[str]:
        """
        Find an exact semantic column match.
        """

        patterns = self.FIELD_PATTERNS.get(field, [])

        normalized_columns = {
            self.normalize_column_name(column): column
            for column in self.columns
        }

        for pattern in patterns:
            normalized_pattern = self.normalize_column_name(pattern)

            if normalized_pattern in normalized_columns:
                return normalized_columns[normalized_pattern]

        return None

    def _find_fuzzy_match(self, field: str) -> Optional[str]:
        """
        Perform a conservative fuzzy-style match.

        We intentionally keep this simple for the first version.
        """

        patterns = self.FIELD_PATTERNS.get(field, [])

        normalized_columns = {
            self.normalize_column_name(column): column
            for column in self.columns
        }

        for normalized_column, original_column in normalized_columns.items():

            for pattern in patterns:

                normalized_pattern = self.normalize_column_name(pattern)

                # Example:
                # customer_name_backup contains customer_name
                if normalized_pattern in normalized_column:
                    return original_column

        return None

    def map_columns(self) -> Dict[str, Optional[str]]:
        """
        Map all supported semantic fields to dataset columns.
        """

        self.mapping = {}
        self.confidence = {}

        for field in self.FIELD_PATTERNS:

            # First attempt exact matching.
            match = self._find_exact_match(field)

            if match:
                self.mapping[field] = match
                self.confidence[field] = 1.0
                continue

            # Then conservative fuzzy matching.
            match = self._find_fuzzy_match(field)

            if match:
                self.mapping[field] = match
                self.confidence[field] = 0.75
            else:
                self.mapping[field] = None
                self.confidence[field] = 0.0

        return self.mapping

    def detect_derived_metrics(self) -> Dict[str, Dict[str, Any]]:
        """
        Detect metrics that can be calculated from existing columns.
        """

        if not self.mapping:
            self.map_columns()

        derived = {}

        for metric, definition in self.DERIVED_METRICS.items():

            required_fields = definition["required_fields"]

            # Revenue can be calculated from price + quantity.
            if metric == "revenue":

                if (
                    self.mapping.get("price")
                    and self.mapping.get("quantity")
                    and not self.mapping.get("revenue")
                ):
                    derived[metric] = {
                        "type": "derived",
                        "formula": definition["formula"],
                        "source_columns": {
                            "price": self.mapping["price"],
                            "quantity": self.mapping["quantity"],
                        },
                        "description": definition["description"],
                    }

            elif metric == "average_order_value":

                if self.mapping.get("revenue"):
                    derived[metric] = {
                        "type": "derived",
                        "formula": definition["formula"],
                        "source_columns": {
                            "revenue": self.mapping["revenue"],
                        },
                        "description": definition["description"],
                    }

        return derived

    def validate_group_by(self, group_by):
        if not group_by:
            raise ValueError(
                "At least one grouping dimension is required"
            )
    
        source_columns = []
    
        for semantic_name in group_by:
    
            if semantic_name not in self.mapping:
                raise ValueError(
                    f"Unknown grouping dimension: {semantic_name}"
                )
    
            source_column = self.mapping.get(
                semantic_name
            )
    
            if source_column is None:
                raise ValueError(
                    f"Cannot group by '{semantic_name}': "
                    "column is not available in dataset."
                )
    
            source_columns.append(source_column)
    
        return source_columns

    def get_result(self) -> Dict[str, Any]:
        """
        Return complete semantic schema information.
        """

        if not self.mapping:
            self.map_columns()

        derived_metrics = self.detect_derived_metrics()

        return {
            "source_columns": self.columns,
            "semantic_mapping": self.mapping,
            "confidence": self.confidence,
            "derived_metrics": derived_metrics,
        }
