"""
AI DATA ANALYZER - QUERY EXECUTOR

Executes real analytical operations against a dataset.

Important:
- This module does NOT use Qwen.
- Calculations are performed by DuckDB.
- Semantic column names come from SchemaMapper.
- Results are returned as Python dictionaries/lists.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional

import duckdb

from app.data_engine.schema_mapper import SchemaMapper


class QueryExecutor:
    """
    Executes analytical operations against CSV/Parquet datasets.

    The executor uses semantic fields such as:

        product
        price
        quantity
        revenue
        location
        channel
        date

    instead of assuming fixed column names.
    """

    def __init__(self, dataset_path: str, schema_mapper: SchemaMapper):
        self.dataset_path = Path(dataset_path)
        self.schema_mapper = schema_mapper

        if not self.dataset_path.exists():
            raise FileNotFoundError(
                f"Dataset not found: {self.dataset_path}"
            )

        # Make sure semantic mapping exists.
        self.schema = self.schema_mapper.get_result()

        self.mapping = self.schema["semantic_mapping"]
        self.derived_metrics = self.schema["derived_metrics"]

        self.connection = duckdb.connect()

        self._register_dataset()

    # ------------------------------------------------------------------
    # Dataset registration
    # ------------------------------------------------------------------

    def _register_dataset(self) -> None:
        """
        Register the dataset as a DuckDB view.

        CSV and Parquet are queried directly without loading
        the entire dataset into Python memory.
        """

        extension = self.dataset_path.suffix.lower()

        path = str(self.dataset_path).replace("\\", "/")

        if extension == ".csv":
            query = f"""
                CREATE OR REPLACE VIEW dataset AS
                SELECT *
                FROM read_csv_auto('{path}')
            """

        elif extension == ".parquet":
            query = f"""
                CREATE OR REPLACE VIEW dataset AS
                SELECT *
                FROM read_parquet('{path}')
            """

        else:
            raise ValueError(
                f"Unsupported dataset format: {extension}. "
                "Currently supported: CSV and Parquet."
            )

        self.connection.execute(query)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _column(self, semantic_name: str) -> str:
        """
        Return the actual dataset column for a semantic field.

        Example:

            semantic "product"
            ->
            actual column "product_name"
        """

        column = self.mapping.get(semantic_name)

        if not column:
            raise ValueError(
                f"Dataset does not contain a column for "
                f"semantic field '{semantic_name}'."
            )

        # DuckDB identifier escaping.
        return '"' + column.replace('"', '""') + '"'

    def _has_column(self, semantic_name: str) -> bool:
        return bool(self.mapping.get(semantic_name))

    def _revenue_expression(self) -> str:
        """
        Return SQL expression for revenue.

        Priority:

        1. Existing revenue column
        2. price * quantity

        """

        if self._has_column("revenue"):
            return self._column("revenue")

        if self._has_column("price") and self._has_column("quantity"):
            return (
                f"({self._column('price')} * "
                f"{self._column('quantity')})"
            )

        raise ValueError(
            "Revenue cannot be calculated. "
            "Dataset requires either a revenue column or "
            "both price and quantity columns."
        )

    # ------------------------------------------------------------------
    # Basic dataset information
    # ------------------------------------------------------------------

    def row_count(self) -> int:
        """
        Return total number of rows.
        """

        result = self.connection.execute(
            "SELECT COUNT(*) FROM dataset"
        ).fetchone()

        return int(result[0])

    # ------------------------------------------------------------------
    # 1. Total Revenue
    # ------------------------------------------------------------------

    def total_revenue(self) -> Dict[str, Any]:
        """
        Calculate total revenue.
        """

        revenue = self._revenue_expression()

        query = f"""
            SELECT
                SUM({revenue}) AS total_revenue
            FROM dataset
        """

        result = self.connection.execute(query).fetchone()

        total = result[0]

        return {
            "metric": "total_revenue",
            "value": float(total) if total is not None else 0.0,
            "formula": "revenue column OR price × quantity",
        }

    # ------------------------------------------------------------------
    # 2. Revenue by Product
    # ------------------------------------------------------------------

    def revenue_by_product(
        self,
        limit: Optional[int] = None,
        filters: Optional[dict] = None,
    ) -> List[Dict[str, Any]]:
        """
        Calculate revenue, units sold and order count by product.
        """

        product = self._column("product")
        revenue = self._revenue_expression()

        quantity_expression = (
            self._column("quantity")
            if self._has_column("quantity")
            else "NULL"
        )

        where_sql, parameters = self._build_filter_clause(filters)

        limit_sql = f"LIMIT {int(limit)}" if limit else ""

        query = f"""
            SELECT
                {product} AS product,
                SUM({revenue}) AS revenue,
                SUM({quantity_expression}) AS units_sold,
                COUNT(*) AS orders
            FROM dataset
            {where_sql}
            GROUP BY {product}
            ORDER BY revenue DESC
            {limit_sql}
        """

        rows = self.connection.execute(query, parameters).fetchall()

        return [
            {
                "product": row[0],
                "revenue": float(row[1]) if row[1] is not None else 0.0,
                "units_sold": (
                    float(row[2])
                    if row[2] is not None
                    else None
                ),
                "orders": int(row[3]),
            }
            for row in rows
        ]

    # ------------------------------------------------------------------
    # 3. Top Product
    # ------------------------------------------------------------------

    def top_product_by_revenue(self) -> Dict[str, Any]:
        """
        Find the single highest-revenue product.
        """

        results = self.revenue_by_product(limit=1)

        if not results:
            return {
                "metric": "top_product_by_revenue",
                "result": None,
            }

        return {
            "metric": "top_product_by_revenue",
            "result": results[0],
        }

    # ------------------------------------------------------------------
    # 4. Units Sold by Product
    # ------------------------------------------------------------------

    def units_sold_by_product(
        self,
        limit: Optional[int] = None,
        filters: Optional[dict] = None,
    ) -> List[Dict[str, Any]]:
        """
        Calculate units sold by product.
        """

        product = self._column("product")
        quantity = self._column("quantity")

        where_sql, parameters = self._build_filter_clause(filters)

        limit_sql = f"LIMIT {int(limit)}" if limit else ""

        query = f"""
            SELECT
                {product} AS product,
                SUM({quantity}) AS units_sold
            FROM dataset
            {where_sql}
            GROUP BY {product}
            ORDER BY units_sold DESC
            {limit_sql}
        """

        rows = self.connection.execute(query, parameters).fetchall()

        return [
            {
                "product": row[0],
                "units_sold": float(row[1]) if row[1] is not None else 0.0,
            }
            for row in rows
        ]

    # ------------------------------------------------------------------
    # 5. Orders by Product
    # ------------------------------------------------------------------

    def orders_by_product(
        self,
        limit: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Count orders by product.
        """

        product = self._column("product")

        limit_sql = f"LIMIT {int(limit)}" if limit else ""

        query = f"""
            SELECT
                {product} AS product,
                COUNT(*) AS orders
            FROM dataset
            GROUP BY {product}
            ORDER BY orders DESC
            {limit_sql}
        """

        rows = self.connection.execute(query).fetchall()

        return [
            {
                "product": row[0],
                "orders": int(row[1]),
            }
            for row in rows
        ]

    # ------------------------------------------------------------------
    # 6. Revenue by Location
    # ------------------------------------------------------------------

    def revenue_by_location(
        self,
        limit: Optional[int] = None,
        filters: Optional[dict] = None,
    ) -> List[Dict[str, Any]]:
        """
        Calculate revenue by location.
        """

        location = self._column("location")
        revenue = self._revenue_expression()

        where_sql, parameters = self._build_filter_clause(filters)

        limit_sql = f"LIMIT {int(limit)}" if limit else ""

        query = f"""
            SELECT
                {location} AS location,
                SUM({revenue}) AS revenue,
                COUNT(*) AS orders
            FROM dataset
            {where_sql}
            GROUP BY {location}
            ORDER BY revenue DESC
            {limit_sql}
        """

        rows = self.connection.execute(query, parameters).fetchall()

        return [
            {
                "location": row[0],
                "revenue": float(row[1]) if row[1] is not None else 0.0,
                "orders": int(row[2]),
            }
            for row in rows
        ]

    # ------------------------------------------------------------------
    # 7. Revenue by Channel
    # ------------------------------------------------------------------

    def revenue_by_channel(
        self,
        limit: Optional[int] = None,
        filters: Optional[dict] = None,
    ) -> List[Dict[str, Any]]:
        """
        Calculate revenue by ordering channel.
        """

        channel = self._column("channel")
        revenue = self._revenue_expression()

        where_sql, parameters = self._build_filter_clause(filters)

        limit_sql = f"LIMIT {int(limit)}" if limit else ""

        query = f"""
            SELECT
                {channel} AS channel,
                SUM({revenue}) AS revenue,
                COUNT(*) AS orders
            FROM dataset
            {where_sql}
            GROUP BY {channel}
            ORDER BY revenue DESC
            {limit_sql}
        """

        rows = self.connection.execute(query, parameters).fetchall()

        return [
            {
                "channel": row[0],
                "revenue": float(row[1]) if row[1] is not None else 0.0,
                "orders": int(row[2]),
            }
            for row in rows
        ]

    # ------------------------------------------------------------------
    # 8. Customer Count
    # ------------------------------------------------------------------

    def customer_count(self) -> Dict[str, Any]:
        """
        Return the distinct number of customers.
        """
        customer_column = self._column("customer")

        query = f"""
            SELECT COUNT(DISTINCT {customer_column})
            FROM dataset
        """

        result = self.connection.execute(query).fetchone()

        return {
            "metric": "customers",
            "value": int(result[0] or 0)
        }

    # ------------------------------------------------------------------
    # 9. Total Units Sold
    # ------------------------------------------------------------------

    def total_units_sold(self) -> Dict[str, Any]:
        """
        Calculate the total units sold.
        """
        quantity_column = self._column("quantity")

        query = f"""
            SELECT
                SUM({quantity_column}) AS total_units_sold
            FROM dataset
        """

        result = self.connection.execute(query).fetchone()

        return {
            "metric": "total_units_sold",
            "value": float(result[0] or 0)
        }

    # ------------------------------------------------------------------
    # 10. Dataset overview
    # ------------------------------------------------------------------

    def overview(self) -> Dict[str, Any]:
        """
        Return high-level dataset metrics.
        """

        result = {
            "row_count": self.row_count(),
        }

        if self._has_column("product"):
            result["product_count"] = self.connection.execute(
                f"""
                SELECT COUNT(DISTINCT {self._column("product")})
                FROM dataset
                """
            ).fetchone()[0]

        if self._has_column("customer"):
            result["customer_count"] = self.connection.execute(
                f"""
                SELECT COUNT(DISTINCT {self._column("customer")})
                FROM dataset
                """
            ).fetchone()[0]

        if self._has_column("location"):
            result["location_count"] = self.connection.execute(
                f"""
                SELECT COUNT(DISTINCT {self._column("location")})
                FROM dataset
                """
            ).fetchone()[0]

        if self._has_column("channel"):
            result["channel_count"] = self.connection.execute(
                f"""
                SELECT COUNT(DISTINCT {self._column("channel")})
                FROM dataset
                """
            ).fetchone()[0]

        if self._has_column("quantity"):
            result["total_units_sold"] = self.connection.execute(
                f"""
                SELECT SUM({self._column("quantity")})
                FROM dataset
                """
            ).fetchone()[0]

        result["total_revenue"] = self.total_revenue()["value"]

        return result

    # ------------------------------------------------------------------
    # 11. Date Range
    # ------------------------------------------------------------------

    def date_range(self) -> Dict[str, Any]:
        """
        Return the minimum and maximum date in the dataset.
        """

        if not self._has_column("date"):
            return {
                "start": None,
                "end": None,
            }

        date_column = self._column("date")

        result = self.connection.execute(
            f"""
            SELECT
                MIN({date_column}) AS min_date,
                MAX({date_column}) AS max_date
            FROM dataset
            """
        ).fetchone()

        if not result:
            return {
                "start": None,
                "end": None,
            }

        from app.data_engine.date_utils import excel_serial_to_date

        return {
            "start": excel_serial_to_date(result[0]),
            "end": excel_serial_to_date(result[1]),
        }

    # ------------------------------------------------------------------
    # 12. Context Enrichment
    # ------------------------------------------------------------------

    def resolve_result_context(self, filters=None):
        from app.data_engine.date_filter import resolve_date_filter
        filters = filters or {}
    
        context = {}
    
        semantic_dimensions = [
            "location",
            "channel",
            "customer",
            "branch",
            "status",
            "category",
        ]
    
        for dimension in semantic_dimensions:
            if dimension in filters:
                context[dimension] = filters[dimension]
    
        if "date" in filters:
            context["date"] = filters["date"]
    
            dataset_range = self.date_range()
    
            context["applied_date_range"] = resolve_date_filter(
                filters["date"],
                dataset_date_range=dataset_range,
            )
    
        return context

    def enrich_result_context(
        self,
        result: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Add contextual dataset information to an analysis result.
    
        Only includes dimensions that are actually available in the
        semantic schema. Never invents unavailable columns.
        """
    
        context = dict(result)
    
        # ---------------------------------------------------------
        # Dataset date range
        # ---------------------------------------------------------
    
        if self._has_column("date"):
            context["dataset_date_range"] = self.date_range()
    
        # ---------------------------------------------------------
        # Resolved context
        # ---------------------------------------------------------
        
        filters = context.get("filters", {})
        context["resolved_context"] = self.resolve_result_context(filters)

        # ---------------------------------------------------------
        # Available dimensions
        # ---------------------------------------------------------
    
        available_dimensions = {}
    
        dimension_mapping = {
            "product": "product",
            "location": "location",
            "branch": "branch",
            "customer": "customer",
            "channel": "channel",
            "status": "status",
            "category": "category",
        }
    
        for output_name, semantic_name in dimension_mapping.items():
    
            if self._has_column(semantic_name):
                available_dimensions[output_name] = True
            else:
                available_dimensions[output_name] = False
    
        context["available_dimensions"] = available_dimensions
    
        return context

    # ------------------------------------------------------------------
    # Filtered Queries
    # ------------------------------------------------------------------

    def _semantic_output_name(self, source_column):
    
        reverse_mapping = {
            source: semantic
            for semantic, source
            in self.schema_mapper.mapping.items()
            if source is not None
        }
    
        return reverse_mapping.get(
            source_column,
            source_column
        )

    def _group_columns(self, group_by):
        if not group_by:
            raise ValueError(
                "At least one grouping dimension is required"
            )
    
        columns = []
    
        for semantic_name in group_by:
            column = self._column(semantic_name)
    
            if not column:
                raise ValueError(
                    f"Grouping column unavailable: {semantic_name}"
                )
    
            columns.append(column)
    
        return columns

    def group_by_dimensions(
        self,
        group_by,
        metric,
        filters=None,
        limit=None,
        sort_order="desc"
    ):
        filters = filters or {}
        
        sort_order_sql = "ASC" if sort_order and sort_order.lower() == "asc" else "DESC"
    
        group_columns = self._group_columns(group_by)
    
        where_sql, parameters = self._build_filter_clause(
            filters
        )
    
        if metric == "revenue":
    
            metric_expression = (
                f"SUM({self._revenue_expression()})"
            )
    
            metric_alias = "revenue"
    
        elif metric == "quantity":
    
            quantity_column = self._column("quantity")
    
            metric_expression = (
                f"SUM({quantity_column})"
            )
    
            metric_alias = "units_sold"
    
        else:
            raise ValueError(
                f"Unsupported metric: {metric}"
            )
    
        select_columns = ", ".join(group_columns)
        group_columns_sql = ", ".join(group_columns)
    
        query = f"""
            SELECT
                {select_columns},
                {metric_expression} AS {metric_alias},
                COUNT(*) AS orders
            FROM dataset
            {where_sql}
            GROUP BY {group_columns_sql}
            ORDER BY {metric_alias} {sort_order_sql}
        """
    
        if limit is not None:
            query += " LIMIT ?"
            parameters.append(int(limit))
    
        rows = self.connection.execute(
            query,
            parameters
        ).fetchall()
    
        column_names = [
            description[0]
            for description in self.connection.description
        ]
    
        results = []
    
        for row in rows:
    
            raw = dict(
                zip(column_names, row)
            )
    
            result = {}
    
            for key, value in raw.items():
    
                result[
                    self._semantic_output_name(key)
                ] = value
    
            results.append(result)
    
        return results

    def _build_filter_clause(self, filters: dict):
        """
        Convert semantic filters into a safe DuckDB WHERE clause.

        Returns:
            tuple[str, list]
        """

        if not filters:
            return "", []

        conditions = []
        parameters = []

        for semantic_name, value in filters.items():

            # Check that the semantic field exists
            if not self._has_column(semantic_name):
                raise ValueError(
                    f"Cannot filter by '{semantic_name}': "
                    "column is not available in dataset."
                )

            column = self._column(semantic_name)

            # Ignore empty filters
            if value is None or value == "":
                continue

            # Date handling will be implemented separately
            if semantic_name == "date":
            
                from app.data_engine.date_filter import resolve_date_filter
                
                dataset_dates = self.date_range()
            
                date_range = resolve_date_filter(
                    value,
                    dataset_date_range=dataset_dates
                )
            
                date_column = self._column("date")
                
                # Strip out the extra quotes that _column adds for interpolation here
                date_col_clean = date_column.strip('"')
            
                conditions.append(
                    f"""
                    CAST(
                        '1899-12-30'::DATE
                        + CAST("{date_col_clean}" AS INTEGER)
                    AS DATE)
                    BETWEEN ? AND ?
                    """
                )
            
                parameters.append(date_range["start"])
                parameters.append(date_range["end"])
            
                continue

            # Safe parameterized condition
            conditions.append(f'{column} = ?')
            parameters.append(value)

        if not conditions:
            return "", []

        where_sql = " WHERE " + " AND ".join(conditions)

        return where_sql, parameters

    def total_revenue_filtered(self, filters=None):
        """
        Calculate revenue after applying filters.
        """

        filters = filters or {}

        revenue_expression = self._revenue_expression()

        where_sql, parameters = self._build_filter_clause(
            filters
        )

        query = f"""
            SELECT
                SUM({revenue_expression}) AS total_revenue
            FROM dataset
            {where_sql}
        """

        result = self.connection.execute(
            query,
            parameters
        ).fetchone()

        value = result[0] or 0

        return {
            "metric": "total_revenue",
            "value": float(value),
            "filters": filters,
            "formula": "revenue column OR price × quantity"
        }

    def top_product_by_revenue_filtered(
        self,
        filters=None,
        limit=1
    ):
        """
        Find the highest-revenue product after filters.
        """

        filters = filters or {}

        revenue_expression = self._revenue_expression()

        product_column = self._column("product")
        quantity_column = self._column("quantity")

        where_sql, parameters = self._build_filter_clause(
            filters
        )

        query = f"""
            SELECT
                {product_column} AS product,
                SUM({revenue_expression}) AS revenue,
                SUM({quantity_column}) AS units_sold,
                COUNT(*) AS orders
            FROM dataset
            {where_sql}
            GROUP BY {product_column}
            ORDER BY revenue DESC
            LIMIT ?
        """

        parameters.append(int(limit))

        rows = self.connection.execute(
            query,
            parameters
        ).fetchall()

        return [
            {
                "product": row[0],
                "revenue": float(row[1] or 0),
                "units_sold": float(row[2] or 0),
                "orders": int(row[3] or 0)
            }
            for row in rows
        ]

    def total_units_sold_filtered(self, filters=None):

        filters = filters or {}

        quantity_column = self._column("quantity")

        where_sql, parameters = self._build_filter_clause(
            filters
        )

        query = f"""
            SELECT
                SUM({quantity_column}) AS total_units
            FROM dataset
            {where_sql}
        """

        result = self.connection.execute(
            query,
            parameters
        ).fetchone()

        value = result[0] or 0

        return {
            "metric": "total_units_sold",
            "value": float(value),
            "filters": filters
        }

    # ------------------------------------------------------------------
    # Close
    # ------------------------------------------------------------------

    def close(self) -> None:
        """
        Close DuckDB connection.
        """

        if self.connection:
            self.connection.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.close()
