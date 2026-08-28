from datetime import date
import calendar


MONTHS = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
}


def resolve_date_filter(value, dataset_date_range=None):
    if not value:
        return None

    text = str(value).strip().lower()

    # Determine default year from dataset
    default_year = None

    if dataset_date_range:
        start_date = dataset_date_range.get("start")

        if start_date:
            default_year = int(start_date[:4])

    if default_year is None:
        raise ValueError(
            "Cannot resolve date without a dataset date range."
        )

    # -----------------------------------------------------
    # Month only
    # -----------------------------------------------------

    if text in MONTHS:

        month = MONTHS[text]

        last_day = calendar.monthrange(
            default_year,
            month
        )[1]

        return {
            "start": date(
                default_year,
                month,
                1
            ).isoformat(),

            "end": date(
                default_year,
                month,
                last_day
            ).isoformat()
        }

    # -----------------------------------------------------
    # Month + year
    # -----------------------------------------------------

    parts = text.split()

    if len(parts) == 2:

        month_name = parts[0]

        if (
            month_name in MONTHS
            and parts[1].isdigit()
        ):

            year = int(parts[1])
            month = MONTHS[month_name]

            last_day = calendar.monthrange(
                year,
                month
            )[1]

            return {
                "start": date(
                    year,
                    month,
                    1
                ).isoformat(),

                "end": date(
                    year,
                    month,
                    last_day
                ).isoformat()
            }

    raise ValueError(
        f"Unsupported date filter: {value}"
    )
