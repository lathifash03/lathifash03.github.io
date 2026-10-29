---
slug: narrative-to-procedural
title: "Turning news narratives into step-by-step text"
context: "Undergraduate thesis · Informatics Engineering, ITS · 2026"
role: "Individual"
stack: [Python, spaCy en_core_web_md, Llama 3.3 70B (Groq), GPT-4o-mini, Claude Haiku, rouge-score, BERTScore]
---

## The problem

Long narrative news asks a lot of a reader on the move. Rewriting it as numbered steps helps,
but only if every fact survives and the order of events stays right. A plain LLM rewrite drops names,
paraphrases numbers and drifts in format.

## The pipeline

1. **Rule-based pre-processing** — spaCy NER (PERSON, ORG, LOC, DATE, MONEY), action-verb extraction
   with POS tagging plus lemmatisation, and temporal-marker detection. Adding lemmatisation raised
   detected action verbs per article from 0.03–0.30 to 3.03–4.70.
2. **Constraint generation** — each article gets its own constraints: entity preservation and format
   (hard), verb structure and temporal order (soft).
3. **Constrained LLM conversion** — the constraints go into the prompt; a hard-constraint failure
   triggers a correction prompt, up to 2 retries.
4. **Rule-based post-processing** — four validators run again, then missing entities are injected into
   the most relevant step (partial match → context match → fallback).

[four-phase pipeline diagram]

## Data

134,359 articles screened, 26,526 valid, 110 sampled per domain → 1,760 articles in 16 domains.
For conversion: 30 per domain × 16 = 480 articles per model, × 3 models = **1,440 evaluation data points**.

## Results

| Metric | Llama 3.3 70B | GPT-4o-mini | Claude Haiku |
|---|---|---|---|
| ROUGE-L (reference: original narrative) | 0.283 | 0.383 | 0.340 |
| BERTScore F1 | 0.645 | 0.700 | 0.688 |
| Entity pass rate, prompt only | 28.7% | 21.2% | 32.9% |
| Entity pass rate, full pipeline | 66.9% | 56.5% | 64.6% |
| Format pass rate | 99.6% | 99.8% | 99.6% |
| Overall pass rate | 100% | 98.5% | 99.2% |

Targets were BERTScore F1 ≥ 0.60 and ROUGE-L ≥ 0.20; all three models met both.
Against 20 procedural references I annotated by hand, BERTScore F1 rose to 0.668 / 0.724 / 0.721,
which supports the view that a narrative reference underestimates procedural output.

**Human evaluation.** Raters scored GPT-4o-mini and Claude Haiku above the 3.5 / 5 target.
On readability: GPT 4.21, Claude 4.20, Llama 3.55.

## What the numbers say

- **Prompting is not enough.** Even with explicit constraints and retries, at most a third of articles
  kept every mandatory entity. Rule-based injection added +31.7 to +38.1 points.
- **The paradox.** The model with the lowest ROUGE-L (Llama 3.3 70B) kept entities best. Verbose models
  match more n-grams but paraphrase names. Pick the model by priority: facts, or fluency.
- **Domain matters more than model.** Variation between news domains was larger than between models;
  event-driven domains (crime, disaster, war) converted best.

## Limitations

- Entity pass rate at article level is still under 70% for all models, below the 85% target.
- Agreement between human raters was low (Krippendorff's α = 0.165 vs a 0.6 target); judging procedural
  quality is subjective.
- Most automatic scores use the original narrative as reference, because validated procedural
  references don't exist for every article.
