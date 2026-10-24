import type { AdaptedAssignment, NeedId } from "../types";

const Q1 = "What are the inputs (reactants) and outputs (products) of photosynthesis?";
const Q2 = "Where in the plant cell does photosynthesis take place, and what pigment captures the light energy?";
const Q3 = "Explain why a fox depends on photosynthesis even though it never eats plants.";
const Q4 = "Which of the following is a producer?";
const CHOICES = ["A. Fox", "B. Rabbit", "C. Clover", "D. Mushroom"];
const Q5 = "Discuss with a partner: predict what would happen to the rabbits and foxes if a disease killed most of the clover. Briefly explain your reasoning.";

const LONG_SENTENCE =
  "Inside the chloroplasts of leaf cells, the pigment chlorophyll absorbs sunlight; the plant then uses that energy to combine carbon dioxide from the air with water from the soil, producing glucose and releasing oxygen as a byproduct.";
const DIRECTIONS = "Read the passage carefully, then answer the questions that follow in complete sentences.";

const OBJECTIVES = [
  "Identify the inputs and outputs of photosynthesis",
  "Locate where photosynthesis happens and the pigment involved",
  "Explain how energy flows from producers to consumers",
  "Predict the effect of a change in a food chain",
];
const VOCAB = ["photosynthesis", "chlorophyll", "chloroplasts", "glucose", "producer", "consumer", "ecosystem", "pigment"];

