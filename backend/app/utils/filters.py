import re
from rapidfuzz import fuzz, process


def address_fuzzy_search(rows, street_part: str, number_part: str):
    # --- ФАЗЗИ фильтрация по улице ---
    def clean_name(name: str):
        name = name.lower()
        name = re.sub(r"[.,]", " ", name)
        name = name.replace("ул", "").strip()
        return name

    street_names = {clean_name(r['name']): r['name'] for r in rows}

    matches = process.extract(
        street_part,
        street_names.keys(),
        scorer=fuzz.WRatio,
        score_cutoff=80,
        limit=None,
    )

    matched_street_names = {street_names[m[0]] for m in matches}

    filtered_rows = [
        r for r in rows if r['name'] in matched_street_names
    ]

    if number_part:
        filtered_rows = [
            r for r in filtered_rows
            if number_part.lower() in (r['number'] or "").lower()
        ]
        
    return filtered_rows