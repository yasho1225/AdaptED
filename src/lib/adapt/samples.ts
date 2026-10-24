/**
 * Sample assignments of increasing complexity, written for AdaptED.
 * The Gettysburg Address (1863) is in the public domain.
 */

export interface SampleAssignment {
  id: "science" | "math" | "ela";
  label: string;
  subject: string;
  grade: string;
  blurb: string;
  text: string;
}

export const SAMPLES: SampleAssignment[] = [
  {
    id: "science",
    label: "Photosynthesis & food chains",
    subject: "Science",
    grade: "7",
    blurb: "Dense reading, multi-part questions, a partner discussion",
    text: `Photosynthesis and Ecosystems

Read the passage carefully, then answer the questions that follow in complete sentences.

Every living thing needs energy, and for almost every ecosystem on Earth that energy starts with photosynthesis. Photosynthesis is the process plants, algae, and some bacteria use to convert light energy into chemical energy stored in glucose. Inside the chloroplasts of leaf cells, the pigment chlorophyll absorbs sunlight; the plant then uses that energy to combine carbon dioxide from the air with water from the soil, producing glucose and releasing oxygen as a byproduct.

The glucose a plant makes is the foundation of the food chain. When a rabbit eats clover, it takes in the energy the clover stored, and when a fox eats the rabbit, some of that energy moves up the chain again. Without producers, consumers would have no source of energy at all. In a nutshell, photosynthesis is the engine that keeps the whole ecosystem running.

1. What are the inputs (reactants) and outputs (products) of photosynthesis?
2. Where in the plant cell does photosynthesis take place, and what pigment captures the light energy?
3. Explain why a fox depends on photosynthesis even though it never eats plants.
4. Which of the following is a producer?
A. Fox
B. Rabbit
C. Clover
D. Mushroom
5. Discuss with a partner: predict what would happen to the rabbits and foxes if a disease killed most of the clover. Briefly explain your reasoning.`,
  },
  {
    id: "math",
    label: "Field-trip fraction problems",
    subject: "Math",
    grade: "5",
    blurb: "Multi-step word problems, time limit, reasoning questions",
    text: `Field Trip Fractions

Show all of your work and label every answer with the correct units. You have 25 minutes, so don't spend too long on any one problem.

1. Ms. Rivera's class is taking a bus to the science museum. The bus ride is 3/4 of an hour each way. How many hours will the class spend on the bus in total?
2. Each student needs 2/3 of a cup of trail mix for the trip. If there are 24 students, how many cups of trail mix does the class need?
3. The museum tour lasts 1 1/2 hours. The class arrives at 9:15 a.m., starts the tour right away, and then spends 1/2 hour at lunch after the tour. At what time will lunch end?
4. Tickets cost $8.50 for each student and $12.25 for each adult. If 24 students and 4 adults go, what is the total cost? Explain how you know your answer is reasonable.
5. Jamal says that 2/3 of 24 is bigger than 3/4 of 24 because 3 is bigger than 2. Is Jamal correct? Explain your thinking.`,
  },
  {
    id: "ela",
    label: "Gettysburg Address close reading",
    subject: "English / History",
    grade: "10",
    blurb: "Primary source, figurative language, analytical writing",
    text: `Close Reading: The Gettysburg Address (1863)

As we discussed in class, Lincoln gave this speech at the dedication of a cemetery for Union soldiers four months after the Battle of Gettysburg. Annotate the text as you read, then answer the questions. Be sure to back up your claims with evidence from the text.

"Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.

Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.

But, in a larger sense, we can not dedicate—we can not consecrate—we can not hallow—this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us—that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion—that we here highly resolve that these dead shall not have died in vain—that this nation, under God, shall have a new birth of freedom—and that government of the people, by the people, for the people, shall not perish from the earth."

1. "Four score and seven years ago" refers to what year, and what event happened then? Show how you calculated it.
2. Lincoln uses images of birth, life, and death throughout the speech (for example, "conceived" and "a new birth of freedom"). Explain how this extended metaphor supports his purpose.
3. Lincoln says, "The world will little note, nor long remember what we say here." Explain the irony in this line.
4. What does Lincoln argue is the "unfinished work" that the living must take on? Use at least two pieces of evidence from the text.
5. In one paragraph, analyze how Lincoln uses repetition (such as "we can not dedicate—we can not consecrate—we can not hallow") to persuade his audience.`,
  },
];

export function findSample(text: string): SampleAssignment | undefined {
  const t = text.trim();
  return SAMPLES.find((s) => s.text.trim() === t);
}
