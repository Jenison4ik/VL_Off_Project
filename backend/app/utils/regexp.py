import re

def normalize_coordinates(coordinates: str):
    pattern = r'"lat":\s*([\d.-]+),\s*"lon":\s*([\d.-]+)'
    correct_coordinates = re.search(pattern, coordinates).groups()
    # print(correct_coordinates)
    return correct_coordinates