import re

def normalize_coordinates(coordinates: str) -> tuple[str]:
    if not coordinates:
        return None

    pattern = r'"lat":\s*([\d.-]+),\s*"lon":\s*([\d.-]+)'
    match = re.search(pattern, coordinates)

    if not match:
        return None

    return match.groups()