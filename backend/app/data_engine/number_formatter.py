def format_currency(value):
    if value is None:
        return None

    return f"${float(value):,.2f}"


def format_number(value, decimals=2):
    if value is None:
        return None

    number = float(value)

    if number.is_integer():
        return f"{int(number):,}"

    return f"{number:,.{decimals}f}"
