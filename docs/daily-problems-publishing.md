# Daily Challenge Publishing Guide

Use this guide to publish Daily Challenge problems with a consistent format.

## Content location

Create each problem under:

- `content/problems/<slug>/meta.json`
- `content/problems/<slug>/description.md`
- `content/problems/<slug>/solution.md`

## Required metadata for daily stream

In `meta.json`, ensure:

- `problemSet` is `"daily"`
- `publishedAt` is an ISO day (`YYYY-MM-DD`)
- `draft` is `false` (or omitted)
- `inputFormat`, `outputFormat`, `examples`, `constraints` are present
- include at least one `visuals` item for tree/graph/matrix-style problems

Example:

```json
{
  "id": "daily-2026-03-26",
  "title": "Two Sum",
  "publishedAt": "2026-03-26",
  "difficulty": "Easy",
  "topic": "Arrays",
  "topics": ["Arrays", "Hash Map"],
  "platform": "LeetCode",
  "externalUrl": "https://leetcode.com/problems/two-sum/",
  "sampleInput": "nums = [2,7,11,15], target = 9",
  "sampleOutput": "[0,1]",
  "inputFormat": "Array nums and integer target",
  "outputFormat": "Indices i,j where nums[i]+nums[j]=target",
  "examples": [{"input":"nums=[2,7,11,15], target=9","output":"[0,1]"}],
  "constraints": ["2 <= nums.length <= 1e5"],
  "visuals": [{"title":"Hash map flow","imageUrl":"/daily-assets/two-sum-map.svg"}],
  "solutionVisuals": [{"title":"Complement lookup","imageUrl":"/daily-assets/two-sum-map.svg"}],
  "testCases": [{ "input": "2 7 11 15\n9", "output": "[0,1]" }],
  "problemSet": "daily",
  "dailyTrack": "dsa"
}
```

## Scheduling future days

- You can publish future problems early by setting `publishedAt` to a future date.
- Future-dated entries are hidden from:
  - `/daily/problem`
  - `/daily/problem/[slug]`
  - `/daily/problem/rss.xml`
- They become visible automatically on/after `publishedAt`.

## Streak/backfill behavior

- Solve on the problem's publish day => full streak credit + `1.0` consistency point.
- Solve after publish day => no streak extension + `0.5` consistency point.
- Unlock solution => one-time `-0.5` consistency penalty for that problem.

## Generation prompt standard

Use this prompt for every new daily entry:

```text
Create a DailyCoder daily DSA problem in JSON + markdown-ready format.
Return meta fields: id, title, publishedAt, difficulty, topic, topics, platform, sampleInput, sampleOutput, inputFormat, outputFormat, examples[], constraints[], testCases[], problemSet=daily, dailyTrack=dsa, visuals[], solutionVisuals[].
Rules:
1) Provide exactly 2 examples with concise explanation where needed.
2) Constraints must be measurable (bounds, ranges).
3) Add one visualization suggestion for problem and one for solution (SVG asset path or inline SVG).
4) Keep description practical and interview-friendly.
5) Ensure sample I/O matches the first example.
6) Provide solution in steps, complexity, and edge cases.
```

## Pre-merge checklist

- `problemSet` is `"daily"`
- `publishedAt` exists and is valid (`YYYY-MM-DD`)
- `inputFormat`, `outputFormat`, `examples`, `constraints` are present
- `visuals` + `solutionVisuals` are present where diagrams add clarity
- `description.md` and `solution.md` are present
- Slug is unique
