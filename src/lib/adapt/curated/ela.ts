import type { AdaptedAssignment, Block, NeedId } from "../types";

const Q1 = "\"Four score and seven years ago\" refers to what year, and what event happened then? Show how you calculated it.";
const Q2 = "Lincoln uses images of birth, life, and death throughout the speech (for example, \"conceived\" and \"a new birth of freedom\"). Explain how this extended metaphor supports his purpose.";
const Q3 = "Lincoln says, \"The world will little note, nor long remember what we say here.\" Explain the irony in this line.";
const Q4 = "What does Lincoln argue is the \"unfinished work\" that the living must take on? Use at least two pieces of evidence from the text.";
const Q5 = "In one paragraph, analyze how Lincoln uses repetition (such as \"we can not dedicate—we can not consecrate—we can not hallow\") to persuade his audience.";

/** Lincoln's exact words, split into numbered chunks (no wording changed). */
const CHUNKS = [
  "Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.",
  "Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war.",
  "We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.",
  "But, in a larger sense, we can not dedicate—we can not consecrate—we can not hallow—this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract.",
  "The world will little note, nor long remember what we say here, but it can never forget what they did here.",
  "It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced.",
  "It is rather for us to be here dedicated to the great task remaining before us—that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion—",
  "that we here highly resolve that these dead shall not have died in vain—that this nation, under God, shall have a new birth of freedom—and that government of the people, by the people, for the people, shall not perish from the earth.",
];

/** Literal meaning only — never interprets metaphor, irony, or repetition (those are what the questions assess). */
const GLOSSES = [
  "In other words: Many years ago, our founders created a new nation on this continent. It was founded on liberty and on the idea that all men are created equal.",
  "In other words: Now we are fighting a huge civil war. It is testing whether a nation built on these ideas can last. We are standing on one of that war's battlefields.",
  "In other words: We came to set aside part of this field as a burial place for the soldiers who died so the nation could survive. It is right for us to do this.",
  "In other words: But really, we cannot make this ground holy. The soldiers who fought here already made it holy, far more than anything we could add or take away.",
  "In other words: People will not pay much attention to, or long remember, what we say today. But they will never forget what the soldiers did here.",
  "In other words: Instead, we who are alive should commit ourselves to the work the soldiers started.",
  "In other words: We should commit to the big job still ahead of us. The soldiers gave everything for their cause, and that should make us even more committed to it —",
  "— and we should firmly decide that their deaths will not be for nothing: that the nation will have a fresh start in freedom, and that government by the people will not disappear.",
];

const chunkBlocks = (withGloss: boolean, icon?: Block["icon"]): Block[] =>
  CHUNKS.flatMap((c, i) => {
    const blocks: Block[] = [{ type: "text", text: `[${i + 1}] ${c}`, icon }];
    if (withGloss) blocks.push({ type: "tip", text: GLOSSES[i] });
    return blocks;
  });

const DIRECTIONS = "Annotate the text as you read, then answer the questions.";

const OBJECTIVES = [
  "Interpret archaic language and calculate a historical date from the text",
  "Analyze an extended metaphor and its purpose",
  "Explain irony",
  "Identify a central argument and support it with textual evidence",
  "Analyze repetition as a persuasive technique in a paragraph",
];
const VOCAB = ["score", "conceived", "proposition", "dedicate", "consecrate", "hallow", "devotion", "extended metaphor", "irony", "repetition"];

