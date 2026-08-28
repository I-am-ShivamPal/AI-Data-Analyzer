import json


class DatasetContextBuilder:
    """
    Builds a compact AI-readable context from dataset metadata,
    profiling information, and sample data.
    """

    def __init__(self, inspection_result: dict, profile_result: dict):
        self.inspection_result = inspection_result
        self.profile_result = profile_result

    def build_context(self) -> str:
        """
        Build a structured text context for the AI model.
        """

        file_info = self.inspection_result.get("file_info", {})
        dataset_info = self.inspection_result.get("dataset_info", {})

        dataset_profile = self.profile_result.get("dataset", {})
        numeric_columns = self.profile_result.get("numeric_columns", {})
        text_columns = self.profile_result.get("text_columns", {})
        data_quality = self.profile_result.get("data_quality", {})
        possible_date_columns = self.profile_result.get(
            "possible_date_columns",
            []
        )

        context = {
            "dataset_information": {
                "file_name": file_info.get("file_name"),
                "file_extension": file_info.get("file_extension"),
                "file_size_mb": file_info.get("file_size_mb"),
                "rows": dataset_info.get("rows"),
                "columns": dataset_info.get("columns"),
            },

            "schema": dataset_info.get("data_types", {}),

            "column_names": dataset_info.get(
                "column_names",
                []
            ),

            "numeric_statistics": numeric_columns,

            "categorical_columns": text_columns,

            "data_quality": {
                "duplicate_rows": data_quality.get(
                    "duplicate_rows"
                ),
                "constant_columns": data_quality.get(
                    "constant_columns"
                ),
                "missing_values": data_quality.get(
                    "missing_values"
                ),
            },

            "possible_date_columns": possible_date_columns,

            "sample_data": dataset_info.get(
                "sample_data",
                []
            ),
        }

        return json.dumps(
            context,
            indent=2,
            default=str
        )

    def build_summary(self) -> str:
        """
        Build a smaller human-readable dataset summary.
        """

        dataset_info = self.inspection_result.get(
            "dataset_info",
            {}
        )

        profile = self.profile_result

        rows = dataset_info.get("rows")
        columns = dataset_info.get("columns")
        column_names = dataset_info.get(
            "column_names",
            []
        )

        numeric_columns = list(
            profile.get(
                "numeric_columns",
                {}
            ).keys()
        )

        text_columns = list(
            profile.get(
                "text_columns",
                {}
            ).keys()
        )

        possible_date_columns = profile.get(
            "possible_date_columns",
            []
        )

        summary = f"""
DATASET SUMMARY

Rows: {rows}
Columns: {columns}

COLUMN NAMES:
{", ".join(column_names)}

NUMERIC COLUMNS:
{", ".join(numeric_columns)}

TEXT/CATEGORICAL COLUMNS:
{", ".join(text_columns)}

POSSIBLE DATE COLUMNS:
{", ".join(possible_date_columns)}
"""

        return summary.strip()