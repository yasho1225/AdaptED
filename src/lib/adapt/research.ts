/**
 * Evidence registry. Every adaptation AdaptED makes points at one of these.
 *
 * Wording is deliberately conservative: each `supports` line says what the
 * source recommends or found, not that AdaptED itself has been proven to work.
 */

export interface ResearchSource {
  id: string;
  /** Short label shown on change cards */
  label: string;
  /** What the source recommends / found (paraphrased, conservative) */
  supports: string;
  citation: string;
  url: string;
}

const UDL = "https://udlguidelines.cast.org";

export const RESEARCH: Record<string, ResearchSource> = {
  "udl-language": {
    id: "udl-language",
    label: "UDL 3.0 · Language & Symbols",
    supports:
      "Clarify vocabulary, symbols, and language structures, and support decoding of text and notation, so unfamiliar language is not the barrier to the idea.",
    citation: "CAST (2024). Universal Design for Learning Guidelines version 3.0.",
    url: `${UDL}/representation/language-symbols/`,
  },
  "udl-knowledge": {
    id: "udl-knowledge",
    label: "UDL 3.0 · Building Knowledge",
    supports:
      "Connect prior knowledge to new learning and highlight patterns, critical features, big ideas, and relationships.",
    citation: "CAST (2024). Universal Design for Learning Guidelines version 3.0.",
    url: `${UDL}/representation/building-knowledge/`,
  },
  "udl-perception": {
    id: "udl-perception",
    label: "UDL 3.0 · Perception",
    supports:
      "Offer information in more than one format and let learners customize how it is displayed, because relying on a single sensory channel creates barriers.",
    citation: "CAST (2024). Universal Design for Learning Guidelines version 3.0.",
    url: `${UDL}/representation/perception/`,
  },
  "udl-strategy": {
    id: "udl-strategy",
    label: "UDL 3.0 · Strategy Development",
    supports:
      "Set meaningful goals, anticipate and plan for challenges, organize information and resources, and enhance capacity for monitoring progress.",
    citation: "CAST (2024). Universal Design for Learning Guidelines version 3.0.",
    url: `${UDL}/action-expression/strategy-development/`,
  },
  "udl-expression": {
    id: "udl-expression",
    label: "UDL 3.0 · Expression & Communication",
    supports:
      "Use multiple media and tools for communication so learners can show what they know without an unrelated skill (like handwriting or spelling) blocking them.",
    citation: "CAST (2024). Universal Design for Learning Guidelines version 3.0.",
    url: `${UDL}/action-expression/expression-communication/`,
  },
  "udl-effort": {
    id: "udl-effort",
    label: "UDL 3.0 · Sustaining Effort & Persistence",
    supports:
      "Clarify the meaning and purpose of goals and optimize challenge and support so effort is sustainable.",
    citation: "CAST (2024). Universal Design for Learning Guidelines version 3.0.",
    url: `${UDL}/engagement/effort-persistence/`,
  },
  "udl-interests": {
    id: "udl-interests",
    label: "UDL 3.0 · Welcoming Interests & Identities",
    supports:
      "Optimize choice and autonomy and address threats and distractions in the learning environment.",
    citation: "CAST (2024). Universal Design for Learning Guidelines version 3.0.",
    url: `${UDL}/engagement/interests-identities/`,
  },
  "ida-accommodations": {
    id: "ida-accommodations",
    label: "International Dyslexia Association",
    supports:
      "Classroom accommodations across materials, instruction, and student performance — e.g. recorded or read-aloud text, highlighting essential information, reducing copying, vocabulary aids, and alternative ways to show knowledge.",
    citation:
      "International Dyslexia Association. Accommodating Students with Dyslexia in All Classroom Settings (fact sheet).",
    url: "https://dyslexiaida.org/fact-sheets/",
  },
  "ida-definition": {
    id: "ida-definition",
    label: "IDA definition of dyslexia",
    supports:
      "Dyslexia mainly affects accurate and fluent word recognition, spelling, and decoding; reading comprehension problems are often a secondary consequence — not a limit on thinking.",
    citation: "International Dyslexia Association (2002). Definition of Dyslexia.",
    url: "https://dyslexiaida.org/definition-of-dyslexia/",
  },
  "tts-meta": {
    id: "tts-meta",
    label: "Text-to-speech meta-analysis",
    supports:
      "Across 22 studies, text-to-speech and read-aloud tools had a small-to-moderate positive average effect on reading comprehension for students with reading disabilities (d = 0.35).",
    citation:
      "Wood, Moxley, Tighe & Wagner (2018). Journal of Learning Disabilities, 51(1), 73–84.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5494021/",
  },
  "letter-spacing": {
    id: "letter-spacing",
    label: "Letter spacing study",
    supports:
      "Extra letter spacing improved reading speed and accuracy for children with dyslexia by reducing visual crowding.",
    citation: "Zorzi et al. (2012). PNAS, 109(28), 11455–11459.",
    url: "https://doi.org/10.1073/pnas.1205566109",
  },
  "dyslexia-fonts": {
    id: "dyslexia-fonts",
    label: "Specialized-font study",
    supports:
      "A specialized dyslexia font did not improve reading rate or accuracy — so AdaptED uses clear standard typefaces and spacing instead of novelty fonts.",
    citation: "Wery & Diliberto (2017). Annals of Dyslexia, 67(2), 114–127.",
    url: "https://doi.org/10.1007/s11881-016-0127-1",
  },
  "bda-style": {
    id: "bda-style",
    label: "BDA Dyslexia Style Guide",
    supports:
      "Use clear sans-serif type, avoid plain bright-white backgrounds, and prefer bullet points and numbering to long continuous prose.",
    citation: "British Dyslexia Association (2023). Dyslexia Style Guide.",
    url: "https://www.bdadyslexia.org.uk/advice/employers/creating-a-dyslexia-friendly-workplace/dyslexia-friendly-style-guide",
  },
  "asha-capd": {
    id: "asha-capd",
    label: "ASHA · (C)APD position statement",
    supports:
      "Management of (C)APD combines direct skills remediation, compensatory strategies, and environmental modifications that improve access to spoken information.",
    citation:
      "American Speech-Language-Hearing Association (2005). (Central) Auditory Processing Disorders — The Role of the Audiologist.",
    url: "https://www.asha.org/policy/ps2005-00114/",
  },
  "asha-portal": {
    id: "asha-portal",
    label: "ASHA Practice Portal · CAPD",
    supports:
      "Classroom management of auditory processing difficulties includes environmental modifications (e.g. reducing noise, improving the speech signal), visual supports, and teaching compensatory strategies; supports should follow the individual student's assessed needs.",
    citation:
      "American Speech-Language-Hearing Association. Practice Portal: Central Auditory Processing Disorder.",
    url: "https://www.asha.org/practice-portal/clinical-topics/central-auditory-processing-disorder/",
  },
  "guided-notes": {
    id: "guided-notes",
    label: "Guided notes meta-analysis",
    supports:
      "Guided notes (teacher-prepared outlines with blanks) improved note accuracy and quiz performance compared with students' own notes.",
    citation:
      "Konrad, Joseph & Eveleigh (2009). Education and Treatment of Children, 32(3), 421–444.",
    url: "https://doi.org/10.1353/etc.0.0066",
  },
  "adhd-classroom": {
    id: "adhd-classroom",
    label: "ADHD classroom strategies",
    supports:
      "Effective school supports for ADHD combine behavioral strategies, modifications to how academic tasks are presented, and home–school communication.",
    citation:
      "DuPaul, Weyandt & Janusis (2011). ADHD in the Classroom: Effective Intervention Strategies. Theory Into Practice, 50(1), 35–42.",
    url: "https://doi.org/10.1080/00405841.2011.534935",
  },
  "self-regulation": {
    id: "self-regulation",
    label: "Self-regulation meta-analysis",
    supports:
      "Self-monitoring, goal-setting, and self-reinforcement interventions improved on-task behavior and academic productivity for students with ADHD.",
    citation:
      "Reid, Trout & Schartz (2005). Exceptional Children, 71(4), 361–377.",
    url: "https://doi.org/10.1177/001440290507100801",
  },
  segmenting: {
    id: "segmenting",
    label: "Cognitive load · segmenting",
    supports:
      "Breaking complex material into learner-paced segments reduces cognitive overload and improves learning (segmenting principle, cognitive load theory).",
    citation: "Mayer (2021). Multimedia Learning (3rd ed.). Cambridge University Press.",
    url: "https://doi.org/10.1017/9781316941355",
  },
  ncaep: {
    id: "ncaep",
    label: "NCAEP evidence-based practices",
    supports:
      "Visual supports, task analysis, prompting, and antecedent-based interventions are among the 28 practices with clear evidence for autistic children and youth.",
    citation:
      "Steinbrenner et al. (2020). Evidence-Based Practices for Children, Youth, and Young Adults with Autism. FPG Child Development Institute, UNC.",
    url: "https://ncaep.fpg.unc.edu/",
  },
  teacch: {
    id: "teacch",
    label: "TEACCH structured teaching",
    supports:
      "Structured work systems make four things visible: what work to do, how much, how I know I'm finished, and what happens next.",
    citation:
      "Mesibov, Shea & Schopler (2004). The TEACCH Approach to Autism Spectrum Disorders. Springer.",
    url: "https://doi.org/10.1007/978-0-306-48647-0",
  },
  figurative: {
    id: "figurative",
    label: "Figurative language meta-analysis",
    supports:
      "On average autistic participants comprehended figurative language (especially metaphor) less well than peers; the gap largely tracked core language skills, so needs are individual.",
    citation:
      "Kalandadze, Norbury, Nærland & Næss (2018). Autism, 22(2), 99–117.",
    url: "https://doi.org/10.1177/1362361316668652",
  },
  "iris-accommodations": {
    id: "iris-accommodations",
    label: "IRIS Center · Accommodations",
    supports:
      "Accommodations change how a student learns or shows learning without changing what they are expected to learn; modifications change the expectations themselves.",
    citation:
      "IRIS Center, Vanderbilt University. Accommodations: Instructional and Testing Supports for Students with Disabilities.",
    url: "https://iris.peabody.vanderbilt.edu/module/acc/",
  },
};

export function getResearch(id: string): ResearchSource | undefined {
  return RESEARCH[id];
}

export const RESEARCH_IDS = Object.keys(RESEARCH);
