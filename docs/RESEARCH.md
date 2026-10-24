# Research basis for AdaptED's adaptations

AdaptED's playbooks start from three foundations — **CAST's Universal Design for Learning (UDL) Guidelines 3.0**, the **International Dyslexia Association (IDA)**'s accommodation guidance, and the **American Speech-Language-Hearing Association (ASHA)**'s guidance on auditory processing — and add peer-reviewed studies for specific moves. Each source below appears in `src/lib/adapt/research.ts`; every change card in the app cites one.

Claims are stated conservatively: the sources support the *strategies*. AdaptED itself has not been studied for effectiveness.

## Cross-cutting principles

| Principle | Basis |
| --- | --- |
| **Accommodate by default.** Change access, not learning goals; modifications only when the teacher chooses. | IRIS Center (Vanderbilt), *Accommodations: Instructional and Testing Supports* |
| **Supports, not labels.** The teacher picks supports; the need label only suggests defaults. | UDL 3.0 (learner variability); Kalandadze et al. 2018 (individual differences track core language skills) |
| **Keep academic vocabulary — support it.** | UDL 3.0 Representation › Language & Symbols ("Clarify vocabulary, symbols, and language structures") |
| **Chunk complex work.** | Mayer, *Multimedia Learning* (segmenting principle); UDL 3.0 Strategy Development |

## Dyslexia
- IDA definition (2002): difficulty with accurate/fluent word recognition, spelling, decoding — comprehension problems are often secondary. → reduce decoding/spelling load, keep the thinking.
- IDA, *Accommodating Students with Dyslexia in All Classroom Settings*: read-aloud/recorded text, highlighting essential information, reduced copying, vocabulary aids, alternative ways to show knowledge.
- Wood, Moxley, Tighe & Wagner (2018), *J. Learning Disabilities* 51(1): text-to-speech, 22 studies, average d = 0.35 for reading comprehension. → read-aloud in the student view.
- Zorzi et al. (2012), *PNAS*: extra letter spacing improved reading in dyslexia. → wider spacing option.
- Wery & Diliberto (2017), *Annals of Dyslexia*: a specialized dyslexia font did not help. → no novelty fonts.
- British Dyslexia Association, *Dyslexia Style Guide* (2023): sans-serif, avoid stark white, prefer bullets/numbering.

## ADHD
- DuPaul, Weyandt & Janusis (2011), *Theory Into Practice*: combine behavioral strategies, academic task modifications, and home–school communication.
- Reid, Trout & Schartz (2005), *Exceptional Children*: self-monitoring and goal-setting improved on-task behavior and productivity. → checklists, self-check.
- UDL 3.0 Strategy Development: set goals, anticipate challenges, organize information, monitor progress. → start step, timed chunks, questions next to the reading they need.

## Auditory processing (APD/CAPD)
- ASHA (2005), *(Central) Auditory Processing Disorders — The Role of the Audiologist*: management combines direct remediation, compensatory strategies, and environmental modifications.
- ASHA Practice Portal, *Central Auditory Processing Disorder*: environmental modifications and visual supports, individualized to assessed needs.
- Konrad, Joseph & Eveleigh (2009), *Education and Treatment of Children*: guided notes improved note accuracy and quiz performance.
- UDL 3.0 Perception: don't rely on one sensory channel.
- → Every spoken direction written; guided notes; written alternatives to listening tasks; teacher notes on noise and checking understanding. **Reading is not simplified**, because listening — not reading — is the barrier.

## Autism
- Steinbrenner et al. (2020), NCAEP report: visual supports, task analysis, prompting, antecedent-based interventions among 28 evidence-based practices.
- Mesibov, Shea & Schopler (2004), *The TEACCH Approach*: structured work systems — what, how much, how I know I'm finished, what's next. → expectations block, predictable layout.
- Kalandadze et al. (2018), *Autism* 22(2): figurative language (especially metaphor) was harder on average, largely tracking core language skills. → literal wording **unless figurative language is the learning objective**, in which case the text is kept and the task is explained.

## Sources not yet verified line-by-line
The sandbox used to build this version could not open some publisher sites directly; citations were confirmed through search results and bibliographic records. Before submission, the team should open each link in `research.ts` and confirm the wording.
