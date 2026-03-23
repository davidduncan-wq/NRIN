🧠 Brain-worthy entries (add these)
1.
NRIN matching should surface evidence, not just conclusions. Each match should be explainable with source-backed facility content.
2.
Patient narrative signals should map directly to facility evidence snippets when possible (e.g., MAT, family programs, lifestyle alignment).
3.
Crawler output should preserve extractable text snippets and source URLs for use in match explanation and UI linking.
4.
The match experience should feel like “we heard you” — not just “we calculated something.”

Brain-worthy formulation
Add this:
NRIN matching follows a three-layer hierarchy: (1) clinical/logistical need, (2) financial accessibility, (3) patient preference. Need determines viability, financial fit determines practical reachability, and preference differentiates among viable options for final patient choice.
And maybe also:
Patient preference should not rescue a clinically inappropriate match, but it should strongly shape ranking and final selection among clinically appropriate, financially plausible options.

🧠 Brain-worthy entries
Add these:
1.
NRIN UI must remain decoupled from matching logic via a stable view-model layer to enable rapid iteration and A/B testing of interaction paradigms.
2.
The matching engine is canonical and stable; UI presentation is experimental and interchangeable.
3.
Different UI paradigms (stack, feed, list, comparison) may serve different patient psychological states and should be testable.

Brain-worthy note
Add this:
NRIN uses a view-model adapter between canonical match logic and patient-facing presentation so UI paradigms can be swapped and A/B tested without changing matcher behavior.
Once this passes, the next move is to add a detail sheet and evidence-ready click handling without touching matcher core.

Brain-worthy notes to add
These are worth capturing now:
1. Match decision hierarchy
NRIN match ranking follows: need first, financial fit second, patient preference third. Patient preference does not rescue clinically inappropriate matches, but strongly shapes ranking and final selection among viable options.
2. Match browsing UX
The patient match interface uses swipe-like motion for browsing only. Navigation is continuous, non-destructive, and reversible.
3. High-consequence action rule
Choosing a facility is an explicit, confirmable action because it triggers real-world operational workflows and must never be gesture-activated.
4. UI/logic separation
NRIN uses a view-model adapter between canonical matching logic and patient-facing presentation so interaction paradigms can be swapped and A/B tested without changing matcher behavior.
5. Evidence-forward future state
Match reasons should eventually be evidence-addressable, linking patient-specific needs and preferences to source-backed facility content, snippets, and URLs.
🧠 Refined version of your idea (save this)

We should eventually add:

“Decision Assist Layer”

Triggered when:

no selection after X time
multiple back-and-forth interactions
repeated browsing

It offers:

refine preferences
ask a question
surface a clearer recommendation