import type { AdaptedAssignment, NeedId } from "../types";

const Q1 = "Ms. Rivera's class is taking a bus to the science museum. The bus ride is 3/4 of an hour each way. How many hours will the class spend on the bus in total?";
const Q2 = "Each student needs 2/3 of a cup of trail mix for the trip. If there are 24 students, how many cups of trail mix does the class need?";
const Q3 = "The museum tour lasts 1 1/2 hours. The class arrives at 9:15 a.m., starts the tour right away, and then spends 1/2 hour at lunch after the tour. At what time will lunch end?";
const Q4 = "Tickets cost $8.50 for each student and $12.25 for each adult. If 24 students and 4 adults go, what is the total cost? Explain how you know your answer is reasonable.";
const Q5 = "Jamal says that 2/3 of 24 is bigger than 3/4 of 24 because 3 is bigger than 2. Is Jamal correct? Explain your thinking.";

const DIRECTIONS = "You have 25 minutes, so don't spend too long on any one problem.";

const OBJECTIVES = [
  "Add and multiply fractions and mixed numbers in context",
  "Calculate elapsed time",
  "Multiply decimals (money) and check reasonableness",
  "Compare fractions of a whole number and critique reasoning",
];
const VOCAB = ["fraction", "units", "total", "reasonable"];

