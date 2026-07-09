# Macho-Nice-Guy-Dichotomy

## Overview

This repository contains the analysis pipeline, manuscript source, and supporting materials for a diachronic semantic study of the **Macho–Nice Guy dichotomy** in English-language historical word embeddings. The project asks whether culturally salient masculine prototypes associated with "macho" versus "nice" men can be recovered from distributional semantics, how these prototypes relate to attractiveness and relationship-type constructs, and whether the semantic split between them changes over time.

The core analysis is implemented as an executable **Quarto manuscript** in [`Macho-Nice-Guy-Dichotomy.qmd`](./Macho-Nice-Guy-Dichotomy.qmd). The rendered HTML output is [`Macho-Nice-Guy-Dichotomy.html`](./Macho-Nice-Guy-Dichotomy.html).

This is not an R package. It is a research repository centered on a single reproducible manuscript.

## Research Design

The study uses decade-specific embedding spaces from the **HistWords** family of models and focuses on the period **1800-1990**. The 2000s are excluded because later N-gram sampling differs from earlier slices.

The main inferential idea is intentionally **within-decade** rather than direct cross-decade cosine comparison. This choice addresses the standard **alignment problem** in diachronic embeddings: raw geometric comparisons across independently trained historical spaces are not automatically interpretable. Instead, the manuscript asks whether words and construct vectors are relatively closer to the **Macho** or **Nice Guy** side *within each decade*, and then studies how those within-decade contrasts evolve across time.

## Main Questions

The manuscript is organized around six substantive questions:

1. Whether lexical items are, on average, more strongly associated with the Macho or Nice Guy construct.
2. Which rated traits are most consistently pulled toward each side of the dichotomy.
3. Whether the valence of the traits associated with each construct changes across decades.
4. How an Attractiveness construct aligns with the Macho-Nice dimension across methods and decades.
5. Whether relationship-type constructs associated with long-term commitment versus casual sexuality align differently with the Macho-Nice dimension.
6. Whether the semantic split between Macho and Nice Guy prototypes widens across historical time.

## Data Sources

### Historical embeddings

- `engall/ENGall_model.RDS`
  A cached list of decade-specific embedding spaces used by the manuscript.
- The underlying modeling logic follows **HistWords**-style historical embeddings derived from Google Books N-grams.

### Lexical norms and stimulus materials

- `wordstim/allwrdnorms_warriner.csv`
  Warriner valence, arousal, and dominance norms used in the trait-valence sections.
- `wordstim/traitlist.txt`
  Trait vocabulary used for the personality-focused analyses.
- `wordstim/traitextradat.csv`
  Additional trait-level supporting data.
- `wordstim/freqav_dat.csv`
  Auxiliary lexical metadata.

### Supplementary materials

- `theoretical-supplements/`
  PDFs and conceptual source materials used to motivate the theoretical framing.

## Construct Representation Strategy

The analysis operationalizes semantic constructs as **DDRs** (distributed dictionary representations), i.e. averaged embeddings over theoretically chosen seed words within each decade.

The repository currently uses three related construct-building / scoring ideas:

- **Nudge approach**
  A construct DDR is built from a seed list and then shifted in the male direction using a male-minus-female semantic axis.
- **Inject approach**
  Male anchor words are inserted directly into the construct seed list before averaging.
- **PLS axis**
  A supervised one-component partial least squares model is trained to separate Macho versus Nice seed words, yielding a directional semantic axis.

The current manuscript also includes:

- **Warriner-based valence analysis**
  Trait valence is read from external human ratings that remain constant across decades.
- **Semantic valence DDR analysis**
  A positive-valence prototype is built directly inside each decade from words such as `good`, `great`, and `wonderful`, allowing the valence signal itself to be represented distributionally rather than imposed from a modern norm table.

## Scoring Framework

Three scoring families are compared throughout the manuscript:

- **Pairwise cosine delta**
  Difference between cosine similarity to Macho and cosine similarity to Nice.
- **Anchored scoring**
  Position on a bipolar Macho-versus-Nice semantic continuum.
- **PLS cosine loading**
  Cosine similarity to a supervised Macho-Nice PLS axis.

Because these methods are not geometrically identical, the manuscript emphasizes **directional agreement**, **rank ordering**, and **historical trajectories** rather than assuming that raw magnitudes are directly interchangeable.

## Statistical Strategy

The project combines descriptive lexical summaries with formal longitudinal modeling.

### Descriptive components

- One-sample tests are used in the screening sections to summarize whether grouped scores differ from their method-appropriate neutral point.
- For anchored scores, the neutral value is handled carefully:
  - raw anchored scores on the `0-1` scale use `.5` as the null;
  - centered anchored scores use `0` as the null.