export const ELA: Record<NeedId, AdaptedAssignment> = {
  dyslexia: {
    title: "Close Reading: The Gettysburg Address (1863)",
    studentIntro: "You will read Lincoln's exact words with help for the hard parts, then analyze how he makes his argument.",
    sections: [
      {
        heading: "Words to know",
        purpose: "Old or formal words from the speech. Say each in parts.",
        blocks: [
          { type: "vocab", term: "score", syllables: "score", definition: "A group of 20." },
          { type: "vocab", term: "conceived", syllables: "con·ceived", definition: "Formed or created. It can also mean the start of a new life." },
          { type: "vocab", term: "proposition", syllables: "pro·po·si·tion", definition: "An idea that is put forward as true." },
          { type: "vocab", term: "consecrate", syllables: "con·se·crate", definition: "To make holy." },
          { type: "vocab", term: "hallow", syllables: "hal·low", definition: "To honor as holy." },
          { type: "vocab", term: "detract", syllables: "de·tract", definition: "To take away from." },
          { type: "vocab", term: "devotion", syllables: "de·vo·tion", definition: "Deep loyalty and commitment." },
          { type: "vocab", term: "perish", syllables: "per·ish", definition: "To die or be destroyed." },
        ],
      },
      {
        heading: "Words in the questions",
        blocks: [
          { type: "vocab", term: "extended metaphor", syllables: "ex·tend·ed met·a·phor", definition: "A comparison that keeps going through a whole text." },
          { type: "vocab", term: "irony", syllables: "i·ro·ny", definition: "When what happens is the opposite of what was said or expected." },
          { type: "vocab", term: "repetition", syllables: "rep·e·ti·tion", definition: "Using the same word or pattern again and again." },
        ],
      },
      {
        heading: "Before you read",
        blocks: [
          { type: "text", text: "Lincoln gave this speech in 1863. It was at the dedication of a cemetery for Union soldiers. This was four months after the Battle of Gettysburg." },
          { type: "direction", icon: "write", text: "**Annotate** the text as you read: underline important ideas and circle words you want to ask about." },
          { type: "direction", icon: "read", text: "You may listen to the speech with text-to-speech while you read along." },
        ],
      },
      {
        heading: "Read the speech",
        purpose: "These are Lincoln's exact words, split into 8 numbered chunks. The gray notes explain the plain meaning only.",
        blocks: chunkBlocks(true, "read"),
      },
      {
        heading: "Questions",
        purpose: "Back up your answers with evidence (quotes) from the speech. Use chunk numbers to find them.",
        blocks: [
          { type: "question", number: "1", icon: "calc", text: Q1, supports: { starters: ["Four score and seven is ___ years.", "The year was ___, when ___."], responseOptions: ["Write it", "Type it"] } },
          {
            type: "question",
            number: "2",
            icon: "write",
            text: Q2,
            supports: { starters: ["Lincoln uses words like \"___\" and \"___.\"", "This comparison helps his purpose because ___."], wordBank: ["birth", "conceived", "endure", "metaphor", "nation", "perish", "purpose"], responseOptions: ["Write it", "Type it", "Dictate it with speech-to-text"] },
          },
          {
            type: "question",
            number: "3",
            icon: "think",
            text: Q3,
            supports: { starters: ["Lincoln said ___, but actually ___.", "This is ironic because ___."], wordBank: ["famous", "irony", "ironic", "remember", "speech"], responseOptions: ["Write it", "Type it", "Dictate it with speech-to-text"] },
          },
          {
            type: "question",
            number: "4",
            icon: "write",
            text: Q4,
            supports: { starters: ["Lincoln argues that the living must ___.", "One piece of evidence is \"___\" (chunk ___).", "Another is \"___\" (chunk ___)."], responseOptions: ["Write it", "Type it", "Dictate it with speech-to-text"] },
          },
          {
            type: "question",
            number: "5",
            icon: "write",
            text: Q5,
            supports: {
              starters: ["Lincoln repeats ___ to ___.", "For example, in chunk ___, he says \"___.\"", "This repetition persuades the audience because ___."],
              wordBank: ["audience", "consecrate", "dedicate", "emphasize", "hallow", "persuade", "repetition"],
              length: "One paragraph",
              responseOptions: ["Write it", "Type it", "Dictate it with speech-to-text"],
            },
          },
        ],
      },
    ],
    changes: [
      { title: "Lincoln's words kept exactly", detail: "The speech is what's being studied, so it wasn't rewritten. It's split into 8 numbered chunks; the 82-word final sentence is divided at its dashes.", barrier: "A dense primary source with very long sentences", need: "dyslexia", evidence: "ida-definition" },
      { title: "Plain-meaning notes beside each chunk", detail: "Each note gives the literal meaning only. They never explain the metaphor, irony, or repetition — the analysis is still the student's.", barrier: "Archaic language like \"four score\" and \"consecrate\"", need: "dyslexia", evidence: "udl-language" },
      { title: "Pre-taught 11 words", detail: "Formal words from the speech and the literary terms the questions use, with syllable breaks.", barrier: "Unfamiliar formal vocabulary", need: "dyslexia", evidence: "udl-language" },
      { title: "Listen while reading", detail: "Text-to-speech removes decoding as a barrier to the close reading.", barrier: "Decoding a long 19th-century text", need: "dyslexia", evidence: "tts-meta" },
      { title: "Paragraph frames and dictation for the writing", detail: "Starters and word banks scaffold the writing; dictation is offered because analysis, not handwriting, is the objective.", barrier: "Four written responses including a full paragraph", need: "dyslexia", evidence: "udl-expression" },
    ],
    teacherNotes: [
      "The gray notes give literal meaning only; they don't interpret anything Questions 2, 3, or 5 assess.",
      "Speech-to-text for Question 5 keeps the analytical demand the same; grade the analysis, not spelling.",
      "If the class discussion added background beyond what's on this page, give it to the student in writing.",
    ],
    barriers: [
      { quote: "But, in a larger sense, we can not dedicate—we can not consecrate—we can not hallow—this ground.", issue: "Archaic, multi-syllable vocabulary in a key line.", needs: ["dyslexia"] },
      { quote: "It is rather for us to be here dedicated to the great task remaining before us", issue: "Start of an 82-word sentence — extreme decoding and working-memory load.", needs: ["dyslexia", "adhd"] },
      { quote: "In one paragraph, analyze how Lincoln uses repetition", issue: "Extended writing where spelling and handwriting can hide the analysis.", needs: ["dyslexia"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
  },

  adhd: {
    title: "The Gettysburg Address — Close Reading Plan",
    studentIntro: "Read a little, answer a little. Six steps, about 35 minutes.",
    estimatedMinutes: 35,
    sections: [
      {
        heading: "Start here",
        minutes: 2,
        blocks: [{ type: "direction", icon: "read", text: "**Read** the 5 questions at the bottom first. Don't answer yet — now you know what to look for." }],
      },
      {
        heading: "Read chunks 1–3, then answer question 1",
        minutes: 6,
        purpose: "Lincoln gave this speech at the dedication of a cemetery for Union soldiers, four months after the Battle of Gettysburg.",
        blocks: [
          { type: "direction", icon: "write", text: "While you read, **underline** words about birth or life. (You'll use them in question 2.)" },
          ...chunkBlocks(false).slice(0, 3),
          { type: "question", number: "1", icon: "calc", text: Q1, supports: { length: "Show the math + 1 sentence" } },
        ],
      },
      {
        heading: "Read chunks 4–5, then answer questions 2 & 3",
        minutes: 9,
        blocks: [
          ...chunkBlocks(false).slice(3, 5),
          { type: "question", number: "2", icon: "write", text: Q2, supports: { length: "3–4 sentences" } },
          { type: "question", number: "3", icon: "think", text: Q3, supports: { length: "2–3 sentences" } },
        ],
      },
      { heading: "Brain break", minutes: 2, blocks: [{ type: "break", minutes: 2, icon: "move", text: "Stand, stretch, get water. Two minutes, then come back." }] },
      {
        heading: "Read chunks 6–8, then answer question 4",
        minutes: 7,
        blocks: [
          { type: "direction", icon: "draw", text: "While you read, **box** each thing Lincoln says \"we\" must do." },
          ...chunkBlocks(false).slice(5),
          { type: "question", number: "4", icon: "write", text: Q4, supports: { length: "3–4 sentences with 2 quotes" } },
        ],
      },
      {
        heading: "Question 5: plan, then write",
        minutes: 8,
        blocks: [
          {
            type: "question",
            number: "5",
            icon: "write",
            text: Q5,
            supports: {
              steps: ["**Copy** one repeated phrase from the speech.", "**Note** what idea the repetition makes stronger.", "**Note** how it would make listeners feel or act.", "**Turn** your notes into one paragraph (5–7 sentences)."],
              length: "One paragraph",
            },
          },
        ],
      },
      {
        heading: "Check your work",
        minutes: 1,
        blocks: [
          {
            type: "checklist",
            items: [
              "Question 1: I showed the math and named the event.",
              "Question 2: I named the images AND explained the purpose.",
              "Question 3: I explained what makes the line ironic.",
              "Question 4: I used 2 quotes.",
              "Question 5: I wrote one full paragraph about repetition.",
            ],
          },
        ],
      },
    ],
    changes: [
      { title: "Questions first, as a 2-minute start", detail: "Previewing the questions gives the reading a purpose and makes starting easy.", barrier: "A long text before any task", need: "adhd", evidence: "udl-strategy" },
      { title: "Read–answer–read–answer", detail: "Each question comes right after the chunks it's about, so the student never holds the whole speech in working memory.", barrier: DIRECTIONS, need: "adhd", evidence: "segmenting" },
      { title: "Active-reading targets", detail: "Underlining birth/life words and boxing what \"we\" must do give attention a job — the student still finds and interprets them.", barrier: "Annotate with no stated focus", need: "adhd", evidence: "adhd-classroom" },
      { title: "A planning scaffold for the paragraph", detail: "Question 5 is broken into note-then-write steps. The analysis required is the same.", barrier: "A full analytical paragraph with no planning step", need: "adhd", evidence: "udl-strategy" },
      { title: "A 2-minute break and a self-check", detail: "A break at the midpoint and concrete checks that catch half-answered questions.", barrier: "A 35-minute task with multi-part questions", need: "adhd", evidence: "self-regulation" },
    ],
    teacherNotes: [
      "The speech text is unchanged and unglossed — this version changes pacing and structure, not reading level.",
      "The time estimates add up to about 35 minutes; adjust to your period length.",
    ],
    barriers: [
      { quote: DIRECTIONS, issue: "Two open-ended tasks with no amount, focus, or order.", needs: ["adhd", "apd"] },
      { quote: Q5, issue: "Extended writing with no planning step.", needs: ["adhd"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
  },

  apd: {
    title: "Close Reading: The Gettysburg Address (1863)",
    studentIntro: "The background from class discussion is written below, so you don't have to remember it.",
    sections: [
      {
        heading: "Background (in writing)",
        blocks: [
          { type: "text", icon: "read", text: "Lincoln gave this speech at the dedication of a cemetery for Union soldiers. It was four months after the Battle of Gettysburg, in 1863." },
        ],
      },
      {
        heading: "Directions",
        blocks: [
          { type: "direction", icon: "read", text: "**Read** the speech. If the class listens to it, follow along with the chunk numbers." },
          { type: "direction", icon: "write", text: "**Annotate** while you read, using the key below." },
          { type: "direction", icon: "write", text: "**Answer** the 5 questions. Back up each claim with a quote from the speech." },
        ],
      },
      {
        heading: "Annotation key",
        blocks: [{ type: "checklist", items: ["Underline = an important idea", "Circle = a word I don't know", "? = a part that confuses me", "★ = a line I could use as evidence"] }],
      },
      {
        heading: "The speech",
        purpose: "Lincoln's exact words, numbered so you can find the place when someone refers to \"chunk 4\".",
        blocks: chunkBlocks(false, "read"),
      },
      {
        heading: "Guided notes",
        blocks: [
          {
            type: "notes",
            icon: "write",
            text: "Word bank: consecrated · dedication · four · Union",
            items: [
              "Lincoln spoke at the ____ of a cemetery.",
              "The soldiers buried there fought for the ____.",
              "The speech was given ____ months after the battle.",
              "Lincoln says the brave men have already ____ the ground (chunk 4).",
            ],
          },
        ],
      },
      {
        heading: "Questions",
        blocks: [
          { type: "question", number: "1", icon: "calc", text: Q1 },
          { type: "question", number: "2", icon: "write", text: Q2 },
          { type: "question", number: "3", icon: "think", text: Q3 },
          { type: "question", number: "4", icon: "write", text: Q4 },
          { type: "question", number: "5", icon: "write", text: Q5 },
        ],
      },
    ],
    changes: [
      { title: "Wrote down what \"we discussed in class\"", detail: "The background the assignment relies on is now on the page.", barrier: "As we discussed in class", need: "apd", evidence: "asha-portal" },
      { title: "Numbered chunks for following along", detail: "If the speech is read aloud or discussed, \"chunk 4\" lets the student find the place visually instead of tracking by ear.", barrier: "Close reading often done as a read-aloud", need: "apd", evidence: "udl-perception" },
      { title: "A written annotation key", detail: "Annotation codes are usually explained out loud; now they're on the page.", barrier: DIRECTIONS, need: "apd", evidence: "asha-portal" },
      { title: "Guided notes on the background", detail: "Captures the context facts in writing.", barrier: "Context delivered orally", need: "apd", evidence: "guided-notes" },
      { title: "Speech and questions left unchanged", detail: "Reading the text isn't the barrier for auditory processing, so the grade-level text and questions stay exactly as written.", barrier: "—", need: "apd", evidence: "asha-capd" },
    ],
    teacherNotes: [
      "If you play a recording or read the speech aloud, also project the text; use captions for any video recitation.",
      "During discussion of irony or repetition, write key points on the board as students share them.",
      "Check understanding by asking the student to point to the chunk you're discussing.",
    ],
    barriers: [
      { quote: "As we discussed in class", issue: "Needed background was delivered orally and isn't on the page.", needs: ["apd"] },
      { quote: DIRECTIONS, issue: "How to annotate is usually explained out loud.", needs: ["apd", "adhd"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
  },

  autism: {
    title: "Close Reading: The Gettysburg Address (1863)",
    studentIntro: "This assignment has 4 parts in this order: What this is about, What to do, The work, When you finish.",
    estimatedMinutes: 40,
    sections: [
      {
        heading: "What this is about",
        blocks: [
          { type: "text", text: "Lincoln gave this speech at the dedication of a cemetery for Union soldiers, four months after the Battle of Gettysburg. You will read it and explain how Lincoln uses language to make his argument." },
          { type: "tip", text: "This speech uses figurative language on purpose. Some questions ask you to explain it, so the speech is not changed." },
        ],
      },
      {
        heading: "What to do",
        blocks: [
          {
            type: "expectations",
            items: [
              "What I will do: Read the speech (8 chunks). Answer 5 questions.",
              "How much: Q1 — the math + 1 sentence. Q2 — 3–4 sentences. Q3 — 2–3 sentences. Q4 — 3–4 sentences with 2 quotes. Q5 — 1 paragraph of 5–7 sentences.",
              "How long: about 40 minutes.",
              "I am finished when: all 5 questions are answered at the lengths above.",
              "Then I will: hand my paper to the teacher.",
            ],
          },
          { type: "direction", icon: "write", text: "**While you read**, underline exactly 3 sentences you think are important." },
          { type: "direction", icon: "write", text: "**Support** each answer with a quote from the speech (copy the exact words in quotation marks)." },
        ],
      },
      {
        heading: "The work",
        blocks: [
          ...chunkBlocks(false, "read"),
          {
            type: "example",
            text: "Example of analyzing repetition (different text): \"Row, row, row your boat.\"",
            items: ["The word \"row\" is repeated three times. The repetition creates a steady rhythm, like the motion of rowing a boat."],
          },
          { type: "question", number: "1", icon: "calc", text: Q1, supports: { length: "The math + 1 sentence", hint: "A \"score\" means 20." } },
          {
            type: "question",
            number: "2",
            icon: "write",
            text: Q2,
            supports: {
              length: "3–4 sentences",
              hint: "What this question is asking: an extended metaphor is a comparison that continues through a whole text. Why does Lincoln keep using words about birth, life, and death? How do they help him make his point?",
            },
          },
          {
            type: "question",
            number: "3",
            icon: "think",
            text: Q3,
            supports: {
              length: "2–3 sentences",
              hint: "What this question is asking: irony is when what actually happens is the opposite of what was said or expected. Compare what Lincoln predicted in this line with what really happened to his speech.",
            },
          },
          { type: "question", number: "4", icon: "write", text: Q4, supports: { length: "3–4 sentences with 2 quotes", steps: ["Write what Lincoln says the living must do.", "Copy quote 1 and its chunk number.", "Copy quote 2 and its chunk number.", "Write how the quotes support your answer."] } },
          {
            type: "question",
            number: "5",
            icon: "write",
            text: Q5,
            supports: {
              length: "1 paragraph, 5–7 sentences",
              steps: ["Sentence 1: your claim about why Lincoln uses repetition.", "Sentences 2–3: one example of repetition (quote) and what it emphasizes.", "Sentences 4–5: a second example and its effect.", "Last sentence: how the repetition persuades the audience."],
            },
          },
        ],
      },
      {
        heading: "When you finish",
        blocks: [{ type: "checklist", items: ["All 5 questions answered.", "Each answer is the length listed.", "Questions 4 and 5 include quotes.", "I handed my paper to the teacher."] }],
      },
    ],
    changes: [
      { title: "Kept the figurative language — and explained the task", detail: "The metaphor and irony are what's being assessed, so they weren't removed. Instead, Questions 2 and 3 include a plain explanation of what they are asking.", barrier: "Figurative-language questions with implicit expectations", need: "autism", evidence: "figurative" },
      { title: "Exact length for every answer", detail: "Including what \"one paragraph\" means (5–7 sentences).", barrier: "\"Explain\" and \"one paragraph\" without defined length", need: "autism", evidence: "teacch" },
      { title: "Literal directions", detail: "\"Back up your claims\" and \"Annotate\" were replaced with exact instructions.", barrier: "Be sure to back up your claims with evidence from the text.", need: "autism", evidence: "figurative" },
      { title: "Sentence-by-sentence plan for the paragraph", detail: "Question 5 lists what each sentence does. The student still produces the analysis.", barrier: "Open-ended analytical writing", need: "autism", evidence: "ncaep" },
      { title: "A model on a different text", detail: "Shows what analyzing repetition looks like using a nursery rhyme, without answering Question 5.", barrier: "No model of the expected analysis", need: "autism", evidence: "ncaep" },
      { title: "Predictable layout", detail: "The same four parts in the same order.", barrier: "No visible structure", need: "autism", evidence: "teacch" },
    ],
    teacherNotes: [
      "If the class will listen to a dramatic reading or video of the speech, tell the student beforehand and offer headphones or a lower volume.",
      "Question 3 depends on knowing the speech became famous; if that background wasn't covered, provide it in writing.",
    ],
    barriers: [
      { quote: "Be sure to back up your claims with evidence from the text.", issue: "Idiom (\"back up\") and no stated amount of evidence.", needs: ["autism"] },
      { quote: DIRECTIONS, issue: "\"Annotate\" doesn't say what or how much to mark.", needs: ["autism", "adhd"] },
      { quote: "Explain the irony in this line.", issue: "Requires inferring an unstated expectation; no length given.", needs: ["autism"] },
      { quote: "In one paragraph", issue: "\"One paragraph\" has no defined length.", needs: ["autism"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
    languageReplacements: [
      { original: "Be sure to back up your claims with evidence from the text", replacement: "Support each answer with a quote from the speech (copy the exact words in quotation marks)" },
      { original: "Annotate the text as you read", replacement: "While you read, underline exactly 3 sentences you think are important" },
      { original: "As we discussed in class", replacement: "(background stated directly)" },
    ],
  },
};

