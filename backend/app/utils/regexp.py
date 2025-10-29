import re

def normalize_coordinates(coordinates: str) -> tuple[str]:
    if not coordinates:
        return None

    pattern = r'"lat":\s*([\d.-]+),\s*"lon":\s*([\d.-]+)'
    match = re.search(pattern, coordinates)

    if not match:
        return None

    return match.groups()


def normalize_address(query: str) -> tuple[str]:
    # убираем "ул.", "улица", точки, запятые
    extended_strings = ('улица', 'Улица')
    for ext_str in extended_strings:
        query = query.replace(ext_str, '')
    query = re.sub(r"(^|\s)(ул\.?|улица)\s*", " ", query)
    query = re.sub(r"[.,]", " ", query).strip()

    # делим на улицу/номер
    parts = query.split()
    street_part = " ".join([p for p in parts if not any(c.isdigit() for c in p)]) or query
    number_part = next((p for p in parts if any(c.isdigit() for c in p)), None)
    
    return (street_part, number_part)