**Note:** This article refers to **Claude Code** (Anthropic’s AI coding agent), not a product named “Open Claude.” The story is about proprietary source that became public by mistake.

On **March 31, 2026**, Anthropic published `@anthropic-ai/claude-code` **version 2.1.88** to npm. The package included a **JavaScript source map** (`cli.js.map`, on the order of tens of megabytes). Source maps are meant for debugging: they can embed **`sourcesContent`**, which reconstructs original sources from the bundled output.

Because **build artifacts were not excluded** from the published package (widely reported as a missing `.npmignore` or `package.json` `files` configuration), anyone who pulled that npm version could recover what reporting describes as on the order of **~512,000 lines of TypeScript** across **~1,900 files**. This was not a network breach of Anthropic’s internal systems—it was **normal package installation** surfacing data that was never supposed to ship.

Security researcher **Chaofan Shou** was among the first to publicize the finding; discussion spread quickly on X and Hacker News. Outlets including [Decrypt](https://decrypt.co/362917/anthropic-accidentally-leaked-claude-code-source-internet-keeping-forever) covered the story.

Anthropic’s statement to Decrypt framed it as a **packaging error**, not a security incident involving customer data:

> “Earlier today, a Claude Code release included some internal source code. No sensitive customer data or credentials were involved or exposed. This was a release packaging issue caused by human error, not a security breach. We're rolling out measures to prevent this from happening again.”

So the “leak” is more accurately **self-published source** that was never intended for distribution—not a hack, but still a severe operational mistake.

## What was inside (and why it mattered)

Technical write-ups—such as [Layer5’s engineering analysis](https://layer5.io/blog/engineering/the-claude-code-source-leak-512000-lines-a-missing-npmignore-and-the-fastest-growing-repo-in-github-history)—summarize the kinds of material that escaped:

- **Product and architecture**: CLI orchestration, tool and plugin structure, permission and sandboxing logic, terminal UI stack, multi‑agent patterns described in prompts and code.
- **Unreleased or gated behavior**: Dozens of **feature flags** and internal codenames mapping to roadmap items competitors would prefer to learn on their own schedule.
- **Design choices that sparked debate**: Coverage highlighted an **“undercover”** mode (discussed as reducing attribution or AI disclosure in some flows), which critics framed as a trust issue and defenders as internal hygiene.

Even unremarkable lines of code add up: the **combination** functions like a compressed product-strategy memo you cannot un-publish.

## Impact

### Strategic and competitive

You can refactor implementation in weeks; you **cannot refactor a leaked roadmap**. Competitors and open-source projects gained a detailed picture of how a leading agent CLI is structured—what problems were prioritized, how experiments are gated, and how orchestration is approached. Many observers argue the **model and API** matter more than the shell, but enterprise buyers still pay partly for **perceived exclusivity** of the full stack.

### Security

Readable source **lowers the cost** of finding bugs in permission models, bash validation, OAuth handling, and supply-chain touchpoints—for defenders and attackers. The timing also sat in a noisy period for npm trust in some accounts (unrelated malicious packages elsewhere), which reinforces that **install paths** are fragile.

### Trust and brand

Companies that emphasize **care and safety** take a reputational hit when a headline-scale packaging mistake suggests **operational rigor** is under strain—especially when customers are choosing who gets agentic access to code and infrastructure.

## How Anthropic responded

Public reporting describes several layers:

1. **Containment at the source**: Stop distributing the bad npm artifact so new installs do not keep shipping the map.
2. **Communication**: The quoted statement distinguishes **internal source** from **customer secrets and credentials**—important for compliance-minded buyers even though source leakage remains serious.
3. **Legal tooling**: Widespread reports describe **DMCA takedowns** aimed at GitHub mirrors hosting **verbatim** recovered TypeScript. Central platforms typically comply; that does **not erase** copies on personal machines, informal mirrors, or decentralized hosting ([Decrypt](https://decrypt.co/362917/anthropic-accidentally-leaked-claude-code-source-internet-keeping-forever) and others mention harder-to-unpublish mirrors).
4. **Process fixes**: “Rolling out measures to prevent this from happening again” is the predictable closure—release checklists, CI blocking `*.map` in publish artifacts, stricter `npm publish` allowlists, and executive scrutiny after a hit of this scale.

**Claude** is the product; **handling is Anthropic’s** legal, engineering, and communications work—the models did not choose to leak; **release configuration** did.

## What happens to a project that forked it?

The answer depends on **what** you forked.

### Direct fork of the leaked TypeScript

If a repo is essentially **hosting or redistributing Anthropic’s copyrighted source** recovered from the npm artifact, it falls in **straightforward DMCA** territory on GitHub and similar U.S.-hosted platforms. Likely outcomes:

- **Takedown** or a **private** repo to avoid repeat notices.
- **Legal exposure** if you commercialize or redistribute, even though you did not “hack” anyone—you are still copying **their** work without a license.

Forking after someone else uploaded it does **not** grant you a license.

### Clean-room or translated reimplementations

Coverage highlighted projects described as **rebuilding architecture in another language** (for example Python) from high-level understanding—sometimes with heavy AI assistance—rather than byte-for-byte copying. Commentators such as **Gergely Orosz** surfaced the tension: if the outcome is a **new implementation**, is it infringing—or awkward for Anthropic to argue AI-assisted outputs are too close to originals, given industry fights over **AI outputs and copyright**?

**Reality check:**

- **Untested in court** for this exact fact pattern.
- **Not risk-free**: “Clean room” is a specific legal process; retyping structure with the leaked repo open beside you is not the same as documented separation.
- **Practical risk**: Enterprises may still avoid stacks whose lineage sits in a famous dispute.

### Decentralized or personal copies

DMCA is **effective against named hosts**, not against every copy. That is why commentary often says the leak is **effectively permanent** in a **social and technical** sense—not that copyright vanished.

## Lessons

1. **Treat publish pipelines as security boundaries.** `.npmignore` and `package.json` `files` are part of the threat model when bundles contain trade secrets.
2. **Source maps in shipping artifacts are dangerous.** Gate them in CI, not in human memory.
3. **Forkers: enthusiasm ≠ license.** Mirroring leaked source is legally unlike forking MIT-licensed code.
4. **Vendors: the failure mode was boring human error.** Customers watch how you respond when scale meets a one-line config mistake.

## Sources and further reading

- [Anthropic accidentally leaked Claude Code’s source—Decrypt](https://decrypt.co/362917/anthropic-accidentally-leaked-claude-code-source-internet-keeping-forever)
- [The Claude Code source leak—Layer5](https://layer5.io/blog/engineering/the-claude-code-source-leak-512000-lines-a-missing-npmignore-and-the-fastest-growing-repo-in-github-history)
- [Hacker News discussion](https://news.ycombinator.com/item?id=47584540)

---

*This post summarizes public reporting and analysis as of early April 2026. Counts and legal claims in secondary articles can change. For decisions about a specific project or fork, consult qualified counsel—not a blog post.*
