---
slug: kg-agent
title: "kg-agent: a verification layer for knowledge-graph RAG"
context: "TEEP research internship · CITI Lab, NTUST · Jun – Aug 2026"
role: "Individual module (Module 3) inside a five-module international team"
stack: [Python, Neo4j, Cypher, Hermes3:3b, qwen3-embedding:0.6b, MCP, LangGraph, Docker]
figures:
  - kind: diagram
    id: pipeline
    diagram: kgAgent
    caption: "The verify-then-retry loop. Three gates sit between the draft answer and the returned one; a failed gate sends the agent back to retrieval."
  - kind: chart
    id: e1-accuracy
    title: "E1 · accuracy by category"
    axis: "Correct answers, 20 ground-truth items in 4 categories"
    caption: "Median of 3 runs. Low trust is the weak category: 1 of 5 correct."
    bars:
      - { label: "Answerable", value: 6, of: 6, display: "6 / 6" }
      - { label: "Out of scope", value: 5, of: 6, display: "5 / 6" }
      - { label: "Low trust", value: 1, of: 5, display: "1 / 5", highlight: true }
      - { label: "Temporal", value: 3, of: 3, display: "3 / 3" }
    rule: { value: 15, of: 20, label: "75% overall (15 / 20)" }
  - kind: chart
    id: e3-false-pass
    title: "E3 · false-pass rate by configuration"
    axis: "Share of answers that passed the gates but should not have"
    caption: "Same 20-item set. With the trust gate removed, 57% of answers came back as false passes; with no gates at all, every one of them."
    bars:
      - { label: "Full system", value: 0, of: 100, display: "0%" }
      - { label: "Trust gate off", value: 57, of: 100, display: "57%", highlight: true }
      - { label: "Temporal gate off", value: 7, of: 100, display: "7%" }
      - { label: "No gates", value: 100, of: 100, display: "100%" }
---

## The problem

The lab keeps its knowledge in a Neo4j graph that many people write to: papers, meeting notes,
informal discussion and automated extraction. An LLM answering questions from that graph can be
perfectly faithful to a node and still be wrong, because the node is stale, superseded or came from
an unreliable source. Worse, a bad answer can be written back into the graph and treated as truth later.
A faithfulness check alone can't catch that.

## What I built

A verify-then-retry controller that sits between retrieval and the final answer.

1. **Retrieve** with vector similarity plus keyword matching over Neo4j (qwen3-embedding:0.6b).
2. **Generate** a draft answer with Hermes3:3b.
3. **Check three gates independently:**
   - *Faithfulness* — an LLM-as-judge scores the share of claims supported by the retrieved context
     (threshold 0.7). Empty answers and "no context" answers are scored 0.0 directly, because the judge
     had rated them 0.70 and 1.00 when asked normally.
   - *Trust* — `confidence × source weight × recency`, with fixed source weights
     (paper 1.0, meeting 0.8, discussion 0.6, auto-extracted 0.4) and a 90-day half-life (threshold 0.4).
   - *Temporal validity* — each node is VALID, OUTDATED, SUPERSEDED (a `SUPERSEDED_BY` edge exists)
     or CONFLICTED (duplicate name with a different value, or flagged by a contradiction detector).
4. **Retry** with an alternate retrieval strategy when a failure is recoverable, up to a fixed limit.

[figure: pipeline]

## How I evaluated it

| Test | Result | Caveat |
|---|---|---|
| E1 ground truth, 20 items in 4 categories | 75% accuracy (15/20), 0% false-pass, 0% false-block | median of 3 runs; 18/20 items stable across runs |
| E1 by category | answerable 6/6 · temporal 3/3 · out-of-scope 5/6 · low-trust 1/5 | low-trust is the main weakness |
| E2 judge reliability | Cohen's κ = 0.833 vs 0.167 for a random mock judge | one model, one evaluation set |
| E3 ablation (false-pass rate) | trust gate off → 57% · temporal gate off → 7% · all gates off → 100% | |

[figure: e1-accuracy]

[figure: e3-false-pass]

Evaluation ran on a frozen 355-node graph snapshot plus 20 synthetic nodes, not the live graph,
because the live graph does not yet carry the provenance metadata the trust gate needs.

## What went wrong, and what I learned

- **Retry can undo a correct answer.** In three separate places, the retry logic preferred a worse
  attempt — once because a failed search scored 0.80 against a successful one's 0.69, once because
  empty results triggered needless retries, and once because retry selection washed out a correct
  contradiction detection.
- **Similarity can't tell in-scope from out-of-scope.** The highest-scoring out-of-corpus question
  (0.86) beat the lowest in-corpus one (0.83). No threshold separates them; that's an architectural
  ceiling, not a tuning problem.
- **One invented detail can slip through.** An otherwise grounded answer cited "ISO 9001:2015" when
  the corpus only had the 2000 and 2005 revisions. The faithfulness score still cleared 0.7, so the
  answer got a disclaimer instead of a block.
- **I corrected my own headline number.** An earlier summary said 95%. When I re-checked it against the
  raw results files, the figure was 75%, and that's the number reported here.

## Next

Thresholds and prompts are set by hand. The suggested next step is to tune them against these
ground-truth sets with GEPA-style text optimisation and recursive language models.
