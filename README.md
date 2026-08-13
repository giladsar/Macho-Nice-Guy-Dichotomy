# Macho–Nice Guy Dichotomy

An R and Quarto analysis of how *Macho* and *Nice Guy* masculine prototypes are represented in English-language historical word embeddings from 1800 to 1990.

The project uses distributional semantics to ask whether these prototypes can be recovered from historical language, how they relate to traits, attractiveness, and relationship type, and whether the semantic distance between them changes over time.

The canonical, executable manuscript is [`Macho-Nice-Guy-Dichotomy.qmd`](./Macho-Nice-Guy-Dichotomy.qmd). A rendered version is available as [`Macho-Nice-Guy-Dichotomy.html`](./Macho-Nice-Guy-Dichotomy.html).

> This is a research repository centered on a reproducible manuscript, not an R package.

## Research questions

The manuscript addresses six questions:

1. Is the historical English lexicon, on average, more closely associated with the Macho or Nice Guy prototype?
2. Which personality traits are most consistently associated with each side of the dichotomy?
3. Does the valence of Macho- and Nice-associated traits change across decades?
4. How does an Attractiveness construct align with the Macho–Nice dimension?
5. Do long-term/committed and casual/sexual relationship constructs align differently with the two prototypes?
6. Does the semantic split between the prototypes widen over historical time?

## Method in brief