### Longitudinal components

Whenever the manuscript formally tests **change across decades**, it first checks for **tracking** in residuals:

- residual-versus-time inspection,
- lag-1 residual correlation,
- studentized residual diagnostics.

When residual dependence is evident, the manuscript uses **weighted GLS with AR(1)**:

- `AR(1)` models temporal carryover between adjacent decades,
- weighting is based on the number of available embedding vectors in each decade (`n_avwords`),
- spline comparisons are used where nonlinear historical change is plausible.

When residual diagnostics do **not** indicate meaningful dependence, the manuscript interprets **OLS slopes** directly as the formal test of historical change.

## Repository Structure

```text
.
├── Macho-Nice-Guy-Dichotomy.qmd        # Canonical manuscript source
├── Macho-Nice-Guy-Dichotomy.html       # Rendered manuscript output
├── Macho-Nice-Guy-Dichotomy.docx       # Word export / manuscript artifact
├── Macho-Nice-Guy-Dichotomy.Rproj      # RStudio project file
├── README.md                           # Project documentation
├── engall/
│   └── ENGall_model.RDS                # Cached decade-specific embeddings
├── wordstim/
│   ├── allwrdnorms_warriner.csv        # Valence/arousal/dominance norms
│   ├── freqav_dat.csv
│   ├── traitextradat.csv
│   └── traitlist.txt
├── theoretical-supplements/            # PDFs and conceptual background
├── coha/                               # Auxiliary historical data resources
└── media/                              # Presentation / visualization assets
```

## Software Requirements

### Core environment

- R
- Quarto

### R packages used directly in the manuscript

- `tidyverse`
- `vroom`
- `stringr`
- `purrr`
- `sweater`
- `quanteda.textmodels`
- `quanteda`
- `embedplyr`
- `knitr`
- `pls`

### Additional namespaced dependencies used in the current manuscript

- `nlme`
- `patchwork`
- `scales`
- `splines`

## Reproducibility

### 1. Open the project

Use the root directory as the working directory, ideally through the included RStudio project:

- `Macho-Nice-Guy-Dichotomy.Rproj`

### 2. Ensure data availability

The Quarto document expects:

- the cached embedding object at `engall/ENGall_model.RDS`, or
- the ability to reconstruct embeddings from the HistWords-style model files referenced by the manuscript.

### 3. Install required packages

An example installation command is:

```r
install.packages(c(
  "tidyverse",
  "vroom",
  "stringr",
  "purrr",
  "quanteda.textmodels",
  "quanteda",
  "knitr",
  "pls",
  "nlme",
  "patchwork",
  "scales"
))
```

Packages such as `sweater` and `embedplyr` may need to be installed from the appropriate source if they are not available in your default package repository.

### 4. Render the manuscript

From the project root:

```bash
quarto render Macho-Nice-Guy-Dichotomy.qmd
```

This regenerates the main HTML manuscript:

- `Macho-Nice-Guy-Dichotomy.html`

## Output

The rendered manuscript contains:

- decade-by-decade plots,
- trait-level summary tables,
- residual tracking diagnostics,
- OLS or GLS trend tables depending on residual dependence,
- robustness checks excluding unstable early decades,
- comparison of Warriner-based and semantic-DDR valence trajectories.

## Methodological Notes

Several design choices are central to the interpretation of results:

- **Within-decade comparison over raw cross-decade geometry**
  This is the key safeguard against the alignment problem.
- **Constructs as averaged seed-word embeddings**
  Results depend on theoretically chosen word lists and should be interpreted as operationalizations, not as direct psychological measurements.
- **Normalization and distance**
  The manuscript distinguishes between cosine-based and Euclidean-based split metrics because vector magnitude can influence Euclidean distance independently of directional separation.
- **Lexical availability**
  The number of words with usable embeddings varies by decade; this matters for uncertainty and motivates weighted models in the longitudinal sections where dependence is evident.

## Limitations

- Historical embeddings are corpus-derived and reflect language use rather than latent beliefs directly.
- Seed-word choices are theory-laden and may affect construct geometry.
- Warriner ratings are modern ratings applied to historical lexical items.
- Some early decades are less stable because lexical coverage is weaker and certain seed terms are absent.
- The project studies English-language semantic history and should not be generalized automatically beyond that corpus and language context.

## Citation and Use

If you use this repository, cite the manuscript or thesis chapter that accompanies it and acknowledge the original data sources, especially:

- HistWords / historical Google Books embedding resources
- Warriner et al. lexical norms
- Any supplementary theoretical sources reproduced in `theoretical-supplements/`

Users remain responsible for complying with the licenses and citation requirements of the original datasets and articles.
