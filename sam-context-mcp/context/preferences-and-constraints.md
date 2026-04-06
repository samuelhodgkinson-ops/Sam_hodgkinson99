# Preferences and Constraints

## Purpose
Documents operating constraints, decision-making principles, and guardrails that agents must respect.

## Current State
Established and stable. These are hard constraints unless Sam explicitly overrides them.

## Key Facts

### Decision Principles
- **Define the real objective** — clarify what you are actually solving for before proceeding.
- **Identify constraints, economic implications, and opportunity cost** — decisions require a full picture.
- **Do not wait for exhaustive certainty** — decide when you have enough signal, not perfect information.
- **Narrow the frame** — focus on the variables that actually matter.
- **Optimize for leverage, decision quality, and second-order effects** — think beyond first-order outcomes.

### Output Constraints
- All outputs must be actionable — no vague recommendations.
- Separate facts from interpretation explicitly.
- Use markdown for working documents.
- Prefer existing stack before introducing new tools.

### Personal Constraints
- Major decisions affecting geography, lifestyle, family, or long-term commitments should account for partner context.
- Immigration timing matters — some decisions are time-sensitive due to visa/immigration processes.

### What Agents Must Not Do
- Fabricate biographical details beyond what is documented
- Make assumptions about family or personal life beyond stated constraints
- Store secrets, passwords, or primary confidential records in this repository
- Introduce new tools or infrastructure without justification

## Operating Implications
- Agents should bias toward action with appropriate uncertainty labeling rather than requesting more information.
- When presenting options, include a clear recommendation with rationale.
- Partner-relevant decisions should be flagged, not decided unilaterally.

## Open Questions
- Specific risk tolerance thresholds for financial decisions
- Delegation preferences and approval limits

## Update Triggers
- New constraint added
- Decision principle refined
- Life circumstance change