The analysis uses decade-specific, 300-dimensional English embeddings from the [HistWords project](https://nlp.stanford.edu/projects/histwords/), trained on Google Books N-grams. It covers 20 decade slices from 1800 through 1990; the 2000s are excluded because of changes in N-gram sampling.

The embeddings for different decades were trained separately, so raw vectors are not directly comparable across time without alignment. The primary analyses therefore calculate all semantic relationships **within each decade** and model the resulting decade-level scores over time.

| Component | Operationalization |
|---|---|
| Macho and Nice Guy constructs | Averaged seed-word embeddings, also called distributed dictionary representations (DDRs) |
| Masculine context | Either inject male anchor words into each seed list or nudge the completed DDR along a male-minus-female axis |
| Pairwise score | Cosine similarity to Macho minus cosine similarity to Nice Guy |
| Anchored score | Position on a bipolar Macho–Nice continuum |
| PLS score | Cosine similarity to a supervised, one-component partial least squares axis |
| Trait valence | Modern Warriner valence norms, complemented by a decade-specific semantic valence DDR |
| Historical trends | OLS diagnostics followed by weighted GLS with AR(1) errors when residual tracking is evident |

The scoring methods are not geometrically identical. Results are compared primarily through direction, rank ordering, robustness, and historical trajectories rather than by treating their raw magnitudes as interchangeable.

## Quick start

### Prerequisites

- [Git LFS](https://git-lfs.com/) for the large embedding files
- R
- [Quarto](https://quarto.org/docs/get-started/)

The current project has been tested with R 4.5.3 and Quarto 1.9.37. These are reference versions, not claimed minimum requirements.

### 1. Clone the repository and fetch the data

```bash
git lfs install
git clone https://github.com/giladsar/Macho-Nice-Guy-Dichotomy.git
cd Macho-Nice-Guy-Dichotomy
git lfs pull
```

If the repository is already cloned, run `git lfs pull` from its root to ensure that the data files have been downloaded rather than left as small pointer files.

### 2. Install the R dependencies

Run the following in R:

```r
install.packages(c(
  "tidyverse",
  "vroom",
  "sweater",
  "quanteda.textmodels",
  "quanteda",
  "knitr",
  "pls",
  "nlme",
  "scales",
  "remotes"
))

remotes::install_github("rimonim/embedplyr")
```

The project does not currently include an `renv` lockfile, so dependency versions are not pinned.

### 3. Render the manuscript

From the project root, run:

```bash
quarto render Macho-Nice-Guy-Dichotomy.qmd
```

Alternatively, open [`Macho-Nice-Guy-Dichotomy.Rproj`](./Macho-Nice-Guy-Dichotomy.Rproj) in RStudio and render the Quarto document there.

The standard render regenerates `Macho-Nice-Guy-Dichotomy.html`. Computationally expensive, lexicon-wide exploratory chunks marked `eval = FALSE` are intentionally skipped.

## Data

### Historical embeddings

- `engall/ENGall_model.RDS` is the cached list of 20 decade-specific ENGall embedding spaces used by the manuscript. It is approximately 1.6 GB and is stored with Git LFS.
- `coha/wordvecsdata_coha.RData` is an auxiliary historical embedding resource. It is approximately 487 MB and is also stored with Git LFS.

Because the cached models are large, rendering requires adequate disk space and memory.

### Lexical norms and stimuli

- `wordstim/allwrdnorms_warriner.csv` contains valence, arousal, and dominance ratings.
- `wordstim/traitlist.txt` contains the trait vocabulary used in the personality analyses.
- `wordstim/traitextradat.csv` and `wordstim/freqav_dat.csv` contain supporting trait and lexical metadata.

### Theoretical materials

`theoretical-supplements/` contains articles, item lists, and other materials used to develop the theoretical framing. These files are supporting sources; the executable analysis remains in the Quarto manuscript.

## Repository structure

```text
.
├── Macho-Nice-Guy-Dichotomy.qmd     # Canonical manuscript and analysis
├── Macho-Nice-Guy-Dichotomy.html    # Rendered HTML manuscript
├── Macho-Nice-Guy-Dichotomy.docx    # Word manuscript artifact
├── Macho-Nice-Guy-Dichotomy.Rproj   # RStudio project
├── engall/
│   └── ENGall_model.RDS             # Cached decade-specific embeddings
├── wordstim/                          # Norms, traits, and lexical metadata
├── theoretical-supplements/           # Theoretical source materials
├── coha/                              # Auxiliary historical embeddings
├── media/                             # Presentation assets
└── previous versions/                 # Earlier rendered manuscripts
```

## Outputs

The rendered manuscript includes:

- word-availability and construct-coverage checks;
- decade-by-decade semantic trajectories;
- trait-level rankings and summaries;
- attractiveness and relationship-type comparisons;
- residual-tracking diagnostics;
- OLS, GLS/AR(1), and nonlinear trend comparisons where appropriate;
- vocabulary and early-decade sensitivity analyses; and
- comparisons between rating-based and semantic-DDR valence measures.

## Reproducibility notes

- The manuscript expects the repository root to be the working directory.
- The primary model cache is tracked with Git LFS; a successful clone without an LFS pull is not sufficient.
- Seed lists and construct definitions currently live inside the `.qmd` file so that the manuscript records the exact operationalizations used.
- The number of available word vectors varies by decade. Coverage is reported explicitly and used in weighted longitudinal models where appropriate.
- Direct vector displacement across independently trained decades is avoided in the primary analyses. Within-decade relationships are used instead.
- The HTML file is a generated artifact. Changes to the analysis should be made in the Quarto source and then rendered.

## Limitations

- Historical embeddings reflect patterns of language use, not psychological beliefs directly.
- Construct seed words are theory-laden choices and can affect the resulting geometry.
- Warriner ratings were collected in the modern period and are applied to historical lexical items.
- Early decades have weaker lexical coverage and omit some seed terms.
- Results are specific to the English-language corpora and should not be generalized automatically to other languages or cultural contexts.
- Google Books data can reflect publication, digitization, and corpus-composition biases.

## Citation and data provenance

If you use this repository, cite the thesis or manuscript associated with it and acknowledge the original data sources:

- Hamilton, W. L., Leskovec, J., & Jurafsky, D. (2016). [Diachronic word embeddings reveal statistical laws of semantic change](https://aclanthology.org/P16-1141/). *Proceedings of ACL 2016*, 1489–1501.
- Warriner, A. B., Kuperman, V., & Brysbaert, M. (2013). [Norms of valence, arousal, and dominance for 13,915 English lemmas](https://doi.org/10.3758/s13428-012-0314-x). *Behavior Research Methods, 45*, 1191–1207.

Users are responsible for complying with the licenses and citation requirements of the original datasets and supplementary articles.
