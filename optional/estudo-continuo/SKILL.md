---
name: estudo-continuo
description: "Maintain study continuity in an authorized Obsidian vault when a user starts, resumes or deepens a topic. Record concepts, questions, evidence of understanding and a concrete place to resume across chats."
---

# Continuous Study

## Find the authorized destination

Use the vault path the user supplied in the session or workspace instructions. Confirm permission for study records only if the user has yet to give it. Discover the vault's home note, study index and organization guide. Keep its existing folder names, note language and metadata conventions. This skill can accompany an `explicar-desenhando` lesson or work independently.

## Consult before teaching

Search the index and topic aliases. Read the topic entry, related concepts, unresolved questions and the last resume point. Check explicit preferences when relevant and consult sources or project records for the current question.

For a resumed topic, briefly tell the learner where they left off and continue from the current request. Offer a fresh example for an explicit review. If the topic is new, create a short entry after the first meaningful step.

## Record the work in the right place

Map these categories to the vault's existing structure.

- **Memory** holds explicit user context, scoped preferences, dated configurations and reusable decisions. Include the origin, date and scope. Distinguish a user's report from an observation, hypothesis or suggestion.
- **Studies** holds a short topic entry with its objective, resume point, linked concepts, questions, evidence and next step. Concept notes contain reusable mechanisms, examples, limitations and sources.
- **References** holds source material, imported research, guides and preserved conversations. Link the study's synthesis to the original source.
- **Projects** holds implementation status, procedures, tests, results and pending execution work.
- **Journal** holds the session's questions, new material, corrections, origin and next action. Group updates from the same chat and day. Preserve distinct origins across chats and track imported turns to avoid duplication.

After a meaningful explanation or correction, update the existing concept and resume point within the authorized vault. Create a separate concept only when it has independent value. Record a correction and its reason in the journal. A repeated review can reuse the existing entry.

Preserve existing metadata. For a vault with no established schema, a concept can record `type: concept`, `topic`, `status: covered`, `understanding: unverified` and `updated`. A session can record `type: study-session`, `topic`, `date` and its origin when known.

## Evidence and preservation

Mark an explanation as covered. Record demonstrated understanding when the learner's own answer or application provides evidence. Keep praise, successful execution and imported notes distinct from that evidence. Let the learner continue without a quiz.

Preserve primary sources and their qualifications. Treat the chat as the origin of the study record. Recheck facts that depend on a changing version, configuration or pending experiment.

Reread the affected notes before editing and reconcile concurrent changes. Before modifying an existing note, preserve a snapshot using the actual skill and vault paths.

```sh
python "<skill-directory>/scripts/snapshot.py" --vault "<vault-path>" "Studies/Topic/Overview.md"
```

The helper requires Python 3.9 or later and stores versions and hashes under `.study-history`. If the helper is unavailable, preserve an equivalent recoverable copy and disclose the limitation. Read back the resume point and check new links.

## Scope

Limit records to authorized study and memory work. Exclude credentials, full logs and restricted corporate data. Monitoring other chats, publishing, messaging, reminders and running projects require separate authorization. If the vault is unavailable, continue the lesson and give the user a recoverable summary of what remains to be saved.