export const MATH: Record<NeedId, AdaptedAssignment> = {
  dyslexia: {
    title: "Field Trip Fractions",
    studentIntro: "Five word problems about a class trip. Every number is the same as the original — the words are just easier to track.",
    sections: [
      {
        heading: "Words to know",
        blocks: [
          { type: "vocab", term: "reasonable", syllables: "rea·son·a·ble", definition: "Makes sense. Close to what you would expect." },
          { type: "vocab", term: "units", syllables: "u·nits", definition: "What you are counting or measuring, like hours, cups, or dollars." },
          { type: "tip", text: "Read each problem two times. The second time, underline the numbers you need." },
        ],
      },
      {
        heading: "Directions",
        blocks: [
          { type: "direction", icon: "calc", text: "**Show** all of your work." },
          { type: "direction", icon: "write", text: "**Label** every answer with the correct units." },
          { type: "direction", icon: "check", text: "You have 25 minutes. Try to spend about 5 minutes on each problem." },
        ],
      },
      {
        heading: "Problems",
        purpose: "One fact per line. The question is always the last line.",
        blocks: [
          { type: "question", number: "1", icon: "calc", text: "Ms. Rivera's class is taking a bus to the science museum.\nThe bus ride is 3/4 of an hour each way.\nHow many hours will the class spend on the bus in total?" },
          { type: "question", number: "2", icon: "calc", text: "Each student needs 2/3 of a cup of trail mix for the trip.\nThere are 24 students.\nHow many cups of trail mix does the class need?" },
          { type: "question", number: "3", icon: "calc", text: "The museum tour lasts 1 1/2 hours.\nThe class arrives at 9:15 a.m. and starts the tour right away.\nAfter the tour, they spend 1/2 hour at lunch.\nAt what time will lunch end?" },
          {
            type: "question",
            number: "4",
            icon: "calc",
            text: "Tickets cost $8.50 for each student.\nTickets cost $12.25 for each adult.\n24 students and 4 adults go.\nWhat is the total cost?\nExplain how you know your answer is reasonable.",
            supports: { starters: ["My answer is reasonable because ___."], wordBank: ["about", "close to", "estimate", "reasonable", "round"], responseOptions: ["Write it", "Say it and record it"] },
          },
          {
            type: "question",
            number: "5",
            icon: "think",
            text: "Jamal says that 2/3 of 24 is bigger than 3/4 of 24.\nHe says this is true because 3 is bigger than 2.\nIs Jamal correct?\nExplain your thinking.",
            supports: { starters: ["Jamal is (correct / not correct) because ___."], wordBank: ["bigger", "fraction", "greater", "smaller", "whole"], responseOptions: ["Write it", "Say it and record it"] },
          },
        ],
      },
    ],
    changes: [
      { title: "One fact per line in every problem", detail: "Long word problems are split so each line holds one fact, with the question last. All numbers and wording of the facts are unchanged.", barrier: "Several facts and a question packed into long lines", need: "dyslexia", evidence: "bda-style" },
      { title: "Read-aloud ready", detail: "Problems can be read aloud by text-to-speech or an adult — this is a math assessment, so reading support doesn't change what's measured.", barrier: "Decoding word problems before doing the math", need: "dyslexia", evidence: "tts-meta" },
      { title: "Starters and word banks for the two explanations", detail: "Problems 4 and 5 ask for written reasoning. Starters and a spelling bank keep the focus on the reasoning.", barrier: "Written explanations with spelling demands", need: "dyslexia", evidence: "udl-expression" },
      { title: "Clarified two task words", detail: "\"Reasonable\" and \"units\" are defined, because the directions depend on them.", barrier: "Key direction words that may not be decodable", need: "dyslexia", evidence: "udl-language" },
    ],
    teacherNotes: [
      "Reading the problems aloud is an appropriate accommodation here — the math is what's assessed.",
      "Accept phonetic spelling in the written explanations.",
    ],
    barriers: [
      { quote: "The class arrives at 9:15 a.m., starts the tour right away, and then spends 1/2 hour at lunch after the tour.", issue: "24-word sentence with three time facts to decode and hold at once.", needs: ["dyslexia", "adhd"] },
      { quote: "Explain how you know your answer is reasonable.", issue: "Written explanation with a hard-to-spell key word.", needs: ["dyslexia"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
  },

  adhd: {
    title: "Field Trip Fractions — Work Plan",
    studentIntro: "Five problems, one at a time, about 25 minutes. Use a timer for each one.",
    estimatedMinutes: 25,
    sections: [
      { heading: "Start here", minutes: 1, blocks: [{ type: "direction", icon: "write", text: "**Write** the numbers 1 to 5 down the side of your paper, with space under each." }] },
      {
        heading: "Before you begin",
        blocks: [
          { type: "direction", icon: "calc", text: "**Show** your work for every problem." },
          { type: "direction", icon: "write", text: "**Label** every answer with units (hours, cups, a time, dollars)." },
          { type: "tip", text: "When a problem's timer ends, put a star next to it and move on. Come back to starred problems at the end." },
        ],
      },
      { heading: "Problem 1", minutes: 4, blocks: [{ type: "question", number: "1", icon: "calc", text: Q1 }] },
      { heading: "Problem 2", minutes: 4, blocks: [{ type: "question", number: "2", icon: "calc", text: Q2 }] },
      { heading: "Brain break", minutes: 1, blocks: [{ type: "break", minutes: 1, icon: "move", text: "Stand up, roll your shoulders 5 times, sit back down." }] },
      { heading: "Problem 3", minutes: 5, blocks: [{ type: "question", number: "3", icon: "calc", text: Q3, supports: { hint: "**Underline** each time amount before you start." } }] },
      { heading: "Problem 4", minutes: 5, blocks: [{ type: "question", number: "4", icon: "calc", text: Q4.replace("Explain", "**Explain**"), supports: { length: "Answer + 1–2 sentences" } }] },
      { heading: "Problem 5", minutes: 4, blocks: [{ type: "question", number: "5", icon: "think", text: Q5.replace("Explain", "**Explain**"), supports: { length: "Yes or no + 2 sentences" } }] },
      {
        heading: "Check your work",
        minutes: 1,
        blocks: [
          {
            type: "checklist",
            items: [
              "Every answer has a unit.",
              "Problem 3: my answer is a time of day.",
              "Problem 4: I explained why my total makes sense.",
              "Problem 5: I said yes or no AND why.",
              "I went back to any starred problems.",
            ],
          },
        ],
      },
    ],
    changes: [
      { title: "One problem per timed section", detail: "Each problem gets its own section and time estimate. The total stays at the original 25 minutes.", barrier: "Five problems and a 25-minute limit with no pacing", need: "adhd", evidence: "segmenting" },
      { title: "A concrete rule replaces \"don't spend too long\"", detail: "When the timer ends: star it, move on, come back. The student doesn't have to judge time internally.", barrier: DIRECTIONS, need: "adhd", evidence: "udl-strategy" },
      { title: "A simple first step", detail: "Numbering the paper takes 30 seconds and sets up the workspace.", barrier: "No obvious starting action", need: "adhd", evidence: "udl-strategy" },
      { title: "One short movement break", detail: "Placed after problem 2, with a clear end.", barrier: "Sustained effort across 25 minutes", need: "adhd", evidence: "adhd-classroom" },
      { title: "A self-check list matched to each problem", detail: "Catches the most common slips (missing units, unanswered \"explain\" parts).", barrier: "Two-part problems that are easy to half-finish", need: "adhd", evidence: "self-regulation" },
    ],
    teacherNotes: [
      "A visible timer (or a timer the student controls) makes the per-problem pacing work.",
      "All problem text is unchanged; only the layout and pacing supports were added.",
    ],
    barriers: [
      { quote: DIRECTIONS, issue: "Relies on internal time sense — \"too long\" is not defined.", needs: ["adhd", "autism"] },
      { quote: "Show all of your work and label every answer with the correct units.", issue: "Two standing rules in one sentence that must be remembered across five problems.", needs: ["adhd"] },
      { quote: Q4, issue: "Two tasks in one problem — calculating and explaining.", needs: ["adhd"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
  },

  apd: {
    title: "Field Trip Fractions",
    studentIntro: "All directions and timing are written here, so you don't need to catch them when they're announced.",
    sections: [
      {
        heading: "Directions",
        blocks: [
          { type: "direction", icon: "calc", text: "**Show** all of your work." },
          { type: "direction", icon: "write", text: "**Label** every answer with the correct units." },
          { type: "direction", icon: "look", text: "**Look** at the board for the start time and end time (25 minutes total)." },
          { type: "direction", icon: "check", text: "If a problem takes more than 5 minutes, skip it and come back at the end." },
        ],
      },
      {
        heading: "Problems",
        purpose: "These are exactly as written in the original.",
        blocks: [
          { type: "question", number: "1", icon: "calc", text: Q1 },
          { type: "question", number: "2", icon: "calc", text: Q2 },
          { type: "question", number: "3", icon: "calc", text: Q3 },
          { type: "question", number: "4", icon: "calc", text: Q4 },
          { type: "question", number: "5", icon: "think", text: Q5 },
        ],
      },
    ],
    changes: [
      { title: "Kept every problem exactly as written", detail: "This is a written problem set, so auditory processing isn't the barrier in the problems themselves — rewriting them would add change without benefit.", barrier: "—", need: "apd", evidence: "asha-portal" },
      { title: "Time limit moved from speech to the board", detail: "Start and end times are written where the student can check them, instead of relying on hearing \"five minutes left\".", barrier: DIRECTIONS, need: "apd", evidence: "asha-portal" },
      { title: "Directions split one per line", detail: "The two standing rules (show work, label units) are separate, numbered, and rereadable.", barrier: "Show all of your work and label every answer with the correct units.", need: "apd", evidence: "udl-perception" },
      { title: "Teacher notes for going over answers", detail: "How to review answers without relying on listening alone.", barrier: "Answers usually reviewed out loud", need: "apd", evidence: "asha-capd" },
    ],
    teacherNotes: [
      "Write the start and end time on the board instead of only announcing time warnings.",
      "If you read a problem aloud for the class, make sure the student is looking at the written copy at the same time.",
      "When reviewing answers, write each final answer and its units on the board.",
    ],
    barriers: [
      { quote: "You have 25 minutes", issue: "Time limits and time warnings are usually given out loud.", needs: ["apd"] },
      { quote: "Show all of your work and label every answer with the correct units.", issue: "Two standing rules, often also said aloud once at the start.", needs: ["apd", "adhd"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
  },

  autism: {
    title: "Field Trip Fractions",
    studentIntro: "This assignment has 4 parts in this order: What this is about, What to do, The work, When you finish.",
    estimatedMinutes: 25,
    sections: [
      { heading: "What this is about", blocks: [{ type: "text", text: "You will solve 5 word problems about a class field trip. The problems use fractions, time, and money." }] },
      {
        heading: "What to do",
        blocks: [
          {
            type: "expectations",
            items: [
              "What I will do: Solve 5 problems.",
              "How much: For every problem, show the math and write the answer with units. Problems 4 and 5 also need 1–3 written sentences.",
              "How long: 25 minutes total, about 5 minutes for each problem.",
              "I am finished when: all 5 problems have an answer with units.",
              "Then I will: hand my paper to the teacher.",
            ],
          },
          { type: "direction", icon: "check", text: "If a problem is not done after 5 minutes, put a star next to it, go to the next problem, and come back at the end." },
        ],
      },
      {
        heading: "The work",
        blocks: [
          {
            type: "example",
            text: "Example of explaining why an answer is reasonable (different problem): 19 pencils cost $0.95 each. What is the total cost?",
            items: ["Answer: 19 × $0.95 = $18.05.", "Reasonable? 19 is close to 20 and $0.95 is close to $1. 20 × $1 = $20. $18.05 is close to $20, so my answer makes sense."],
          },
          { type: "question", number: "1", icon: "calc", text: Q1, supports: { length: "Show the math + answer in hours" } },
          { type: "question", number: "2", icon: "calc", text: Q2, supports: { length: "Show the math + answer in cups" } },
          { type: "question", number: "3", icon: "calc", text: Q3, supports: { length: "Show the math + answer as a time (a.m. or p.m.)" } },
          { type: "question", number: "4", icon: "calc", text: "Tickets cost $8.50 for each student and $12.25 for each adult. If 24 students and 4 adults go, what is the total cost? Write 1–2 sentences that show how you checked that your answer is reasonable.", supports: { length: "Show the math + answer in dollars + 1–2 sentences" } },
          {
            type: "question",
            number: "5",
            icon: "think",
            text: Q5,
            supports: {
              length: "Yes or no + math + 2 sentences",
              steps: ["Write yes or no: is Jamal correct?", "Show math that proves your answer.", "Write 1–2 sentences that explain why Jamal's reason works or does not work."],
            },
          },
        ],
      },
      {
        heading: "When you finish",
        blocks: [{ type: "checklist", items: ["All 5 problems have an answer with units.", "I went back to any starred problems.", "I handed my paper to the teacher."] }],
      },
    ],
    changes: [
      { title: "Replaced \"don't spend too long\" with an exact rule", detail: "About 5 minutes per problem; if not finished, star it, move on, return at the end.", barrier: DIRECTIONS, need: "autism", evidence: "figurative" },
      { title: "Stated exactly what each answer needs", detail: "Units for each problem and the number of sentences for the two explanations.", barrier: "\"Explain\" with no length", need: "autism", evidence: "teacch" },
      { title: "A model of a \"reasonable\" check", detail: "Shows what checking reasonableness looks like using a different problem, without solving any real one.", barrier: "Implicit expectation in \"how you know your answer is reasonable\"", need: "autism", evidence: "ncaep" },
      { title: "Structured the critique question", detail: "Problem 5 asks the student to evaluate someone else's reasoning. Steps make the parts explicit; the student still does the math and the reasoning.", barrier: "Open-ended judgement of another person's claim", need: "autism", evidence: "ncaep" },
      { title: "The same four-part layout", detail: "Predictable order every time.", barrier: "No visible structure", need: "autism", evidence: "teacch" },
    ],
    teacherNotes: [
      "If the class will review answers together afterward, tell the student in advance when that will happen.",
      "\"Each way\" in problem 1 is part of the problem-solving and was left as written; clarify only if the student asks what the phrase means.",
    ],
    barriers: [
      { quote: "don't spend too long on any one problem", issue: "\"Too long\" is not defined — no exact rule to follow.", needs: ["autism", "adhd"] },
      { quote: "Explain how you know your answer is reasonable.", issue: "Unstated expectation about what counts as showing reasonableness.", needs: ["autism"] },
      { quote: "Explain your thinking.", issue: "No stated length or format.", needs: ["autism"] },
    ],
    preserved: { objectives: OBJECTIVES, vocabulary: VOCAB },
    languageReplacements: [
      { original: "don't spend too long on any one problem", replacement: "spend about 5 minutes on each problem; if not done, star it and come back at the end" },
      { original: "Explain how you know your answer is reasonable", replacement: "Write 1–2 sentences that show how you checked that your answer is reasonable" },
    ],
  },
};
