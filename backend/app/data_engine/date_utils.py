from datetime import datetime, timedelta
from typing import Optional


def excel_serial_to_date(value) -> Optional[str]:
    """
    Convert an Excel serial date into YYYY-MM-DD.
    """

    if value is None:
        return None

    try:
        value = float(value)

        base_date = datetime(1899, 12, 30)

        result = base_date + timedelta(days=value)

        return result.strftime("%Y-%m-%d")

    except (ValueError, TypeError):
        return None

