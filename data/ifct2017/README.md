# IFCT 2017 data snapshot

## Source

- Package: [@ifct2017/compositions](https://www.npmjs.com/package/@ifct2017/compositions)
- Version: `2.0.9` (published May 2, 2023)
- License: MIT (see `LICENSE-mit.txt`)
- Upstream data: Indian Food Composition Tables 2017, National Institute of Nutrition, Hyderabad.
- Snapshot URL: `https://unpkg.com/@ifct2017/compositions@2.0.9/index.csv`

## Files

- `compositions-v2.0.9.csv` - raw per-100g nutrient composition for 542 Indian foods.
- `LICENSE-mit.txt` - upstream MIT license verbatim.

## Units

- `enerc` energy is in kJ per 100 g. kcal = kJ / 4.184.
- `protcnt`, `fatce`, `choavldf`, `fibtg` are grams per 100 g.

## Why this snapshot

The upstream `ifct2017.github.io` repository changed to AGPL-3.0 on 2025-05-01.
This snapshot predates that change; the MIT grant under which it was published
is irrevocable for this version.

The snapshot is vendored into the repo (not fetched at runtime) so the seed
script is reproducible without network access.