export const SCIENCE: Record<NeedId, AdaptedAssignment> = {
  dyslexia: {
    title: "Photosynthesis and Ecosystems",
    studentIntro: "Plants make food from sunlight. You will read how they do it, then show why every animal depends on it.",
    sections: [
      {
        heading: "Words to know",
        purpose: "Say each word in parts. You will see all of these in the reading.",
        blocks: [
          { type: "vocab", term: "photosynthesis", syllables: "pho·to·syn·the·sis", definition: "How plants use light energy to make their own food." },
          { type: "vocab", term: "chloroplast", syllables: "chlo·ro·plast", definition: "A tiny structure inside a plant cell. Plant cells have many of them." },
          { type: "vocab", term: "chlorophyll", syllables: "chlo·ro·phyll", definition: "A green pigment found in plants." },
          { type: "vocab", term: "pigment", syllables: "pig·ment", definition: "A substance that gives something its color." },
          { type: "vocab", term: "glucose", syllables: "glu·cose", definition: "A kind of sugar. It stores energy." },
          { type: "vocab", term: "producer", syllables: "pro·du·cer", definition: "A living thing that makes its own food." },
          { type: "vocab", term: "consumer", syllables: "con·su·mer", definition: "A living thing that gets energy by eating other living things." },
        ],
      },
      {
        heading: "Read: where energy comes from",
        blocks: [
          { type: "keyIdea", text: "**Photosynthesis** turns light energy into food energy. Almost every ecosystem depends on it." },
          { type: "text", text: "Every living thing needs energy. In almost every **ecosystem** on Earth, that energy starts with **photosynthesis**." },
          { type: "text", text: "Photosynthesis is a process. Plants, algae, and some bacteria use it. They change light energy into chemical energy. That energy is stored in **glucose**." },
        ],
      },
      {
        heading: "Read: inside the leaf",
        blocks: [
          { type: "text", text: "Leaf cells have tiny parts called **chloroplasts**. Inside them, a pigment called **chlorophyll** absorbs sunlight." },
          { type: "text", text: "The plant uses that energy to join two things: carbon dioxide from the air and water from the soil." },
          { type: "text", text: "This makes glucose. It also releases oxygen as a byproduct. A byproduct is something extra that is made along the way." },
        ],
      },
      {
        heading: "Read: energy moves up the food chain",
        blocks: [
          { type: "text", text: "The glucose a plant makes is the foundation of the food chain." },
          { type: "text", text: "A rabbit eats clover. The rabbit takes in the energy the clover stored. Then a fox eats the rabbit. Some of that energy moves up the chain again." },
          { type: "keyIdea", text: "Without **producers**, **consumers** would have no source of energy at all." },
          { type: "text", text: "In a nutshell, photosynthesis is the engine that keeps the whole ecosystem running." },
        ],
      },
      {
        heading: "Questions",
        purpose: "Use the reading. Pick the way you want to show each answer.",
        blocks: [
          {
            type: "question",
            number: "1",
            text: Q1,
            icon: "write",
            supports: {
              starters: ["The inputs are ___.", "The outputs are ___."],
              wordBank: ["carbon dioxide", "chlorophyll", "glucose", "oxygen", "soil", "sunlight", "water"],
              responseOptions: ["Write it", "Type it", "Fill in a two-column chart: In | Out"],
            },
          },
          {
            type: "question",
            number: "2",
            text: Q2,
            icon: "write",
            supports: {
              starters: ["Photosynthesis takes place in the ___.", "The pigment that captures light is ___."],
              wordBank: ["chlorophyll", "chloroplasts", "glucose", "nucleus"],
              responseOptions: ["Write it", "Type it", "Say it and record it"],
            },
          },
          {
            type: "question",
            number: "3",
            text: Q3,
            icon: "think",
            supports: {
              starters: ["A fox depends on photosynthesis because ___."],
              hint: "Reread the part of the reading about the rabbit and the fox.",
              wordBank: ["consumer", "energy", "food chain", "producer"],
              responseOptions: ["Write it", "Type it", "Say it and record it"],
            },
          },
          { type: "question", number: "4", text: Q4, items: CHOICES, icon: "check", supports: { hint: "Look at the word list: what does a producer do?" } },
          {
            type: "question",
            number: "5",
            text: Q5,
            icon: "talk",
            supports: {
              starters: ["If most of the clover died, the rabbits would ___.", "Then the foxes would ___ because ___."],
              length: "2–3 sentences",
              responseOptions: ["Talk it through, then write it", "Say it and record it"],
            },
          },
        ],
      },
    ],
    changes: [
      { title: "Pre-taught 7 academic words", detail: "Each word is split into syllables and defined in plain language. Every term is still used in the reading and questions — decoding is removed as the barrier, the vocabulary is not.", barrier: "Long, undefined terms like chloroplasts and chlorophyll", need: "dyslexia", evidence: "udl-language" },
      { title: "Broke a 37-word sentence into four short ones", detail: "The original packed four facts into one sentence. Each fact now has its own short sentence. Nothing was removed.", barrier: "One sentence carrying four facts", need: "dyslexia", evidence: "bda-style" },
      { title: "Added headings and key-idea boxes", detail: "Headings preview each part, and the most important idea of each part stands out.", barrier: "Two dense paragraphs with no signposts", need: "dyslexia", evidence: "udl-knowledge" },
      { title: "Starters and a spelling word bank", detail: "Starters frame the answer without giving it. Word banks mix needed words with distractors, so spelling doesn't hide the science.", barrier: "Heavy writing and spelling of technical words", need: "dyslexia", evidence: "udl-expression" },
      { title: "Other ways to answer", detail: "Typing, recording, or a two-column chart show the same knowledge. The questions themselves are unchanged.", barrier: "Written answers as the only option", need: "dyslexia", evidence: "ida-accommodations" },
      { title: "Read-aloud ready", detail: "Short, plain sentences read naturally with text-to-speech.", barrier: "Dense text that is hard to decode independently", need: "dyslexia", evidence: "tts-meta" },
    ],
    teacherNotes: [
      "Let the student listen to the reading with text-to-speech first (the Student view has a Read aloud button), then answer.",
      "Don't grade spelling on this assignment unless spelling is a learning objective.",
      "Recorded or typed answers should be held to the same science expectations as written ones.",
    ],
    barriers: [
      { quote: LONG_SENTENCE, issue: "37-word sentence holding four facts — heavy decoding and working-memory load.", needs: ["dyslexia", "adhd"] },
      { quote: "Photosynthesis is the process plants, algae, and some bacteria use to convert light energy into chemical energy stored in glucose.", issue: "Dense definition with several long academic words in one sentence.", needs: ["dyslexia"] },
      { quote: "answer the questions that follow in complete sentences", issue: "All answers must be handwritten in full sentences — spelling technical words can hide what the student knows.", needs: ["dyslexia"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
  },

  adhd: {
    title: "Photosynthesis and Ecosystems — Work Plan",
    studentIntro: "Six short steps, about 20 minutes. Finish a step, tick it, move on.",
    estimatedMinutes: 20,
    sections: [
      {
        heading: "Start here",
        minutes: 1,
        blocks: [{ type: "direction", icon: "write", text: "**Write** your name. Then **circle** the word photosynthesis each time you see it in the reading. (There are 3.)" }],
      },
      {
        heading: "Read how plants make food",
        minutes: 3,
        blocks: [
          { type: "text", text: "Every living thing needs energy, and for almost every ecosystem on Earth that energy starts with photosynthesis." },
          { type: "text", text: "Photosynthesis is the process plants, algae, and some bacteria use to convert light energy into chemical energy stored in glucose." },
          { type: "text", text: "Inside the chloroplasts of leaf cells, the pigment chlorophyll absorbs sunlight. The plant then uses that energy to combine carbon dioxide from the air with water from the soil. This produces glucose and releases oxygen as a byproduct." },
          { type: "direction", icon: "look", text: "**Underline** what goes IN to the plant and what comes OUT." },
        ],
      },
      {
        heading: "Answer questions 1 & 2",
        minutes: 4,
        blocks: [
          { type: "question", number: "1", text: Q1, icon: "write", supports: { length: "1–2 sentences" } },
          { type: "question", number: "2", text: Q2, icon: "write", supports: { length: "1–2 sentences — answer both parts" } },
        ],
      },
      {
        heading: "Brain break",
        minutes: 1,
        blocks: [{ type: "break", minutes: 1, icon: "move", text: "Stand up. Stretch your arms over your head for 30 seconds. Sit back down." }],
      },
      {
        heading: "Read how energy moves",
        minutes: 2,
        blocks: [
          { type: "text", text: "The glucose a plant makes is the foundation of the food chain." },
          { type: "text", text: "When a rabbit eats clover, it takes in the energy the clover stored. When a fox eats the rabbit, some of that energy moves up the chain again." },
          { type: "keyIdea", text: "Without producers, consumers would have no source of energy at all. In a nutshell, photosynthesis is the engine that keeps the whole ecosystem running." },
          { type: "direction", icon: "draw", text: "**Draw** small arrows in the margin to follow the energy from one living thing to the next." },
        ],
      },
      {
        heading: "Answer questions 3 & 4",
        minutes: 4,
        blocks: [
          { type: "question", number: "3", text: Q3, icon: "write", supports: { length: "2–3 sentences" } },
          { type: "question", number: "4", text: Q4, items: CHOICES, icon: "check", supports: { length: "Circle 1 letter" } },
        ],
      },
      {
        heading: "Final task: question 5",
        minutes: 5,
        blocks: [
          {
            type: "question",
            number: "5",
            text: Q5,
            icon: "talk",
            supports: {
              steps: ["**Talk** with your partner for 2 minutes (set a timer).", "**Write** what happens to the rabbits.", "**Write** what happens to the foxes — and why."],
              length: "2–3 sentences",
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
              "Question 1: I named the inputs AND the outputs.",
              "Question 2: I answered both parts (where + which pigment).",
              "Question 3: I explained how the energy reaches the fox.",
              "Question 4: I circled one letter.",
              "Question 5: I wrote about the rabbits AND the foxes.",
            ],
          },
        ],
      },
    ],
    changes: [
      { title: "A one-minute way to start", detail: "Circling a word is a no-decision task that gets the student into the reading immediately.", barrier: "The assignment opens with dense reading — no easy entry point", need: "adhd", evidence: "udl-strategy" },
      { title: "Six timed chunks instead of one block", detail: "Each section is one task with an honest time estimate, so the end is always visible.", barrier: "Read everything, then answer everything", need: "adhd", evidence: "segmenting" },
      { title: "Questions placed right after the reading they need", detail: "Questions 1–2 follow part 1; questions 3–4 follow part 2. The student doesn't have to hold the whole passage in working memory.", barrier: "All questions come after a long reading", need: "adhd", evidence: "udl-strategy" },
      { title: "Active-reading micro-tasks", detail: "Underlining and drawing arrows give the eyes and hands a purpose while reading.", barrier: "Passive reading with no task to anchor attention", need: "adhd", evidence: "adhd-classroom" },
      { title: "A planned 1-minute movement break", detail: "Placed at the halfway point, with a concrete instruction and a clear end.", barrier: "No natural pause in a 20-minute task", need: "adhd", evidence: "adhd-classroom" },
      { title: "A self-check tied to each question", detail: "Specific checks (\"both parts\", \"rabbits AND foxes\") catch the most common incomplete answers.", barrier: "Multi-part questions are easy to half-answer", need: "adhd", evidence: "self-regulation" },
    ],
    teacherNotes: [
      "The main change is order: the reading is split in two, with questions after each half. The reading text and all five questions are unchanged.",
      "A visible timer per chunk helps; the minutes are estimates, not deadlines.",
      "For question 5, pair the student with a focused partner; the 2-minute talk timer gives a clear end point.",
    ],
    barriers: [
      { quote: DIRECTIONS, issue: "Two big steps and an unstated amount of work in one instruction, with no clear starting point.", needs: ["adhd", "apd"] },
      { quote: Q5, issue: "Open-ended partner talk with no time limit or end point — easy to drift off task.", needs: ["adhd", "autism"] },
      { quote: Q2, issue: "Two questions in one — easy to answer only the first part.", needs: ["adhd"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
  },

  apd: {
    title: "Photosynthesis and Ecosystems",
    studentIntro: "Everything you need is written on this page. You do not have to remember anything that was said out loud.",
    sections: [
      {
        heading: "Directions",
        purpose: "Do these in order. Come back to this list any time.",
        blocks: [
          { type: "direction", icon: "read", text: "**Read** the two paragraphs below." },
          { type: "direction", icon: "write", text: "**Fill in** the guided notes." },
          { type: "direction", icon: "write", text: "**Answer** questions 1 to 4 in complete sentences." },
          { type: "direction", icon: "talk", text: "**Do** question 5 with a partner. A written option is included." },
          { type: "direction", icon: "check", text: "**Check** your work with the list at the end." },
        ],
      },
      {
        heading: "Reading",
        purpose: "This is the full reading, exactly as written.",
        blocks: [
          { type: "text", icon: "read", text: "Every living thing needs energy, and for almost every ecosystem on Earth that energy starts with photosynthesis. Photosynthesis is the process plants, algae, and some bacteria use to convert light energy into chemical energy stored in glucose. Inside the chloroplasts of leaf cells, the pigment chlorophyll absorbs sunlight; the plant then uses that energy to combine carbon dioxide from the air with water from the soil, producing glucose and releasing oxygen as a byproduct." },
          { type: "text", icon: "read", text: "The glucose a plant makes is the foundation of the food chain. When a rabbit eats clover, it takes in the energy the clover stored, and when a fox eats the rabbit, some of that energy moves up the chain again. Without producers, consumers would have no source of energy at all. In a nutshell, photosynthesis is the engine that keeps the whole ecosystem running." },
        ],
      },
      {
        heading: "Guided notes",
        purpose: "Fill in each blank with a word from the reading.",
        blocks: [
          {
            type: "notes",
            icon: "write",
            text: "Word bank: chlorophyll · chloroplasts · dioxide · energy · glucose · oxygen · producers · water",
            items: [
              "Photosynthesis changes light energy into chemical energy stored in ____.",
              "Photosynthesis happens inside the ____ of leaf cells.",
              "The pigment ____ absorbs sunlight.",
              "The plant combines carbon ____ from the air with ____ from the soil.",
              "The plant releases ____ as a byproduct.",
              "When an animal eats, it takes in the ____ that was stored.",
              "Without ____, consumers would have no source of energy.",
            ],
          },
        ],
      },
      {
        heading: "Questions",
        blocks: [
          { type: "question", number: "1", text: Q1, icon: "write" },
          { type: "question", number: "2", text: Q2, icon: "write" },
          { type: "question", number: "3", text: Q3, icon: "write" },
          { type: "question", number: "4", text: Q4, items: CHOICES, icon: "check" },
          {
            type: "question",
            number: "5",
            text: Q5,
            icon: "talk",
            supports: {
              hint: "Written option: write your prediction on a sticky note and swap notes with your partner. Read theirs and add one idea to yours.",
              length: "2–3 sentences",
            },
          },
        ],
      },
      {
        heading: "Finished?",
        blocks: [{ type: "checklist", items: ["Guided notes filled in", "Questions 1–4 answered in complete sentences", "Question 5 done (talked or written)"] }],
      },
    ],
    changes: [
      { title: "Every direction written out, one step per line", detail: "The original packs two steps into one sentence that is usually also said aloud. Now the student can reread each step at any time.", barrier: "Directions given once, in one long sentence", need: "apd", evidence: "asha-portal" },
      { title: "Added guided notes", detail: "Fill-in notes capture the key facts in writing, so nothing depends on catching what was said in class.", barrier: "Key facts usually reviewed out loud", need: "apd", evidence: "guided-notes" },
      { title: "Kept the reading exactly as written", detail: "Auditory processing affects listening, not reading — so the text was not simplified. The student keeps full grade-level reading.", barrier: "—", need: "apd", evidence: "asha-capd" },
      { title: "Written path for the partner discussion", detail: "Question 5 keeps its partner task, plus a sticky-note option that meets the same objective without relying on listening in a noisy room.", barrier: "Partner talk is the hardest listening situation in class", need: "apd", evidence: "udl-perception" },
      { title: "Picture cues on every step", detail: "Read, write, talk, and check icons show what each step involves at a glance.", barrier: "Instructions that are only words", need: "apd", evidence: "udl-perception" },
      { title: "Delivery notes for the teacher", detail: "How to check understanding and reduce listening load while giving this assignment.", barrier: "Directions usually explained out loud", need: "apd", evidence: "asha-portal" },
    ],
    teacherNotes: [
      "Hand out this page before you explain the assignment, so the student can read along instead of relying on listening.",
      "After giving directions, ask the student to point to the step they'll do first, rather than asking \"Any questions?\"",
      "During question 5, seat the pair away from other groups if possible — partner talk in a noisy room is the hardest listening situation.",
      "If the class reviews answers aloud afterward, write each key answer on the board as students share it.",
    ],
    barriers: [
      { quote: "Discuss with a partner", issue: "Partner talk in a noisy classroom depends on listening, with no written alternative.", needs: ["apd"] },
      { quote: DIRECTIONS, issue: "Two steps in one instruction, typically also said aloud only once.", needs: ["apd", "adhd"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
  },

  autism: {
    title: "Photosynthesis and Ecosystems",
    studentIntro: "This assignment has 4 parts in this order: What this is about, What to do, The work, When you finish.",
    estimatedMinutes: 25,
    sections: [
      {
        heading: "What this is about",
        blocks: [{ type: "text", text: "You will learn how plants make food from sunlight (photosynthesis) and how that energy moves to animals in a food chain." }],
      },
      {
        heading: "What to do",
        blocks: [
          {
            type: "expectations",
            items: [
              "What I will do: Read 2 paragraphs. Answer 5 questions.",
              "How much: Questions 1 and 2 — 2 sentences each. Question 3 — 3 sentences. Question 4 — circle 1 letter. Question 5 — 3 minutes of partner talk, then 2–3 sentences.",
              "How long: about 25 minutes.",
              "I am finished when: all 5 questions have answers.",
              "Then I will: hand my paper to the teacher.",
            ],
          },
          { type: "direction", icon: "read", text: "**Read** the text below one time." },
          { type: "direction", icon: "write", text: "**Answer** questions 1 to 5 in order. Write complete sentences." },
        ],
      },
      {
        heading: "The work",
        blocks: [
          { type: "text", icon: "read", text: "Every living thing needs energy, and for almost every ecosystem on Earth that energy starts with photosynthesis. Photosynthesis is the process plants, algae, and some bacteria use to convert light energy into chemical energy stored in glucose. Inside the chloroplasts of leaf cells, the pigment chlorophyll absorbs sunlight. The plant then uses that energy to combine carbon dioxide from the air with water from the soil. This produces glucose and releases oxygen as a byproduct." },
          { type: "text", icon: "read", text: "The glucose a plant makes is the foundation of the food chain. When a rabbit eats clover, it takes in the energy the clover stored. When a fox eats the rabbit, some of that energy moves up the chain again. Without producers, consumers would have no source of energy at all. In summary, photosynthesis provides the energy that the whole ecosystem needs." },
          {
            type: "example",
            text: "Example of a complete answer (different topic). Question: What are the inputs and outputs of baking bread?",
            items: ["Answer: The inputs are flour, water, and yeast. The outputs are bread and carbon dioxide gas.", "This answer has 2 sentences: 1 for inputs and 1 for outputs."],
          },
          { type: "question", number: "1", text: Q1, icon: "write", supports: { length: "2 sentences: 1 for inputs, 1 for outputs" } },
          { type: "question", number: "2", text: Q2, icon: "write", supports: { length: "2 sentences", steps: ["Write where photosynthesis takes place.", "Write the name of the pigment."] } },
          {
            type: "question",
            number: "3",
            text: Q3,
            icon: "think",
            supports: { length: "3 sentences", steps: ["Write what the fox eats.", "Write what that animal eats.", "Write how the energy from sunlight reaches the fox."] },
          },
          { type: "question", number: "4", text: Q4, items: CHOICES, icon: "check", supports: { length: "Circle 1 letter" } },
          {
            type: "question",
            number: "5",
            text: "Talk with one partner for 3 minutes: predict what would happen to the rabbits and foxes if a disease killed most of the clover. Then write 2–3 sentences that explain your reasoning.",
            icon: "talk",
            supports: {
              length: "2–3 sentences",
              steps: ["Partner talk: each person says one prediction (3 minutes).", "Write what happens to the rabbits.", "Write what happens to the foxes.", "Write why, using the food chain."],
            },
          },
        ],
      },
      {
        heading: "When you finish",
        blocks: [
          { type: "checklist", items: ["I answered questions 1, 2, 3, 4, and 5.", "Each answer has the number of sentences listed.", "I handed my paper to the teacher."] },
        ],
      },
    ],
    changes: [
      { title: "Exact length for every answer", detail: "\"Explain\" and \"Briefly\" don't say how much is enough. Each question now states the number of sentences.", barrier: "No stated length on any written question", need: "autism", evidence: "teacch" },
      { title: "The same four-part layout", detail: "What this is about → What to do → The work → When you finish. The student knows what comes next.", barrier: "No visible structure", need: "autism", evidence: "teacch" },
      { title: "Figurative phrases made literal", detail: "\"In a nutshell\" and \"the engine that keeps the whole ecosystem running\" were rewritten to say exactly what they mean.", barrier: "Idiom and metaphor in a science text", need: "autism", evidence: "figurative" },
      { title: "A defined partner task", detail: "Who (one partner), how long (3 minutes), and what each person says — the open-ended \"Discuss\" now has a clear structure and end.", barrier: "Unstructured social task", need: "autism", evidence: "ncaep" },
      { title: "Multi-part questions broken into steps", detail: "Questions 2, 3, and 5 list their parts so none is missed. The thinking required is the same.", barrier: "Implicit reasoning steps", need: "autism", evidence: "ncaep" },
      { title: "A model answer on a different topic", detail: "Shows the expected format (one sentence per part) without answering any real question.", barrier: "No model of a complete answer", need: "autism", evidence: "ncaep" },
    ],
    teacherNotes: [
      "Question 5 includes partner work. Tell the student in advance who their partner is and that talk time is exactly 3 minutes; offer writing ideas and swapping as an alternative.",
      "A visual timer during partner talk makes the end point predictable.",
      "Check with the student whether the noise level during partner work is manageable; offer a quieter spot if needed.",
    ],
    barriers: [
      { quote: "In a nutshell, photosynthesis is the engine that keeps the whole ecosystem running.", issue: "Two figurative expressions (\"in a nutshell\", \"engine\") that can be read literally.", needs: ["autism"] },
      { quote: "Briefly explain your reasoning.", issue: "\"Briefly\" does not say how much to write.", needs: ["autism", "adhd"] },
      { quote: Q3, issue: "No stated length; the reasoning steps are implicit.", needs: ["autism"] },
      { quote: "Discuss with a partner", issue: "Unstructured social task with no time limit or clear end.", needs: ["autism"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
    languageReplacements: [
      { original: "In a nutshell", replacement: "In summary" },
      { original: "is the engine that keeps the whole ecosystem running", replacement: "provides the energy that the whole ecosystem needs" },
      { original: "Discuss with a partner", replacement: "Talk with one partner for 3 minutes" },
      { original: "Briefly explain your reasoning", replacement: "Write 2–3 sentences that explain your reasoning" },
    ],
  },
};
