"""
AI DATA ANALYZER - QUESTION PARSER

Converts a user's natural-language question into a structured
analysis intent using Qwen2.5-7B-Instruct.
"""

from __future__ import annotations

import json
import re
from typing import Any, Dict

from app.ai.qwen_model import QwenModel


SUPPORTED_OPERATIONS = {
    "group",
    "total",
    "count",
    "overview",
}

SUPPORTED_ENTITIES = {
    "product",
    "location",
    "channel",
    "customer",
    "order",
    "dataset",
}

SUPPORTED_METRICS = {
    "revenue",
    "quantity",
    "orders",
    "customers",
    None,
}

SUPPORTED_FILTERS = {
    "product",
    "product_id",
    "location",
    "branch",
    "customer",
    "channel",
    "status",
    "category",
    "date",
}

SUPPORTED_GROUP_BY = {
    "product",
    "product_id",
    "location",
    "branch",
    "customer",
    "channel",
    "status",
    "category",
    "date",
}


class IntentValidationError(ValueError):
    """Raised when Qwen produces an invalid analysis intent."""


class QuestionParser:
    """
    Uses Qwen2.5-7B-Instruct to convert natural language
    questions into structured analysis intents.
    """

    def __init__(self, qwen: QwenModel, schema: Dict[str, Any] = None):
        self.qwen = qwen
        self.schema = schema or {}

    def _build_prompt(self, question: str) -> str:
        return f"""
You are the intent parser for an AI data analysis system.

Your ONLY job is to understand the user's question and
convert it into structured JSON.

You MUST NOT:
- calculate anything
- invent numbers
- answer the question
- write explanations
- create SQL
- create an analysis plan

Return ONLY valid JSON.

SUPPORTED OPERATIONS:

1. "group"
   Used when the user asks to show, compare, rank, or summarize
   a metric grouped by an entity. Also used when the user asks for
   the highest, lowest, best, worst, top, or bottom.

2. "total"
   Used when the user asks for the total/sum of a metric.

3. "count"
   Used when the user asks how many orders/customers exist.

4. "overview"
   Used when the user asks for a general dataset summary.

SUPPORTED ENTITIES:

- product
- location
- channel
- customer
- order
- dataset

SUPPORTED METRICS:

- revenue
- quantity
- orders
- customers
- null

INTENT FORMAT:

{{
  "operation": "...",
  "entity": "...",
  "group_by": [],
  "metric": "...",
  "limit": null,
  "sort_order": "desc",
  "filters": {{}}
}}

Use "sort_order": "desc" for top/highest/best.
Use "sort_order": "asc" for bottom/lowest/worst.

For group operations, group_by MUST contain the dimensions
requested by the user.

EXAMPLES:

Question:
Which product generated the highest revenue?

JSON:
{{
  "operation": "group",
  "entity": "product",
  "group_by": ["product"],
  "metric": "revenue",
  "limit": 1,
  "sort_order": "desc",
  "filters": {{}}
}}

Question:
Top 5 products by revenue in Virginia?

JSON:
{{
  "operation": "group",
  "entity": "product",
  "group_by": ["product"],
  "metric": "revenue",
  "limit": 5,
  "sort_order": "desc",
  "filters": {{
    "location": "Virginia"
  }}
}}

Question:
Bottom 3 products by units sold?

JSON:
{{
  "operation": "group",
  "entity": "product",
  "group_by": ["product"],
  "metric": "quantity",
  "limit": 3,
  "sort_order": "asc",
  "filters": {{}}
}}

Question:
Show revenue by product.

JSON:
{{
  "operation": "group",
  "entity": "product",
  "group_by": ["product"],
  "metric": "revenue",
  "limit": null,
  "sort_order": null,
  "filters": {{}}
}}

Question:
Show revenue by product and location.

JSON:
{{
  "operation": "group",
  "entity": "product",
  "group_by": ["product", "location"],
  "metric": "revenue",
  "limit": null,
  "sort_order": null,
  "filters": {{}}
}}

Question:
Show units sold by product and channel in Virginia.

JSON:
{{
  "operation": "group",
  "entity": "product",
  "group_by": ["product", "channel"],
  "metric": "quantity",
  "limit": null,
  "sort_order": null,
  "filters": {{
    "location": "Virginia"
  }}
}}

Question:
Show revenue by product, location and channel in March.

JSON:
{{
  "operation": "group",
  "entity": "product",
  "group_by": ["product", "location", "channel"],
  "metric": "revenue",
  "limit": null,
  "sort_order": null,
  "filters": {{
    "date": "March"
  }}
}}

Question:
How many units were sold in Virginia?

JSON:
{{
  "operation": "total",
  "entity": "dataset",
  "group_by": [],
  "metric": "quantity",
  "limit": null,
  "sort_order": null,
  "filters": {{
    "location": "Virginia"
  }}
}}

Question:
What was the total revenue in March?

JSON:
{{
  "operation": "total",
  "entity": "dataset",
  "group_by": [],
  "metric": "revenue",
  "limit": null,
  "sort_order": null,
  "filters": {{
    "date": "March"
  }}
}}

Never put grouping dimensions inside filters.

Never calculate the result.

Never generate SQL.

USER QUESTION:

{question}

RETURN ONLY JSON.
"""

    def _extract_json(self, response: str) -> Dict[str, Any]:
        """
        Extract JSON even if Qwen accidentally surrounds it
        with markdown or extra text.
        """
        response = response.strip()

        # First attempt: complete response is JSON
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            pass

        # Remove markdown code fences
        cleaned = response
        cleaned = re.sub(
            r"```json\s*",
            "",
            cleaned,
            flags=re.IGNORECASE,
        )
        cleaned = re.sub(
            r"```\s*",
            "",
            cleaned,
        )
        cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            pass

        # Find first JSON object
        match = re.search(
            r"\{.*\}",
            cleaned,
            flags=re.DOTALL,
        )

        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass

        raise IntentValidationError(
            f"Qwen returned invalid JSON:\n{response}"
        )

    def normalize_group_by(self, group_by):
        if group_by is None:
            return []
    
        if isinstance(group_by, str):
            group_by = [group_by]
    
        if not isinstance(group_by, list):
            raise ValueError("group_by must be a list")
    
        aliases = {
            "products": "product",
            "product name": "product",
            "product names": "product",
    
            "locations": "location",
            "states": "location",
            "state": "location",
    
            "customers": "customer",
            "customer name": "customer",
    
            "channels": "channel",
            "ordering channel": "channel",
    
            "statuses": "status",
            "order status": "status",
    
            "branches": "branch",
            "categories": "category",
            "dates": "date",
        }
    
        normalized = []
    
        for value in group_by:
            if not isinstance(value, str):
                raise ValueError(
                    "group_by values must be strings"
                )
    
            value = value.strip().lower()
            value = aliases.get(value, value)
    
            if value not in SUPPORTED_GROUP_BY:
                raise ValueError(
                    f"Unsupported grouping dimension: {value}"
                )
    
            if value not in normalized:
                normalized.append(value)
    
        return normalized

    def normalize_filters(self, filters):
        """
        Normalize Qwen-generated filters into the internal schema.
        """
    
        if not filters:
            return {}
    
        if not isinstance(filters, dict):
            raise ValueError("filters must be an object")
    
        normalized = {}
    
        for key, value in filters.items():
    
            if key not in SUPPORTED_FILTERS:
                raise ValueError(
                    f"Unsupported filter: {key}"
                )
    
            if value is None:
                continue
    
            normalized[key] = value
    
        return normalized

    def _normalize_intent(self, raw_intent: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate and normalize Qwen's structured intent.
    
        Qwen is allowed to interpret language, but Python
        remains responsible for validating the result.
        """
        if not isinstance(raw_intent, dict):
            raise IntentValidationError(
                "Qwen did not return a JSON object."
            )
    
        operation = raw_intent.get("operation")
        entity = raw_intent.get("entity")
        metric = raw_intent.get("metric")
        limit = raw_intent.get("limit")
        sort_order = raw_intent.get("sort_order")
    
        # ---------------------------------------------------------
        # NORMALIZE STRINGS
        # ---------------------------------------------------------
    
        if isinstance(operation, str):
            operation = operation.strip().lower()
    
        if isinstance(entity, str):
            entity = entity.strip().lower()
    
        if isinstance(metric, str):
            metric = metric.strip().lower()
    
        # ---------------------------------------------------------
        # COMMON ALIASES
        # ---------------------------------------------------------
    
        operation_aliases = {
            "ranking": "group",
            "rank": "group",
            "highest": "group",
            "lowest": "group",
            "top": "group",
            "compare": "group",
            "groupby": "group",
            "group_by": "group",
            "sum": "total",
            "aggregate": "total",
            "count_distinct": "count",
            "summary": "overview",
            "describe": "overview",
        }
    
        entity_aliases = {
            "products": "product",
            "locations": "location",
            "states": "location",
            "channels": "channel",
            "customers": "customer",
            "orders": "order",
            "data": "dataset",
            "file": "dataset",
            "dataset_overview": "dataset",
        }
    
        metric_aliases = {
            "sales": "revenue",
            "total_sales": "revenue",
            "income": "revenue",
            "money": "revenue",
            "amount": "revenue",
            "unit": "quantity",
            "units": "quantity",
            "units_sold": "quantity",
            "number_of_units": "quantity",
            "order_count": "orders",
            "customer_count": "customers",
            "number_of_orders": "orders",
            "number_of_customers": "customers",
        }
    
        operation = operation_aliases.get(
            operation,
            operation,
        )
    
        entity = entity_aliases.get(
            entity,
            entity,
        )
    
        metric = metric_aliases.get(
            metric,
            metric,
        )
    
        # ---------------------------------------------------------
        # SPECIAL CASES
        # ---------------------------------------------------------
    
        # "How many orders?"
        # means count rows because one row represents an order.
        if operation == "count" and entity == "order":
            metric = None
    
        # "How many customers?"
        if operation == "count" and entity == "customer":
            metric = None
    
        # Dataset totals
        if operation == "total" and entity is None:
            entity = "dataset"
    
        # Dataset overview
        if operation == "overview":
            entity = "dataset"
            metric = None
            limit = None
    
        # ---------------------------------------------------------
        # VALIDATE OPERATION
        # ---------------------------------------------------------
    
        if operation not in SUPPORTED_OPERATIONS:
            raise IntentValidationError(
                f"Unsupported operation: {operation}"
            )
    
        # ---------------------------------------------------------
        # VALIDATE ENTITY
        # ---------------------------------------------------------
    
        if entity not in SUPPORTED_ENTITIES:
            raise IntentValidationError(
                f"Unsupported entity: {entity}"
            )
    
        # ---------------------------------------------------------
        # VALIDATE METRIC
        # ---------------------------------------------------------
    
        if metric not in SUPPORTED_METRICS:
            raise IntentValidationError(
                f"Unsupported metric: {metric}"
            )
    
        # ---------------------------------------------------------
        # NORMALIZE LIMIT
        # ---------------------------------------------------------
    
        if limit is not None:
    
            try:
                limit = int(limit)
            except (TypeError, ValueError):
                limit = 1
    
            if limit < 1:
                limit = 1
    
        # top always needs a limit
        if operation == "top" and limit is None:
            limit = 1
    
        # group doesn't need a limit, but might have one if it's a ranking query
        if operation in {"total", "count", "overview"}:
            limit = None
            
        if sort_order is not None:
            if isinstance(sort_order, str):
                sort_order = sort_order.strip().lower()
            if sort_order not in {"desc", "asc"}:
                sort_order = "desc"
        elif limit is not None and operation == "group":
            sort_order = "desc" # Default to desc for top N queries
    
        # ---------------------------------------------------------
        # RETURN STRICT STRUCTURE
        # ---------------------------------------------------------
    
        normalized_filters = self.normalize_filters(
            raw_intent.get("filters", {})
        )

        group_by = self.normalize_group_by(
            raw_intent.get("group_by", [])
        )

        if operation == "group":
            if not group_by:
                if entity:
                    group_by = [entity]
                else:
                    raise ValueError(
                        "Group operation requires at least one grouping dimension"
                    )
        else:
            group_by = []
        
        return {
            "operation": operation,
            "entity": entity,
            "group_by": group_by,
            "metric": metric,
            "limit": limit,
            "sort_order": sort_order,
            "filters": normalized_filters,
        }

    def validate_against_schema(
        self,
        intent: Dict[str, Any],
    ) -> Dict[str, Any]:
    
        available_columns = set(
            self.schema.get("source_columns", [])
        )
    
        entity_column_map = {
            "product": "product",
            "location": "location",
            "channel": "channel",
            "customer": "customer",
        }
    
        entity = intent["entity"]
    
        if entity in entity_column_map:
    
            semantic_name = entity_column_map[entity]
    
            mapping = self.schema.get(
                "semantic_mapping",
                {},
            )
    
            source_column = mapping.get(
                semantic_name
            )
    
            if not source_column:
                raise IntentValidationError(
                    f"Dataset does not contain the required "
                    f"'{entity}' field."
                )
    
            if source_column not in available_columns:
                raise IntentValidationError(
                    f"Mapped column '{source_column}' "
                    f"does not exist in the dataset."
                )
    
        return intent

    def parse(self, question: str, schema: Dict[str, Any] = None) -> Dict[str, Any]:
        if schema is not None:
            self.schema = schema
            
        if not question or not question.strip():
            raise ValueError("Question cannot be empty.")
    
        prompt = self._build_prompt(
            question.strip()
        )
    
        response = self.qwen.generate(
            prompt,
            max_new_tokens=200,
            temperature=0.0,
        )
    
        raw_intent = self._extract_json(
            response
        )
    
        intent = self._normalize_intent(
            raw_intent
        )
        
        intent = self.validate_against_schema(
            intent
        )
    
        return intent

    def unload(self):
        pass
