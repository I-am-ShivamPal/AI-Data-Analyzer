"""
AI DATA ANALYZER - ANALYSIS EXECUTOR

Translates the structured JSON intent into actual
calculations using QueryExecutor.
"""

from typing import Any, Dict
from app.data_engine.query_executor import QueryExecutor

class AnalysisExecutor:
    """
    Connects the structured intent to the data execution layer.
    """
    
    def __init__(self, query_executor: QueryExecutor):
        self.query_executor = query_executor

    def _wrap_result(
        self,
        operation,
        entity,
        metric,
        result,
        filters,
        group_by=None
    ):
        return {
            "operation": operation,
            "entity": entity,
            "group_by": group_by or [],
            "metric": metric,
            "result": result,
            "filters": filters
        }
        
    def execute(self, intent: Dict[str, Any]) -> Dict[str, Any]:
        operation = intent.get("operation")
        entity = intent.get("entity")
        metric = intent.get("metric")
        limit = intent.get("limit")
        filters = intent.get("filters") or {}

        if operation == "top":
            result = self._execute_top(
                entity=entity,
                metric=metric,
                limit=limit,
                filters=filters
            )

        elif operation == "group":
            result = self._execute_group(intent)

        elif operation == "total":
            result = self._execute_total(
                metric=metric,
                filters=filters
            )

        elif operation == "count":
            result = self._execute_count(
                entity=entity,
                filters=filters
            )

        elif operation == "overview":
            result = self._execute_overview(
                filters=filters
            )

        else:
            raise ValueError(
                f"Unsupported operation: {operation}"
            )

        return self.query_executor.enrich_result_context(result)

    def _execute_top(self, entity, metric, limit=1, filters=None):
        filters = filters or {}
        limit = limit or 1

        if entity == "product":
            if metric == "revenue":
                result = self.query_executor.top_product_by_revenue_filtered(
                    filters=filters,
                    limit=limit
                )
                return self._wrap_result(
                    operation="top",
                    entity=entity,
                    metric=metric,
                    result=result,
                    filters=filters
                )
            if metric == "quantity":
                result = self.query_executor.units_sold_by_product(limit=limit)
                return self._wrap_result("top", entity, metric, result, filters)

        if entity == "location":
            if metric == "revenue":
                result = self.query_executor.revenue_by_location(limit=limit)
                return self._wrap_result("top", entity, metric, result, filters)

        if entity == "channel":
            if metric == "revenue":
                result = self.query_executor.revenue_by_channel(limit=limit)
                return self._wrap_result("top", entity, metric, result, filters)

        raise ValueError(
            f"Unsupported top query: "
            f"entity={entity}, metric={metric}"
        )

    def _execute_total(
        self,
        metric,
        filters=None
    ):
        filters = filters or {}

        if metric == "revenue":
            result = self.query_executor.total_revenue_filtered(
                filters=filters
            )
            return self._wrap_result(
                operation="total",
                entity="dataset",
                metric=metric,
                result=result,
                filters=filters
            )

        if metric == "quantity":
            result = self.query_executor.total_units_sold_filtered(
                filters=filters
            )
            return self._wrap_result(
                operation="total",
                entity="dataset",
                metric=metric,
                result=result,
                filters=filters
            )

        raise ValueError(
            f"Unsupported total metric: {metric}"
        )

    def _validate_group_by(self, group_by):
        return self.query_executor.schema_mapper.validate_group_by(
            group_by
        )

    def _execute_group(self, intent: Dict[str, Any]) -> Dict[str, Any]:
        group_by = intent.get(
            "group_by",
            []
        )
    
        if not group_by:
            entity = intent.get("entity")
            if entity:
                group_by = [entity]
            else:
                raise ValueError(
                    "Group operation requires group_by"
                )
    
        self._validate_group_by(group_by)
    
        result = self.query_executor.group_by_dimensions(
            group_by=group_by,
            metric=intent.get("metric"),
            filters=intent.get("filters", {}),
            limit=intent.get("limit"),
            sort_order=intent.get("sort_order", "desc")
        )
    
        return self._wrap_result(
            operation="group",
            entity=intent.get("entity"),
            metric=intent.get("metric"),
            result=result,
            filters=intent.get("filters", {}),
            group_by=group_by
        )

    def _execute_count(self, entity: str, filters: dict = None) -> Dict[str, Any]:
        filters = filters or {}
        if entity == "customer":
            return self._wrap_result("count", "customer", None, self.query_executor.customer_count(), filters)
        if entity == "order":
            return self._wrap_result("count", "order", None, {"metric": "orders", "value": self.query_executor.row_count()}, filters)

        raise ValueError(f"Unsupported count entity: {entity}")

    def _execute_overview(self, filters: dict = None) -> Dict[str, Any]:
        filters = filters or {}
        return self._wrap_result("overview", "dataset", None, self.query_executor.overview(), filters)
