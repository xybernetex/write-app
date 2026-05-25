import type { Criterion } from "./cloudflare-ai";

// One prompt-attempt within a stage — each stage has 5 of these, all different material
export type ExerciseVariant = {
  given?: string; // Source material to transform/respond to
  prompt: string; // Specific instruction for this attempt
};

// One round within an exercise — 3 rounds per exercise, each stricter than the last
export type ExerciseStage = {
  label: string;
  variants: ExerciseVariant[]; // 5 distinct prompts — must pass each to advance
  criteria: Criterion[];
  passThreshold: number; // 50 → 65 → 75 (out of 100)
  wordCountMin: number;
  wordCountMax: number;
};

export type Exercise = {
  id: string;
  title: string;
  lesson: string;
  given?: string;   // For non-staged exercises only
  prompt: string;   // Fallback when no stages
  wordCountMin: number;
  wordCountMax: number;
  criteria: Criterion[];
  stages?: ExerciseStage[];
  exampleResponse?: string;
};

export type Track = {
  id: string;
  title: string;
  description: string;
  genre: "nonfiction" | "fiction" | "grammar";
  difficulty: "beginner" | "intermediate" | "advanced";
  exercises: Exercise[];
};

export const tracks: Track[] = [
  {
    id: "fiction-first-lines",
    title: "Fiction First Lines",
    genre: "fiction",
    difficulty: "beginner",
    description:
      "The first sentence of a story is a contract with the reader. It tells them what kind of experience they're about to have and whether it's worth their time. In this track you'll write six different kinds of fiction openings and get scored against the criteria editors and agents use.",
    exercises: [
      {
        id: "fl1",
        title: "A Character Doing Something",
        lesson:
          "The most reliable opening in fiction is a specific person doing a specific thing. It establishes immediately: there is a person, they have a body, they are in the world, time is passing. The action should be just strange enough to create a question. 'Gregor Samsa woke one morning from uneasy dreams to find himself transformed into an enormous insect.' A person. An action. A problem. Done.",
        prompt:
          "Write a fiction first line (1 sentence, 10–30 words) that opens with a character doing something specific. The action should make the reader ask 'why?' or 'what next?' No dialogue. No description of appearance.",
        wordCountMin: 8,
        wordCountMax: 35,
        criteria: [
          { name: "Person doing something", description: "Subject is a character, predicate is a specific action — not a description or a state of being.", weight: 0.4 },
          { name: "Creates a question", description: "Something about the action implies a situation we don't yet understand — the reader is pulled forward.", weight: 0.4 },
          { name: "Under 30 words", description: "One sentence, maximum 30 words.", weight: 0.2 },
        ],
      },
      {
        id: "fl2",
        title: "The World in a Detail",
        lesson:
          "Some openings establish setting before character — but the best ones do it through a single telling detail, not a panoramic description. 'It was a bright cold day in April, and the clocks were striking thirteen.' One wrong detail tells you everything: this world looks like ours but isn't. The goal is a detail that makes the world legible but slightly unfamiliar.",
        prompt:
          "Write a fiction opening (1–2 sentences, 15–40 words) that establishes a world through a single specific detail. The detail should be concrete and signal what kind of story this is — genre, tone, era — without spelling it out.",
        wordCountMin: 12,
        wordCountMax: 45,
        criteria: [
          { name: "One specific concrete detail", description: "Not 'a strange city' but an actual thing in that city — specific enough to picture.", weight: 0.5 },
          { name: "Detail signals the world", description: "A reader can make educated guesses about genre or tone from this detail alone.", weight: 0.3 },
          { name: "Not a panoramic description", description: "One thing in focus — not a three-detail establishing shot.", weight: 0.2 },
        ],
      },
      {
        id: "fl3",
        title: "Voice as the Hook",
        lesson:
          "In first-person and close-third narration, the narrator's voice can be the entire reason to read on. This works when the voice is distinct, funny, damaged, or wise in some particular way. 'Call me Ishmael.' 'Happy families are all alike; every unhappy family is unhappy in its own way.' The voice promises a specific experience. No major plot event is needed — the voice itself is the event.",
        prompt:
          "Write a fiction opening (2–3 sentences, 30–60 words) where the narrator's voice is the hook. The narrator should have a distinct personality that comes through in word choice and rhythm alone. No major plot event needs to happen.",
        wordCountMin: 25,
        wordCountMax: 70,
        criteria: [
          { name: "Distinct voice", description: "The narrator sounds like a specific person, not a generic narrator — their word choices and rhythm are theirs alone.", weight: 0.5 },
          { name: "Voice carries information", description: "We learn something about the narrator's personality or worldview from how they speak.", weight: 0.3 },
          { name: "Creates desire to spend time with this narrator", description: "After reading, you want more of this voice.", weight: 0.2 },
        ],
      },
      {
        id: "fl4",
        title: "In the Middle of It",
        lesson:
          "In medias res — starting in the middle of action — is one of the oldest techniques in fiction. The risk is disorientation; the reward is momentum. The key: the reader should feel the action before they understand it. They're running before they know why. Don't over-explain. Drop us in and let the situation become clear through accumulation.",
        prompt:
          "Write a fiction opening (3–4 sentences, 40–80 words) that drops the reader into the middle of something already happening. No setup. No backstory. We need action and physical sensation. The reader should be productively disoriented — pulled forward, not lost.",
        wordCountMin: 35,
        wordCountMax: 90,
        criteria: [
          { name: "Action is already in progress", description: "Something is happening when the story starts — we are not being told about it before it begins.", weight: 0.5 },
          { name: "Sensory grounding", description: "The action has physical texture — what it feels, sounds, or looks like to be in this moment.", weight: 0.3 },
          { name: "Disorientation is productive", description: "The reader doesn't fully understand what's happening but wants to — they're pulled forward, not confused and bored.", weight: 0.2 },
        ],
      },
      {
        id: "fl5",
        title: "The Subverted Expectation",
        lesson:
          "The best first lines often set up an expectation and immediately crack it. 'It was a bright cold day in April' — ordinary. 'and the clocks were striking thirteen' — not. The subversion is the hook. You build the frame, then break it. The crack can be tonal, logical, physical, or social. The key is precision: the wrong detail has to be the right kind of wrong.",
        prompt:
          "Write a fiction first line (1–2 sentences, 15–40 words) that establishes an expectation and subverts it in the same breath. The subversion should be specific, not random.",
        wordCountMin: 12,
        wordCountMax: 45,
        criteria: [
          { name: "Expectation is established", description: "The opening sets up a recognizable situation, genre, or tone.", weight: 0.4 },
          { name: "Subversion is specific", description: "The crack is a precise wrong detail — not vague strangeness, but one exact thing that shouldn't be there.", weight: 0.4 },
          { name: "Happens in the same breath", description: "The turn happens within the 1–2 sentence window — not pages later.", weight: 0.2 },
        ],
      },
      {
        id: "fl6",
        title: "Rewrite the Cliché Opening",
        lesson:
          "Editors recognize dead openings on sight: 'It was a dark and stormy night.' 'She woke up to the sound of her alarm.' 'He had never expected this to happen.' Any opening with 'always' or 'never' in the first sentence. These aren't just bad — they're invisible. Your job: take the most clichéd possible premise and find the original entry point. Use any technique from this track.",
        prompt:
          "Rewrite this opening — make it good: 'Sarah woke up on a Monday morning and realized today was going to be different.' Use any technique from this track. 20–60 words.",
        wordCountMin: 15,
        wordCountMax: 70,
        criteria: [
          { name: "Clichés eliminated", description: "No 'woke up,' no vague 'something different,' no passive observation of the obvious.", weight: 0.35 },
          { name: "Uses a deliberate technique", description: "The rewrite uses one of the track's methods: character in action, world detail, voice, in medias res, or subversion.", weight: 0.35 },
          { name: "Stronger than the original", description: "Demonstrably more compelling — a reader would turn the page.", weight: 0.3 },
        ],
      },
    ],
  },

  // ── NONFICTION: FINDING YOUR VOICE ──────────────────────────────────────

  {
    id: "writing-dialogue",
    title: "Writing Dialogue",
    genre: "fiction",
    difficulty: "beginner",
    description:
      "Dialogue is the fastest way to establish character, advance plot, and create tension simultaneously. Most beginners write dialogue that sounds like speeches. This track teaches you to write the way people actually talk — which is to say, almost never directly.",
    exercises: [
      {
        id: "d1",
        title: "Nobody Says What They Mean",
        lesson:
          "Real dialogue is almost never direct. People talk around things. They deflect, hedge, change the subject, answer a different question than was asked. In fiction, the subtext — what's NOT being said — is where the power lives. Two people arguing about where to eat dinner are almost never arguing about where to eat dinner. Write the surface. Trust the reader to see beneath it.",
        prompt:
          "Write a dialogue scene (4–8 lines of dialogue, 60–120 words total) between two people where neither says what they actually mean. The subtext should be clear to the reader even though neither character names it.",
        wordCountMin: 55,
        wordCountMax: 130,
        criteria: [
          { name: "Neither speaker says what they mean", description: "The surface conversation is about something other than the real issue — and the gap is consistent.", weight: 0.5 },
          { name: "Subtext is readable", description: "The reader can tell what's actually going on underneath the surface conversation.", weight: 0.3 },
          { name: "Dialogue sounds natural", description: "People talk like people, not like characters demonstrating a craft concept.", weight: 0.2 },
        ],
      },
      {
        id: "d2",
        title: "Two Voices",
        lesson:
          "Every character should sound different from every other character. The way someone talks encodes their education, background, mood, and relationship to the person they're talking to. If you cover the dialogue tags and can't tell who's speaking, the dialogue is failing. Two characters who are instantly distinguishable by word choice, rhythm, and what they choose to say — that's the goal.",
        prompt:
          "Write a conversation (8–12 lines, 80–150 words) between two characters who sound completely different. No description of how they speak — only the words themselves. A reader should be able to identify each speaker without dialogue tags.",
        wordCountMin: 75,
        wordCountMax: 165,
        criteria: [
          { name: "Voices are distinguishable", description: "Without tags, the two speakers are clearly different — vocabulary, rhythm, sentence length, and subject matter all vary.", weight: 0.6 },
          { name: "Distinction comes from the words", description: "The difference is in what they say and how they say it — not in action tags describing their manner.", weight: 0.2 },
          { name: "Still sounds like a real conversation", description: "The exchange has the organic quality of two people actually talking.", weight: 0.2 },
        ],
      },
      {
        id: "d3",
        title: "The Escalating Argument",
        lesson:
          "Good argument dialogue escalates. Each line raises the stakes slightly — a new accusation, a defense that accidentally reveals something, a silence that lands wrong. The trap is writing arguments that stay at the same temperature throughout. Real arguments have rhythm: advance, retreat, escalate, pause, detonate. The scene should feel like it could end at any moment — but doesn't.",
        prompt:
          "Write an argument (8–12 lines, 80–150 words) between two people where each exchange escalates the tension slightly. End at a higher temperature than you started.",
        wordCountMin: 75,
        wordCountMax: 165,
        criteria: [
          { name: "Escalates", description: "Each exchange raises the emotional stakes — the argument is worse at the end than at the start.", weight: 0.5 },
          { name: "Escalation comes from what's revealed", description: "It gets worse because something new is said or admitted, not just because people get louder.", weight: 0.3 },
          { name: "Has rhythm", description: "The escalation isn't monotonically linear — there are brief retreats or pauses before the next rise.", weight: 0.2 },
        ],
      },
      {
        id: "d4",
        title: "What the Body Says",
        lesson:
          "Dialogue doesn't exist in a vacuum — it happens while people do things with their bodies. Action beats (what a character does while speaking, or between lines) can carry as much information as the dialogue itself. 'He handed her the letter' before a line of dialogue changes every word that follows. Used well, action beats make dialogue physically real and reveal character simultaneously.",
        prompt:
          "Write a dialogue scene (6–10 lines, 80–140 words) where the action beats carry as much weight as the words. The physical behavior of the characters should reveal something the dialogue doesn't state outright.",
        wordCountMin: 75,
        wordCountMax: 155,
        criteria: [
          { name: "Action beats are specific", description: "What characters do with their bodies is precise and visual — not generic ('he said, smiling').", weight: 0.4 },
          { name: "Action reveals subtext", description: "The physical behavior tells us something the words don't — the two tracks carry different information.", weight: 0.4 },
          { name: "Balance between words and action", description: "The scene isn't all action with minimal dialogue, or all dialogue with minimal action.", weight: 0.2 },
        ],
      },
      {
        id: "d5",
        title: "The Meaningful Silence",
        lesson:
          "What a character doesn't say is often more powerful than what they do. Silence in dialogue can be a beat, a non-answer, a subject change, or a response to a completely different question than was asked. The pause or deflection can reveal more than any line of speech. This is one of the hardest dialogue skills — the scene has to be structured around the silence, not past it.",
        prompt:
          "Write a dialogue scene (6–10 exchanges, 80–140 words) where one character's silence or non-answer is the most important 'line' in the scene. The silence should change how we understand everything around it.",
        wordCountMin: 75,
        wordCountMax: 155,
        criteria: [
          { name: "Silence or non-answer is present", description: "One character clearly doesn't answer what they were asked — the gap is deliberate, not an omission.", weight: 0.4 },
          { name: "Silence is meaningful", description: "The non-answer changes our understanding of the scene, the character, or the relationship.", weight: 0.4 },
          { name: "Scene is structured around it", description: "The dialogue builds toward the silence — it's the destination, not an accident.", weight: 0.2 },
        ],
      },
    ],
  },
  // ── FICTION: CHARACTER VOICE ─────────────────────────────────────────────

  {
    id: "character-voice",
    title: "Character Voice",
    genre: "fiction",
    difficulty: "beginner",
    description:
      "A character's voice is how they see the world — their vocabulary, their preoccupations, their blind spots. This track teaches you to create narrators and characters who sound unmistakably like themselves.",
    exercises: [
      {
        id: "cv-1",
        title: "One Event, Three Voices",
        lesson:
          "The same event narrated by different characters produces completely different stories. Each character notices different things, uses different language, draws different conclusions. Voice is not just style — it's perception. Two characters who witness the same car accident will literally see different things based on who they are.",
        prompt:
          "A glass of wine gets knocked off a dinner table. Write three 40–60 word descriptions of this moment — one from the person who knocked it over, one from the host, one from a child at the table. Each must sound completely different. No dialogue.",
        wordCountMin: 110,
        wordCountMax: 200,
        criteria: [
          { name: "Three distinct voices", description: "Each section sounds like a clearly different person — different vocabulary, different focus, different emotional register.", weight: 0.6 },
          { name: "Same event, different perception", description: "All three describe the same moment, but notice and prioritize different things.", weight: 0.3 },
          { name: "No dialogue", description: "Voices expressed through narration and observation, not speech.", weight: 0.1 },
        ],
      },
      {
        id: "cv-2",
        title: "The Unreliable Detail",
        lesson:
          "An unreliable narrator doesn't announce themselves. They reveal themselves through what they notice, what they get wrong, and what they insist on that doesn't quite add up. The craft: plant the unreliability in the narration itself — the reader suspects before they're sure. The best unreliable narrators believe everything they're saying.",
        prompt:
          "Write 100–180 words from the point of view of someone describing why a friendship ended — but make it subtly clear to the reader that the narrator isn't telling the full story. Don't have the narrator say they're hiding anything. Let it leak through what they emphasize or avoid.",
        wordCountMin: 90,
        wordCountMax: 200,
        criteria: [
          { name: "Narrator seems credible on the surface", description: "The narrator believes their version — they're not obviously lying.", weight: 0.3 },
          { name: "Unreliability leaks through", description: "A careful reader can sense something is off — an over-emphasis, a deflection, an inconsistency.", weight: 0.5 },
          { name: "Never announced", description: "The word 'lie,' 'hide,' or any explicit signal of unreliability never appears.", weight: 0.2 },
        ],
      },
      {
        id: "cv-3",
        title: "Voice Under Pressure",
        lesson:
          "A character's voice under pressure reveals who they really are. The language people reach for in crisis is different from their everyday register — it compresses, repeats, skips, or becomes oddly calm when it should be frantic. Pressure makes voice honest. Write characters in crisis and their voice will write itself.",
        prompt:
          "Write 100–160 words from the first-person perspective of someone who has just been told they didn't get the job they expected to get. We're in their head in the first few minutes after hearing the news. No other character speaks. The voice should change as the news settles in.",
        wordCountMin: 90,
        wordCountMax: 180,
        criteria: [
          { name: "Immediate psychological reality", description: "The interior voice feels like what it's actually like to receive bad news — not a composed reflection on it.", weight: 0.45 },
          { name: "Voice shifts as the news settles", description: "The register changes across the piece — denial, shock, bitterness, or whatever feels true — not static.", weight: 0.4 },
          { name: "Distinctive diction", description: "The narrator has a particular way of speaking — their vocabulary and sentence structure are theirs alone.", weight: 0.15 },
        ],
      },
      {
        id: "cv-4",
        title: "The Narrator Reveals Themselves",
        lesson:
          "The most interesting thing a first-person narrator can do is reveal something about themselves that they don't intend to reveal. They think they're telling you about someone else. But we learn more about the narrator than about the subject. This is called 'inadvertent self-portrait' — the narrator's blind spots, biases, and preoccupations become the actual subject.",
        prompt:
          "Write 120–200 words in first person: a narrator describes a person they claim to dislike. But through the way they describe this person — the details they notice, the things they return to — we can tell the narrator is actually envious or secretly admiring. The word 'jealous' or 'admire' must not appear.",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "Surface is hostile or dismissive", description: "The narrator says they dislike or look down on this person.", weight: 0.25 },
          { name: "Subtext reveals admiration or envy", description: "The details chosen, the things returned to, the intensity — all suggest a different underlying feeling.", weight: 0.55 },
          { name: "Never named directly", description: "'Jealous,' 'envy,' 'admire,' or equivalents do not appear.", weight: 0.2 },
        ],
      },
      {
        id: "cv-5",
        title: "Age in the Voice",
        lesson:
          "A twelve-year-old narrator and a sixty-year-old narrator should not sound remotely alike — even if they're describing the same event. Age shapes vocabulary, reference points, what seems normal, what feels threatening, what is taken for granted. Voice that is age-specific is much harder to write than we think, because our default voice is always our own age.",
        prompt:
          "Write the same scene twice (70–110 words each): a grandparent visiting a grandchild for the first time in two years. First from the grandchild's perspective (age 9), then from the grandparent's (age 72). Each voice must be genuinely age-appropriate — in vocabulary, in what they notice, in what matters.",
        wordCountMin: 130,
        wordCountMax: 240,
        criteria: [
          { name: "Child's voice is genuinely 9 years old", description: "Vocabulary, preoccupations, and syntax feel like a 9-year-old — not a small adult.", weight: 0.35 },
          { name: "Elder's voice is genuinely 72", description: "The grandparent's narration has the texture of age — in what they notice, what they feel, how they speak to themselves.", weight: 0.35 },
          { name: "The same scene, two worlds", description: "Both versions cover the same reunion but feel like entirely different events because of whose eyes we're in.", weight: 0.3 },
        ],
      },
    ],
  },

  // ── FICTION: SETTING & ATMOSPHERE ────────────────────────────────────────

  {
    id: "setting-atmosphere",
    title: "Setting & Atmosphere",
    genre: "fiction",
    difficulty: "beginner",
    description:
      "Place in fiction isn't backdrop — it's argument. The right setting creates pressure, meaning, and mood before a character speaks. This track teaches you to build worlds through detail, not description.",
    exercises: [
      {
        id: "sa-1",
        title: "One Room",
        lesson:
          "The discipline of one room: describe a space so specifically that the reader knows the kind of person who lives or works there before anyone enters. The room is a character. Every object in it was chosen by someone. The accumulation of those choices — what is there, what is missing, what is where — builds a portrait without a person present.",
        prompt:
          "Write 100–180 words describing a room with no one in it. By the end, the reader should be able to make specific guesses about who lives there — their age, their state of mind, what they're running from or toward. Don't name the person or explain the room.",
        wordCountMin: 90,
        wordCountMax: 200,
        criteria: [
          { name: "Room is specific", description: "Contains real, particular objects — not 'furniture' but a specific piece; not 'some books' but what kind.", weight: 0.35 },
          { name: "Room implies its occupant", description: "A reader could make reasonable guesses about the person from the space alone.", weight: 0.45 },
          { name: "No occupant named or explained", description: "The person does not appear in the description, and the writer doesn't explain what the room 'means.'", weight: 0.2 },
        ],
      },
      {
        id: "sa-2",
        title: "The Detail That Carries the Tone",
        lesson:
          "Atmosphere isn't achieved through adjectives ('it was a gloomy night') — it's achieved through the right specific detail. One wrong detail does more tonal work than a paragraph of mood-setting. 'The clocks were striking thirteen' signals wrongness more powerfully than any amount of 'eerie' or 'unsettling.' The principle: find the one detail that does all the atmospheric work.",
        prompt:
          "Write a 60–100 word scene set in two versions: (1) the same space feels threatening, (2) the same space feels safe. Use only one different detail between the two versions — everything else stays the same. The changed detail must do all the tonal work.",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "Both versions present", description: "Two clearly labeled versions of the same scene.", weight: 0.2 },
          { name: "Only one detail changes", description: "All other elements are identical — the tonal shift comes from a single changed element.", weight: 0.4 },
          { name: "The detail does the work", description: "The changed detail is strong enough to shift the entire feel of the scene.", weight: 0.4 },
        ],
      },
      {
        id: "sa-3",
        title: "Weather Without Cliché",
        lesson:
          "'It was a dark and stormy night.' Pathetic fallacy — using weather to mirror human emotion — is one of the oldest tools in fiction, and one of the most abused. The rule: weather can contribute to atmosphere, but it cannot be the atmosphere. The storm isn't the grief. The character is. Weather should create conditions, not announce feelings.",
        prompt:
          "Write 80–140 words of a scene in which the weather is present but NOT used as an emotional mirror for the main character's state. The weather should create physical conditions that affect the character, without being symbolic commentary on their inner life.",
        wordCountMin: 75,
        wordCountMax: 155,
        criteria: [
          { name: "Weather is present", description: "The scene contains specific weather.", weight: 0.2 },
          { name: "Weather creates conditions, not symbols", description: "The weather affects what characters can do, see, or feel physically — it isn't a metaphor for their emotions.", weight: 0.55 },
          { name: "Weather is specific", description: "Not just 'it was raining' — specific sensory details of the weather condition.", weight: 0.25 },
        ],
      },
      {
        id: "sa-4",
        title: "Place as Pressure",
        lesson:
          "The most powerful use of setting in fiction is when the place itself creates pressure on the characters — where being in this specific space makes the conflict more intense, harder to escape, or more meaningful. A difficult conversation in a church, a courtroom, a crowded elevator, a childhood home — the place amplifies the human situation.",
        prompt:
          "Write 120–200 words of a scene in which two characters have an unresolved tension between them, and the specific place they're in makes that tension harder to resolve or harder to ignore. The setting should be doing active work — not just backdrop.",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "Setting is specific and present", description: "We know exactly where we are — the place has physical detail.", weight: 0.25 },
          { name: "Setting creates pressure", description: "The specific location makes the situation more intense, more confined, or more meaningful.", weight: 0.5 },
          { name: "Tension is shown, not told", description: "We feel the unresolved tension through action and dialogue, not through 'there was tension between them.'", weight: 0.25 },
        ],
      },
      {
        id: "sa-5",
        title: "The Establishing Scene",
        lesson:
          "The establishing scene is the first sustained look at a world. It sets up what's normal before it can be violated. The trap is trying to show everything at once — the result is an inventory. The craft is selection: which two or three details establish the world's rules, its mood, its particular flavor? Start small and let the world expand from there.",
        prompt:
          "Write an establishing scene (120–200 words) for a story set in a world that is slightly wrong — not obviously fantastical, but subtly off from our own reality. Establish what is normal in this world through specific, concrete detail. The wrongness should feel matter-of-fact, not announced.",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "World is established through specifics", description: "The scene contains concrete details that establish what is normal in this world.", weight: 0.35 },
          { name: "Wrongness is matter-of-fact", description: "The off-note detail is presented as ordinary within the world — no character comments on its strangeness.", weight: 0.45 },
          { name: "Scene creates a habitable world", description: "After reading, the reader has a real sense of what it would be like to exist in this place.", weight: 0.2 },
        ],
      },
    ],
  },

  // ── FICTION: SHOW DON'T TELL ─────────────────────────────────────────────

  {
    id: "show-dont-tell",
    title: "Show Don't Tell",
    genre: "fiction",
    difficulty: "intermediate",
    description:
      "The most taught, least understood rule in fiction. This track cuts through the cliché and teaches the actual craft: how to externalize interior states, render character through action, and let the reader do the work.",
    exercises: [
      {
        id: "sdt-1",
        title: "Emotion Without the Label",
        lesson:
          "Telling: 'She was furious.' Showing: rendering the physical, behavioral, and psychological reality of fury so the reader feels it without being told the word. The key: every emotion has a specific, observable expression — in the body, in behavior, in speech, in what the character notices. 'Angry' is a category. Find the specific animal inside it.",
        prompt:
          "Write 80–140 words in which a character is ashamed — but the word 'shame,' 'ashamed,' 'embarrassed,' or 'humiliated' never appears. Show us the shame through what the character does, says, avoids, or thinks. A reader should be able to name the emotion from your writing.",
        wordCountMin: 75,
        wordCountMax: 155,
        criteria: [
          { name: "Emotion word absent", description: "'Shame,' 'ashamed,' 'embarrassment,' 'humiliation,' and close synonyms do not appear.", weight: 0.35 },
          { name: "Emotion is readable", description: "A reader could name 'shame' from the passage without being told.", weight: 0.45 },
          { name: "Shown through specific behavior", description: "The shame manifests in concrete, observable actions or physical sensations — not in abstract internal states.", weight: 0.2 },
        ],
      },
      {
        id: "sdt-2",
        title: "Character Through Action",
        lesson:
          "Who a character is should emerge from what they do, not from how they are described. 'She was generous' is a report. 'She gave the last of her coffee to the stranger at the bus stop without being asked' is a scene. The action contains the character. Find the action that is so specifically this person that no one else would do it quite that way.",
        prompt:
          "Write 100–160 words in which a character's personality is revealed entirely through their actions in a mundane situation — waiting in line, unpacking groceries, making a phone call. No description of their personality. No thoughts about who they are. Just behavior.",
        wordCountMin: 90,
        wordCountMax: 180,
        criteria: [
          { name: "No direct personality description", description: "The writer never labels the character's traits — no 'she was' followed by an adjective.", weight: 0.4 },
          { name: "Actions reveal a specific person", description: "The behavior is particular enough that we can make real inferences about who this person is.", weight: 0.45 },
          { name: "Situation is mundane", description: "The scene is ordinary — not a dramatic moment that forces revelation.", weight: 0.15 },
        ],
      },
      {
        id: "sdt-3",
        title: "Relationship in a Scene",
        lesson:
          "The history of a relationship can be shown in a brief scene through what the characters don't have to explain to each other, what they avoid, and the shortcuts they take. Two people who have been together for twenty years behave differently than two people on a third date — even if they're just passing the salt. The scene is carrying all that history in its texture.",
        prompt:
          "Write a scene (120–200 words) between two characters. Without stating anything about their history, the scene should make clear whether this is a new relationship or a long one, and whether it is loving or strained. The reader should be able to identify both.",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "History not stated but implied", description: "No 'they had been married for twenty years' or 'they'd only just met' — the reader infers it.", weight: 0.4 },
          { name: "Dynamic is readable", description: "A reader could say with confidence whether this relationship is new or established, warm or cold.", weight: 0.45 },
          { name: "Scene carries the weight naturally", description: "The relationship history feels embedded in how they speak and move, not inserted artificially.", weight: 0.15 },
        ],
      },
      {
        id: "sdt-4",
        title: "Rewrite the Summary",
        lesson:
          "Summary tells us what happened or what is true. Scene shows us. The craft skill is knowing when to convert summary into scene — when the moment is important enough to be lived in rather than reported. The rewrite exercise: take a summary paragraph and find the scene that would do the same work more powerfully.",
        prompt:
          "Rewrite this summary as a scene (120–200 words). Keep all the information but render it in real time, with action and dialogue. Original: 'Over the years, Jack and his father had developed a habit of avoiding serious conversations by talking about baseball. Whenever something difficult came up, one of them would change the subject, and the other would let it happen. Their relationship was warm but built on distance they had both agreed not to examine.'",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "Summary is rendered as scene", description: "A specific moment in time, not a compressed account of patterns over time.", weight: 0.35 },
          { name: "Original information is preserved", description: "The avoidance dynamic, the warmth, and the chosen distance are all still present in the scene.", weight: 0.35 },
          { name: "Avoidance is shown, not told", description: "The subject-change and the letting-it-happen are dramatized — not re-summarized.", weight: 0.3 },
        ],
      },
      {
        id: "sdt-5",
        title: "The Physical Life of Thought",
        lesson:
          "Interior states have physical expression — fear tightens the chest, grief sits in the throat, joy does something specific in the hands. Good fiction renders the body thinking. Not 'she thought about her father' but whatever her body does when she thinks about her father. This isn't just poetic — it's neurologically accurate. Thought is embodied. The body knows things the narrator doesn't say.",
        prompt:
          "Write 100–160 words in which a character is thinking about a difficult decision, but their interior state is expressed only through physical sensation and behavior — not through any summarized thought. We should know what kind of decision this is from how their body is responding, not from what they're thinking.",
        wordCountMin: 90,
        wordCountMax: 180,
        criteria: [
          { name: "No summarized thought", description: "The piece doesn't say 'she thought about X' or 'he wondered whether' — the mind is rendered physically.", weight: 0.4 },
          { name: "Body expresses the interior", description: "Physical sensations and behaviors give the reader access to the character's inner state.", weight: 0.45 },
          { name: "Nature of the decision is inferable", description: "A reader could make a reasonable guess about the weight or type of decision from the physical rendering.", weight: 0.15 },
        ],
      },
    ],
  },

  // ── FICTION: TENSION & PACING ────────────────────────────────────────────

  {
    id: "tension-pacing",
    title: "Tension & Pacing",
    genre: "fiction",
    difficulty: "intermediate",
    description:
      "Tension is not the same as action. Pacing is not the same as speed. This track teaches you to control reader anxiety, vary tempo deliberately, and create the dread or urgency that keeps pages turning.",
    exercises: [
      {
        id: "tp-1",
        title: "Slow the Clock",
        lesson:
          "In the most tense moments, time slows. Narrative time and clock time diverge — a thirty-second moment can take three pages. The craft: expand the moment by filling it with sensory detail, fractured thought, and small physical actions that delay the inevitable. The reader wants to slow down and speed up simultaneously. Let them slow down.",
        prompt:
          "Write 120–200 words expanding a single moment that takes no more than 10 seconds in real time. The moment: someone opens a letter they've been afraid to open. Fill the time with specific sensation, physical action, and interrupted thought. Don't reveal what's in the letter.",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "Time is expanded", description: "A moment that takes seconds in real time is stretched across the word count through detail and sensation.", weight: 0.45 },
          { name: "Specific physical and sensory detail", description: "The expansion uses concrete sensation and action — not abstract reflection.", weight: 0.35 },
          { name: "Letter's contents withheld", description: "Tension is maintained: we don't know what's inside before the piece ends.", weight: 0.2 },
        ],
      },
      {
        id: "tp-2",
        title: "The Withheld Information",
        lesson:
          "The most reliable source of tension in fiction is information the reader doesn't yet have. The writer knows what's in the letter. The reader doesn't. What you withhold creates the forward pull. But the craft is being specific about the withholding — showing the reader exactly where the gap is. If they can't tell what's missing, they can't feel the tension of not knowing it.",
        prompt:
          "Write a scene (120–200 words) in which a character knows something that the reader and the other characters don't. Build tension by showing the knowing character's behavior — what do they do differently when they know this thing? Don't reveal what they know.",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "Information gap is present", description: "The knowing character has something the reader and others don't — this is established clearly.", weight: 0.3 },
          { name: "Knowledge affects behavior", description: "The character who knows acts differently because of what they know — we can see the knowledge in their behavior.", weight: 0.5 },
          { name: "Secret is not revealed", description: "What the character knows is not disclosed — the tension is sustained.", weight: 0.2 },
        ],
      },
      {
        id: "tp-3",
        title: "Cut to the Chase",
        lesson:
          "Pacing is controlled partly by what you cut. The scene that arrives too late and leaves too early creates urgency. Establish just enough, then get out. The craft decision: where does the scene actually start? Most writers enter too early and exit too late — they set up what doesn't need setting up and explain what the reader can infer. Cut the first and last sentence of every slow scene and see what you lose.",
        prompt:
          "Write a scene (100–160 words) in which you enter as late as possible and leave as early as possible. Two characters need to agree on something high-stakes. Start with the moment of decision already in progress — no setup. End before the aftermath.",
        wordCountMin: 90,
        wordCountMax: 180,
        criteria: [
          { name: "Enters late", description: "No setup — the scene begins in the middle of the action or conversation.", weight: 0.35 },
          { name: "Exits early", description: "Ends before the aftermath is processed or explained. The scene stops at the moment of resolution or decision.", weight: 0.35 },
          { name: "High stakes are felt", description: "Despite the compression, the importance of what's happening is clear.", weight: 0.3 },
        ],
      },
      {
        id: "tp-4",
        title: "The False Resolution",
        lesson:
          "One of the most effective tension tools: the moment where the reader thinks the danger is over, and it isn't. The false resolution lets tension breathe, then pulls the floor away. The technique: set up a resolution clearly enough that the reader relaxes, then find the detail that makes it not resolved at all. The second drop is always harder than the first.",
        prompt:
          "Write a passage (140–220 words) in which tension builds, appears to resolve, and then reveals itself to be unresolved. Three movements: build, false release, pull back. The final turn must come from something already in the scene — not a new element introduced at the end.",
        wordCountMin: 130,
        wordCountMax: 240,
        criteria: [
          { name: "Three movements present", description: "Build, false resolution, and the reveal that it isn't over — all three are identifiable.", weight: 0.35 },
          { name: "Resolution feels genuine before it breaks", description: "The reader should be able to believe the tension is over — the false release is convincing.", weight: 0.35 },
          { name: "Final turn uses existing elements", description: "The undoing comes from something already present in the scene — not a new character or piece of information.", weight: 0.3 },
        ],
      },
      {
        id: "tp-5",
        title: "Dread vs. Suspense",
        lesson:
          "Suspense: the reader doesn't know what will happen. Dread: the reader knows what will happen and can't stop it. Two different tools, both powerful. Dread is often underused because it seems to give away the ending — but knowing the bad thing is coming while watching the characters unable to see it is one of the oldest and most effective forms of tension.",
        prompt:
          "Write a scene (120–200 words) that creates dread, not suspense. The reader should sense from the opening what's going to go wrong. The character should not. Build the scene so that the reader watches something terrible become inevitable — without seeing it happen.",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "Dread established early", description: "A reader can sense from the opening what is likely to go wrong — the wrongness is embedded in the setup.", weight: 0.4 },
          { name: "Character is oblivious", description: "The character does not sense the coming problem — the gap between reader and character knowledge is the source of dread.", weight: 0.35 },
          { name: "Catastrophe not reached", description: "The scene ends before the bad thing happens — the tension is in anticipation, not resolution.", weight: 0.25 },
        ],
      },
    ],
  },

  // ── FICTION: POINT OF VIEW ────────────────────────────────────────────────

  {
    id: "pov-perspective",
    title: "Point of View",
    genre: "fiction",
    difficulty: "intermediate",
    description:
      "POV is not a technicality — it is the lens through which the whole story is filtered. This track teaches you the differences between perspectives, how to stay deep inside one, and what each costs and gains.",
    exercises: [
      {
        id: "pov-1",
        title: "First Person, Present Tense",
        lesson:
          "First person present tense is the most intimate, most immediate, and most demanding POV. Every sentence is happening now. There is no retrospective wisdom. The narrator can't say 'I know now what I didn't then' — they're in it. The risk: it can feel claustrophobic or breathless. The reward: a reader who can't get any closer to a mind.",
        prompt:
          "Write 100–160 words in first person present tense of someone arriving somewhere for the first time — a new city, a new job, a new relationship. The narrator must only know what they know in this exact moment. No backstory, no retrospection.",
        wordCountMin: 90,
        wordCountMax: 180,
        criteria: [
          { name: "Strict present tense throughout", description: "All verbs describing the narrator's experience are present tense — no past-tense narration.", weight: 0.35 },
          { name: "No retrospective knowledge", description: "The narrator doesn't reflect on what they would learn later or what they know now.", weight: 0.4 },
          { name: "Immediacy is felt", description: "The reader feels the experience happening in real time — not reported from a remove.", weight: 0.25 },
        ],
      },
      {
        id: "pov-2",
        title: "Third Person Limited",
        lesson:
          "Third person limited: we follow one character's perspective closely, but in 'he' or 'she' rather than 'I.' The camera is right behind their eyes. We know what they know, feel what they feel, but the narrator isn't them — there's a slight remove that allows for observations the character might not make about themselves. The key: stay in the limited perspective. No omniscient dips.",
        prompt:
          "Write 100–160 words in third person limited following a character who is about to say something they've been putting off saying. Stay tightly in their perspective — their physical sensations, their observations, their thoughts — without ever dipping into anyone else's interiority.",
        wordCountMin: 90,
        wordCountMax: 180,
        criteria: [
          { name: "Third person throughout", description: "Uses 'he,' 'she,' or 'they' — not 'I.'", weight: 0.2 },
          { name: "Strictly limited to one perspective", description: "We only know what this character observes, thinks, or feels — no access to other minds.", weight: 0.5 },
          { name: "Interior state is rendered", description: "We are inside this character's experience — not observing them from the outside.", weight: 0.3 },
        ],
      },
      {
        id: "pov-3",
        title: "Deep POV",
        lesson:
          "Deep POV is third person limited taken to its extreme: the narration sounds so close to the character that the distinction between the narrator and the character nearly disappears. The narrator's vocabulary, biases, and rhythms become the character's. 'She saw that it was raining' becomes 'It was raining.' The mediating layer dissolves. The reader is inside the character, not behind them.",
        prompt:
          "Write 100–160 words in deep third-person POV for a character who is extremely anxious. The prose itself should be anxious — the sentence rhythms, the things noticed, the intrusions of irrelevant detail. Don't filter through 'she felt' or 'she thought' — let the narration itself carry the anxiety.",
        wordCountMin: 90,
        wordCountMax: 180,
        criteria: [
          { name: "Minimal filtering phrases", description: "Avoids 'she thought,' 'she felt,' 'she noticed' — the perception is direct, not reported.", weight: 0.35 },
          { name: "Narration reflects the character's state", description: "The prose style itself — rhythm, focus, interruption — embodies the anxiety.", weight: 0.45 },
          { name: "Third person maintained", description: "'She/he/they' pronouns used — not first person.", weight: 0.2 },
        ],
      },
      {
        id: "pov-4",
        title: "The Cost of Omniscience",
        lesson:
          "Omniscient narration gives you everything: access to all minds, all times, all knowledge. The cost: distance. An omniscient narrator is always slightly outside every character, and the reader is always slightly outside with them. The skill is knowing when omniscience earns its distance — and when the intimacy of limited POV would be more powerful.",
        prompt:
          "Write the same scene twice (80–120 words each). Version 1: omniscient narration — you can access any character's thoughts, zoom out to context, observe from above. Version 2: third person limited, strictly inside one character. Label each version. The scene: two old friends see each other after five years of silence.",
        wordCountMin: 150,
        wordCountMax: 260,
        criteria: [
          { name: "Both versions clearly present and labeled", description: "Two distinct versions, each clearly marked.", weight: 0.2 },
          { name: "Omniscient version uses multiple interiorities", description: "Version 1 accesses more than one character's inner life or zooms out beyond any single perspective.", weight: 0.35 },
          { name: "Limited version strictly confined", description: "Version 2 stays entirely within one character's perception — no other mind is entered.", weight: 0.35 },
          { name: "Both feel like the right choice for different reasons", description: "Each version has a quality the other lacks — the exercise demonstrates the trade-off.", weight: 0.1 },
        ],
      },
    ],
  },

  {
    id: "writing-conflict",
    title: "Writing Conflict",
    genre: "fiction",
    difficulty: "intermediate",
    description:
      "Conflict isn't just fighting. It's the engine of every scene — a want running into an obstacle. This track builds the craft moves that create real tension: the argument that's not about what it's about, conflict visible through action, and the art of escalation.",
    exercises: [
      {
        id: "wc-1",
        title: "Want vs. Obstacle",
        lesson: "Every scene needs a character who wants something and something in the way. Not 'Bob is unhappy' — that's a state, not a conflict. 'Bob needs his sister to sign the papers before 5pm and she won't answer her phone' — that's a want with an obstacle. The more specific each is, the more specific the tension.",
        prompt: "Write a scene of 150–200 words where the conflict is entirely clear from the first two sentences. One character wants something specific. Something specific stands in the way. Don't name the emotions — let the want and obstacle create them.",
        wordCountMin: 150,
        wordCountMax: 200,
        criteria: [
          { name: "Want is specific and clear within the first two sentences", description: "The reader knows what the character is after before the second sentence ends.", weight: 0.3 },
          { name: "Obstacle is concrete, not vague", description: "The thing in the way is specific — not 'her past' but the particular thing.", weight: 0.3 },
          { name: "Emotions not named — created by the conflict", description: "No 'she felt anxious' — the anxiety comes from the situation itself.", weight: 0.25 },
          { name: "Want and obstacle unresolved at the end", description: "The scene maintains tension rather than dissolving it prematurely.", weight: 0.15 },
        ],
      },
      {
        id: "wc-2",
        title: "The Argument That's Not About What It's About",
        lesson: "Real arguments are almost never about what they appear to be about. Two people arguing about Thanksgiving are arguing about power, love, resentment, or fear. The surface argument is the occasion; the real conflict is underneath. Good dialogue holds both levels at once.",
        prompt: "Write a scene of 160–200 words of dialogue and action between two people arguing about something mundane (where to eat, a minor chore). The surface argument should be trivial. By the end, the real conflict underneath — something deeper and unspoken — should be unmistakable to the reader without ever being stated.",
        wordCountMin: 160,
        wordCountMax: 200,
        criteria: [
          { name: "Surface argument is trivial", description: "The stated subject of the argument is genuinely small.", weight: 0.2 },
          { name: "Real conflict unmistakable to the reader", description: "A reader can identify what the argument is actually about, even though it's never named.", weight: 0.4 },
          { name: "Neither character names the real conflict", description: "The underlying tension is implied, not stated.", weight: 0.25 },
          { name: "Dialogue and action work together to reveal subtext", description: "What characters do while talking is as revealing as what they say.", weight: 0.15 },
        ],
      },
      {
        id: "wc-3",
        title: "Conflict Through Action",
        lesson: "The easiest way to write conflict is through dialogue. The harder and often more powerful way is through action: characters whose every movement is in tension. Conflict through action shows rather than tells the state of a relationship.",
        prompt: "Write a scene of 150–190 words between two people in conflict — using zero dialogue. No quoted speech, no interior thought. Show the conflict entirely through what the characters do, where they move, what they touch, and how they avoid or approach each other.",
        wordCountMin: 150,
        wordCountMax: 190,
        criteria: [
          { name: "Zero dialogue — no quoted speech", description: "Not a single line of spoken dialogue.", weight: 0.25 },
          { name: "Conflict clear from action alone", description: "The reader understands the tension without internal thought or explanation.", weight: 0.4 },
          { name: "Physical details carry emotional weight", description: "Objects, distance, direction of gaze — these do the work dialogue would normally do.", weight: 0.25 },
          { name: "No interior monologue labeling the conflict", description: "Characters' thoughts don't state the tension explicitly.", weight: 0.1 },
        ],
      },
      {
        id: "wc-4",
        title: "Escalation",
        lesson: "A conflict that stays at the same temperature for three pages is a standoff, not a scene. Escalation is the craft of raising the stakes: each exchange slightly worse, each action slightly more irreversible, until something breaks. Every scene needs a temperature arc.",
        prompt: "Write a scene of 200–250 words in which conflict escalates across exactly three labeled beats. Beat 1: tension present but contained. Beat 2: something said or done that makes it worse. Beat 3: something that crosses a line — can't be taken back. The escalation should feel inevitable, not contrived.",
        wordCountMin: 200,
        wordCountMax: 250,
        criteria: [
          { name: "Three labeled beats with clear escalation", description: "Each beat is marked and each is genuinely worse than the previous.", weight: 0.25 },
          { name: "Beat 2 escalates in a specific, credible way", description: "The escalation is earned — something a real person in this situation might do.", weight: 0.25 },
          { name: "Beat 3 crosses a line — something irreversible", description: "The final beat changes something permanently or says something that can't be unsaid.", weight: 0.35 },
          { name: "Escalation feels inevitable rather than imposed", description: "The progression feels like a real escalation, not a writer forcing the scene upward.", weight: 0.15 },
        ],
      },
      {
        id: "wc-5",
        title: "Conflict Without a Villain",
        lesson: "The most powerful conflicts aren't between a hero and a villain — they're between two people who each have legitimate wants that can't coexist. When both characters are right from their own perspective, the conflict has real weight. The reader can't fully take sides.",
        prompt: "Write a scene of 180–230 words in which two characters are in genuine conflict, but both are right from their own perspective. The reader should understand and sympathize with both sides. Neither character is the villain — their wants simply can't coexist.",
        wordCountMin: 180,
        wordCountMax: 230,
        criteria: [
          { name: "Both characters have clear, legitimate wants", description: "Each character's position is comprehensible — the reader understands why they want what they want.", weight: 0.3 },
          { name: "Neither character is the villain", description: "The conflict isn't one reasonable person vs. one unreasonable one.", weight: 0.3 },
          { name: "Reader can sympathize with both sides", description: "The scene doesn't signal which character to root for.", weight: 0.25 },
          { name: "Conflict unresolved or resolved at cost to both", description: "There is no clean win.", weight: 0.15 },
        ],
      },
    ],
  },

  {
    id: "story-endings",
    title: "Endings",
    genre: "fiction",
    difficulty: "intermediate",
    description:
      "The last line of a story is the last thing the reader carries. This track drills the hardest move in fiction: how to close without deflating, how to earn an ending, and how to let the silence after the last sentence do its work.",
    exercises: [
      {
        id: "end-1",
        title: "The Last Line",
        lesson: "The last line isn't a summary and it isn't a moral. It's one final image, action, or statement that leaves the reader in the right place — not resolved, not confused, but resonant. The best last lines don't explain what the story meant; they make the reader feel it.",
        prompt: "Write three different last lines for the same story (describe the story in 1–2 sentences). Version 1: explains the meaning. Version 2: abrupt and unearned. Version 3: resonant — image or action, not explanation. Then write one sentence on what Version 3 does that the others don't.",
        wordCountMin: 100,
        wordCountMax: 180,
        criteria: [
          { name: "Three versions with story setup", description: "All three present, story setup clear.", weight: 0.15 },
          { name: "Version 1 explains the meaning", description: "States what the story was about rather than leaving it open.", weight: 0.2 },
          { name: "Version 3 is image or action, not explanation", description: "Doesn't tell the reader how to feel — gives them something that creates feeling.", weight: 0.4 },
          { name: "Explanation names what Version 3 achieves", description: "Concretely identifies what the resonant ending does.", weight: 0.25 },
        ],
      },
      {
        id: "end-2",
        title: "The Earned Ending",
        lesson: "An earned ending was set up somewhere earlier — an image repeated, a line echoed, a detail returned to. It doesn't announce itself as a callback; the reader simply feels it as inevitable. 'Of course it ends here' is what the reader should feel, even if they didn't predict it.",
        prompt: "Write a short scene of 200–240 words that ends on a specific image or detail — and uses that same image or detail near the beginning, without making the repetition obvious. The ending should feel inevitable to a reader who notices the setup, and resonant to one who doesn't.",
        wordCountMin: 200,
        wordCountMax: 240,
        criteria: [
          { name: "Ending image or detail appears earlier in the piece", description: "The closing element is introduced earlier — the ending completes something.", weight: 0.35 },
          { name: "Setup not announced or over-signaled", description: "The first appearance doesn't feel like a planted callback.", weight: 0.25 },
          { name: "Ending feels inevitable in retrospect", description: "Looking back, the ending was prepared — it doesn't feel arbitrary.", weight: 0.3 },
          { name: "Repetition serves the meaning", description: "The returned image does new work — it means more the second time.", weight: 0.1 },
        ],
      },
      {
        id: "end-3",
        title: "The Quiet Ending",
        lesson: "Not every story ends with revelation. Some of the best fiction ends quietly — a character walking away, someone going back to what they were doing, a small action that contains everything. Quiet endings resist the urge to explain. They trust the reader to feel what they feel.",
        prompt: "Write an ending of 80–120 words for a story of your own invention (describe the story in 2 sentences). The ending must: use a small, specific physical action; contain no emotional explanation; resist making a statement about meaning. Last line must be image or action, not conclusion.",
        wordCountMin: 90,
        wordCountMax: 140,
        criteria: [
          { name: "Ends on a small, specific physical action", description: "The final beat is a concrete thing happening, not a reflection or summary.", weight: 0.3 },
          { name: "No emotional explanation", description: "Doesn't tell the reader what the character feels or what it all meant.", weight: 0.35 },
          { name: "Last line is image or action", description: "The final sentence is concrete — something seen, heard, or done.", weight: 0.25 },
          { name: "Feels like an ending — not a stop", description: "The quiet is purposeful — a sense of completion even without resolution.", weight: 0.1 },
        ],
      },
      {
        id: "end-4",
        title: "Cut the Explanation",
        lesson: "The urge to explain at the end comes from anxiety — the writer worrying the reader didn't get it. But if the story did its job, the reader got it. The explanatory ending undoes the work by flattening what the reader was just beginning to feel. Cut it. Trust the image.",
        prompt: "Write a scene of 150–180 words that ends with an explanatory sentence telling the reader what it all meant. Label it 'explained ending.' Then rewrite just the final 2–3 sentences without the explanation. Label it 'cut ending.' The cut version must trust the preceding scene to do the work.",
        wordCountMin: 160,
        wordCountMax: 220,
        criteria: [
          { name: "Both versions present and labeled", description: "Explained ending and cut ending both present and marked.", weight: 0.15 },
          { name: "Explained ending genuinely over-explains", description: "The original final line tells the reader what to feel or what the story means.", weight: 0.25 },
          { name: "Cut ending removes explanation without replacing it", description: "The revision removes the explanatory line — doesn't substitute a different explanation.", weight: 0.35 },
          { name: "Cut ending trusts the scene", description: "The preceding scene is strong enough that the cut ending feels complete, not truncated.", weight: 0.25 },
        ],
      },
      {
        id: "end-5",
        title: "The Deflating Ending",
        lesson: "The most common ending failure is the deflating ending: a story builds to something, then releases all tension at the close with reassurance or explanation. Deflating endings often begin with 'And so' or 'In the end' or 'She realized.' The fix is almost always to stop one beat earlier.",
        prompt: "Write a scene of 160–200 words with a deflating ending that releases tension. Label it 'deflating.' Then rewrite only the final paragraph (40–60 words) to hold the tension open. Label it 'rewrite.' The rewrite should leave the reader inside the story rather than releasing them from it.",
        wordCountMin: 200,
        wordCountMax: 280,
        criteria: [
          { name: "Both versions present and labeled", description: "Deflating version and rewrite both present and clearly marked.", weight: 0.15 },
          { name: "Deflating ending genuinely releases tension", description: "The original ending provides comfort, closure, or explanation that deflates the story.", weight: 0.25 },
          { name: "Rewrite holds tension open", description: "The revised ending leaves the reader inside the story rather than stepping outside it.", weight: 0.4 },
          { name: "Rewrite changes approach, not just length", description: "The rewrite is comparable in length to the original closing paragraph.", weight: 0.2 },
        ],
      },
    ],
  },

  {
    id: "subtext",
    title: "Subtext",
    genre: "fiction",
    difficulty: "intermediate",
    description: "The best scenes have two conversations: the surface one and the real one. Characters want things they won't say directly. Subtext is the gap between what characters say and what they mean — and learning to write it is the difference between flat dialogue and layered fiction.",
    exercises: [
      {
        id: "subtext-1",
        title: "The Thing They Won't Ask For",
        lesson: "Subtext begins with want. A character needs something — forgiveness, money, attention, love — and can't ask for it directly. So they talk around it. They ask about something else. They make a joke. They offer something in exchange without naming what they want in return. The surface conversation is the decoy. The real conversation is underneath, visible only in what they keep circling back to.",
        prompt: "Write a scene of 150–220 words in which one character needs something from another but never asks for it directly. The reader should be able to name what the first character really wants. The other character may or may not understand. No character should state their feelings directly.",
        wordCountMin: 140,
        wordCountMax: 235,
        criteria: [
          { name: "The want is never stated", description: "No character says directly what they need or feel — it emerges through behavior, word choice, and what they avoid.", weight: 0.40 },
          { name: "The want is legible", description: "A careful reader can identify what the character really wants without being told.", weight: 0.35 },
          { name: "Surface conversation is distinct", description: "The characters are ostensibly talking about something other than the real subject.", weight: 0.25 },
        ],
      },
      {
        id: "subtext-2",
        title: "Two Conversations at Once",
        lesson: "In the best subtext, characters are having a conversation about Topic A that is actually about Topic B. A couple arguing about dishes is arguing about control. A son discussing his father's health is discussing his own guilt. The surface topic gives them permission to fight about the real one. Choose your surface topic carefully — it should mirror or invert the real one.",
        prompt: "Write a scene of 150–200 words in which two characters argue about something mundane (money, a household task, a minor inconvenience) that is clearly standing in for a deeper conflict the reader can identify. The surface argument must be specific and real. The underlying conflict must be distinct from it.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "Surface argument is concrete and specific", description: "The characters are genuinely arguing about something real — dishes, a bill, a missed event.", weight: 0.30 },
          { name: "Underlying conflict is distinct and legible", description: "A reader can identify what the fight is really about without being told.", weight: 0.40 },
          { name: "Neither character names the real conflict", description: "No one breaks the surface to say 'this isn't really about the dishes.'", weight: 0.30 },
        ],
      },
      {
        id: "subtext-3",
        title: "What They Didn't Say",
        lesson: "Sometimes subtext is a silence. The thing a character doesn't say — doesn't deny, doesn't correct, doesn't respond to — can carry more weight than anything spoken. A character who doesn't answer a question has answered it. The reader notices the absence. The other character may not, which creates dramatic irony. The silence should feel charged, not empty.",
        prompt: "Write a scene of 120–180 words that turns on something a character doesn't say. A question goes unanswered, an accusation isn't denied, or a statement isn't corrected. The non-response should tell the reader something important. The other character's reaction to the silence should be part of the scene.",
        wordCountMin: 110,
        wordCountMax: 195,
        criteria: [
          { name: "The silence is deliberate and visible", description: "The non-response is clearly a choice, not an accident — the reader feels its weight.", weight: 0.40 },
          { name: "The silence communicates something specific", description: "A reader can say what the silence reveals or confirms about the character.", weight: 0.35 },
          { name: "The other character reacts to the silence", description: "The non-response doesn't go unnoticed — someone registers it, even if they don't name it.", weight: 0.25 },
        ],
      },
      {
        id: "subtext-4",
        title: "The Polite Fight",
        lesson: "Civility can be a weapon. Two characters who dislike each other — or who are furious at each other — may be forced by context to remain polite. The scene's tension comes from the gap between the surface politeness and the hostility underneath. Every sentence is chosen to wound without technically being rude. The politeness is the point.",
        prompt: "Write a scene of 150–200 words in which two characters are in open conflict but are forced by context (a dinner party, a professional setting, a family event) to remain outwardly civil. The hostility should be unmistakable but the words technically polite. No character should break the surface and become openly rude.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "Surface remains polite", description: "No character says anything that couldn't technically be called civil — no insults, no raised voice.", weight: 0.30 },
          { name: "Hostility is unmistakable", description: "The reader has no doubt that these characters are in conflict.", weight: 0.40 },
          { name: "Context constrains them", description: "The reason for their forced civility is clear and makes dramatic sense.", weight: 0.30 },
        ],
      },
      {
        id: "subtext-5",
        title: "Rewrite — Kill the Direct Statement",
        lesson: "The most common subtext failure is letting a character say what they mean. 'I'm so angry at you.' 'I'm scared.' 'I still love you.' These statements may be true but they kill the scene's tension. The reader should arrive at the emotion through behavior and word choice, not be told. This exercise takes a direct statement and earns the same emotional truth through subtext.",
        prompt: "Take this passage and rewrite it (150–200 words) so that no character states an emotion or feeling directly. Original: 'Maria looked at him and realized she was still in love with him, even after everything. She wanted to tell him, but she was afraid he'd reject her. She felt angry at herself for still caring.'\n\nAll three emotional states must be present in your version — love, desire to confess, and self-directed anger — but shown through behavior, dialogue, and physical detail, not named.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "No emotions stated directly", description: "The words 'love,' 'afraid,' 'angry' (or synonyms) do not appear as descriptions of internal state.", weight: 0.35 },
          { name: "All three emotional states are legible", description: "A reader can identify love, desire to confess, and self-directed anger in the rewrite.", weight: 0.40 },
          { name: "Behavior and detail carry the emotional weight", description: "The emotions emerge through action, physical response, and word choice — not narrated feeling.", weight: 0.25 },
        ],
      },
    ],
  },

  // ── FICTION: INTERIORITY ─────────────────────────────────────────────────

  {
    id: "interiority",
    title: "Interiority",
    genre: "fiction",
    difficulty: "intermediate",
    description: "Access to a character's inner life is fiction's superpower. But most writers default to telling the reader what to feel. Interiority done right shows consciousness directly: the intrusive memory, the body reacting before the mind catches up, the thought a character can't quite finish.",
    exercises: [
      {
        id: "int-1",
        title: "The Thought Stream",
        lesson: "Interior monologue doesn't have to be dramatic to be good. A character thinking through an ordinary moment — waiting for coffee, stuck in traffic, washing dishes — can reveal everything. The thought wanders, circles back, connects the immediate to the larger life. The mundane moment becomes a window into who someone is. The key is specificity: these are this character's thoughts, not generic thoughts.",
        prompt: "Write 150–200 words of a character's interior during an ordinary, undramatic moment (waiting, doing a routine task, walking somewhere familiar). The thoughts should reveal character — something about their preoccupations, their history, their relationships — without the writer announcing 'here is what this character is like.'",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "Thoughts are specific to this character", description: "The interior feels like one person's mind, not a generic stream of consciousness.", weight: 0.40 },
          { name: "Character is revealed without direct statement", description: "The reader learns something about who this person is without the narrator summarizing their personality.", weight: 0.35 },
          { name: "The mundane moment grounds the interior", description: "The outer situation (the task, the place) stays present — this isn't just floating thoughts.", weight: 0.25 },
        ],
      },
      {
        id: "int-2",
        title: "The Unwanted Memory",
        lesson: "Memory interrupts. A smell, a word, a posture — and suddenly a character is somewhere else. The intrusive memory is one of fiction's most powerful tools because it shows the reader something in the past while grounding them in the present, and it tells us what haunts the character. The memory should arrive uninvited and feel impossible to stop.",
        prompt: "Write a scene of 150–200 words in which a character is doing something in the present when an unbidden memory intrudes. The memory should be triggered by something specific in the present scene. The character should not welcome it. The reader should understand why this particular memory surfaces now.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "Memory is triggered by something specific", description: "The intrusion has a clear sensory or situational trigger in the present scene.", weight: 0.30 },
          { name: "The memory reveals something about the character", description: "The content of the memory tells us something important — a wound, a relationship, a past self.", weight: 0.40 },
          { name: "The character doesn't welcome it", description: "The memory feels intrusive, not chosen — there is some resistance or discomfort.", weight: 0.30 },
        ],
      },
      {
        id: "int-3",
        title: "Body Before Mind",
        lesson: "The body often knows before the mind does. A character's stomach drops before they understand why. Their hands shake before they've acknowledged what they're afraid of. Their throat tightens before they recognize the grief. Writing sensation before cognition — body first, interpretation second — creates a feeling of interior truth. The reader trusts it because it matches how experience actually works.",
        prompt: "Write a scene of 130–180 words in which a character's body registers an emotion before the character consciously names it. The physical sensation should come first. The cognitive recognition — if it comes at all — should come later, and feel like catching up to something that already happened.",
        wordCountMin: 120,
        wordCountMax: 195,
        criteria: [
          { name: "Physical sensation precedes cognitive recognition", description: "The body reacts first — the awareness of what the body is doing comes after, not simultaneously.", weight: 0.45 },
          { name: "The sensation is specific and concrete", description: "Not 'she felt anxious' — a specific physical description of what anxiety feels like in this body.", weight: 0.35 },
          { name: "The sequence feels true", description: "The body-then-mind ordering reads as psychologically real, not constructed.", weight: 0.20 },
        ],
      },
      {
        id: "int-4",
        title: "The Self-Justification",
        lesson: "Characters lie to themselves constantly. They minimize, rationalize, reframe, excuse. Self-justification is one of the richest seams in interiority because it reveals the gap between what a character knows and what they're willing to admit. The reader sees through the rationalization even when the character doesn't. This gap — between what a character thinks and what the reader suspects — is dramatic irony.",
        prompt: "Write 150–200 words of a character's interior as they justify a decision, action, or inaction that the reader should be able to see is flawed. The character should believe their own justification. The reader should not be entirely convinced. Don't editorialize — don't let the narrator break in to undercut them. Let the rationalization indict itself.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "Character genuinely believes the justification", description: "The interior monologue isn't self-aware irony — the character means it.", weight: 0.35 },
          { name: "The flaw in the reasoning is visible to the reader", description: "The reader can see what the character is glossing over, minimizing, or ignoring.", weight: 0.40 },
          { name: "Narrator doesn't editorialize", description: "The writer doesn't tip the reader off with narrative commentary — the dramatic irony is implicit.", weight: 0.25 },
        ],
      },
      {
        id: "int-5",
        title: "The Gap Between Inside and Outside",
        lesson: "One of fiction's most reliable moves: show us what a character thinks, then show us what they say or do — and the gap between the two IS the character. 'I hate this party,' she thought. 'I love it,' she said.' That gap tells us about her social performance, her dishonesty, her fear. The greater the gap, the more we know about who she is and what she costs herself.",
        prompt: "Write a scene of 150–200 words in which a character's interior state is clearly distinct from their external behavior. Show us the inside first, then show us what they actually say or do. The gap should be significant enough that the reader understands something about who this character is and what they're hiding.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "Interior and exterior are clearly distinct", description: "What the character thinks/feels and what they say/do are noticeably different.", weight: 0.40 },
          { name: "The gap reveals character", description: "The difference between inside and outside tells the reader something specific about who this person is.", weight: 0.40 },
          { name: "Interior is shown before or alongside the exterior action", description: "The reader knows the inside before or as they watch the outside — not after.", weight: 0.20 },
        ],
      },
    ],
  },

  // ── FICTION: THE EMOTIONAL BEAT ──────────────────────────────────────────

  {
    id: "emotional-beat",
    title: "The Emotional Beat",
    genre: "fiction",
    difficulty: "intermediate",
    description: "Every scene must change something. A character enters with one emotional state and exits with another — even subtly. The 'beat' is the moment of change. Learning to engineer it deliberately separates scenes that matter from scenes that just describe.",
    exercises: [
      {
        id: "eb-1",
        title: "Name the Beat",
        lesson: "Before you can write a beat, you need to be able to name it. 'The scene where she realizes she's been lying to herself.' 'The scene where he finally admits he's afraid.' 'The scene where they understand their friendship is over.' The beat is the hinge — the thing the scene turns on. Every element in the scene should point toward it. If you can't name the beat, the scene doesn't have one.",
        prompt: "Write a scene of 180–250 words with a single clear emotional beat — a moment of change that the entire scene builds toward. Before your scene, write one sentence naming the beat: 'This is the scene where ___.' Every element of the scene should point toward that moment.",
        wordCountMin: 190,
        wordCountMax: 270,
        criteria: [
          { name: "Beat is named before the scene", description: "One sentence clearly identifies the emotional change the scene is building toward.", weight: 0.20 },
          { name: "Scene builds toward the beat", description: "The early part of the scene creates conditions for the beat — it isn't just dropped in.", weight: 0.40 },
          { name: "Beat is a genuine change, not a description", description: "Something shifts — the character's understanding, relationship, or state is different after the beat.", weight: 0.40 },
        ],
      },
      {
        id: "eb-2",
        title: "The Small Shift",
        lesson: "Not every beat is a revelation. Some of the best beats are nearly invisible — a slight cooling, a door that stays slightly more closed, a warmth that appeared where it wasn't before. The small shift is harder to write than the dramatic reversal because you can't rely on big events. You have to manufacture meaning from tiny details.",
        prompt: "Write a scene of 150–200 words whose emotional beat is subtle — a shift so small that it might be missed but cannot be unfelt. The change should be detectable in how the scene ends compared to how it begins: something is slightly different, slightly colder or warmer, slightly less possible than before.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "Change is present but understated", description: "Something is different by the end — but the writer resists dramatizing it.", weight: 0.45 },
          { name: "The shift is felt, not stated", description: "No character names what just happened — the reader registers it through detail and tone.", weight: 0.35 },
          { name: "The ending differs from the opening in a specific way", description: "The final state is demonstrably — if slightly — different from the initial state.", weight: 0.20 },
        ],
      },
      {
        id: "eb-3",
        title: "The Reversal",
        lesson: "The most dramatic beat is a full reversal: the character enters hopeful and exits defeated, or enters hostile and exits open, or enters certain and exits lost. A reversal is earned when the middle of the scene makes it feel inevitable in retrospect. Without the earning, it's just a plot event. With it, it's a scene.",
        prompt: "Write a scene of 200–270 words in which a character's emotional state reverses completely. Name both states (beginning: hopeful / end: defeated, or similar). The middle of the scene must make the reversal feel inevitable — not random. The reader should feel the turn happening, not just observe it.",
        wordCountMin: 185,
        wordCountMax: 285,
        criteria: [
          { name: "Reversal is complete and clear", description: "The character begins in one state and ends in its opposite — the distance is significant.", weight: 0.30 },
          { name: "Reversal is earned by the middle of the scene", description: "The scene contains the mechanism of the change — it doesn't just happen.", weight: 0.45 },
          { name: "Turns feels inevitable, not arbitrary", description: "In retrospect, the reversal was set up — the reader can trace how it happened.", weight: 0.25 },
        ],
      },
      {
        id: "eb-4",
        title: "Beat Without Dialogue",
        lesson: "Emotional beats in fiction are often carried by dialogue — someone says something that changes everything. The harder and more powerful version: carry the beat entirely through action, object, and physical environment. No spoken word does the work. The character moves, touches something, notices something, leaves. The change is visible in what they do with their body.",
        prompt: "Write a scene of 150–200 words whose emotional beat is carried entirely by action and physical detail. No dialogue. The change in the character's emotional state must be legible to the reader, but every piece of evidence for it must be physical — what they do, what they notice, how they move.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "No dialogue", description: "No spoken or thought words — the scene is entirely action and description.", weight: 0.25 },
          { name: "Emotional change is legible", description: "A reader can identify what changed and roughly what the character is feeling by the end.", weight: 0.40 },
          { name: "Physical details carry the emotional weight", description: "What the character does with their body, what they touch, how they move — these are the scene's evidence.", weight: 0.35 },
        ],
      },
      {
        id: "eb-5",
        title: "The Earned Beat",
        lesson: "A beat is earned through accumulation. Three details that point the same direction, each one intensifying the pressure until something has to give. The earned beat feels inevitable because you laid the groundwork — the reader was almost there before the beat arrived. Unearned beats feel like plot conveniences. Earned beats feel like truth.",
        prompt: "Write a scene of 220–300 words whose beat is earned by three distinct preparatory details. Before your scene, list the three details and the beat they're building toward. In the scene, plant all three before the beat arrives. The beat itself should be brief — the preparation is the work.",
        wordCountMin: 235,
        wordCountMax: 320,
        criteria: [
          { name: "Three preparatory details listed and present", description: "The pre-scene list names three details, and all three appear in the scene before the beat.", weight: 0.30 },
          { name: "Details accumulate toward the beat", description: "Each detail adds pressure — they point the same direction and make the beat feel coming.", weight: 0.40 },
          { name: "The beat itself is brief and earned", description: "The beat arrives after the preparation, not in place of it — the preparation did the work.", weight: 0.30 },
        ],
      },
    ],
  },

  // ── FICTION: SCENE CONSTRUCTION ──────────────────────────────────────────

  {
    id: "scene-construction",
    title: "Scene Construction",
    genre: "fiction",
    difficulty: "advanced",
    description: "A scene isn't just action on the page — it has architecture. Someone wants something, encounters resistance, and ends somewhere different from where they started. Mastering scene construction means understanding why a scene works, not just that it does.",
    exercises: [
      {
        id: "sc-1",
        title: "Goal, Obstacle, Outcome",
        lesson: "Every scene needs three things: a character who wants something specific, something that gets in the way, and a resolution that changes the situation. Without a goal, nothing is at stake. Without an obstacle, there's no scene — just events. Without a change, the scene was pointless. The goal doesn't have to be large. The obstacle doesn't have to be dramatic. But both must be present.",
        prompt: "Write a scene of 200–280 words. Before you write, state in one sentence: who wants what, what gets in the way, and how it resolves. Then write the scene. The goal must be specific (not 'he wants to feel better' but 'he wants her to say she's sorry'). The obstacle must create genuine pressure. The outcome must leave the situation different from how it began.",
        wordCountMin: 215,
        wordCountMax: 300,
        criteria: [
          { name: "Goal stated and present", description: "A specific want is named in the pre-scene sentence and drives the scene's action.", weight: 0.25 },
          { name: "Obstacle creates genuine pressure", description: "Something meaningfully resists the character's goal — not a token difficulty.", weight: 0.35 },
          { name: "Situation is different at the end", description: "The scene's resolution changes something — the relationship, the plan, the understanding.", weight: 0.40 },
        ],
      },
      {
        id: "sc-2",
        title: "Enter Late, Leave Early",
        lesson: "Most scenes start too early and end too late. Writers feel obligated to show the walk to the door, the greeting, the pleasantries, the exit. Strip them. Enter the scene when the pressure is already present. Leave it the moment the beat lands. Everything before the pressure and after the resolution is throat-clearing. Cut it ruthlessly.",
        prompt: "Write a scene of 150–200 words that begins in the middle of an already-pressurized situation and ends the moment the scene's beat lands — not a sentence after. No establishing approach, no farewell. The reader should feel dropped in and cut out. The scene should feel taut.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "Scene begins mid-pressure", description: "No warm-up — the scene opens with tension already present or imminent.", weight: 0.35 },
          { name: "Scene ends at the beat", description: "The scene ends the moment its point lands — there is no aftermath, no wind-down.", weight: 0.35 },
          { name: "Scene feels taut, not abrupt", description: "The compression feels intentional and controlled, not like something is missing.", weight: 0.30 },
        ],
      },
      {
        id: "sc-3",
        title: "The Scene That Does Two Things",
        lesson: "A scene that only advances plot is functional. A scene that only reveals character is indulgent. A scene that does both is essential. Every scene in a finished novel should be doing at least two things simultaneously: moving the story forward and deepening our understanding of who someone is. If a scene only does one, it's a candidate for cutting.",
        prompt: "Write a scene of 200–260 words that simultaneously advances a plot situation AND reveals a character's essential nature or flaw. After the scene, write two sentences: one naming what plot moved forward, one naming what you learned about the character that wasn't explicit before.",
        wordCountMin: 215,
        wordCountMax: 285,
        criteria: [
          { name: "Plot moves forward", description: "A situation changes — information revealed, decision made, relationship shifted.", weight: 0.30 },
          { name: "Character is revealed", description: "The reader learns something specific about who this person is — not stated, shown.", weight: 0.35 },
          { name: "Both functions named after the scene", description: "The two-sentence analysis correctly identifies what each element accomplished.", weight: 0.20 },
          { name: "Neither function feels forced", description: "The dual work feels organic — the scene isn't obviously constructed to check two boxes.", weight: 0.15 },
        ],
      },
      {
        id: "sc-4",
        title: "Escalating Pressure",
        lesson: "Tension in a scene isn't static — it accumulates. The goal is blocked once, then again, then again, each time the obstacle more serious. The three-block pattern is reliable: a minor obstacle, a more serious one, and then the one that forces a decision or a change. Without escalation, tension flatlines. With it, the scene builds.",
        prompt: "Write a scene of 250–320 words in which a character's goal is blocked three times in escalating order. The first block is an inconvenience. The second raises the stakes. The third forces a decision. Label the three blocks in a pre-scene note. The scene's resolution should emerge from the third block.",
        wordCountMin: 265,
        wordCountMax: 340,
        criteria: [
          { name: "Three blocks present and labeled", description: "A pre-scene note identifies the three obstacles, and all three appear in the scene.", weight: 0.25 },
          { name: "Escalation is genuine", description: "Each block is more serious than the last — the pressure genuinely increases.", weight: 0.40 },
          { name: "Third block forces a decision or change", description: "The climactic obstacle doesn't just obstruct — it requires a response that moves the scene.", weight: 0.35 },
        ],
      },
      {
        id: "sc-5",
        title: "The Exit Point",
        lesson: "Where a scene ends determines what it means. Exit too early and the beat doesn't land. Exit too late and you dissipate it. The right exit point is the sentence after which anything added would be a mistake. Often it's an image, a statement, a small action — something that closes the scene's circuit without over-explaining it. The last sentence of a scene should feel like a door closing, not trailing off.",
        prompt: "Write the final 100–150 words of a scene — just the ending, not a full scene. Before you write, describe in one sentence what the scene has been building toward. Then write only the ending: the beat landing, and the exit. The final sentence should close the circuit. Nothing should be added after it.",
        wordCountMin: 100,
        wordCountMax: 165,
        criteria: [
          { name: "Beat lands clearly within the excerpt", description: "The emotional or narrative point of the scene arrives in this passage.", weight: 0.35 },
          { name: "Final sentence closes the circuit", description: "The last line feels final — it's the right place to stop, and stopping there is a choice.", weight: 0.40 },
          { name: "Nothing is added after the exit point", description: "The scene doesn't wind down — it ends at the moment of maximum resonance.", weight: 0.25 },
        ],
      },
    ],
  },

  // ── FICTION: PROSE RHYTHM ────────────────────────────────────────────────

  {
    id: "prose-rhythm",
    title: "Prose Rhythm",
    genre: "fiction",
    difficulty: "advanced",
    description: "Fiction prose has music. The shape of a sentence is itself meaning — short sentences accelerate and hit, long ones ask the reader to hold multiple thoughts in suspension before they resolve. Writers who control rhythm control how readers feel, not just what they know.",
    exercises: [
      {
        id: "pr-1",
        title: "The Staccato Scene",
        lesson: "Short sentences accelerate. They create urgency. They cut off breath. They hit. They stop. They hit again. Used in high-tension passages, they create a physiological sensation in the reader — the feeling of pursuit, of panic, of irreversibility. The trap is monotony: all short sentences flatten out quickly. The staccato effect needs occasional variation to maintain its impact.",
        prompt: "Write a scene of 130–180 words depicting a moment of tension, urgency, or crisis using predominantly short sentences (under 10 words). At least 70% of your sentences should be under 10 words. The rhythm should create a feeling in the reader, not just describe one.",
        wordCountMin: 120,
        wordCountMax: 195,
        criteria: [
          { name: "Sentence brevity sustained", description: "At least 70% of sentences are 10 words or fewer.", weight: 0.30 },
          { name: "Rhythm creates urgency", description: "The short-sentence pattern produces a feeling of acceleration or pressure — it isn't just grammatically short.", weight: 0.45 },
          { name: "Variation prevents monotony", description: "At least one or two longer sentences create contrast that makes the short ones hit harder.", weight: 0.25 },
        ],
      },
      {
        id: "pr-2",
        title: "The Long Sentence",
        lesson: "A long sentence, used well, doesn't confuse — it accumulates, like a slow tide coming in, carrying details and qualifications and subordinate clauses, each one adding to the weight of what the sentence is building toward, until the final word arrives and the whole structure resolves and the reader exhales. The long sentence is an instrument of contemplation, memory, and complexity. The trap: losing the grammatical thread.",
        prompt: "Write a single sentence of 60–100 words that is grammatically correct, clear, and uses its length as an intentional effect — building toward something, accumulating pressure or detail, arriving at a resolution. Then write two sentences explaining what the length is doing.",
        wordCountMin: 75,
        wordCountMax: 125,
        criteria: [
          { name: "Sentence is grammatically correct", description: "However long, the sentence is structurally sound — no run-ons, no lost clauses.", weight: 0.30 },
          { name: "Length serves an intentional effect", description: "The accumulation is doing something — building toward, deepening, surrounding. It isn't just long.", weight: 0.45 },
          { name: "Explanation identifies the effect clearly", description: "The two-sentence note names specifically what the length accomplishes in this sentence.", weight: 0.25 },
        ],
      },
      {
        id: "pr-3",
        title: "Rhythm as Emotion",
        lesson: "Prose rhythm should track emotional intensity. When the character is calm, the sentences can be long and expansive. When they're frightened, sentences shorten. When something is dawning on them — gradually, irresistibly — sentences can lengthen and slow. The rhythm is an emotional score running beneath the words. A mismatch between rhythm and content creates a jarring effect — calm sentences in a crisis, or frenetic rhythm in a peaceful moment.",
        prompt: "Write a paragraph of 150–200 words in which the sentence lengths change to track the character's shifting emotional state. The paragraph must contain at least one clear shift in emotional intensity, and the sentence rhythm must change to match it. No character should name their emotional state directly.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "Rhythm shifts with emotion", description: "Sentence length changes at the emotional turning point — the shift is visible on the page.", weight: 0.45 },
          { name: "Emotional shift is clear without being stated", description: "The reader registers the change in the character's state without a direct statement.", weight: 0.35 },
          { name: "Rhythm feels intentional, not accidental", description: "The length variation appears to be a controlled choice, not random variation.", weight: 0.20 },
        ],
      },
      {
        id: "pr-4",
        title: "The Rhythm Shift",
        lesson: "A deliberate shift in rhythm — from long to short, or slow to urgent — can signal a turning point more powerfully than any explicit statement. The shift itself is the announcement: something has changed. This is why writers often break into short sentences at the moment of revelation. The change in music tells the reader before the words do.",
        prompt: "Write a passage of 180–240 words in which you use a deliberate rhythm shift to signal a turning point. The first half should be in one dominant rhythm (either long and contemplative or short and tense). The second half should shift clearly to the opposite. The shift should coincide with or signal a change in the scene's situation or the character's understanding.",
        wordCountMin: 170,
        wordCountMax: 255,
        criteria: [
          { name: "Two distinct rhythmic registers are present", description: "The first half and second half are visibly different in sentence length and pacing.", weight: 0.35 },
          { name: "Shift coincides with a story turning point", description: "The rhythm change aligns with a change in situation, understanding, or emotional state.", weight: 0.40 },
          { name: "Shift feels purposeful, not coincidental", description: "The two-part structure reads as controlled — the pivot point is deliberate.", weight: 0.25 },
        ],
      },
      {
        id: "pr-5",
        title: "The Same Scene, Two Rhythms",
        lesson: "Rhythm isn't decoration — it's a fundamental choice about how the reader experiences a moment. The same event written in staccato rhythm and in long, flowing sentences is not the same event. The rhythm shapes the experience. This exercise makes that visible by forcing you to write the same scene twice.",
        prompt: "Write the same scene twice: once in urgent, short-sentence prose (100–130 words), once in slow, long-sentence prose (100–130 words). Same characters, same events, same outcome. The only difference is the rhythm. After both versions, write two sentences describing how the rhythm changed the emotional experience of the scene.",
        wordCountMin: 215,
        wordCountMax: 285,
        criteria: [
          { name: "Both versions tell the same story", description: "Characters, events, and outcome are identical — only the rhythm changes.", weight: 0.25 },
          { name: "First version is genuinely urgent/staccato", description: "Short sentences dominate; the prose moves fast.", weight: 0.25 },
          { name: "Second version is genuinely slow/expansive", description: "Longer sentences dominate; the prose moves deliberately.", weight: 0.25 },
          { name: "Analysis identifies a specific difference in emotional experience", description: "The two sentences name something real about how rhythm changed the feel of the scene.", weight: 0.25 },
        ],
      },
    ],
  },

  // ── FICTION: THE UNRELIABLE NARRATOR ────────────────────────────────────

  {
    id: "unreliable-narrator",
    title: "The Unreliable Narrator",
    genre: "fiction",
    difficulty: "advanced",
    description: "Every narrator is unreliable — they have blind spots, biases, limited knowledge. The skill is using those limitations deliberately to create dramatic irony: when the reader knows more than the narrator admits, tension and meaning accumulate.",
    exercises: [
      {
        id: "un-1",
        title: "The Self-Serving Account",
        lesson: "The most common unreliability is self-interest. Characters remember events in ways that protect their self-image. They misremember who started it. They minimize what they did. They inflate what was done to them. The self-serving narrator doesn't know they're doing it — or if they know, they won't admit it. The reader, watching the spin, learns more about the narrator than about the event.",
        prompt: "Write a first-person account of an event (150–200 words) from the perspective of a character who was clearly in the wrong, but who narrates it as though they were the aggrieved party. The narrator should sound sincere, not cynical. The reader should be able to see through the account without the writer tipping them off.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "Narrator sounds sincere", description: "The narrator isn't winking at the reader — they genuinely believe their version.", weight: 0.35 },
          { name: "Reader can see the spin", description: "The gaps, deflections, and self-flattering choices are visible to a careful reader.", weight: 0.40 },
          { name: "Narrator's culpability is implied without being stated", description: "The writer doesn't announce that the narrator is wrong — it emerges from the account.", weight: 0.25 },
        ],
      },
      {
        id: "un-2",
        title: "The Oblivious Narrator",
        lesson: "Sometimes a narrator isn't lying — they're just wrong. They misread another character's intentions. They don't understand what's happening in the room. They interpret evidence through the wrong frame. The oblivious narrator creates a different kind of dramatic irony: the reader sees what the narrator misses. The narrator's blindness is itself characterization — it tells us about their limitations, their needs, their inability to see clearly.",
        prompt: "Write a scene of 160–220 words from the first-person perspective of a narrator who fundamentally misreads what is happening — another character's emotional state, the significance of an event, or their own situation. The reader should understand the truth. The narrator should be confidently wrong.",
        wordCountMin: 150,
        wordCountMax: 235,
        criteria: [
          { name: "Narrator's misreading is confident, not tentative", description: "The narrator presents their wrong interpretation as obvious truth.", weight: 0.30 },
          { name: "The correct reading is available to the reader", description: "Enough evidence is in the scene that the reader can see what the narrator cannot.", weight: 0.45 },
          { name: "The misreading reveals something about the narrator", description: "What the narrator gets wrong tells us about their limitations, fears, or blind spots.", weight: 0.25 },
        ],
      },
      {
        id: "un-3",
        title: "What They Won't Say",
        lesson: "Omission is a form of unreliability. A narrator who keeps circling around something, approaching it and veering off, tells the reader that something is there. The subject they won't address is the subject of the piece. What the narrator refuses to look at directly is exactly what the reader looks at. The structure of avoidance is itself a confession.",
        prompt: "Write 150–200 words of first-person narration in which the narrator clearly knows something they won't say directly. They should approach it, reference it obliquely, perhaps get close and then change the subject. The reader should have a strong sense of what the narrator is avoiding without being told.",
        wordCountMin: 140,
        wordCountMax: 215,
        criteria: [
          { name: "Avoidance pattern is visible", description: "The narrator approaches and retreats from a subject more than once — the circling is legible.", weight: 0.40 },
          { name: "The avoided subject is strongly implied", description: "A reader can name what the narrator won't say.", weight: 0.40 },
          { name: "Narrator doesn't directly name what they're hiding", description: "The avoidance is the technique — the thing itself is never explicitly stated.", weight: 0.20 },
        ],
      },
      {
        id: "un-4",
        title: "Reliable vs. Unreliable",
        lesson: "The best way to understand unreliable narration is contrast. The same event told by a reliable narrator reads very differently than when told by an unreliable one. The reliable narrator is precise, acknowledges uncertainty, doesn't editorialize. The unreliable one shapes, softens, omits. The contrast makes both versions more vivid.",
        prompt: "Write the same event (100–130 words each) from two narrators: one reliable, one unreliable. The event should involve a conflict between two characters. The reliable version should be balanced, uncertain about motive, precise about what was observed. The unreliable version should be biased, confident, self-serving. After both versions, write one sentence identifying the key technique that creates the unreliability.",
        wordCountMin: 215,
        wordCountMax: 285,
        criteria: [
          { name: "Reliable version is genuinely balanced", description: "The reliable narrator observes without editorializing and acknowledges what they can't know.", weight: 0.25 },
          { name: "Unreliable version is clearly biased", description: "The unreliable narrator shapes the account — what they include, omit, and emphasize is visibly self-serving.", weight: 0.35 },
          { name: "Same event in both versions", description: "The underlying event is identical — only the narration changes.", weight: 0.25 },
          { name: "Key technique identified", description: "The one-sentence analysis names specifically what technique creates the unreliability.", weight: 0.15 },
        ],
      },
      {
        id: "un-5",
        title: "The Tell",
        lesson: "Even the most carefully constructed unreliable narrator has a tell — a moment where the mask slips, where the defense cracks, where the real emotion breaks through the constructed version. The tell is the scene's most powerful moment because the narrator's control fails and the truth briefly surfaces. It should feel involuntary — something escaping, not something confessed.",
        prompt: "Write a scene of 180–240 words in first person in which an unreliable narrator's control breaks at the end — a tell, a slip, a moment where the real feeling or knowledge escapes the constructed account. The setup (the unreliable narration) should make the break feel involuntary and significant. The tell should be brief.",
        wordCountMin: 170,
        wordCountMax: 255,
        criteria: [
          { name: "Unreliable narration established in the setup", description: "The opening sets up the narrator's constructed account — we understand what they've been doing.", weight: 0.30 },
          { name: "The tell is brief and involuntary-feeling", description: "The crack is a moment, not a paragraph — something escaping, not a confession.", weight: 0.40 },
          { name: "The tell changes what the reader understands", description: "After the tell, the reader knows something they didn't before — or confirms what they suspected.", weight: 0.30 },
        ],
      },
    ],
  },

  // ── FICTION: STRUCTURE & PLOT ────────────────────────────────────────────

  {
    id: "structure-and-plot",
    title: "Structure & Plot",
    genre: "fiction",
    difficulty: "advanced",
    description: "Plot is what happens. Structure is why it happens in that order. Understanding story architecture means knowing what each scene must accomplish — not just what it contains — and why the sequence matters.",
    exercises: [
      {
        id: "sp-1",
        title: "The Central Dramatic Question",
        lesson: "Every story has a central dramatic question — the one question the whole story is organized to answer. 'Will she escape?' 'Will he be forgiven?' 'Can they trust each other?' The CDQ isn't the theme; it's the engine. It's what keeps readers turning pages. If you can't state the CDQ in one sentence, the story may not have one yet. Everything in the story should tighten or loosen the tension around that question.",
        prompt: "Write the opening 200–260 words of a story whose central dramatic question is established within the first three paragraphs. After your excerpt, state the CDQ in one sentence. The opening should create enough context that the question feels urgent — not just interesting.",
        wordCountMin: 215,
        wordCountMax: 280,
        criteria: [
          { name: "CDQ is identifiable in the excerpt", description: "A reader can sense the central question before being told what it is.", weight: 0.35 },
          { name: "CDQ is stated correctly after the excerpt", description: "The one-sentence statement matches what the opening actually establishes.", weight: 0.25 },
          { name: "The question feels urgent, not merely interesting", description: "The opening creates stakes — something is at risk if the question goes the wrong way.", weight: 0.40 },
        ],
      },
      {
        id: "sp-2",
        title: "The Midpoint Turn",
        lesson: "Midpoints are structural hinges — the moment when the story's direction changes. Before the midpoint, the character is pursuing a goal in one way. After the midpoint, the game changes: new information arrives, the stakes shift, the character must pursue the goal differently. A story without a clear midpoint often feels like it runs out of steam halfway through. The midpoint gives the second half its energy.",
        prompt: "Write a scene of 200–270 words that functions as a story's midpoint turn. Before you write, state in two sentences: what the story's situation was before this scene, and what it will be after. The scene itself should be the hinge — the moment when new information or a new condition changes the story's trajectory.",
        wordCountMin: 215,
        wordCountMax: 290,
        criteria: [
          { name: "Before and after states are described", description: "Two sentences before the scene clearly describe the story's trajectory before and after the midpoint.", weight: 0.20 },
          { name: "Scene contains a genuine change in trajectory", description: "Something in the scene changes the story's direction — not just raises stakes, but changes them.", weight: 0.45 },
          { name: "Scene functions as a hinge", description: "The scene connects the first half's logic to the second half's new logic.", weight: 0.35 },
        ],
      },
      {
        id: "sp-3",
        title: "The False Victory",
        lesson: "The false victory — where the character seems to have solved the problem before the story's climax — is one of the most effective structural moves. It resets the stakes, deepens the reader's investment, and creates the sensation of the ground dropping away. The false victory works because the reader believed it too. The more convinced the reader was, the harder the fall.",
        prompt: "Write a scene of 180–240 words depicting a false victory — a moment where a character appears to have achieved their goal, followed by a reversal that shows they haven't. The reader (and character) should genuinely believe the victory for at least the first half of the scene. The reversal should feel earned, not arbitrary.",
        wordCountMin: 170,
        wordCountMax: 255,
        criteria: [
          { name: "Victory is genuinely convincing", description: "The first half of the scene successfully establishes that the goal has been achieved.", weight: 0.30 },
          { name: "Reversal is clear and lands hard", description: "The complication that undoes the victory is specific and significant.", weight: 0.40 },
          { name: "Reversal feels earned, not convenient", description: "The complication was possible given what we know — it isn't dropped in from nowhere.", weight: 0.30 },
        ],
      },
      {
        id: "sp-4",
        title: "Scene Necessity",
        lesson: "Every scene in a finished story should be doing something specific and irreplaceable. If a scene could be cut without losing anything essential, it should be cut. The test: what would be missing from the story if this scene didn't exist? If the answer is 'nothing,' the scene is decoration. If the answer is specific — this relationship wouldn't make sense, this reveal would have no setup — the scene earns its place.",
        prompt: "Write a scene of 200–260 words and then write a defense of its necessity in three sentences: what plot it moves, what character it reveals, and what would be missing from the story if it were cut. The defense should be specific — not 'it's important' but 'without this scene, the reader wouldn't know X, which makes Y impossible.'",
        wordCountMin: 215,
        wordCountMax: 285,
        criteria: [
          { name: "Scene is doing at least two identifiable things", description: "Plot and character both move forward in the scene.", weight: 0.30 },
          { name: "Defense is specific, not vague", description: "The three-sentence defense names what specifically would be missing without this scene.", weight: 0.40 },
          { name: "Scene would pass the necessity test", description: "Based on the defense, the scene earns its place — the consequences of cutting it are real.", weight: 0.30 },
        ],
      },
      {
        id: "sp-5",
        title: "The Promise of the Premise",
        lesson: "The opening of a story makes a promise about what kind of story it is. Genre, tone, stakes, world — all of these are established in the first pages. A story that breaks its opening promise without justification loses its readers. The skill is knowing what promise your opening makes and then keeping it — or deliberately subverting it for effect.",
        prompt: "Write a 150–200 word opening that makes a clear promise about what kind of story this will be. After the opening, write three sentences identifying: (1) the genre/tone promised, (2) the stakes established, and (3) the central character's situation. The opening should be specific enough that a reader could predict what kind of story follows.",
        wordCountMin: 165,
        wordCountMax: 225,
        criteria: [
          { name: "Opening makes a clear genre/tone promise", description: "A reader can identify what kind of story this will be from the opening.", weight: 0.30 },
          { name: "Stakes are established", description: "The opening establishes what is at risk — what could go wrong or what is already in jeopardy.", weight: 0.35 },
          { name: "Three-sentence analysis is accurate", description: "The genre, stakes, and situation named after the excerpt match what's actually in the opening.", weight: 0.35 },
        ],
      },
    ],
  },

  // ── FICTION: FORESHADOWING & PAYOFF ─────────────────────────────────────

  {
    id: "foreshadowing-payoff",
    title: "Foreshadowing & Payoff",
    genre: "fiction",
    difficulty: "advanced",
    description: "Great endings feel both surprising and inevitable. That combination is engineered from page one. Foreshadowing isn't about hiding clues — it's about planting details that make endings feel like they couldn't have been otherwise.",
    exercises: [
      {
        id: "fp-1",
        title: "The Loaded Object",
        lesson: "An object that appears early and returns later carries weight the second time it couldn't have had the first. The gun on the mantle. The letter in the drawer. The wedding ring removed and pocketed. Plant an object with enough specificity that the reader notices it, but not so much emphasis that they know it matters. When it returns, its significance should feel discovered, not manufactured.",
        prompt: "Write two scenes (100–130 words each). In Scene A, introduce an object in a way that is specific but not obviously significant — the reader shouldn't know to watch for it. In Scene B (set later), bring the object back in a way that makes it carry real emotional or narrative weight. The object should be transformed in meaning by Scene B.",
        wordCountMin: 215,
        wordCountMax: 285,
        criteria: [
          { name: "Object introduced naturally in Scene A", description: "The object appears without fanfare — specific, but not underlined.", weight: 0.25 },
          { name: "Object carries weight in Scene B", description: "The return of the object changes the meaning of the scene — it isn't just a callback.", weight: 0.45 },
          { name: "Payoff feels earned, not planted", description: "Scene B's use of the object feels like discovery, not like the writer pointing at their own plant.", weight: 0.30 },
        ],
      },
      {
        id: "fp-2",
        title: "The Character Seed",
        lesson: "A character's flaw, habit, or tendency planted early should bloom into consequence later. The impulsive character makes an impulsive decision that costs them. The person who can't ask for help can't ask for help when they most need to. The seed and the consequence are the same trait — just the early version and the late version. The reader, encountering the consequence, should feel: of course.",
        prompt: "Write two short scenes. Scene A (100–130 words): plant a character's specific trait, habit, or flaw in an ordinary moment — it should feel like characterization, not setup. Scene B (100–130 words): show that same trait becoming consequential in a higher-stakes moment. The reader should see the connection between A and B without being told.",
        wordCountMin: 215,
        wordCountMax: 285,
        criteria: [
          { name: "Trait is established naturally in Scene A", description: "The characteristic feels like characterization in A — not a setup arrow pointing at Scene B.", weight: 0.25 },
          { name: "Same trait creates consequences in Scene B", description: "Scene B's situation directly involves the trait planted in Scene A.", weight: 0.40 },
          { name: "Connection is visible without being stated", description: "A reader can identify the link between A and B without being told they are connected.", weight: 0.35 },
        ],
      },
      {
        id: "fp-3",
        title: "The False Plant",
        lesson: "A false plant is a detail that appears to foreshadow one thing but pays off differently. It misleads the reader intentionally, creating a surprise when the payoff arrives. The false plant is harder to execute than a true one — it has to be convincing enough to mislead but not so convincing that the actual payoff feels like a cheat. The reader should feel outwitted, not cheated.",
        prompt: "Write two scenes (100–130 words each). Scene A should plant a detail that appears to point toward Outcome X. Scene B should reveal that the detail actually pointed toward Outcome Y — a different, surprising resolution. After Scene B, write one sentence explaining why Outcome Y is satisfying rather than a cheat.",
        wordCountMin: 215,
        wordCountMax: 285,
        criteria: [
          { name: "Plant in Scene A convincingly suggests Outcome X", description: "The detail is specific and plausible enough that the reader would expect X.", weight: 0.25 },
          { name: "Scene B delivers Outcome Y with surprise and logic", description: "The actual payoff is unexpected but, in retrospect, was always possible given what we knew.", weight: 0.40 },
          { name: "One-sentence explanation shows why Y satisfies", description: "The explanation identifies why the reader feels outwitted rather than cheated.", weight: 0.35 },
        ],
      },
      {
        id: "fp-4",
        title: "The Callback",
        lesson: "A callback revisits an earlier moment — a line of dialogue, an image, a gesture — and gives it new meaning in a new context. The callback works because it rewards attentive readers and creates a sense of the story's architecture: the writer knew, from the beginning, that this moment would echo. The callback should change the meaning of the earlier moment, not just repeat it.",
        prompt: "Write Scene A (100–130 words) containing a specific line of dialogue, image, or gesture. Write Scene B (100–130 words) that calls back to the exact element from Scene A — repeating or echoing it in a new context that changes its meaning. Scene A should not 'point' at Scene B. Scene B should make Scene A mean something different than it did when first encountered.",
        wordCountMin: 215,
        wordCountMax: 285,
        criteria: [
          { name: "Scene A does not signal it will be called back", description: "The element in Scene A feels ordinary in its original context.", weight: 0.25 },
          { name: "Callback in Scene B is clear and exact", description: "The element is echoed specifically — not approximately — in Scene B.", weight: 0.35 },
          { name: "Scene B changes the meaning of Scene A's element", description: "After Scene B, the original moment means something different than it did alone.", weight: 0.40 },
        ],
      },
      {
        id: "fp-5",
        title: "The Inevitable Ending",
        lesson: "The best endings feel both surprising and inevitable. The surprise is what happens. The inevitability is: of course it had to be this, given everything that came before. Inevitability is engineered retroactively — you decide on the ending, then work backward to plant what makes it feel earned. The reader should finish and think: I should have seen that coming. The fact that they didn't is the surprise.",
        prompt: "Write an ending scene of 150–200 words. Before you write, state the ending in one sentence. Then plant two specific details earlier in your excerpt (in a brief 80–100 word setup passage) that make the ending feel inevitable in retrospect. The details should not obviously signal the ending in the setup, but should feel like they were always pointing there.",
        wordCountMin: 240,
        wordCountMax: 320,
        criteria: [
          { name: "Ending is stated in advance", description: "One sentence before the excerpt names what the ending is.", weight: 0.15 },
          { name: "Two plants are present in the setup", description: "Two specific details in the setup passage point toward the ending without announcing it.", weight: 0.30 },
          { name: "Ending feels inevitable in light of the plants", description: "After reading, the setup's details feel like they were always pointing here.", weight: 0.35 },
          { name: "Plants don't announce themselves in the setup", description: "In the setup, the two details feel like characterization or atmosphere — not obvious arrows.", weight: 0.20 },
        ],
      },
    ],
  },

  {
    id: "strong-ledes",
    title: "Writing Strong Ledes",
    genre: "nonfiction",
    difficulty: "beginner",
    description:
      "The lede is the first sentence or two of any piece of nonfiction. It determines whether your reader stays or leaves. In this track you'll write six ledes and get scored against the craft criteria editors actually use.",
    exercises: [
      {
        id: "lede-1",
        title: "Cut the Throat-Clearing",
        lesson:
          "The first sentence most writers produce is not their lede — it's warm-up. Clearing your throat. Telling the reader why this matters before you've earned the right to say so. Real ledes skip all of that. They drop you directly into the story. Your job is to find where the story actually begins and cut everything before it.",
        prompt: "A bloated paragraph buries its person at the end. Find where the story starts and cut everything before it.",
        wordCountMin: 10,
        wordCountMax: 60,
        criteria: [
          { name: "No windup", description: "Opens directly on a person or concrete detail — no statistics or policy framing first.", weight: 0.5 },
          { name: "Person present", description: "The specific person appears in the first sentence.", weight: 0.5 },
        ],
        stages: [
          {
            label: "Get closer",
            criteria: [
              { name: "No statistic opener", description: "Does not open with statistics, 'studies show,' 'millions,' or sweeping national context.", weight: 0.5 },
              { name: "Closer to the person", description: "The specific person or a concrete detail about them appears earlier than in the original.", weight: 0.5 },
            ],
            passThreshold: 50,
            wordCountMin: 10,
            wordCountMax: 60,
            variants: [
              {
                given: "The issue of food insecurity is one that affects many people across the United States. Studies have shown that millions of Americans don't know where their next meal is coming from. This is particularly true in rural areas where access to grocery stores is limited. One such person is Maria, a 34-year-old mother of three in eastern Kentucky, who drives 45 minutes to the nearest Walmart.",
                prompt: "That paragraph starts four sentences too early. Maria is the story. Cut the windup and get closer to her. The only rule: don't open with 'the issue of' or a statistic.",
              },
              {
                given: "Healthcare costs in the United States have risen dramatically in recent years, creating impossible choices for millions of working Americans. Prescription drugs, in particular, have seen price spikes that outpace inflation and wage growth. Diabetics who rely on insulin face some of the most severe consequences. James, a 52-year-old truck driver in rural Ohio, splits his insulin doses in half to make each bottle last twice as long.",
                prompt: "James is buried four sentences in. The three sentences before him are context the reader doesn't need yet. Cut to James. Don't open with 'healthcare costs' or any variation.",
              },
              {
                given: "Student loan debt has become one of the defining financial pressures facing Americans in their 20s and 30s. Total outstanding student debt now exceeds $1.7 trillion. Advocates have pushed for cancellation while critics argue it would be unfair to those who paid off their loans. Sofia, a 31-year-old social worker in Detroit, doesn't open her bank app on the first of the month when the loan payment posts.",
                prompt: "Sofia is the lede. The $1.7 trillion number is not. Cut until you're with Sofia. Don't open with a statistic or the words 'student loan debt.'",
              },
              {
                given: "The deindustrialization of the American Midwest has been documented by economists and journalists for decades. When manufacturing plants close, the effects ripple through local economies for years. Workers who spent their careers in a single plant often find their skills untranslatable in the modern job market. Ray, a 58-year-old machinist in Youngstown, still sets his alarm for 5:45 a.m. even though the plant closed eight months ago.",
                prompt: "Ray is the story. 'The deindustrialization of the American Midwest' is not. Cut. Don't open with economists or decades — open on Ray.",
              },
              {
                given: "The burden of elder care in the United States falls disproportionately on adult daughters, who often reduce their own working hours or leave jobs entirely to provide care. The cost of assisted living facilities is out of reach for most middle-class families. Policy proposals for caregiver subsidies have stalled in Congress for years. Luisa, a 44-year-old accountant in Phoenix, drives two hours each way to her mother's apartment every Sunday to manage her medications.",
                prompt: "Luisa is the story. 'The burden of elder care' is not. Cut the policy framing and get to Luisa. Don't open with any generalization about American caregiving.",
              },
            ],
          },
          {
            label: "Drop in",
            criteria: [
              { name: "Person is first subject", description: "The specific person is the grammatical subject of the first sentence — in the first five words.", weight: 0.4 },
              { name: "Active voice", description: "No passive constructions. The verb shows action — not 'is,' 'has been,' 'finds herself.'", weight: 0.35 },
              { name: "No windup", description: "Nothing appears before the person — no statistics, no context-setting, no national framing.", weight: 0.25 },
            ],
            passThreshold: 65,
            wordCountMin: 10,
            wordCountMax: 45,
            variants: [
              {
                given: "The housing affordability crisis in American cities has made renting increasingly out of reach for working-class residents. In Los Angeles, median rent for a one-bedroom apartment now exceeds $2,000 per month. New immigrants often face the greatest challenges, lacking established credit or connections to housing networks. Ana, a 29-year-old nursing assistant, sleeps on a cot in her cousin's living room because she cannot afford a room of her own in the city where she works.",
                prompt: "Ana must be your first subject — in your opening five words. Active voice: no 'is sleeping,' 'has been,' 'finds herself.' Under 45 words. Cut everything before her.",
              },
              {
                given: "The opioid epidemic has claimed hundreds of thousands of lives over the past two decades and left millions more struggling with addiction. The crisis hit hardest in communities already weakened by economic decline. Recovery is a long and nonlinear process that is poorly supported by the current healthcare system. Marcus, a 37-year-old former coal miner in West Virginia, has been sober for fourteen months and still counts each morning as a small thing to be grateful for.",
                prompt: "Marcus leads. In your first five words. No 'Marcus has been' (that buries the action). Pick a verb that shows Marcus doing something. Under 45 words.",
              },
              {
                given: "Climate change is forcing difficult decisions on American farmers who have worked the same land for generations. Drought, flooding, and unpredictable growing seasons have made planning nearly impossible. Small family farms are disappearing faster than at any point since the Dust Bowl. Priya, a 38-year-old farmer in the Sacramento Valley, planted drought-tolerant varieties across her fields this spring and is still not sure it will be enough.",
                prompt: "Priya first, in your opening words. Active verb. Under 45 words. She does something — she plants, she watches, she decides. No statistics. Start the clock when Priya starts.",
              },
              {
                given: "The retirement savings crisis affects tens of millions of Americans who find that what they saved over a lifetime is not sufficient to cover basic expenses. Social Security was designed to supplement retirement savings, not replace them. Many retirees are re-entering the workforce in their 60s and 70s out of financial necessity. Henry, a 73-year-old retired electrician in Pittsburgh, started stocking shelves at a Walmart in March because his savings ran out.",
                prompt: "Henry is first, five words in at most. Active verb. Under 45 words. He does something concrete. The Walmart detail is gold — use it, don't bury it.",
              },
              {
                given: "Access to mental healthcare in the United States has long been inadequate, but the problem has worsened since the pandemic. Rural areas are disproportionately affected by therapist shortages. Insurance reimbursement rates for psychiatric services are so low that many providers do not accept insurance at all. Carmen, a 26-year-old teacher in rural Tennessee, has been on a waitlist for a therapist for seven months.",
                prompt: "Carmen leads. Not 'Carmen has been waiting' — that's still passive-ish. Find a verb that shows Carmen doing something, even if that something is waiting. Active, under 45 words.",
              },
            ],
          },
          {
            label: "Create pull",
            criteria: [
              { name: "Person opens", description: "The person is the very first thing we encounter — no context before them.", weight: 0.3 },
              { name: "Strong active verb", description: "Specific active verb — not 'is,' 'has,' 'was,' or any static/generic verb.", weight: 0.35 },
              { name: "Forward tension", description: "The lede implies a question or stakes without stating them. The reader is pulled forward.", weight: 0.35 },
            ],
            passThreshold: 75,
            wordCountMin: 10,
            wordCountMax: 35,
            variants: [
              {
                given: "Veteran homelessness is a persistent problem in the United States, with an estimated 35,000 veterans experiencing homelessness on any given night. Many veterans face a combination of PTSD, substance abuse, and difficulty accessing services. Tom, a 41-year-old Marine veteran in San Diego, has slept in the cab of his pickup truck for six months. There is a Semper Fi sticker on the rear window.",
                prompt: "Under 35 words. Tom first. A verb that shows action. Pick the one detail that does the most work — the truck, the sticker, the months — and don't explain what it means.",
              },
              {
                given: "Healthcare workers in the United States are often divided into two tiers: highly compensated clinicians and dramatically underpaid support staff. Hospital housekeepers and orderlies are among the lowest-paid workers in the healthcare system. Many cannot afford the very employer-sponsored health insurance that is available to them. Denise, a 48-year-old hospital housekeeper in Memphis, works two jobs and still can't afford the hospital's own health plan.",
                prompt: "Under 35 words. Denise first. Active verb. The irony of working in a hospital and not being able to afford its insurance is the whole story — let it land without explaining it.",
              },
              {
                given: "Many undocumented immigrants in the United States have lived and worked in the same communities for decades, paying taxes and raising families. A single traffic stop can change everything. Jorge, a 55-year-old farmworker in Salinas, California, has worked the same lettuce fields for 22 years and still flinches when a car slows down on the road beside him.",
                prompt: "Under 35 words. Jorge first. Active verb — not 'Jorge has worked' (static). The detail about the car slowing down is the heart of the lede. Use it or find your own angle.",
              },
              {
                given: "In May 2022, a gunman killed 19 students and two teachers at Robb Elementary School in Uvalde, Texas. Teachers in Uvalde and across the country have had to process collective trauma while continuing to show up for their students. Marisol, a sixth-grade teacher in Uvalde, spent the summer before the new school year buying plants for her classroom because looking at the walls made it easier.",
                prompt: "Under 35 words. Marisol first. Active verb. The plants are there — they do real work. Don't explain Uvalde. Don't explain the plants. Just write the lede.",
              },
              {
                given: "The American Southwest is facing a water crisis that hydrologists say will reshape where millions of people can live. Phoenix and other desert cities built on the premise of unlimited water are confronting limits that were always there. Evelyn, a 63-year-old retiree in Phoenix, put her house on the market in April after her water bill tripled.",
                prompt: "Under 35 words. Evelyn first. Active verb. The water bill tripling — that's the fact. The act of listing a house — that's the consequence. Make it land.",
              },
            ],
          },
        ],
      },
      {
        id: "lede-2",
        title: "Put the Actor First",
        lesson:
          "Passive voice buries the actor. 'A decision was made' — by whom? 'Protests were organized' — by whom? Every passive construction hides accountability. In a lede, this is deadly: you have one sentence to make the reader care, and passive verbs drain all the energy out of it. The fix is mechanical — find who did the thing, and put them first.",
        prompt: "Passive sentences hide who did what. Rewrite with the actor before the action.",
        wordCountMin: 5,
        wordCountMax: 40,
        criteria: [
          { name: "Actor first", description: "The subject of the sentence is the person or body that did something.", weight: 0.5 },
          { name: "Active verb", description: "No 'was,' 'were,' 'had been.' Something happens.", weight: 0.5 },
        ],
        stages: [
          {
            label: "Name the actor",
            criteria: [
              { name: "Actor named", description: "A specific person or body is the grammatical subject — not the thing that was done to someone.", weight: 0.5 },
              { name: "Action named", description: "We know what they did, stated clearly.", weight: 0.5 },
            ],
            passThreshold: 50,
            wordCountMin: 5,
            wordCountMax: 30,
            variants: [
              {
                given: "A decision was made by the city council last Tuesday to close three public libraries in low-income neighborhoods. The libraries had been serving the community for over 40 years. Protests were organized by residents.",
                prompt: "Pick any one sentence. Rewrite just that sentence so the actor comes before the action. Don't rewrite the whole paragraph — just prove you can flip one sentence.",
              },
              {
                given: "Seventeen books were removed from the curriculum by the school board following complaints from parents. The books had been taught in the district for over a decade. A petition was signed by more than 400 students and teachers requesting their reinstatement.",
                prompt: "One sentence. Who removed the books? Put them first. Then what they did.",
              },
              {
                given: "The maternity ward at County General was closed last month due to budget cuts approved by the hospital board. More than 200 births had been delivered there annually. Families will now be required to travel 40 minutes to the nearest alternative.",
                prompt: "Who made the decision? Pick the sentence where the decision-maker is buried and put them first.",
              },
              {
                given: "Two hundred workers were laid off by Nextel Industries on Friday in a move described by analysts as a restructuring. The workers had been employed by the company for an average of 11 years. A statement was released citing 'challenging market conditions.'",
                prompt: "The workers are the object of the action, not the subject. Find who did the laying off. Put them first.",
              },
              {
                given: "A $4 million fine was levied against Darby Chemical last week for violations of the Clean Water Act. The violations were documented by inspectors over a three-year period. An appeal has been announced by the company.",
                prompt: "Someone levied a fine. Someone documented violations. Pick one sentence and put the actor before the action.",
              },
            ],
          },
          {
            label: "Active verb",
            criteria: [
              { name: "Actor first", description: "The decision-making body or person is the grammatical subject.", weight: 0.4 },
              { name: "Active verb", description: "Specific active verb — not any form of 'be' or 'have.'", weight: 0.4 },
              { name: "Clarity", description: "One read is enough to understand who did what.", weight: 0.2 },
            ],
            passThreshold: 65,
            wordCountMin: 8,
            wordCountMax: 40,
            variants: [
              {
                given: "A proposal to cut public transit funding was advanced by the city council on Wednesday, a move that would affect more than 200,000 daily riders. The decision was criticized by transit advocates. A final vote is expected next month.",
                prompt: "Full lede, one or two sentences. The city council did something — put them first. Active verb. No 'was advanced,' 'was criticized.' Under 40 words.",
              },
              {
                given: "Approval was granted by the FDA last Thursday for a new antidepressant manufactured by Zenith Pharmaceuticals. The drug had been shown in clinical trials to work faster than existing options. The decision was welcomed by psychiatrists and patient advocates.",
                prompt: "The FDA approved something. Put them first. Active verb. One sentence, under 40 words.",
              },
              {
                given: "A new admissions policy that eliminates legacy preferences was announced by Stanford University on Monday. The policy will take effect for the incoming class of 2026. The decision was praised by equity advocates and criticized by some alumni donors.",
                prompt: "Stanford did something. Put them first. Active verb. Under 40 words. What did Stanford actually change?",
              },
              {
                given: "Eviction proceedings were filed against 47 tenants in a single building on Maple Street by its new owner, a private equity firm based in Austin. The tenants had been living in the building for an average of eight years. An emergency council meeting was called in response.",
                prompt: "The private equity firm did something. Put them first. Active verb. Under 40 words. The number 47 is there — use it.",
              },
              {
                given: "Layoff notices were sent to 12 teachers at Lincoln Elementary by the school district on Friday, citing budget shortfalls. The school serves a student body that is 80% low-income. An emergency school board meeting was called by parents over the weekend.",
                prompt: "The district did something. Active verb. Under 40 words. Actor first — not the notices, not the teachers. The entity that made the decision leads.",
              },
            ],
          },
          {
            label: "Compress and land",
            criteria: [
              { name: "Actor first", description: "The decision-maker is the grammatical subject.", weight: 0.35 },
              { name: "Active specific verb", description: "The verb is active and precise — not generic.", weight: 0.35 },
              { name: "Weight without editorializing", description: "Sentence conveys consequence without telling the reader how to feel about it.", weight: 0.3 },
            ],
            passThreshold: 75,
            wordCountMin: 8,
            wordCountMax: 28,
            variants: [
              {
                given: "The governor of Mississippi signed legislation on Tuesday that will ban gender-affirming care for minors under the age of 18. The bill passed both chambers of the Republican-controlled legislature last month. Opponents have already filed a legal challenge.",
                prompt: "Under 28 words. Governor first. Active verb. Don't call the bill 'controversial' or 'landmark.' The law does something specific — name it.",
              },
              {
                given: "Following a closed-door vote, the board of trustees of Mercy Hospital announced that the emergency department would be permanently closed, effective April 1. The ED has been in operation for 61 years. It is the only emergency facility within 30 miles for more than 80,000 residents.",
                prompt: "Under 28 words. Board of trustees first. Active verb. Don't editorialize — the 30-mile radius carries the weight. Let one fact do the work.",
              },
              {
                given: "A unanimous decision to demolish the city's only remaining community center in the Southside neighborhood was reached by the parks commission on Monday. The center has operated for 55 years and serves more than 3,000 residents weekly.",
                prompt: "Under 28 words. Parks commission first. Active verb. Don't explain what the community center means to the community — just what the commission did.",
              },
              {
                given: "An agreement was finalized by the teachers' union and the school board on Sunday after a 19-day strike that kept 34,000 students out of school. The union won a 12% pay increase over three years. Both sides described the deal as a compromise.",
                prompt: "Under 28 words. Pick your actor — the union, the board, or both. Active verb. The 19-day strike is context; the deal is the news.",
              },
              {
                given: "A settlement of $8.3 million was reached between the city of Baltimore and the family of a man who died in police custody in 2019. The city did not admit wrongdoing as part of the settlement. The agreement was described as 'a step toward accountability.'",
                prompt: "Under 28 words. Who settled with whom? Active verb. No 'tragic' or 'controversial.' The $8.3 million and the denial of wrongdoing can coexist in one sentence.",
              },
            ],
          },
        ],
      },
      {
        id: "lede-3",
        title: "Pick the One Fact",
        lesson:
          "Editors talk about 'burying the lede' — putting the interesting thing three paragraphs in while boring setup sits on top. The same mistake happens inside a single lede: writers list three facts when only one of them is actually arresting. The skill here is selection, not writing. Which one fact makes a stranger pause? That's your lede. Use just that one.",
        prompt: "From a set of facts, identify the one that makes a reader stop. Write only that one, as a single clean sentence.",
        wordCountMin: 5,
        wordCountMax: 30,
        criteria: [
          { name: "One sentence", description: "Exactly one sentence.", weight: 0.4 },
          { name: "Best fact chosen", description: "The most surprising or compelling fact is chosen.", weight: 0.6 },
        ],
        stages: [
          {
            label: "Write any fact",
            criteria: [
              { name: "One sentence", description: "Exactly one sentence, not two.", weight: 0.5 },
              { name: "Uses a listed fact", description: "The sentence is based on one of the given facts — not invented detail.", weight: 0.5 },
            ],
            passThreshold: 50,
            wordCountMin: 5,
            wordCountMax: 25,
            variants: [
              {
                given: "Five facts:\n1. A 71-year-old retired teacher in Wisconsin has started a YouTube channel.\n2. She has 2.3 million subscribers.\n3. Her videos are about identifying wild mushrooms.\n4. She films them in her backyard.\n5. She was diagnosed with early-stage dementia two years ago.",
                prompt: "Pick any fact. Write one clean sentence using only that fact. Don't combine facts. Just practice the format: one fact, one sentence.",
              },
              {
                given: "Five facts:\n1. A 44-year-old plumber in Memphis became a licensed attorney at age 44.\n2. He passed the bar exam on his fourth attempt.\n3. He attended law school at night while working full time.\n4. His first case as an attorney was defending his former employer in a wage dispute.\n5. He won.",
                prompt: "One fact, one sentence. Pick any. Don't combine or add context that isn't in the list.",
              },
              {
                given: "Five facts:\n1. A Walmart in rural Montana has become the de facto community center for the town of Harlem, population 870.\n2. It hosts weekly AA meetings in the break room.\n3. The local library closed in 2018.\n4. The town's only doctor retired and was not replaced.\n5. The Walmart parking lot is where teenagers go on weekend nights.",
                prompt: "One fact, one sentence. Any fact. Practice stating a fact plainly with no editorializing.",
              },
              {
                given: "Five facts:\n1. A man in Tokyo has not spoken to any other human being in seven years, by choice.\n2. He lives in an apartment.\n3. He has a job done entirely online.\n4. He has a cat.\n5. He wrote a 90,000-word memoir about the experience.",
                prompt: "One clean sentence using one fact. Any one. Just the fact, nothing added.",
              },
              {
                given: "Five facts:\n1. A 12-year-old in rural Kentucky is the primary caregiver for her two younger siblings.\n2. Both parents are incarcerated.\n3. She gets herself and her siblings to school every day by walking two miles.\n4. She has not missed a day of school in two years.\n5. She is on the honor roll.",
                prompt: "One fact, one sentence. Pick any. State it plainly.",
              },
            ],
          },
          {
            label: "Pick the right one",
            criteria: [
              { name: "Strongest fact chosen", description: "The chosen fact is the most surprising or emotionally resonant — not the most obvious or expected.", weight: 0.5 },
              { name: "No editorializing", description: "Does not use words like 'remarkably,' 'despite,' or 'incredibly' to dress up the fact.", weight: 0.3 },
              { name: "One clean sentence", description: "One sentence, grammatically clean.", weight: 0.2 },
            ],
            passThreshold: 65,
            wordCountMin: 5,
            wordCountMax: 25,
            variants: [
              {
                given: "Five facts:\n1. A 71-year-old retired teacher in Wisconsin has started a YouTube channel.\n2. She has 2.3 million subscribers.\n3. Her videos are about identifying wild mushrooms.\n4. She films them in her backyard.\n5. She was diagnosed with early-stage dementia two years ago.",
                prompt: "Which fact makes a stranger pause? Write one sentence using the strongest fact. No editorializing — just the fact, stated plainly.",
              },
              {
                given: "Five facts:\n1. A federal prison in Alabama serves inmates meals that cost an average of $2.43 per day.\n2. The prison is privately operated.\n3. The same company operates prisons in six states.\n4. The company's CEO earned $8.7 million last year.\n5. The state of Alabama paid the company $52 million in the same year.",
                prompt: "One of these facts is the lede. The others are context. Write the one sentence that stops a reader from scrolling.",
              },
              {
                given: "Five facts:\n1. The United States has more self-storage facilities than McDonald's, Starbucks, and Subway combined.\n2. There are approximately 50,000 self-storage facilities in the country.\n3. The industry generates $40 billion in annual revenue.\n4. The average American household uses 7.3 square feet of storage space.\n5. One in eleven American households currently rents a storage unit.",
                prompt: "Which of these is the lede? Not the most comprehensive fact — the most surprising. Write it clean. One sentence.",
              },
              {
                given: "Five facts:\n1. A woman in Tulsa has kept every piece of mail she has ever received since 1987.\n2. She has 74 boxes of mail.\n3. She doesn't know why she started.\n4. She has never opened any box after filling it.\n5. She is a retired postal worker.",
                prompt: "One of these facts is doing most of the work. Write it cleanly. The fact should be enough — don't help it with explanation.",
              },
              {
                given: "Five facts:\n1. A county in rural West Virginia has a higher rate of library card ownership than any county in Connecticut.\n2. The county has a median household income of $28,000.\n3. It has one library.\n4. The library is open six days a week.\n5. The librarian has worked there for 31 years.",
                prompt: "Which fact creates the most productive surprise? Write it as one clean sentence. No setup needed.",
              },
            ],
          },
          {
            label: "Plain and true",
            criteria: [
              { name: "Strongest fact", description: "The most surprising or resonant fact is chosen — not the most expected.", weight: 0.4 },
              { name: "Plain language", description: "Reads like something a person would say aloud — no press-release phrasing.", weight: 0.3 },
              { name: "Creates genuine curiosity", description: "After reading it, a stranger wants to know more.", weight: 0.3 },
            ],
            passThreshold: 75,
            wordCountMin: 5,
            wordCountMax: 25,
            variants: [
              {
                given: "Five facts:\n1. A hospice nurse in Vermont has been present at more than 1,000 deaths in her 30-year career.\n2. She has kept a journal since her first year on the job.\n3. She writes one sentence about each patient who dies in her care.\n4. The journal now runs to 900 pages.\n5. She has never shared it with anyone.",
                prompt: "Pick the fact that makes you want to know more. Write it as plainly as you'd say it to a friend. No press-release language. Just the fact.",
              },
              {
                given: "Five facts:\n1. The town of Centralia, Pennsylvania has been on fire underground since 1962.\n2. The fire is caused by a coal seam that ignited beneath a landfill.\n3. There is no known way to extinguish it.\n4. The town's population has fallen from 1,100 to 5 people.\n5. Five people still live there.",
                prompt: "One of these facts lands harder than the others. Write it plain. If you want to add 'remarkably' — that means the fact is doing the work without your help. Let it.",
              },
              {
                given: "Five facts:\n1. A man in Ohio has sued 12 different fast food companies in the past decade.\n2. He has won every case.\n3. He represents himself.\n4. He went to law school for two semesters before dropping out.\n5. He is currently suing McDonald's for the third time.",
                prompt: "Pick the one fact that makes a stranger put down their phone to tell someone. Write it plain. One sentence. The fact should be enough.",
              },
              {
                given: "Five facts:\n1. A public school in Detroit has had 47 different teachers in a single school year.\n2. The school serves 320 students, grades K through 5.\n3. The state has been overseeing the district for 11 years.\n4. Student test scores have not improved during that period.\n5. The school cannot retain staff.",
                prompt: "One fact is the lede. The others explain or follow from it. Write the lede fact cleanly — no editorializing, no setup. One sentence.",
              },
              {
                given: "Five facts:\n1. A small town in Nebraska has been losing population since 1950.\n2. The town has a population of 112.\n3. There are 412 registered voters.\n4. Voter turnout in the last municipal election was 100%.\n5. The winning candidate received 212 votes.",
                prompt: "Read these facts twice. Something doesn't add up — that's the lede. Write the fact that contains the puzzle. One sentence. Plain.",
              },
            ],
          },
        ],
      },
      {
        id: "lede-4",
        title: "Write the Scene",
        lesson:
          "A scene lede puts the reader in a specific place at a specific time. It does not explain or summarize — it shows one moment, and through that moment implies everything the story is about. The discipline is restraint: you do not need to set the whole stage. One sharp detail does more work than a paragraph of description. Enter as late as possible. Leave as early as possible.",
        prompt: "Write a scene lede that puts the reader in a specific moment with a specific person and object. Don't explain — show.",
        wordCountMin: 10,
        wordCountMax: 80,
        criteria: [
          { name: "Person in a moment", description: "Person is in a specific scene, not introduced or summarized.", weight: 0.5 },
          { name: "Withholds explanation", description: "Does not tell us what the story is about or what anything means.", weight: 0.5 },
        ],
        stages: [
          {
            label: "Person in the room",
            criteria: [
              { name: "Person is present", description: "The person is in a specific moment — not introduced with backstory.", weight: 0.4 },
              { name: "One specific object", description: "A single specific object (not 'items' or 'belongings') appears.", weight: 0.6 },
            ],
            passThreshold: 50,
            wordCountMin: 10,
            wordCountMax: 50,
            variants: [
              {
                given: "Story context: A US Border Patrol evidence officer named Tom Kiefer spent years processing confiscated items from migrants — clothing, shoes, photographs, rosaries — and throwing them away per procedure. Instead of discarding them, he began secretly photographing each object. He now has over 6,000 photographs.",
                prompt: "Put Tom in a room with one object. 1–2 sentences. Don't explain the project. Just: what is he doing with what specific thing right now?",
              },
              {
                given: "Story context: A retired portrait painter named Ruth Bergmann, 78, has spent the last six years painting the portraits of dementia patients at the nursing home where her husband lives. She paints them at the moment when, for a few seconds, they seem most like themselves. She has completed 340 portraits and gives them to families when patients die.",
                prompt: "Put Ruth in the room with one patient and a canvas. 1–2 sentences. Don't explain the project or say 'dementia.' Just: Ruth, the canvas, one moment.",
              },
              {
                given: "Story context: An 88-year-old former mail carrier named Calvin Washington has written a letter every day since his wife died in 2007. He addresses each letter to a different person — politicians, athletes, strangers whose names he finds in news articles. He mails them all. He has never received a response.",
                prompt: "Put Calvin at a table with a letter. 1–2 sentences. What does he do with his hands? What's on the table? Don't tell us who he writes to yet.",
              },
              {
                given: "Story context: A taxidermist in rural Montana named Dale has been preserving roadkill for the state's natural history museum for 22 years. He has preserved over 800 animals — birds, foxes, deer, once a mountain lion. He has never charged more than his cost of materials. His workshop is in his garage.",
                prompt: "Put Dale in the garage with one animal. 1–2 sentences. What does he do first? What's specific about this animal or the workspace? Don't explain the museum relationship yet.",
              },
              {
                given: "Story context: A bakery in Portland called Nightshift Bread opens its doors at 3 a.m. for customers who work overnight shifts. Its owner, Lee Park, started it after her husband, a hospital nurse, told her he'd never been able to buy fresh bread. She has been open four years. Her 3 a.m. line sometimes wraps around the block.",
                prompt: "Put Lee in the bakery at 3 a.m. with one specific thing — a loaf, the counter, the door opening. 1–2 sentences. Don't explain why the bakery exists yet.",
              },
            ],
          },
          {
            label: "Add a sense",
            criteria: [
              { name: "Specific object", description: "One named, specific object — not a category or vague description.", weight: 0.3 },
              { name: "Sensory detail", description: "At least one sensory detail — not emotional, an actual sense: sight, touch, smell, sound.", weight: 0.4 },
              { name: "Withholds explanation", description: "Does not name or explain what the story is about.", weight: 0.3 },
            ],
            passThreshold: 65,
            wordCountMin: 15,
            wordCountMax: 60,
            variants: [
              {
                given: "Story context: A retired forest ranger named Frank Malone, 66, has spent each summer for the past 11 years living alone in a fire lookout tower in the Cascade Mountains. He is one of the last volunteer lookouts in the country. His 14-by-14-foot cabin is perched 7,000 feet above sea level. He has spotted 43 fires.",
                prompt: "Put Frank in the tower doing something specific. Add a sensory detail — what does he see, hear, or feel? Don't explain what the tower is or why he's there.",
              },
              {
                given: "Story context: A hospital in Denver employs a full-time beekeeper named Sara Ortiz to maintain 12 hives on the hospital's rooftop garden. The honey is used in the café and given to burn unit patients as a wound treatment. Sara came to beekeeping after a long illness and says she finds hospitals less frightening than she used to.",
                prompt: "Put Sara on the roof with the hives. Add a sensory detail — what does she hear, smell, see? Don't explain the honey's medical use yet. Just Sara and the bees.",
              },
              {
                given: "Story context: A town archivist in Gloucester, Massachusetts named Helen Park has spent 14 years cataloging the town's flood of 1978, which destroyed most of its records. She interviews elderly residents to reconstruct what was lost. She has filled 200 notebooks. She is 82 years old and still comes in three days a week.",
                prompt: "Put Helen in the archive with a notebook and one thing she finds or records. Sensory: what does the notebook feel like, look like? Don't explain the project or the flood.",
              },
              {
                given: "Story context: A night security guard at the Detroit Institute of Arts named Marcus Webb has been photographing his own reflection in the paintings he guards for 12 years. He uses his phone, taken quickly. He has 4,000 photographs. The museum does not know. He intends to show them someday.",
                prompt: "Put Marcus in front of one painting at 2 a.m. Sensory: light, his phone screen, the painting's surface. 2–3 sentences. Don't explain what he's doing or why.",
              },
              {
                given: "Story context: An ice sculptor in Chicago named Dan Cho has carved sculptures for funerals for 15 years. Clients request things associated with the deceased — a favorite bird, a boat, an old house. He works in a refrigerated van behind the funeral home, usually the night before. 'The ice melts,' he says. 'That's the point.'",
                prompt: "Put Dan in the van the night before a funeral with one specific sculpture. Sensory: the cold, the sound of the tool, the shape. Don't explain the symbolism.",
              },
            ],
          },
          {
            label: "Scene discipline",
            criteria: [
              { name: "Specific scene", description: "Reader is in one moment — not a summary, introduction, or backstory.", weight: 0.35 },
              { name: "Sensory grounding", description: "At least one precise sensory detail.", weight: 0.3 },
              { name: "Withholds and implies", description: "Does not explain what the scene means, but the weight is felt through the details chosen.", weight: 0.35 },
            ],
            passThreshold: 75,
            wordCountMin: 25,
            wordCountMax: 80,
            variants: [
              {
                given: "Story context: A mail carrier named Donna Payne, 61, is retiring after 32 years on the same route in Akron, Ohio. On her last day, she brought handwritten notes for each of the 87 houses on her route. She has watched children grow up, leave, and come back. She walked the route alone at 5 a.m. before her shift began.",
                prompt: "Full scene, 2–4 sentences. Donna on the route on her last morning. One sharp detail — a house she knows, something she carries, the dark. Don't summarize what 32 years means. Show us one moment.",
              },
              {
                given: "Story context: The last human lighthouse keeper in New England, Bernard Albrecht, handed over his lighthouse to an automated system in March. He had lived there for 28 years. His wife died in the lighthouse in 2014. He brought one box when he left.",
                prompt: "Full scene, 2–4 sentences. Bernard's last night or last morning. One object, one sensory detail, one action. Don't tell us how he feels. Let the scene carry it.",
              },
              {
                given: "Story context: After a flood damaged the archives of a small historical society in Kentucky, the only remaining employee — a 58-year-old librarian named Sadie Holt — began hand-drying each document with a hair dryer. She spent four months doing it before state help arrived. She saved about 40% of the collection.",
                prompt: "Put Sadie in the archive with a document and a hair dryer. 2–4 sentences. What does the paper look like? What does she do with it? Don't explain what she saved or why it matters.",
              },
              {
                given: "Story context: A demolition contractor named Wayne Kelly was assigned to tear down the house where he grew up. He didn't tell his crew until they'd started. The house had been condemned. His mother had moved out the year before.",
                prompt: "Put Wayne at the site — before the crew arrives, or at the moment they start, or at the end. 2–4 sentences. One specific detail — what he touches, what he sees first. Don't tell us how he feels.",
              },
              {
                given: "Story context: A clock repairman named Joseph Huang, 74, has operated his shop in San Francisco's Chinatown for 46 years. He repairs only mechanical clocks — nothing digital, nothing battery-operated. He has 200 clocks in various states of repair. He says each one has its own sound and he knows by sound which ones are dying.",
                prompt: "Put Joseph in the shop with one specific clock. 2–4 sentences. What does he do with his hands? What does the clock sound like? Don't tell us about 46 years. Put us in the room right now.",
              },
            ],
          },
        ],
      },
      {
        id: "lede-5",
        title: "Lede + Nut Graf",
        lesson:
          "Long-form nonfiction often uses a 'delayed lede': a scene or anecdote at the top, followed by a nut graf that steps back and signals why this story matters right now, at scale. The lede earns the nut graf. The nut graf justifies the lede. They are a matched pair: one makes you feel something; the other tells you why that feeling matters beyond this one person.",
        prompt: "Write a lede grounded in one person's story, then a nut graf that zooms out to why it matters.",
        wordCountMin: 40,
        wordCountMax: 150,
        criteria: [
          { name: "Lede is specific", description: "Opens on a person or concrete moment — not a generalization.", weight: 0.5 },
          { name: "Nut graf zooms out", description: "Second paragraph signals what this story means beyond this one person.", weight: 0.5 },
        ],
        stages: [
          {
            label: "Write the pair",
            criteria: [
              { name: "Lede is present", description: "Opens on something specific — not a general observation about society.", weight: 0.4 },
              { name: "Nut graf is present", description: "A second paragraph or sentence shifts to the broader question or stakes.", weight: 0.6 },
            ],
            passThreshold: 50,
            wordCountMin: 40,
            wordCountMax: 150,
            variants: [
              {
                given: "Story context: In 2019, James, 28, turned off all social media, email, and messaging apps for one full year. No exceptions. He slept more. He reconnected with three old friends by phone. He missed a job offer. His girlfriend left him. He says he would do it again.",
                prompt: "Write a lede (something specific about James) and a nut graf (why this matters beyond James). Rough is fine. Just get both on the page.",
              },
              {
                given: "Story context: Sara, a 34-year-old software engineer earning $130,000 a year, has lived in a converted van for three years. She drives it to an office park every morning, showers at a gym, and parks on residential streets at night. She is saving 70% of her income. She has never told her employer.",
                prompt: "Lede (something specific about Sara's daily routine) + nut graf (the broader question this raises). Get both pieces down. They don't need to be perfect.",
              },
              {
                given: "Story context: The town of Hale, Nebraska (population 340) has had one doctor for 31 years: Dr. Robert Shen, who moved there from Chicago in 1993. He has delivered 600 babies. He is 71 years old and has no plans to retire because there is no one to replace him. He drives to patients' houses when they can't come to him.",
                prompt: "Lede (something specific about Dr. Shen or a moment in his practice) + nut graf (the larger problem this one man represents). Get both down.",
              },
              {
                given: "Story context: A volunteer teacher named Nadia runs a coding class in a state prison in Georgia. Her students have passed certification exams and have job offers waiting. The recidivism rate for her graduates is under 5%, compared to a state average of 30%. She has been doing this for eight years on her own time and money.",
                prompt: "Lede (Nadia doing something specific in the classroom) + nut graf (what this says about how we approach criminal justice or workforce training). Both pieces, both present.",
              },
              {
                given: "Story context: New York City removed its last public payphone in May 2022. The payphone had been in operation since 1978. In its final weeks, it received thousands of calls from people who wanted to say they'd called a payphone. The city had removed 8,700 payphones over the previous decade.",
                prompt: "Lede (something specific — who called, what it looked like, a moment from its final weeks) + nut graf (the larger story about what disappears from public life). Get both down.",
              },
            ],
          },
          {
            label: "Specific + real zoom",
            criteria: [
              { name: "Lede is a moment", description: "Opens on a specific moment — not a summary of what someone did or who they are.", weight: 0.35 },
              { name: "Nut graf has real stakes", description: "Signals a tension or question larger than one person — not a generic observation about society.", weight: 0.35 },
              { name: "Both clearly present", description: "Lede and nut graf are both present and distinct from each other.", weight: 0.3 },
            ],
            passThreshold: 65,
            wordCountMin: 50,
            wordCountMax: 130,
            variants: [
              {
                given: "Story context: A hospice nurse named Diane has been present at more than 1,100 deaths in a 29-year career. She has driven through snowstorms and slept in her car to be there. She says she does it because she would not want to die alone. She is not religious.",
                prompt: "Lede: one specific moment from Diane's work — arriving, waiting, what she does in those hours. Not a summary of her career. Nut graf: the broader question about how we die in America, alone or attended. Lede is a moment. Nut graf has real stakes.",
              },
              {
                given: "Story context: Earl Watkins, 62, is the last working coal miner in Harlan County, Kentucky — a county that once employed 10,000 miners. He mines a small slope operation he owns himself. He knows the seam will run out in about three years. His son works in tech in Seattle. They don't talk about it.",
                prompt: "Lede: Earl doing something specific — in the mine, at home, at breakfast before a shift. Not a history of Harlan County. Nut graf: what this one man's continuation says about the end of something larger. Lede is a moment. Nut graf is the larger thing.",
              },
              {
                given: "Story context: A first-grade teacher named Ms. Flores in Albuquerque spends an average of $1,400 of her own money each year on classroom supplies. She earns $38,000 a year. She has done this for 14 years. She keeps her receipts in a folder labeled 'the gap.' Last year the folder was three inches thick.",
                prompt: "Lede: Ms. Flores doing something specific — at a store, opening the folder, a specific classroom moment. Nut graf: the larger question about school funding or what teachers quietly subsidize. Lede is a moment. Nut graf has actual stakes.",
              },
              {
                given: "Story context: A new study found that nurses who work rotating night shifts have significantly higher rates of anxiety, depression, and early cognitive decline than those on fixed schedules. Rotating shifts are used in 70% of American hospitals. The practice exists because it is cheaper to manage staffing this way.",
                prompt: "Lede: one specific nurse in one night-shift moment — 3 a.m., a hallway, something that only happens at night. Nut graf: the cost this imposes and who benefits from the current arrangement. Lede is a scene. Nut graf is the system.",
              },
              {
                given: "Story context: A public defender in Tucson named Marcus Reyes has an average caseload of 130 clients at any given time. The American Bar Association recommends 150 per year. He meets most clients for the first time in court. Almost all cases end in plea deals. He calls this 'efficiency' and says it with no affect.",
                prompt: "Lede: Marcus in a courthouse moment — meeting a client, signing something, waiting. Nut graf: what the system he works in says about the right to counsel. Lede is a moment. Nut graf is the machinery.",
              },
            ],
          },
          {
            label: "Earn the pair",
            criteria: [
              { name: "Specific lede", description: "One concrete moment or detail — not a summary or generalization.", weight: 0.3 },
              { name: "Nut graf zooms out", description: "Tells us why this story matters at scale — a real question or tension, not a vague statement.", weight: 0.35 },
              { name: "Clean pivot", description: "The move from specific to broad feels earned and natural — not abrupt or forced.", weight: 0.35 },
            ],
            passThreshold: 75,
            wordCountMin: 50,
            wordCountMax: 130,
            variants: [
              {
                given: "Story context: Ama Owusu, 84, is the last known fluent speaker of a language spoken by a small ethnic group in Ghana. Linguists have been recording her for three years. She has taught fragments to her grandchildren, but none are fluent. She says she is not sad. She says every language that disappears was spoken by people who thought it would last forever.",
                prompt: "Lede: Ama doing something in the language — talking, making a sound that doesn't exist in English. Nut graf: the broader fact of language death and what it erases. Lede specific. Nut graf zoomed. Transition earned.",
              },
              {
                given: "Story context: The town of Davenport, Iowa has flooded five times in the last 20 years and has declined to build a permanent flood wall. Each time, the town cleans up and returns. The mayor says the view of the Mississippi River is worth it. FEMA has paid out more than $120 million in flood aid to the town.",
                prompt: "Lede: someone specific in Davenport during or after a flood — pumping water, returning to a house, stacking sandbags. Nut graf: the tension between individual choice, public risk, and taxpayer cost. Earned pivot.",
              },
              {
                given: "Story context: Every Tuesday night, a line forms outside St. Anthony's food pantry in San Francisco starting around 9 p.m. The pantry opens at 8 a.m. Wednesday. Many in line are employed, some full time. The pantry runs out of food by 10 a.m. most Wednesdays.",
                prompt: "Lede: one person in that line on a Tuesday night — what they brought, where they're standing, what's around them. Nut graf: what this line says about food insecurity or working poverty. Specific lede. Real nut graf. Clean pivot.",
              },
              {
                given: "Story context: Detroit shut off water service to more than 17,000 households in a single year for unpaid bills, most of which were under $150. The average household was without water for three months before restoration. Many had children. The shutoffs were suspended during COVID and then resumed.",
                prompt: "Lede: one household, one moment — a tap that doesn't run, a child, a bucket, a particular morning. Nut graf: what the practice of water shutoffs says about how cities handle debt and who bears the cost. Lede is one moment. Nut graf is the machinery.",
              },
              {
                given: "Story context: A factory in Ohio is the last place in the United States that manufactures a specific type of brass instrument bell used in professional orchestral horns. The factory has 12 employees. Its owner, Pat McCann, 67, is the only person in the country who knows the full process. He has trained no one to replace him.",
                prompt: "Lede: Pat doing one step of the process — the specific physical work, one moment in the shop. Nut graf: what disappears when the last person who knows how to do something decides not to pass it on. Clean, specific, earned.",
              },
            ],
          },
        ],
      },
      {
        id: "lede-6",
        title: "Write One From Scratch",
        lesson:
          "You've cut throat-clearing, activated passive constructions, selected the sharpest fact, written a scene without editorializing, and built a lede-nut-graf pair. Now do it without a net. Pick something you actually know — a place, a person, a problem, a habit, a memory. Write a lede that makes a stranger want to know more. No source material. Just the page.",
        prompt: "Pick something you know well. Write a lede that makes a stranger want to read the next sentence.",
        wordCountMin: 10,
        wordCountMax: 80,
        criteria: [
          { name: "Concrete", description: "Opens on something specific.", weight: 0.35 },
          { name: "Forward tension", description: "The reader is pulled forward.", weight: 0.35 },
          { name: "Strong verb", description: "Active, specific verb.", weight: 0.3 },
        ],
        stages: [
          {
            label: "Get something down",
            criteria: [
              { name: "Specific detail", description: "Names or describes something specific — not abstract or hypothetical.", weight: 0.5 },
              { name: "Grounded in reality", description: "Grounded in a recognizable person, place, or situation you actually know.", weight: 0.5 },
            ],
            passThreshold: 50,
            wordCountMin: 10,
            wordCountMax: 80,
            variants: [
              { prompt: "Write about a place you know well — a room, a street, a building, a route you drive. 1–3 sentences. The only rule: name something specific. One real detail." },
              { prompt: "Write about a person you know or have observed. Not famous. A specific person doing a specific thing. 1–3 sentences. Name what they do." },
              { prompt: "Write about a habit — yours or someone else's. Something that happens repeatedly. 1–3 sentences. Make it specific." },
              { prompt: "Write about something you've noticed recently that seemed wrong, strange, or worth questioning. 1–3 sentences. State what you noticed." },
              { prompt: "Write about a conversation you overheard or had that stuck with you. Not the whole conversation — just the sentence or moment that mattered. 1–3 sentences." },
            ],
          },
          {
            label: "Strong verb",
            criteria: [
              { name: "Active verb", description: "The main verb is active and specific — not a form of 'be' or 'have.'", weight: 0.4 },
              { name: "Something happens", description: "An action occurs in the lede — it's not purely descriptive or static.", weight: 0.35 },
              { name: "Specific detail", description: "Still grounded in something concrete — not abstract.", weight: 0.25 },
            ],
            passThreshold: 65,
            wordCountMin: 10,
            wordCountMax: 80,
            variants: [
              { prompt: "Write about a place. Cut any sentence using 'is,' 'was,' 'has,' or 'seems.' Replace with a verb that shows something happening. The place does something — or something happens in it." },
              { prompt: "Write about a moment of routine — a morning ritual, a commute, a repeated action. Make the verb show the action. Not 'she drives to work' — what does she specifically do?" },
              { prompt: "Write about a change — something that used to be one way and is now different. Find the verb that shows the change happening, not just the result." },
              { prompt: "Write about something you know is happening but nobody talks about. Active verb. Something must be doing something in your lede. Under 60 words." },
              { prompt: "Write about a person you know who does something that makes you think. Not 'she is kind' — what does she do? Active verb. Under 60 words." },
            ],
          },
          {
            label: "Make a stranger stop",
            criteria: [
              { name: "Concrete not abstract", description: "Opens on a specific person, scene, or detail — not an idea or thesis.", weight: 0.35 },
              { name: "Strong active verb", description: "The verb does real work — not 'is,' 'was,' 'seems.'", weight: 0.3 },
              { name: "Forward tension", description: "There is a question or pull in the lede — you need to read the next sentence.", weight: 0.35 },
            ],
            passThreshold: 75,
            wordCountMin: 10,
            wordCountMax: 60,
            variants: [
              { prompt: "Pick the thing you know best. Write a lede that makes a stranger stop. Under 60 words. A person, a place, an action. Something must happen. The reader must need the next sentence." },
              { prompt: "Write about a contradiction you've witnessed — something that shouldn't be true, but is. Under 60 words. Active verb. The contradiction should live in the lede without you naming it as a contradiction." },
              { prompt: "Write about a moment that changed something small. Not a historical event — something small. Under 60 words. One specific moment. Active verb. The change is implied, not stated." },
              { prompt: "Write about something that is ending or has already ended. Under 60 words. Concrete detail. Active verb. Make the reader feel the ending without using the word 'end,' 'last,' or 'final.'" },
              { prompt: "Write the lede you've been putting off. The one you know the story for. Under 60 words. Make it land." },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "two-weeks",
    title: "Two Weeks of Simple Prompts",
    genre: "nonfiction",
    difficulty: "beginner",
    description:
      "100–300 words. No research. No editing. No perfection. The only mission is completion momentum — showing up, being specific, and letting the engine wake up through repetition.",
    exercises: [
      {
        id: "day-1",
        title: "Day 1 — Your Writing Environment",
        lesson:
          "The first drill is the lowest possible bar: describe what's right in front of you. Not metaphorically. Literally. The point isn't interesting prose — it's teaching yourself that you can start. Most writing paralysis comes from treating the blank page as a referendum on your intelligence. This prompt refuses that framing entirely.",
        prompt:
          "Describe your current desk or writing environment. What do you see, hear, or feel right now? 100–300 words. No research. No editing. No perfection.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Actually describes the space",
            description: "The response contains at least one concrete, specific detail about the physical environment — not a vague generalization.",
            weight: 0.5,
          },
          {
            name: "Sounds like a person, not a performance",
            description: "The writing sounds like someone thinking out loud, not trying to impress. Authentic > polished here.",
            weight: 0.5,
          },
        ],
      },
      {
        id: "day-2",
        title: "Day 2 — Underrated Technology",
        lesson:
          "Good observation writing starts with noticing what other people scroll past. The mundane is full of engineered solutions nobody thinks about anymore. Your job today isn't to be clever — it's to pick one specific thing and actually look at it.",
        prompt:
          "What's a small thing modern technology improved that people take for granted? Pick one specific thing. Describe what it replaced, what it does now, and why that matters. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Picks something specific",
            description: "Names one actual thing — not a category. 'GPS' not 'navigation technology.'",
            weight: 0.45,
          },
          {
            name: "Has an observation, not just description",
            description: "Goes beyond 'this thing exists and is useful' — there's a small insight or angle to it.",
            weight: 0.55,
          },
        ],
      },
      {
        id: "day-3",
        title: "Day 3 — Someone Who Shaped How You Think",
        lesson:
          "Writing about influence is tricky because it can slide into hagiography fast. The move that keeps it honest: focus on the specific idea or moment that changed something in you, not a biography of the person. What did they show you that you couldn't unsee?",
        prompt:
          "Write about a teacher, mentor, or public figure who influenced how you think. Focus on one specific thing they showed you — not their whole biography. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Focuses on a specific idea or moment",
            description: "Anchors on one concrete thing the person showed or taught — not a general tribute to their greatness.",
            weight: 0.55,
          },
          {
            name: "Shows the change, not just the source",
            description: "Indicates how thinking actually shifted — what you saw differently after.",
            weight: 0.45,
          },
        ],
      },
      {
        id: "day-4",
        title: "Day 4 — The Polite Lie",
        lesson:
          "Social reality is full of collective fictions we maintain because the alternative is awkward. Writing about them well requires honesty without cruelty — you're naming a pattern, not attacking people who participate in it. The best version of this kind of writing makes the reader recognize themselves and laugh, not feel accused.",
        prompt:
          "What's something people pretend to enjoy more than they actually do? Pick one specific thing. Describe the gap between the performance and the reality. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Names something specific",
            description: "Picks an actual concrete thing, not a vague category like 'socializing' or 'work.'",
            weight: 0.4,
          },
          {
            name: "Observes the gap honestly",
            description: "Describes the difference between what people say and what they actually do — with some precision, not just sarcasm.",
            weight: 0.6,
          },
        ],
      },
      {
        id: "day-5",
        title: "Day 5 — A Place You Remember",
        lesson:
          "Memory writing lives or dies on sensory specificity. The mistake most people make is going immediately to meaning — 'this place mattered to me because...' The better move is to stay in the physical details longer than feels comfortable, and let the meaning emerge from the accumulation of specifics. Trust the details to do the work.",
        prompt:
          "Describe a place you remember vividly. Stay in the sensory details as long as you can before explaining why it matters. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Sensory detail present",
            description: "Contains at least two specific sensory details — sight, sound, smell, texture, or temperature.",
            weight: 0.55,
          },
          {
            name: "The place feels real",
            description: "A reader who has never been there could picture something specific. Vague atmosphere doesn't count.",
            weight: 0.45,
          },
        ],
      },
      {
        id: "day-6",
        title: "Day 6 — Intellectual Aliveness",
        lesson:
          "Some conversations leave you more energized than when they started. Others drain you even when they're technically 'productive.' The difference is worth trying to name — not as a complaint about the wrong kind of conversation, but as a description of what the right kind actually does.",
        prompt:
          "What makes a conversation feel intellectually alive? Describe the conditions, not just the subject matter. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Gets specific about conditions",
            description: "Names something more concrete than 'smart people talking about interesting things' — identifies a mechanism or quality.",
            weight: 0.6,
          },
          {
            name: "Comes from observation, not ideal",
            description: "Reads like it's drawn from actual experience, not an abstract wish list.",
            weight: 0.4,
          },
        ],
      },
      {
        id: "day-7",
        title: "Day 7 — A Habit You're Building",
        lesson:
          "Habit writing is everywhere and most of it is useless because it stays at the level of aspiration. The interesting version is honest about the gap between intention and execution — what the resistance actually feels like, what makes it easier or harder on specific days, what you notice when you skip it.",
        prompt:
          "Write about a habit you're trying to build or rebuild. Be honest about the resistance, not just the goal. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Names the actual resistance",
            description: "Describes what makes it hard specifically — not just 'it's difficult' but what the friction actually is.",
            weight: 0.55,
          },
          {
            name: "Honest, not aspirational",
            description: "Reads like a real account, not a motivational post. Acknowledges what's actually happening.",
            weight: 0.45,
          },
        ],
      },
      {
        id: "day-8",
        title: "Day 8 — A Belief That Changed",
        lesson:
          "Changed beliefs are easy to write about badly — either as triumphant self-improvement ('I used to be wrong, now I'm right') or as performance of intellectual humility ('look how open-minded I am'). The honest version focuses on what it actually felt like when the belief started to crack. What was the evidence or experience that first made you uncertain?",
        prompt:
          "What's something you believed strongly five years ago that changed? Focus on the moment or evidence that first made you uncertain — not the final conclusion. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Identifies a specific belief",
            description: "Names an actual belief, not a vague area of growth like 'I used to be less patient.'",
            weight: 0.35,
          },
          {
            name: "Shows the crack, not just the conclusion",
            description: "Describes what first created doubt — the evidence, conversation, or moment — rather than just announcing the changed view.",
            weight: 0.65,
          },
        ],
      },
      {
        id: "day-9",
        title: "Day 9 — Confidence vs. Arrogance",
        lesson:
          "The trap with contrast essays is listing definitions. The stronger move is finding the observable behavioral difference — what does each one actually look like in practice? How do you tell them apart in real time? The best distinctions come from watching people, not consulting a dictionary.",
        prompt:
          "Describe the difference between confidence and arrogance. Don't define them — describe what each one looks like when you encounter it in a real person. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Behavioral, not definitional",
            description: "Shows how each one looks or acts in practice — not abstract definitions of the two words.",
            weight: 0.6,
          },
          {
            name: "The distinction is useful",
            description: "After reading this, a person would have a clearer way to tell the difference. The contrast actually lands.",
            weight: 0.4,
          },
        ],
      },
      {
        id: "day-10",
        title: "Day 10 — Software You Actually Love",
        lesson:
          "Most software writing is either marketing copy or complaint forums. The interesting version tries to name what a tool actually does to your cognition — how it changes the way you think, not just what it enables you to do. The question isn't 'what are the features' but 'what does it feel like to use it and why does that matter.'",
        prompt:
          "What's a piece of software you genuinely love using and why? Go beyond features — describe what it does to how you think or work. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Names something specific",
            description: "Picks one actual piece of software, not a category.",
            weight: 0.3,
          },
          {
            name: "Explains the cognitive or workflow effect",
            description: "Goes beyond listing features — describes what the experience of using it actually does to thinking or output.",
            weight: 0.7,
          },
        ],
      },
      {
        id: "day-11",
        title: "Day 11 — Mentally Exhausting People",
        lesson:
          "Social friction is worth analyzing because it's almost never random. Mentally exhausting people tend to have specific, identifiable patterns — not just 'they're annoying.' The useful version of this kind of writing names the mechanism: what are they actually doing, and why does it cost energy to engage with?",
        prompt:
          "What makes certain people mentally exhausting? Name the mechanism — what are they actually doing, not just how it makes you feel. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Names the mechanism",
            description: "Identifies what the person is actually doing behaviorally or cognitively — not just 'they're negative' or 'they drain me.'",
            weight: 0.65,
          },
          {
            name: "More analytical than venting",
            description: "Reads like an observation about a pattern, not a complaint about a specific person.",
            weight: 0.35,
          },
        ],
      },
      {
        id: "day-12",
        title: "Day 12 — When Simple Became Complex",
        lesson:
          "The moment you realize a system is more complicated than it appeared is a specific cognitive experience — a kind of structured disorientation. Writing about it well means capturing what you thought before, what you encountered that broke that model, and what the new shape of the thing looked like. The before/after structure is the whole essay.",
        prompt:
          "Write about a moment where you realized a system was more complicated than it first appeared. Describe what you thought before, what broke that model, and what you understood after. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Has a clear before and after",
            description: "Shows what the original understanding was and what replaced it — not just 'things are complicated.'",
            weight: 0.55,
          },
          {
            name: "Names the specific system",
            description: "Picks an actual thing — an institution, process, relationship, or field — not a vague abstraction.",
            weight: 0.45,
          },
        ],
      },
      {
        id: "day-13",
        title: "Day 13 — Structure Unlocks Difficulty",
        lesson:
          "Some things that seem hard are actually just unfamiliar. Once you see the underlying structure — the pattern it follows, the logic that organizes it — the difficulty collapses. Writing about that experience is useful because it names the mechanism: what was the structure that unlocked it, and how did seeing it change your relationship to the difficulty?",
        prompt:
          "What's something difficult that became easier once you understood the structure behind it? Describe the structure you found — not just that things got easier. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Describes the actual structure",
            description: "Names or describes the underlying pattern or logic that made it click — not just 'I practiced more.'",
            weight: 0.65,
          },
          {
            name: "The example is specific",
            description: "Uses one real subject — a skill, domain, or concept — not a generic observation about learning.",
            weight: 0.35,
          },
        ],
      },
      {
        id: "day-14",
        title: "Day 14 — The Intellectual Life You Actually Want",
        lesson:
          "Most writing about 'the good life' describes a fantasy. The useful version is more honest — it holds the actual conditions of your life against the actual shape of what you want and names the gap without pretending it doesn't exist. The question isn't 'what would be ideal' but 'what do you actually want to be doing with your mind, long term, given who you actually are.'",
        prompt:
          "Describe what kind of intellectual life you actually want long term. Not the ideal version — the honest version, given who you are and what you're actually drawn to. 100–300 words.",
        wordCountMin: 80,
        wordCountMax: 320,
        criteria: [
          {
            name: "Honest, not aspirational",
            description: "Describes something that sounds like this specific person's actual desires — not a generic 'I want to read and think deeply.'",
            weight: 0.5,
          },
          {
            name: "Has specificity",
            description: "Names actual domains, activities, or conditions — not vague intellectual virtues.",
            weight: 0.5,
          },
        ],
      },
    ],
  },

  // ── NONFICTION: SENTENCES THAT LAND ─────────────────────────────────────

  {
    id: "sentences-that-land",
    title: "Sentences That Land",
    genre: "nonfiction",
    difficulty: "beginner",
    description:
      "Most first drafts are 30–50% longer than they need to be. In this track you'll work at the sentence level: killing weak verbs, cutting to half the word count, using the short sentence as a weapon, and replacing abstract language with concrete specifics.",
    exercises: [
      {
        id: "s1",
        title: "Kill the Weak Verb",
        lesson:
          "The verb is the engine of a sentence. Weak verbs — 'was,' 'is,' 'had,' 'went,' 'got' — make readers work harder than they should. Strong verbs do three things at once: they tell you what happened, how it happened, and what it felt like. 'She walked into the room' is neutral. 'She shouldered through the door' tells you something. Find the weak verbs and replace them with ones that do actual work.",
        prompt:
          "Rewrite these three sentences to replace every weak verb with a strong, specific one. Don't change the facts — change the force. (1) 'She was crying at the table when he came in.' (2) 'The company had problems with its supply chain for months.' (3) 'He went up to the podium and started his speech.' 30–80 words.",
        wordCountMin: 25,
        wordCountMax: 90,
        criteria: [
          { name: "Weak verbs replaced", description: "No 'was,' 'had,' 'went,' 'came,' or 'started' — every verb does real work.", weight: 0.5 },
          { name: "Verbs are specific", description: "The new verbs aren't just stronger synonyms — they add information about how the action happened.", weight: 0.3 },
          { name: "Sentences read naturally", description: "The rewrites don't feel strained or thesaurus-hunted.", weight: 0.2 },
        ],
      },
      {
        id: "s2",
        title: "Cut to 50%",
        lesson:
          "Most first-draft sentences are bloated with throat-clearing: 'the fact that,' 'in order to,' 'it is worth noting that,' 'which is to say.' The discipline of cutting to half the word count trains you to find what a sentence is actually about. The cuts don't come from the ideas — they come from the scaffolding around them.",
        prompt:
          "Cut this paragraph to exactly half its word count — from 80 words to 40 — without losing any of the facts. 'The city of Detroit, which has been struggling with economic problems for several decades now, has in recent years begun to see some signs of recovery in certain neighborhoods, particularly in areas where new businesses have been opening and young people have been moving in, attracted by the relatively affordable housing prices and the emerging arts scene that has developed there.' 35–45 words.",
        wordCountMin: 35,
        wordCountMax: 45,
        criteria: [
          { name: "Hits the target word count", description: "The rewrite is between 35–45 words.", weight: 0.3 },
          { name: "All key facts retained", description: "Detroit, economic recovery, neighborhoods, young people, housing prices, and arts scene are all still present.", weight: 0.4 },
          { name: "Reads as complete prose", description: "The result reads like a real sentence, not a list of fragments.", weight: 0.3 },
        ],
      },
      {
        id: "s3",
        title: "The Landing Short Sentence",
        lesson:
          "The shortest sentence in a paragraph carries the most weight. Good writers use this deliberately — a short sentence after a long one creates a punch. 'He had driven three hours through the rain, missed his daughter's recital, and arrived late to a meeting that had already ended. He quit that afternoon.' The second sentence lands because of the contrast with what came before it.",
        prompt:
          "Write a paragraph of 4–6 sentences about someone making a difficult decision. The last sentence must be 6 words or fewer. Make it land. 60–120 words.",
        wordCountMin: 55,
        wordCountMax: 130,
        criteria: [
          { name: "Final sentence is 6 words or fewer", description: "Strictly enforced — count the words.", weight: 0.3 },
          { name: "The ending earns its brevity", description: "The short sentence lands because of what built before it. The contrast matters.", weight: 0.4 },
          { name: "Paragraph builds toward the end", description: "The structure creates anticipation — the short sentence doesn't feel dropped in randomly.", weight: 0.3 },
        ],
      },
      {
        id: "s4",
        title: "Kill the Abstract",
        lesson:
          "Abstract language is the default mode of bad writing. 'Society faces challenges.' 'This creates problems.' 'The situation is complex.' These sentences say nothing. Every abstract statement can be made concrete by asking: what actually happened? Who did what? Where? When? What did it look like? Concrete writing doesn't mean simple — it means specific.",
        prompt:
          "Rewrite this abstract paragraph with concrete language. Keep the same argument. Use zero abstract nouns. 'Society's relationship with technology has become increasingly problematic. People are experiencing negative effects on their mental health and social connections. The situation has created concerns among experts who study these issues and believe that something needs to change.' 60–100 words.",
        wordCountMin: 55,
        wordCountMax: 110,
        criteria: [
          { name: "No abstract nouns", description: "No 'society,' 'relationship,' 'situation,' 'effects,' 'issues,' 'something,' or equivalent catch-all nouns.", weight: 0.4 },
          { name: "Specific people and actions", description: "Names types of people, specific behaviors, or real phenomena instead of categories.", weight: 0.35 },
          { name: "Argument is still there", description: "The rewrite still makes the same case — just in concrete terms.", weight: 0.25 },
        ],
      },
    ],
  },

  // ── NONFICTION: THE NUT GRAF ─────────────────────────────────────────────

  {
    id: "writing-voice",
    title: "Finding Your Voice",
    genre: "nonfiction",
    difficulty: "beginner",
    description:
      "Most writers' first drafts sound like someone pretending to be a writer. This track trains you to write the way you actually think — specific, direct, and yours.",
    exercises: [
      {
        id: "voice-1",
        title: "Write Like You Talk",
        lesson:
          "The gap between how people write and how they speak is where bad prose lives. Read your drafts out loud. If you'd never say it, cut it. The most reliable voice test: would you say this sentence to a smart friend? If yes, it's probably good. If not, it's performing.",
        prompt:
          "Write 100–200 words about something you find genuinely interesting right now — a subject, an idea, a question. Write it the way you'd explain it to a friend who'd never heard of it. No introductions, no thesis. Just start talking.",
        wordCountMin: 90,
        wordCountMax: 220,
        criteria: [
          { name: "Sounds like a person, not a writer", description: "The prose sounds like someone explaining something they care about — not like an essay introduction.", weight: 0.5 },
          { name: "No performance", description: "No unnecessary formal phrases, no 'in conclusion,' no 'it is important to note.' Just thought.", weight: 0.5 },
        ],
      },
      {
        id: "voice-2",
        title: "Your Actual Opinion",
        lesson:
          "Opinion writing is full of hedged non-opinions. 'On one hand… on the other hand… it's complicated.' These are not opinions. An opinion is a specific claim you'd defend in an argument. The test: if someone disagreed, would you push back? If not, you don't have an opinion yet — you have a survey.",
        prompt:
          "Write 100–200 words with a specific, arguable opinion about something in your own field, profession, or area of interest. State the opinion in the first sentence. Don't hedge. Don't pre-apologize. If someone would disagree with this, you're on the right track.",
        wordCountMin: 90,
        wordCountMax: 220,
        criteria: [
          { name: "States a clear opinion in sentence one", description: "The first sentence is a claim someone could disagree with — not a topic statement.", weight: 0.45 },
          { name: "No hedging", description: "No 'some might argue,' 'it's complicated,' or 'there are many perspectives.' One view, stated directly.", weight: 0.3 },
          { name: "Gives a reason", description: "The opinion is backed by at least one specific reason or observation.", weight: 0.25 },
        ],
      },
      {
        id: "voice-3",
        title: "The Specific You",
        lesson:
          "Voice comes from specificity about your own experience, not from clever phrases. The most distinctive sentence a writer can produce is one that only they could have written — because it references a specific thing they know, remember, or have noticed. Generic writing is generic because it avoids the specific.",
        prompt:
          "Write 100–200 words that only you could have written. Reference something from your own life, work, or observation that is specific enough that a stranger couldn't have made it up. No universal truths. No statements that begin with 'everyone' or 'we all.'",
        wordCountMin: 90,
        wordCountMax: 220,
        criteria: [
          { name: "Contains something only this writer knows", description: "At least one detail or observation that is clearly from personal experience — not something anyone could have written.", weight: 0.6 },
          { name: "No universalizing", description: "Doesn't make broad claims about what 'everyone' feels or does. Stays in the first person or the specific.", weight: 0.4 },
        ],
      },
      {
        id: "voice-4",
        title: "Drop the Throat-Clearing",
        lesson:
          "Throat-clearing is everything before the piece actually begins: the explanation of what you're about to say, the context-setting, the apology for your limitations. Cut it. The piece starts where the energy starts. In a first draft, that's usually paragraph three. When in doubt, delete the first paragraph and see if the piece is better. It usually is.",
        prompt:
          "Take this throat-clearing opening and find where the piece actually starts. Then write the real opening plus the next 80–120 words of the piece. Original: 'I've been thinking a lot lately about what it means to be productive. There are many different definitions of productivity, and different people have different views on the subject. In this piece, I want to explore some of those ideas.' Start fresh. Don't use any of those sentences.",
        wordCountMin: 80,
        wordCountMax: 140,
        criteria: [
          { name: "None of the original sentences survive", description: "The rewrite doesn't contain 'I've been thinking,' 'there are many,' or anything from the original.", weight: 0.3 },
          { name: "Starts with the real thing", description: "The new opening is in the middle of an idea, a scene, or a specific claim — not setup for the actual piece.", weight: 0.4 },
          { name: "Has energy immediately", description: "A reader would want to keep reading after the first sentence.", weight: 0.3 },
        ],
      },
      {
        id: "voice-5",
        title: "The Rhythm Test",
        lesson:
          "Voice is partly sound. Sentences that all have the same length and structure create a drone. Good prose varies: long sentences accumulate; short ones land. Read your work aloud. If you never have to breathe, your sentences are too similar. If you're always out of breath, they're too long. The rhythm should feel like thought — which accelerates, pauses, and doubles back.",
        prompt:
          "Write 150–250 words about any subject you've written about before. This time, pay deliberate attention to sentence length variation. Use at least one sentence under 8 words and at least one sentence over 30 words. The transitions should feel natural, not forced.",
        wordCountMin: 140,
        wordCountMax: 270,
        criteria: [
          { name: "Visible sentence length variation", description: "Contains at least one very short sentence (under 8 words) and at least one long one (over 30 words) — not just medium-length throughout.", weight: 0.4 },
          { name: "Variation serves the meaning", description: "Short sentences land on important moments. Long sentences carry accumulation or complexity. The rhythm isn't random.", weight: 0.4 },
          { name: "Reads naturally aloud", description: "The transitions between long and short feel organic, not lurching.", weight: 0.2 },
        ],
      },
    ],
  },

  // ── NONFICTION: SCENE VS SUMMARY ─────────────────────────────────────────

  {
    id: "scene-vs-summary",
    title: "Scene vs. Summary",
    genre: "nonfiction",
    difficulty: "beginner",
    description:
      "Every piece of nonfiction is built from two materials: scenes (the camera close, time slowing, sensory detail) and summary (time compressing, patterns named, context given). Knowing which to use, and when to switch, is one of the most important structural skills in nonfiction.",
    exercises: [
      {
        id: "svs-1",
        title: "Write the Scene",
        lesson:
          "A scene is a unit of time with a beginning and end. It happens in a specific place. The camera is close. We can see what people are doing and hear what they're saying. The job of a scene in nonfiction is to make the reader feel the reality of what happened — not to be told about it.",
        prompt:
          "Write a scene (100–200 words) from your own life: a specific moment that captures something true about a person, place, or situation. Stay in the moment. No backstory, no summary of what usually happens. One specific time, in one specific place.",
        wordCountMin: 90,
        wordCountMax: 220,
        criteria: [
          { name: "Specific time and place", description: "This is one moment in one place — not 'every Sunday we would' or 'she was always the kind of person who.'", weight: 0.4 },
          { name: "Sensory detail present", description: "Contains at least one sensory detail that puts the reader physically in the scene.", weight: 0.35 },
          { name: "Shows rather than explains", description: "Doesn't editorialize or draw conclusions — presents what happened and lets the reader feel it.", weight: 0.25 },
        ],
      },
      {
        id: "svs-2",
        title: "Compress to Summary",
        lesson:
          "Summary compresses time. It tells the reader about patterns, repeated events, or context. 'For twenty years, he arrived at the office before anyone else' is summary. It covers twenty years in nine words. The skill is knowing what to leave in when you compress. The best summary retains one concrete, specific detail that keeps it from feeling generic.",
        prompt:
          "Write a summary (60–100 words) that compresses at least five years of something into a coherent paragraph. It could be a period in someone's life, the history of a place, or the arc of a relationship. Include at least one specific detail that keeps it from being a bland generalization.",
        wordCountMin: 55,
        wordCountMax: 115,
        criteria: [
          { name: "Compresses time effectively", description: "Covers a significant span of time (at least 5 years or many repeated events) in the word limit without losing coherence.", weight: 0.4 },
          { name: "Contains at least one specific detail", description: "One concrete fact, person, or event that makes the summary feel grounded rather than generic.", weight: 0.45 },
          { name: "Clean and readable", description: "The compression doesn't make it choppy or feel like a list of facts.", weight: 0.15 },
        ],
      },
      {
        id: "svs-3",
        title: "When to Zoom In",
        lesson:
          "The choice between scene and summary is a pacing choice. Zoom in (scene) when: the moment is the argument, the reader needs to feel it, or dialogue is essential. Stay in summary when: you're building context, covering ground, or the details don't change anything. The mistake most writers make is staying in summary too long because scenes feel exposed — too much like showing your work.",
        prompt:
          "Write a piece (150–250 words) that uses both scene and summary. Start with a brief scene (2–4 sentences), pull back to summary context (2–4 sentences), then zoom back into scene for the ending. The scene should earn the summary and vice versa.",
        wordCountMin: 140,
        wordCountMax: 270,
        criteria: [
          { name: "Contains both modes", description: "There is identifiable scene (specific, sensory, present-tense feeling) and summary (compressed, contextual) in the piece.", weight: 0.4 },
          { name: "Transitions work", description: "The shifts between modes feel deliberate, not accidental. The reader can follow the zooming.", weight: 0.35 },
          { name: "Scene earns the summary", description: "The zoomed-in moments justify the existence of the zoomed-out context — one informs the other.", weight: 0.25 },
        ],
      },
      {
        id: "svs-4",
        title: "The Telling Scene",
        lesson:
          "The best nonfiction scenes carry argumentative weight — they don't just illustrate a point, they make it. The scene is the evidence. This is different from a scene that exists for atmosphere or variety. A telling scene: one specific event that contains the whole argument in miniature. The rest of the piece unpacks what the scene already proved.",
        prompt:
          "Write a telling scene (100–200 words) from someone's life — real or composite — that makes an argument about something larger without stating that argument. The scene alone should do the work: a reader who only read the scene should understand the larger claim without being told it.",
        wordCountMin: 90,
        wordCountMax: 220,
        criteria: [
          { name: "Scene is specific and concrete", description: "One event, one place, specific actions and details — not a blur of generalized behavior.", weight: 0.35 },
          { name: "Argument is embedded, not stated", description: "The scene implies a claim about something larger without the writer stepping in to name it.", weight: 0.45 },
          { name: "Scene stands alone", description: "A reader who only saw the scene could intuit what the piece is arguing.", weight: 0.2 },
        ],
      },
    ],
  },

  // ── NONFICTION: WRITING ABOUT PEOPLE ────────────────────────────────────

  {
    id: "writing-people",
    title: "Writing About People",
    genre: "nonfiction",
    difficulty: "beginner",
    description:
      "Most writing about real people either turns them into saints or caricatures. This track teaches you to render real humans on the page — specific, contradictory, and alive — through detail, action, and restraint.",
    exercises: [
      {
        id: "wp-1",
        title: "The Telling Detail",
        lesson:
          "You don't describe a person by listing their features. You find the one detail that unlocks them. Joan Didion on John Wayne: 'When John Wayne rode through my childhood, and perhaps through yours, he suggested that a man could move through life.' It's not a physical description — it's what he meant. One detail, chosen carefully, does more than a paragraph of physical inventory.",
        prompt:
          "Write 60–100 words describing a real person (someone you know, not a celebrity) using only one physical or behavioral detail. That detail must imply something about who they are. No lists of features. No adjectives that are also moral judgments ('kind,' 'difficult,' 'generous').",
        wordCountMin: 55,
        wordCountMax: 115,
        criteria: [
          { name: "One specific detail in focus", description: "The description is built around one concrete thing — not three or four traits stacked together.", weight: 0.45 },
          { name: "Detail implies character", description: "The detail tells you something about the person beyond the physical fact of it.", weight: 0.4 },
          { name: "No moral-adjective shortcuts", description: "Avoids 'kind,' 'generous,' 'difficult,' 'smart' — shows the thing instead of naming the quality.", weight: 0.15 },
        ],
      },
      {
        id: "wp-2",
        title: "Action Over Adjective",
        lesson:
          "The worst profile writing is adjective-heavy: 'She is passionate, driven, and deeply committed to her work.' These sentences are empty because they tell you what to think without giving you the evidence. The move is always to replace the adjective with the action that earned it. 'Passionate' becomes: what did she do that made you call her that? Show that.",
        prompt:
          "You want to convey that someone is stubborn. Write 80–120 words about this person using only actions and specific behaviors — no use of the word 'stubborn' or any synonym. A reader should arrive at 'stubborn' themselves after reading.",
        wordCountMin: 75,
        wordCountMax: 135,
        criteria: [
          { name: "No direct naming of the trait", description: "'Stubborn,' 'obstinate,' 'persistent,' 'headstrong' do not appear. Neither does any synonym that directly labels it.", weight: 0.4 },
          { name: "Reader can infer the trait", description: "A reader would plausibly arrive at 'stubborn' from the actions described, without being told.", weight: 0.45 },
          { name: "Actions are specific", description: "The behaviors described are concrete and visual — not vague ('she always pushed back on things').", weight: 0.15 },
        ],
      },
      {
        id: "wp-3",
        title: "A Person in a Room",
        lesson:
          "One of the most powerful techniques in profile writing is placing the subject in a specific environment and watching what they do. The room, the objects, what they reach for first, what they ignore — all of it is information. You are building a portrait through behavior and context, not through explanation.",
        prompt:
          "Write 100–180 words placing a person you know in a specific room — their home, their workspace, their car. Describe what they do in that space. What do they touch? What do they avoid? What does the space tell you about them? Do not summarize their personality. Let the room speak.",
        wordCountMin: 90,
        wordCountMax: 200,
        criteria: [
          { name: "The space is specific", description: "A real, identifiable room with actual objects — not a vague environment.", weight: 0.3 },
          { name: "Person's behavior in the space reveals them", description: "What they do in the room tells you something about who they are.", weight: 0.5 },
          { name: "No direct personality summary", description: "The writer doesn't step back and explain what the room 'means.' The details do the work.", weight: 0.2 },
        ],
      },
      {
        id: "wp-4",
        title: "Against Hagiography",
        lesson:
          "Most writing about people we admire becomes hagiography — a list of virtues without friction. Honest portrait writing holds both. Your subject can be impressive and still have a flaw, a contradiction, a moment that complicates the tribute. The tension makes the portrait believable. A person without shadow isn't a person — they're a press release.",
        prompt:
          "Write 120–200 words about someone you genuinely admire. Include one complication: a contradiction in them, a flaw, a thing they do that sits oddly with the rest of the portrait. The complication should make them more real, not diminish them.",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "Admiration is genuine and specific", description: "The positive portrait is grounded in specific evidence, not generic praise.", weight: 0.35 },
          { name: "Complication is present", description: "One flaw, contradiction, or unexpected detail that doesn't fit neatly into the tribute.", weight: 0.45 },
          { name: "Complication humanizes, doesn't destroy", description: "The flaw makes the portrait feel real and complicated — not like a takedown.", weight: 0.2 },
        ],
      },
      {
        id: "wp-5",
        title: "The First Meeting",
        lesson:
          "Readers experience a person through the writer's first encounter with them. The power of this technique: the reader learns the subject and the narrator simultaneously. What the writer notices first, what registers, what surprises — all of this characterizes both people. The first meeting is never just about the subject.",
        prompt:
          "Write 120–200 words about meeting someone for the first time — a job interview, a date, a new colleague, a stranger. Describe what you noticed first, what surprised you, what your impression was before you knew anything. What they said can appear, but don't make the piece a transcript.",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "Sensory first impression is present", description: "What the narrator noticed immediately — before conversation or context — is described specifically.", weight: 0.4 },
          { name: "Both people are revealed", description: "The subject is rendered, but the narrator's priorities and perceptions are also visible.", weight: 0.35 },
          { name: "Avoids transcript mode", description: "The piece isn't a play-by-play of what was said — it has a point of view and a selection.", weight: 0.25 },
        ],
      },
    ],
  },

  // ── NONFICTION: PERSONAL ESSAY ───────────────────────────────────────────

  {
    id: "nut-graf-fundamentals",
    title: "Nut Graf Fundamentals",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "The nut graf is the paragraph that answers the reader's unspoken question: 'why am I reading this?' It bridges the specific lede to the larger story. Editors cut stories that don't have one. This track teaches you to write it well.",
    exercises: [
      {
        id: "ng1",
        title: "From Person to Pattern",
        lesson:
          "The nut graf's job is to zoom out. One person's experience → a shared reality. Write the bridge so that someone who skipped the lede still understands what the piece is about. The best nut grafs are two or three sentences. They name the issue, the scale, and the moment. They don't explain the whole story — they unlock the door.",
        prompt:
          "You've just written this lede: 'Maria Ruiz spent three hours on hold with her insurance company last October, trying to get approval for a prescription her doctor had already ordered twice.' Write the nut graf that zooms out and establishes the larger story. 60–150 words.",
        wordCountMin: 55,
        wordCountMax: 160,
        criteria: [
          { name: "Establishes larger context", description: "Connects Maria's story to a broader issue affecting more than one person.", weight: 0.4 },
          { name: "Answers why now", description: "Makes clear why this story is worth reading today, not six months ago.", weight: 0.35 },
          { name: "Clean zoom out", description: "The transition from one person to the bigger picture feels logical, not jarring.", weight: 0.25 },
        ],
      },
      {
        id: "ng2",
        title: "The Concrete Stakes",
        lesson:
          "Not every nut graf is about a crisis. Some need to establish stakes that are quiet but real. The trap is vagueness: 'many people face this problem.' The move is precision: 'About 1.3 million Americans in rural counties live more than 30 miles from the nearest emergency room.' A number or a specific systemic fact does what ten adjectives cannot.",
        prompt:
          "You've written a lede about a small-town hardware store closing after 50 years. Write the nut graf that establishes why this matters beyond nostalgia — make the stakes concrete and specific, not sentimental. 60–150 words.",
        wordCountMin: 55,
        wordCountMax: 160,
        criteria: [
          { name: "Stakes are concrete", description: "Uses specific language — numbers, named systems, documented trends — not vague gestures at importance.", weight: 0.5 },
          { name: "Avoids the nostalgia trap", description: "Doesn't just say this is sad — makes a case for structural or economic significance.", weight: 0.5 },
        ],
      },
      {
        id: "ng3",
        title: "The Why Now",
        lesson:
          "The nut graf often needs a 'why now' element — what is happening right now that makes this story timely? Legislation, new data, a cultural shift, a court case. Without it, a story can feel like it could have been written any time, which gives editors permission to pass. The 'why now' gives readers permission to care.",
        prompt:
          "Write a lede + nut graf (combined 100–180 words) for a story about a teacher who has been teaching the same way for 30 years and is being asked to change. The nut graf must include a 'why now' element that makes this story timely today.",
        wordCountMin: 90,
        wordCountMax: 200,
        criteria: [
          { name: "Lede is a scene", description: "Opens with a specific moment or action, not a generalization.", weight: 0.3 },
          { name: "Nut graf establishes what's changing now", description: "Names something happening currently that makes this a story of the moment.", weight: 0.4 },
          { name: "Combined structure works", description: "The lede and nut graf together set up a compelling reason to read on.", weight: 0.3 },
        ],
      },
      {
        id: "ng4",
        title: "Rewrite the Weak Nut Graf",
        lesson:
          "Here is a weak nut graf: vague, passive, and padded. Your job is to cut and sharpen it until it actually does the work it's supposed to do. Good nut grafs are 2–3 sentences. They do not explain the whole story — they name the issue, the scale, and why now. Then they get out of the way.",
        prompt:
          "Rewrite this weak nut graf in 2–3 tight sentences: 'Insurance in America has become increasingly complicated for many patients and doctors alike, and this is causing problems for the healthcare system in ways that affect millions of people every year, particularly those who are uninsured or underinsured and who may not have access to the care they need.' 35–80 words.",
        wordCountMin: 30,
        wordCountMax: 90,
        criteria: [
          { name: "2–3 sentences", description: "Strictly 2–3 sentences — no paragraph-length nut grafs.", weight: 0.3 },
          { name: "Concrete, not vague", description: "Uses specific language — numbers, named systems — not 'many' and 'various' and 'issues.'", weight: 0.4 },
          { name: "Stronger than the original", description: "The rewrite is clearer and more urgent than the original.", weight: 0.3 },
        ],
      },
    ],
  },

  // ── FICTION: FIRST LINES ─────────────────────────────────────────────────

  {
    id: "personal-essay",
    title: "The Personal Essay",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "The personal essay isn't memoir and it isn't opinion writing — it's thinking in public. This track teaches the form: how to use your own experience as evidence, how to find the turn, and how to make the personal speak to something larger.",
    exercises: [
      {
        id: "pe-1",
        title: "The Entry Point",
        lesson:
          "Every essay has an entry point — the specific, concrete place it starts before it becomes about something larger. The mistake is starting with the large thing directly: 'I've always been bad at goodbyes.' Start with the specific goodbye. The particular scene or object or conversation is the door into the larger argument. The essay earns the abstract through the concrete.",
        prompt:
          "Write the opening of a personal essay (100–180 words) that starts with a specific scene or object or moment — not with the larger theme it represents. By the end of the opening, the reader should feel the larger thing is coming without being told what it is.",
        wordCountMin: 90,
        wordCountMax: 200,
        criteria: [
          { name: "Starts with the specific, not the abstract", description: "Opens on a concrete scene, object, or event — not a thesis statement or theme announcement.", weight: 0.45 },
          { name: "Larger theme is approaching but unstated", description: "A careful reader can sense the essay is about something beyond the specific, but the writer hasn't named it yet.", weight: 0.35 },
          { name: "Invites continuation", description: "The opening creates enough tension or intrigue that a reader wants to continue.", weight: 0.2 },
        ],
      },
      {
        id: "pe-2",
        title: "The Complication",
        lesson:
          "An essay that only argues one thing isn't thinking — it's announcing. The complication is where the essay honestly confronts what makes its argument hard. 'But here's what I don't know.' 'Here's what this explanation doesn't account for.' The complication is not a flaw in the essay — it's the evidence that the writer is actually thinking.",
        prompt:
          "Write a complication (80–150 words) for this easy argument: 'I believe people should spend less time on social media.' Write the paragraph that honestly names what this argument misses, ignores, or can't account for. Don't abandon the argument — complicate it.",
        wordCountMin: 75,
        wordCountMax: 165,
        criteria: [
          { name: "Genuinely complicates the claim", description: "Identifies a real tension, exception, or limitation in the original argument — not a straw man.", weight: 0.55 },
          { name: "Doesn't abandon the argument", description: "The complication adds nuance — it doesn't conclude 'so I was wrong about everything.'", weight: 0.3 },
          { name: "Honest voice", description: "Sounds like someone genuinely wrestling with the question, not performing intellectual humility.", weight: 0.15 },
        ],
      },
      {
        id: "pe-3",
        title: "The Turn",
        lesson:
          "The turn is the moment an essay changes direction — where what you thought you were writing about reveals itself to be about something else, or where the argument shifts, deepens, or inverts. Without a turn, an essay is just a piece that arrives where it started. Montaigne's essays were all turn. The best personal essays make the turn feel inevitable in retrospect, surprising in the moment.",
        prompt:
          "Write an essay passage (150–250 words) that contains a turn. Start going in one direction — set up an argument, establish a position — and then find the moment where the essay pivots. The turn should feel earned, not arbitrary.",
        wordCountMin: 140,
        wordCountMax: 270,
        criteria: [
          { name: "Turn is present and identifiable", description: "There is a clear moment where the direction of the piece shifts — not just a new paragraph, but a new angle.", weight: 0.45 },
          { name: "Turn feels earned", description: "The pivot follows logically or emotionally from what preceded it — the reader could go back and see the setup.", weight: 0.4 },
          { name: "Piece is different at the end than at the start", description: "We arrive at a different understanding than we had in the opening lines.", weight: 0.15 },
        ],
      },
      {
        id: "pe-4",
        title: "The Private Made Public",
        lesson:
          "The personal essay uses the self as evidence — but it is not a diary entry. The difference: in a diary, you write about your feelings. In an essay, you use your experience to argue something about the world. The private experience is the entry point; the claim is the destination. 'I went through this' is a diary. 'I went through this and it showed me something true about X' is an essay.",
        prompt:
          "Write 150–250 words using a personal experience as evidence for a claim about something larger than yourself. The experience is the proof. The claim is the reason we're reading. State the claim clearly somewhere in the piece.",
        wordCountMin: 140,
        wordCountMax: 270,
        criteria: [
          { name: "Personal experience is specific", description: "A real, concrete event or period — not a vague gesture at personal history.", weight: 0.35 },
          { name: "Claim is present and clear", description: "The piece is arguing something specific about the world, stated somewhere in the prose.", weight: 0.4 },
          { name: "Experience serves the claim", description: "The personal story is evidence for the argument — not just context or scene-setting.", weight: 0.25 },
        ],
      },
      {
        id: "pe-5",
        title: "The Ending That Doesn't Resolve",
        lesson:
          "Essays shouldn't tie themselves in a bow. An ending that resolves everything was already resolved before the essay started — which means the thinking wasn't real. The best essay endings hold the tension. They don't answer the question — they reframe it, or leave it exactly as complicated as it deserves to be. The reader should feel the work of the thinking, not the relief of a lesson.",
        prompt:
          "Write an essay ending (80–140 words) for a piece about the impossibility of truly knowing whether you made the right decision. The ending must not resolve the question. It must not arrive at peace, acceptance, or a lesson. End in the difficulty.",
        wordCountMin: 75,
        wordCountMax: 155,
        criteria: [
          { name: "Does not resolve", description: "The ending doesn't land on an answer, a lesson, or a moment of acceptance. The question remains open.", weight: 0.5 },
          { name: "Ends on something specific", description: "Despite not resolving, the ending is grounded in something concrete — not just vague ambiguity.", weight: 0.3 },
          { name: "Feels like an ending, not an abandonment", description: "The piece feels finished even though it doesn't conclude. The last sentence has weight.", weight: 0.2 },
        ],
      },
    ],
  },

  // ── NONFICTION: THE ARGUMENT ─────────────────────────────────────────────

  {
    id: "opinion-writing",
    title: "The Argument",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "Opinion writing that fails is vague, hedged, and forgettable. Opinion writing that works is specific, direct, and honest about what it doesn't know. This track teaches the structure of a real argument: the thesis, the evidence, the concession, and the counterintuitive claim.",
    exercises: [
      {
        id: "op-1",
        title: "The Clear Thesis",
        lesson:
          "A thesis is a sentence someone could disagree with. 'Technology is changing society' is not a thesis — it's a topic. 'Smartphones have made us worse at being alone, which has made us worse at being together' is a thesis. It is specific, it is arguable, and it commits to a direction. You can write around a thesis. You cannot write around a topic.",
        prompt:
          "Write five thesis statements on the topic of 'work.' Each must be a specific, arguable claim — not a topic announcement. Then choose your best one and write the first 100 words of the argument. Total: 130–200 words.",
        wordCountMin: 120,
        wordCountMax: 220,
        criteria: [
          { name: "Theses are genuinely arguable", description: "Each one is a claim someone could reasonably disagree with — not a truism or topic statement.", weight: 0.4 },
          { name: "Best thesis is specific and interesting", description: "The chosen thesis is tight, specific, and makes the reader want to read the argument.", weight: 0.35 },
          { name: "Opening argument starts somewhere real", description: "The first 100 words of argument are underway — not still setting up the topic.", weight: 0.25 },
        ],
      },
      {
        id: "op-2",
        title: "Evidence That Lands",
        lesson:
          "Evidence in opinion writing comes in three types: the example (a specific case), the statistic (a quantified fact), and the story (a scene or person). Most opinion writers over-rely on abstract claims or weak examples. The principle: every claim that isn't itself obviously true needs a piece of evidence. And the evidence should be more specific than the claim.",
        prompt:
          "Write 100–180 words arguing that people dramatically underestimate how much their environment shapes their thinking. Use at least two pieces of specific evidence — examples, studies, or scenarios. The evidence must be more specific than the claim it supports.",
        wordCountMin: 90,
        wordCountMax: 200,
        criteria: [
          { name: "At least two pieces of evidence", description: "Uses at least two distinct examples, facts, or scenarios as support.", weight: 0.4 },
          { name: "Evidence is more specific than the claim", description: "The evidence is concrete and particular — not just a restatement of the thesis in different words.", weight: 0.4 },
          { name: "Evidence connects to the claim", description: "It's clear why each piece of evidence supports the argument being made.", weight: 0.2 },
        ],
      },
      {
        id: "op-3",
        title: "The Concession",
        lesson:
          "The concession is the strongest move in argument writing and the most avoided. To concede is to say: 'here is the strongest thing someone who disagrees with me could say, and I'm going to engage with it honestly.' The concession does two things: it makes your argument stronger by showing it survives the best objection; it makes you more credible to readers who aren't already on your side.",
        prompt:
          "Write 100–170 words that include both an argument and a genuine concession. The argument: 'remote work has been good for most knowledge workers.' The concession must be your strongest, most honest version of what the other side would say — not a straw man. Then answer it.",
        wordCountMin: 90,
        wordCountMax: 190,
        criteria: [
          { name: "Concession is genuinely strong", description: "The opposing view is presented at its best — not as a weak version easily dismissed.", weight: 0.5 },
          { name: "Concession is answered", description: "After conceding, the argument continues — explains why the concession doesn't defeat the main claim.", weight: 0.35 },
          { name: "Reads as honest engagement", description: "The piece sounds like someone thinking through a real tension, not performing fairness.", weight: 0.15 },
        ],
      },
      {
        id: "op-4",
        title: "The Counterintuitive Take",
        lesson:
          "The best opinion pieces argue something that isn't obvious — that makes readers say 'I hadn't thought about it that way.' The structure: name the conventional wisdom, then make the case for the opposite or for something more complicated. The counterintuitive take isn't contrarianism for its own sake — it has to be true, or at least seriously arguable.",
        prompt:
          "Write 120–200 words making the case for a counterintuitive position on one of these topics: the value of boredom, why cheap things sometimes beat expensive ones, why reading fewer books is often better than reading more. Start by naming the conventional wisdom, then subvert it.",
        wordCountMin: 110,
        wordCountMax: 220,
        criteria: [
          { name: "Conventional wisdom is named", description: "The piece identifies what most people believe before arguing against it.", weight: 0.3 },
          { name: "Counterintuitive claim is specific", description: "The argument isn't just 'it's complicated' — it makes a specific, defensible claim that goes against the grain.", weight: 0.45 },
          { name: "Claim is argued, not just asserted", description: "There is at least one piece of evidence or reasoning beyond the claim itself.", weight: 0.25 },
        ],
      },
      {
        id: "op-5",
        title: "End on the Hard Part",
        lesson:
          "Opinion essays that end with a call to action or a neat summary lose the energy they spent 800 words building. The strongest endings acknowledge what the argument can't fully resolve — not to undermine the case, but to be honest about its limits. An argument that ends in certainty is less convincing than one that ends in something like 'this is the best I can do with a genuinely hard problem.'",
        prompt:
          "Write an ending (80–140 words) for a piece arguing that social media companies should be regulated like utilities. The ending must acknowledge something your own argument doesn't fully resolve or can't account for. Don't walk back the argument — complicate it at the close.",
        wordCountMin: 75,
        wordCountMax: 155,
        criteria: [
          { name: "Argument survives the ending", description: "The piece still argues for regulation — the ending doesn't retreat to 'who knows.'", weight: 0.4 },
          { name: "Complication is honest", description: "The unnamed tension is a real problem with the argument — not a trivial objection.", weight: 0.4 },
          { name: "Ending has weight", description: "The last sentence or two feel conclusive despite remaining open.", weight: 0.2 },
        ],
      },
    ],
  },

  // ── NONFICTION: NUMBERS THAT LAND ────────────────────────────────────────

  {
    id: "writing-numbers",
    title: "Numbers That Land",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "Most writers avoid numbers. Most of the ones who use them use them badly. This track teaches you to make data human — to write about statistics and research in a way that readers actually feel.",
    exercises: [
      {
        id: "num-1",
        title: "Translate the Statistic",
        lesson:
          "The most misused tool in nonfiction: the raw statistic. '73% of Americans report feeling anxious' means almost nothing to a reader — the number is too abstract to feel. The move is translation: convert the statistic into something concrete. '73% of Americans' → 'three out of every four people you'll sit next to on a bus.' Same fact, but now it exists in the world.",
        prompt:
          "Translate these three statistics into concrete, human-scale language without losing the meaning. (1) 'Approximately 1.5 billion people worldwide lack access to clean water.' (2) 'The average American spends 7 hours a day looking at screens.' (3) 'Infant mortality in the US is 5.4 per 1,000 births.' 80–150 words total.",
        wordCountMin: 75,
        wordCountMax: 165,
        criteria: [
          { name: "All three are translated", description: "Each statistic is rewritten in concrete, human-scale language.", weight: 0.35 },
          { name: "Translations feel real, not gimmicky", description: "The analogies or comparisons are apt and clear — not strained or condescending.", weight: 0.45 },
          { name: "Facts are preserved", description: "The translations don't distort the meaning of the underlying statistics.", weight: 0.2 },
        ],
      },
      {
        id: "num-2",
        title: "The Comparison That Works",
        lesson:
          "Numbers get their power from comparison. '$100 million' means nothing. '$100 million — enough to fund every public school in Detroit for three years' means something. The comparison anchors the number in something the reader can imagine. The craft: find the right anchor. Too small and the number still feels abstract; too large and the comparison loses proportion.",
        prompt:
          "Write three comparisons that make these numbers land. Each comparison should be one sentence. (1) $1.7 trillion — the total student loan debt in the US. (2) 8 minutes — the time it takes light to travel from the sun to Earth. (3) 40,000 — the number of Amazon packages delivered every hour. 60–100 words.",
        wordCountMin: 55,
        wordCountMax: 115,
        criteria: [
          { name: "All three comparisons written", description: "Three separate, one-sentence comparisons — one for each number.", weight: 0.3 },
          { name: "Comparisons are proportional", description: "The anchor chosen is the right scale — not too small, not too large.", weight: 0.4 },
          { name: "Comparisons are concrete and imaginable", description: "Each one gives the reader something they can actually picture or feel.", weight: 0.3 },
        ],
      },
      {
        id: "num-3",
        title: "The Number in a Sentence",
        lesson:
          "How you position a number in a sentence determines how it lands. 'She slept four hours a night for six years' is devastating. 'Over a period of approximately six years, she averaged around four hours of sleep per night' is nothing. Front-load the number when you want impact. Bury it in qualifiers and it disappears. The placement is the craft.",
        prompt:
          "Rewrite each of these sentences to make the number land harder. Change word order, strip qualifiers, find the most powerful position for the figure. (1) 'During the course of the study, which lasted approximately eighteen months, researchers found that roughly 40% of participants showed signs of improvement.' (2) 'The factory, which had been in operation for about 85 years at that point, employed somewhere in the range of 600 workers before it closed.' 60–120 words.",
        wordCountMin: 55,
        wordCountMax: 135,
        criteria: [
          { name: "Both sentences rewritten", description: "Both originals are replaced with tighter, more impactful versions.", weight: 0.3 },
          { name: "Numbers are positioned for impact", description: "The figures appear where they hit hardest — not buried in subordinate clauses or hedged with qualifiers.", weight: 0.45 },
          { name: "Facts are preserved", description: "The rewritten sentences contain the same information as the originals.", weight: 0.25 },
        ],
      },
      {
        id: "num-4",
        title: "Data-Driven Lede",
        lesson:
          "Data can open a story — but a raw statistic is almost never the right lede. The exception: when the number is so stark that no scene or anecdote could match it. Even then, the number needs to be followed immediately by something human that catches it. The rule of thumb: lead with the human, follow with the number, or lead with the number that is so arresting it IS the human story.",
        prompt:
          "Write a lede (2–3 sentences, 40–80 words) for a story about the US opioid epidemic that uses a number. The number must not be the first word. It must be followed by something human that makes the number feel real.",
        wordCountMin: 35,
        wordCountMax: 90,
        criteria: [
          { name: "Number is not the first word", description: "The lede doesn't open with a statistic dump.", weight: 0.3 },
          { name: "Number is specific and correct in form", description: "The statistic used is the kind that would appear in a real piece — not vague or invented.", weight: 0.25 },
          { name: "Something human follows the number", description: "After the statistic, the lede moves to a person, scene, or concrete consequence that makes the number felt.", weight: 0.45 },
        ],
      },
    ],
  },

  // ── FICTION: WRITING DIALOGUE ────────────────────────────────────────────

  {
    id: "paragraph-structure",
    title: "Paragraph Structure & Transitions",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "Most writers can write a sentence. Fewer can write a paragraph. This track drills the units that make essays hold together: topic sentences with teeth, internal turns, and transitions that snap.",
    exercises: [
      {
        id: "ps-1",
        title: "The Topic Sentence That Works",
        lesson: "Most topic sentences are placeholders: 'This brings me to my next point.' A real topic sentence does three things at once — makes a specific claim, tells the reader why this paragraph exists, and sets up everything that follows. Write it last, after you know what the paragraph proves.",
        prompt: "Write a paragraph of 80–120 words making a case for any opinion you hold. The topic sentence must (1) make a specific, arguable claim, (2) not start with 'I' or 'This,' and (3) predict exactly what the rest of the paragraph proves. Every remaining sentence should prove that specific claim — nothing else.",
        wordCountMin: 80,
        wordCountMax: 120,
        criteria: [
          { name: "Topic sentence makes a specific claim", description: "The opening sentence states an arguable position — not a vague observation or meta-comment about what's coming.", weight: 0.35 },
          { name: "Paragraph proves only what the topic sentence claims", description: "Every sentence serves the opening claim. No tangents, no bonus ideas.", weight: 0.35 },
          { name: "Doesn't start with 'I' or 'This'", description: "The topic sentence opens with the idea, not the writer.", weight: 0.15 },
          { name: "Claim is specific and arguable", description: "A reasonable person could disagree with the topic sentence.", weight: 0.15 },
        ],
      },
      {
        id: "ps-2",
        title: "The Turn Inside a Paragraph",
        lesson: "The best paragraphs don't just make a point — they make a point and then turn on it. The turn is the moment where you complicate, qualify, or surprise the idea you just set up. 'Yes, but' and 'and yet' are turn signals. A paragraph without a turn is just a repeated claim.",
        prompt: "Write a paragraph of 100–140 words that sets up a clear idea in the first 2–3 sentences, then turns on it. The turn must complicate or qualify the original idea — not contradict it entirely, not just restate it. End on the complication, not a resolution.",
        wordCountMin: 100,
        wordCountMax: 140,
        criteria: [
          { name: "Clear setup in first 2–3 sentences", description: "The opening sentences establish one clear idea before anything complicates it.", weight: 0.3 },
          { name: "Identifiable turn", description: "There is a pivot sentence — 'but,' 'and yet,' 'except,' or a structural equivalent.", weight: 0.35 },
          { name: "Turn complicates rather than reverses or restates", description: "The turn adds nuance to the original idea rather than abandoning or repeating it.", weight: 0.25 },
          { name: "Final sentence holds the tension open", description: "The paragraph ends on the complication — not wrapped up.", weight: 0.1 },
        ],
      },
      {
        id: "ps-3",
        title: "The Bridge",
        lesson: "Weak transitions are throat-clearing: 'Moving on...' Strong transitions do two jobs simultaneously: they close the previous idea and open the next one. The last sentence of a paragraph and the first of the next should lock together like cause and effect — one raises a question, the other begins to answer it.",
        prompt: "Write two consecutive paragraphs (60–80 words each) on any topic. The last sentence of Paragraph 1 must create a question, tension, or gap. The first sentence of Paragraph 2 must answer, address, or step into it. Label them Paragraph 1 and Paragraph 2.",
        wordCountMin: 120,
        wordCountMax: 175,
        criteria: [
          { name: "Each paragraph is focused and internally unified", description: "Both paragraphs pursue one idea from start to finish.", weight: 0.2 },
          { name: "Last sentence of P1 creates forward tension", description: "The closing sentence of Paragraph 1 generates a question, gap, or pull toward what comes next.", weight: 0.35 },
          { name: "First sentence of P2 steps into that tension", description: "Paragraph 2 opens by addressing — not ignoring — what Paragraph 1 ended on.", weight: 0.35 },
          { name: "Transition feels inevitable, not mechanical", description: "The connection feels earned and logical, not like a labeled segue.", weight: 0.1 },
        ],
      },
      {
        id: "ps-4",
        title: "Five Sentences, Five Jobs",
        lesson: "Long paragraphs feel long when every sentence does the same thing. The fix is structural: each sentence should do different work. A reliable scaffold: Claim → Example → Why it matters → The complication → The landing. Follow the form and then feel how the paragraph moves.",
        prompt: "Write a paragraph of exactly 5 sentences (90–130 words) about something you know or believe. Follow this structure: (1) claim, (2) specific example, (3) why it matters, (4) complication, (5) landing. Label each sentence with its job in parentheses after it. Labels don't count toward word count.",
        wordCountMin: 90,
        wordCountMax: 130,
        criteria: [
          { name: "Exactly 5 labeled sentences", description: "Five sentences, each marked with its structural role.", weight: 0.2 },
          { name: "Each sentence does distinct work", description: "No two adjacent sentences do the same job — the paragraph moves forward structurally.", weight: 0.4 },
          { name: "Reads as unified despite the structure", description: "It feels like one coherent paragraph, not five disconnected statements.", weight: 0.25 },
          { name: "Complication is genuine", description: "The fourth sentence actually complicates the idea — not just a detail.", weight: 0.15 },
        ],
      },
      {
        id: "ps-5",
        title: "Cut It in Half",
        lesson: "The average first-draft paragraph is 30–40% longer than it needs to be. The bloat isn't random words — it's sentences that restate what the previous sentence already said, or sentences that tell the reader what they just read. Cut those and the argument gets sharper.",
        prompt: "Write a paragraph of 160–200 words arguing for something you believe. Then cut it to 80–90 words without losing the argument. Submit only the cut version.",
        wordCountMin: 80,
        wordCountMax: 90,
        criteria: [
          { name: "Under 90 words", description: "The cut version lands within the required range.", weight: 0.2 },
          { name: "Core argument fully intact", description: "The claim and its support survive — nothing essential was cut.", weight: 0.4 },
          { name: "No sentences that merely summarize what came before", description: "Every sentence in the cut version does new work.", weight: 0.25 },
          { name: "Reads as complete, not truncated", description: "It feels like a finished paragraph, not a fragment.", weight: 0.15 },
        ],
      },
    ],
  },

  {
    id: "argument-fundamentals",
    title: "Argument Fundamentals",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "Opinion is cheap. An argument is opinion plus proof plus the anticipation of pushback. This track builds the skills that make a position hold: the thesis with teeth, the concession that strengthens, and the evidence that actually proves something.",
    exercises: [
      {
        id: "wa-1",
        title: "The Thesis With Teeth",
        lesson: "A weak thesis is a statement of fact ('Climate change is real') or a vague preference ('Education is important'). A thesis with teeth is specific, arguable, and consequential — a reasonable person could disagree. It should also imply what kind of argument will follow.",
        prompt: "Write three versions of a thesis on the same topic. Version 1: weak (observation or vague preference). Version 2: stronger but still generic. Version 3: specific, arguable, consequential. Then write 2–3 sentences explaining what Version 3 has that the others lack. Label each version.",
        wordCountMin: 100,
        wordCountMax: 180,
        criteria: [
          { name: "Three clearly labeled versions", description: "All three versions present and marked.", weight: 0.15 },
          { name: "Version 1 is genuinely weak", description: "A fact, a vague preference, or something no one would argue with.", weight: 0.15 },
          { name: "Version 3 is specific and arguable", description: "A reasonable person could disagree. It makes a real claim.", weight: 0.4 },
          { name: "Explanation names what changed", description: "Concretely identifies what Version 3 has that the others lack.", weight: 0.3 },
        ],
      },
      {
        id: "wa-2",
        title: "The Concession That Strengthens",
        lesson: "Acknowledging the opposing view doesn't weaken your argument — it strengthens it. A writer who never concedes anything looks like someone who hasn't thought hard. The technique: state the opposing point fairly, then turn it back with 'and yet' or 'but here's what that misses.'",
        prompt: "Write a paragraph of 120–160 words that: argues for a position, includes a genuine concession to the opposing view (not a strawman), then recovers from that concession to land the original argument stronger than before.",
        wordCountMin: 120,
        wordCountMax: 160,
        criteria: [
          { name: "Clear original argument", description: "The paragraph is arguing for a specific position.", weight: 0.25 },
          { name: "Concession is genuine, not a strawman", description: "The opposing view is stated fairly — a real objection, not a weakened version.", weight: 0.35 },
          { name: "Recovery strengthens the original position", description: "After the concession, the argument comes back stronger.", weight: 0.3 },
          { name: "Flows as argument, not a list of positions", description: "The concession feels integrated, not bolted on.", weight: 0.1 },
        ],
      },
      {
        id: "wa-3",
        title: "Evidence That Actually Proves Something",
        lesson: "Bad evidence: 'Studies show that...' Good evidence: a specific finding, from a specific context, applied precisely to a specific claim. Evidence that gestures at proof ('research suggests...') is worse than no evidence — it looks like rigor but isn't.",
        prompt: "Write a paragraph of 100–140 words where you make one specific claim and support it with one specific piece of evidence. The evidence must be named (not just 'research'), connected explicitly to the claim, and not overstated — don't generalize beyond what the evidence actually shows.",
        wordCountMin: 100,
        wordCountMax: 140,
        criteria: [
          { name: "Evidence is specific and named", description: "Not 'studies show' — the evidence has a name, a number, or a specific source.", weight: 0.35 },
          { name: "Evidence explicitly connected to the claim", description: "The paragraph explains exactly why this evidence supports this claim.", weight: 0.35 },
          { name: "Claim not overstated beyond the evidence", description: "The conclusion drawn doesn't exceed what the evidence actually shows.", weight: 0.2 },
          { name: "Paragraph is coherent and readable", description: "The evidence integration doesn't break the flow.", weight: 0.1 },
        ],
      },
      {
        id: "wa-4",
        title: "The Counterargument",
        lesson: "The difference between having an opinion and having thought through an argument is your relationship to counterarguments. State the strongest possible version of the opposing position — then answer it directly. Don't avoid the best objection. Find it and take it on.",
        prompt: "Write 150–200 words in two labeled parts. Part 1: State the strongest counterargument to a position you hold — make it as strong as you can. Part 2: Answer it. The answer must engage directly with what Part 1 argued — no changing the subject.",
        wordCountMin: 150,
        wordCountMax: 200,
        criteria: [
          { name: "Counterargument is strongest version, not a strawman", description: "Part 1 presents the best case against the writer's position.", weight: 0.35 },
          { name: "Answer engages directly with Part 1", description: "Part 2 addresses what was actually argued — not a different objection.", weight: 0.35 },
          { name: "Both parts labeled", description: "Counterargument and response clearly marked.", weight: 0.1 },
          { name: "Answer takes the objection seriously", description: "Part 2 acknowledges the force of the counterargument even while rebutting it.", weight: 0.2 },
        ],
      },
      {
        id: "wa-5",
        title: "The Argument That Moves",
        lesson: "The best arguments don't just prove a thesis — they take the reader somewhere. The reader who finishes should understand something they didn't at the start. The ending should feel different from the beginning — not because the topic changed, but because the thinking deepened.",
        prompt: "Write an argument of 200–250 words that opens with a familiar or obvious-seeming position and, by the end, has taken it somewhere genuinely unexpected — a qualification, a reversal, or a complication that changes what the original position means. The shift should feel earned, not arbitrary.",
        wordCountMin: 200,
        wordCountMax: 250,
        criteria: [
          { name: "Opens with a clear, accessible position", description: "The reader knows what territory they're in from the start.", weight: 0.2 },
          { name: "Argument develops — doesn't just repeat the opening claim", description: "Each paragraph adds something new — the argument accumulates.", weight: 0.35 },
          { name: "Ends somewhere different from where it started", description: "The final position is more nuanced, qualified, or surprising than the opening.", weight: 0.35 },
          { name: "Movement feels earned, not imposed", description: "The shift follows logically from what was argued.", weight: 0.1 },
        ],
      },
    ],
  },

  {
    id: "research-on-the-page",
    title: "Research on the Page",
    genre: "nonfiction",
    difficulty: "intermediate",
    description: "Nonfiction books are built from research — interviews, data, documents, reported scenes. This track teaches you to turn that raw material into prose: making statistics human, integrating quotes, reconstructing scenes from facts, and building extended case studies that carry an argument.",
    exercises: [
      {
        id: "research-1",
        title: "Making Data Human",
        lesson: "Statistics without a human anchor are noise. The move is always: find the person behind the number. Not '40% of Americans are food insecure' but 'In Louisville's Portland neighborhood, Denise Walters...' Data lands when it attaches to a face, a place, a decision. The statistic becomes evidence. The person becomes the argument.",
        prompt: "You have this statistic: 'In 2023, 17.8 million households in the United States were food insecure, according to the USDA.' Write 80–120 words that makes this number land. Rules: the statistic cannot be your first sentence, and it cannot stand alone — it must be anchored to a specific person, place, or moment. You may invent the person. Make the reader feel the number before they see it.",
        wordCountMin: 70,
        wordCountMax: 130,
        criteria: [
          { name: "Statistic not leading", description: "The statistic does not open the passage — it arrives after a human anchor.", weight: 0.25 },
          { name: "Human anchor", description: "A specific person, place, or moment grounds the statistic before or after it appears.", weight: 0.35 },
          { name: "Emotional weight", description: "The reader feels the scale of the number — it is not just cited but made real.", weight: 0.25 },
          { name: "Statistic present", description: "The actual statistic appears somewhere in the passage.", weight: 0.15 },
        ],
      },
      {
        id: "research-2",
        title: "The Quote and the Paraphrase",
        lesson: "Most writers over-quote. A direct quote earns its place by doing something paraphrase can't: capturing a voice, landing a punchline, or revealing character through word choice. Everything else should be paraphrased. The test: would anything be lost if you paraphrased this? If no, paraphrase it. A quote that could just as easily be paraphrased is clutter.",
        prompt: "Here is a partial interview transcript from a climate scientist:\n\n'The thing people don't understand is that we've already crossed multiple tipping points. What we're doing now isn't saving the climate we had — it's choosing how bad the climate we're going to get will be. That's the honest frame. And politicians can't say that, so they don't.'\n\nWrite 100–150 words incorporating this material. Use at least one direct quote (you may excerpt it). The rest should be paraphrase or context. Choose only the words that would lose something if paraphrased.",
        wordCountMin: 90,
        wordCountMax: 165,
        criteria: [
          { name: "Quote selection justified", description: "The quoted words are the ones that couldn't be paraphrased without losing voice, impact, or specificity.", weight: 0.40 },
          { name: "Paraphrase fluent", description: "The paraphrased material reads as prose, not a summary of the transcript.", weight: 0.30 },
          { name: "Quote integrated", description: "The quote is woven into the prose — not dropped in with a colon and left to stand alone.", weight: 0.30 },
        ],
      },
      {
        id: "research-3",
        title: "Research Into Scene",
        lesson: "The most powerful move in reported nonfiction is turning documented facts into scene — rendering a real event as if the reader were in the room. You weren't there. But you know what was said, who was present, what happened. Reconstruct from the record. Use attribution to cover what you couldn't witness. The reader should feel present even when you weren't.",
        prompt: "Using only these documented facts, write a scene of 120–160 words that puts the reader in the room.\n\nFacts: In March 2019, Boeing held an internal meeting about the 737 MAX. CEO Dennis Muilenburg was present. An engineer named Sam Salehpour raised concerns about the MCAS flight-control system. He was told the plane was safe. He later testified to Congress that he felt 'pressured to ignore safety concerns.'\n\nWrite reconstructed nonfiction. Use attribution where needed ('according to congressional testimony'). Do not invent dialogue unless you attribute it. The goal: a scene, not a list of facts.",
        wordCountMin: 110,
        wordCountMax: 175,
        criteria: [
          { name: "Scene construction", description: "The passage reads as scene — the reader is in the room — not as a list of facts or a summary.", weight: 0.35 },
          { name: "Attribution present", description: "Claims that go beyond what's verifiable are attributed to their source.", weight: 0.30 },
          { name: "No invented unattributed content", description: "Dialogue or interior states that aren't in the record are attributed or absent.", weight: 0.20 },
          { name: "Forward tension", description: "The scene has momentum — the reader wants to know what happens next.", weight: 0.15 },
        ],
      },
      {
        id: "research-4",
        title: "Introducing a Source",
        lesson: "How you introduce a source tells the reader how much to trust them and how to listen. 'John Smith, a professor' is lazy. 'John Smith spent twenty years studying X before concluding Y' is doing work. The source introduction should establish credential, hint at relevance, and not interrupt the sentence's momentum. A good introduction makes the reader lean forward. A bad one makes them skim.",
        prompt: "Write one sentence introducing each of these four sources in a piece about the opioid crisis. Each introduction should be 15–25 words. The credential must be specific, not just a title. The reader should lean forward, not just nod.\n\n1. A pharmacist who dispensed pills that killed patients\n2. A Purdue Pharma sales executive\n3. A rural emergency room doctor\n4. A mother whose son died at 24",
        wordCountMin: 60,
        wordCountMax: 110,
        criteria: [
          { name: "Specificity", description: "Each introduction names a specific credential or circumstance — not just a job title.", weight: 0.35 },
          { name: "Forward lean", description: "Each introduction makes the reader want to hear what this person says next.", weight: 0.35 },
          { name: "Momentum", description: "None of the introductions interrupt the flow — they feel like prose, not résumé entries.", weight: 0.30 },
        ],
      },
      {
        id: "research-5",
        title: "The Extended Case Study",
        lesson: "Most writers use examples too briefly — they name them and move on. An extended case study earns its length by developing a single example over multiple paragraphs: establishing stakes, building the narrative, landing the analytical point, and connecting back to the larger argument. The case study should be so specific it becomes a scene. Then it should pivot outward to tell the reader what it means.",
        prompt: "Write an extended case study of 200–280 words for a piece arguing that smaller American cities are gaining economic and creative vitality as remote workers arrive and don't leave.\n\nThe case study must: name a specific fictional city (give it geography, population, history), name one person who moved there and why they left a major city, show what they found, and land the analytical point your piece is making. The final sentence should connect back to the larger argument.",
        wordCountMin: 185,
        wordCountMax: 300,
        criteria: [
          { name: "Specific detail", description: "The city is named and characterized (geography, feel, history). The person is specific — named, motivated, particular.", weight: 0.30 },
          { name: "Scene-level development", description: "The case study develops rather than summarizes — the reader is inside it, not looking down at it.", weight: 0.30 },
          { name: "Analytical point lands", description: "The case study makes its argumentative point clearly — it doesn't just tell a story, it proves something.", weight: 0.25 },
          { name: "Connection to larger argument", description: "The final sentence pivots from the specific case back to the piece's larger claim.", weight: 0.15 },
        ],
      },
    ],
  },

  // ── GRAMMAR: MECHANICS ───────────────────────────────────────────────────

  {
    id: "interview-on-page",
    title: "The Interview on the Page",
    genre: "nonfiction",
    difficulty: "advanced",
    description:
      "Using sources is a craft skill. Knowing when to quote directly versus paraphrase, how to make a person live on the page, and how to turn an interview into a scene — these are learnable moves that most writers never drill.",
    exercises: [
      {
        id: "iop-1",
        title: "The Telling Quote",
        lesson: "Most quotes in journalism are wasted: 'It was a very difficult time,' she said. A telling quote does something only direct quotation can do — it reveals character, uses language the writer couldn't invent, or says something so specific and strange that paraphrase would kill it. Test: if you could paraphrase without loss, you should.",
        prompt: "Write 80–120 words of reported nonfiction (real or invented) that includes exactly one direct quote. The quote must do something paraphrase cannot. Then add one sentence explaining why this quote earns direct quotation.",
        wordCountMin: 90,
        wordCountMax: 140,
        criteria: [
          { name: "Exactly one direct quote", description: "One quote, properly attributed and punctuated.", weight: 0.15 },
          { name: "Quote earns direct quotation", description: "The quoted words do something a paraphrase could not — they reveal, surprise, or land in a way that would be lost in summary.", weight: 0.45 },
          { name: "Attribution is clean and unobtrusive", description: "The attribution tag doesn't distract from the quote.", weight: 0.15 },
          { name: "Explanation names what the quote achieves", description: "The final sentence concretely identifies what the quote does.", weight: 0.25 },
        ],
      },
      {
        id: "iop-2",
        title: "The Source Who Lives",
        lesson: "A source who doesn't live on the page is just a floating voice. Making a source real takes the same tools as any character: a specific physical detail, something they do with their hands, the way they enter a room. One concrete detail does more than a paragraph of credentials.",
        prompt: "Write 120–160 words introducing a source (real or invented). Include: one specific physical detail, one thing they said (direct or paraphrased), one small action or gesture, and their relevant context or credential. The reader should feel they've met this person, not just received their information.",
        wordCountMin: 120,
        wordCountMax: 160,
        criteria: [
          { name: "One specific physical detail", description: "Something you could photograph — not 'tall' but the particular thing.", weight: 0.25 },
          { name: "Something they said, direct or paraphrased", description: "Their voice or position is present.", weight: 0.2 },
          { name: "One action or gesture", description: "They are doing something, not just being described.", weight: 0.25 },
          { name: "Source feels like a person, not a credential", description: "The reader has a sense of who this person is beyond their title.", weight: 0.3 },
        ],
      },
      {
        id: "iop-3",
        title: "Quote vs. Paraphrase",
        lesson: "Paraphrase when the information matters more than the exact words. Quote directly when the exact words are the point. Mixing them well creates rhythm — quote the peaks, paraphrase the connective tissue. Each choice should be defensible.",
        prompt: "Write a passage of 140–180 words using a source on one topic, alternating between direct quotation (at least twice) and paraphrase (at least twice). Each choice should be defensible. The rhythm should feel natural, not mechanical.",
        wordCountMin: 140,
        wordCountMax: 180,
        criteria: [
          { name: "At least two direct quotes and two paraphrases", description: "Both techniques used multiple times.", weight: 0.2 },
          { name: "Direct quotes are earned", description: "Each quote does something a summary could not.", weight: 0.35 },
          { name: "Paraphrases genuinely compress rather than just remove quotation marks", description: "The paraphrases synthesize or compress — they're not just unquoted speech.", weight: 0.3 },
          { name: "Rhythm of quote/paraphrase feels natural", description: "The alternation serves the passage rather than feeling formulaic.", weight: 0.15 },
        ],
      },
      {
        id: "iop-4",
        title: "The Scene From an Interview",
        lesson: "The best interview writing isn't a list of answers — it's a scene. Where did it take place? What did the person do while they talked? An interview becomes reportage when the writer was also observing, not just transcribing.",
        prompt: "Write a scene of 160–200 words set during an interview (real or invented). Include: where it took place (specific), at least one observation about the subject beyond what they said, at least one direct quote, and a sense of time passing or something shifting during the conversation.",
        wordCountMin: 160,
        wordCountMax: 200,
        criteria: [
          { name: "Setting is specific and present", description: "The reader knows where this interview happened — something concrete about the space.", weight: 0.2 },
          { name: "At least one non-verbal observation", description: "Something the subject did, wore, or how they moved — distinct from what they said.", weight: 0.25 },
          { name: "At least one direct quote that earns quotation", description: "A quote that does what paraphrase cannot.", weight: 0.25 },
          { name: "Time passes or something shifts", description: "The scene has movement — the beginning and end are not in the same place.", weight: 0.3 },
        ],
      },
      {
        id: "iop-5",
        title: "The Attribution Problem",
        lesson: "Bad attribution competes with the quote for attention, or tells the reader how to feel: 'she said sadly.' The problem isn't 'said' — 'said' is invisible. The problem is any tag that performs emotion rather than letting the quote do that work.",
        prompt: "Write a passage of 120–150 words with at least three direct quotes, using attribution tags that are invisible. Then rewrite one attribution line as a bad version — one that editorializes or draws attention to itself. Label the bad version.",
        wordCountMin: 130,
        wordCountMax: 180,
        criteria: [
          { name: "At least three direct quotes with attribution", description: "Three or more quotes, each with an attribution tag.", weight: 0.15 },
          { name: "Main attribution tags are clean and unobtrusive", description: "The tags in the main passage don't compete with the quotes or perform emotion.", weight: 0.4 },
          { name: "Bad version demonstrates the contrast", description: "The labeled bad attribution is genuinely worse — it editorializes or draws attention to itself.", weight: 0.3 },
          { name: "Quotes carry their own weight", description: "The quotes don't need the attribution to explain how to receive them.", weight: 0.15 },
        ],
      },
    ],
  },

  {
    id: "grammar-mechanics",
    title: "Grammar & Mechanics",
    genre: "grammar",
    difficulty: "beginner",
    description:
      "Sentence-level mechanics that separate clear prose from muddy prose. These drills isolate the rules most writers know but don't apply consistently: sentence rhythm, active voice, commas, parallel structure, and advanced punctuation.",
    exercises: [
      {
        id: "gm-1",
        title: "Vary Your Sentence Length",
        lesson:
          "Sentences of the same length create drone. Read a paragraph of yours aloud — if you never have to breathe, your sentences are too similar. The fix is deliberate variation: short sentences hit; long ones accumulate. A short sentence after a long one lands with extra force. Place short sentences where you want the reader to stop. Use long ones to develop complexity and carry the reader through a chain of related ideas.",
        prompt:
          "Write a paragraph of 120–180 words about any subject you know well. Deliberately include at least two sentences under 7 words and at least two sentences over 25 words. Read it aloud when done — the rhythm should feel like thought, not a metronome.",
        wordCountMin: 120,
        wordCountMax: 180,
        criteria: [
          { name: "Short sentences present", description: "At least two sentences of 7 words or fewer appear in the paragraph.", weight: 0.3 },
          { name: "Long sentences present", description: "At least two sentences of 25 words or more appear in the paragraph.", weight: 0.3 },
          { name: "Variation serves the meaning", description: "Short sentences land on important moments; long ones carry complexity. The rhythm feels intentional, not random.", weight: 0.4 },
        ],
      },
      {
        id: "gm-2",
        title: "Cut the Passive Voice",
        lesson:
          "Passive voice hides the actor: 'Mistakes were made.' By whom? Active voice puts the actor first and makes prose vivid: 'The team made mistakes.' The passive isn't always wrong — use it when the subject is genuinely unknown, or when you want to emphasize the object over the actor ('Three people were killed in the blast'). But most passive constructions in first drafts are weak by default. The test: can you name who's doing the thing? If yes, make them the subject.",
        prompt:
          "Rewrite these four sentences in active voice, then identify which one actually has a legitimate reason to stay passive and explain why in one sentence. (1) 'The report was completed by the team last Thursday.' (2) 'Mistakes were made during the initial phase.' (3) 'The decision was announced by the CEO in a memo.' (4) 'Three workers were injured in the factory accident.' Total: 80–130 words.",
        wordCountMin: 75,
        wordCountMax: 140,
        criteria: [
          { name: "Active rewrites are grammatically correct", description: "Each rewritten sentence is in active voice and reads naturally.", weight: 0.4 },
          { name: "Legitimate passive identified with reasoning", description: "One sentence is correctly identified as having a valid passive use, with a specific reason given.", weight: 0.35 },
          { name: "Rewrites are stronger than the originals", description: "The active versions are more vivid and direct than the passive originals.", weight: 0.25 },
        ],
      },
      {
        id: "gm-3",
        title: "Comma Control",
        lesson:
          "Most comma errors fall into two categories: using one where there shouldn't be one (between a subject and its verb), or omitting one where it's needed (before a coordinating conjunction joining two independent clauses, after a long introductory phrase, around a non-restrictive clause). The comma's job is to clarify structure, not just mark a pause. When in doubt, ask: would a reader momentarily misread this without the comma?",
        prompt:
          "Edit the following four sentences — add or remove commas as needed. After each corrected sentence, write one phrase identifying the rule you applied. (1) 'The writer who revises consistently improves fastest.' (2) 'After writing for three hours she finally found the lede.' (3) 'He wanted to leave but she asked him to stay.' (4) 'My favorite essay which was published in 1992 still holds up.' Total: 60–100 words.",
        wordCountMin: 60,
        wordCountMax: 110,
        criteria: [
          { name: "Corrections are grammatically justified", description: "Each comma change is correct according to standard usage rules.", weight: 0.45 },
          { name: "Rules are named accurately", description: "Each explanation correctly identifies why the comma was added, removed, or kept.", weight: 0.35 },
          { name: "No unnecessary commas added", description: "The corrections don't over-insert commas where they don't belong.", weight: 0.2 },
        ],
      },
      {
        id: "gm-4",
        title: "Parallel Structure",
        lesson:
          "Parallel structure means keeping items in a list or comparison in the same grammatical form. 'She likes running, to swim, and cycling' is broken. 'She likes running, swimming, and cycling' is parallel. Broken parallelism is easy to miss and immediately visible to editors. The rule: once you establish a pattern in a list or comparison, hold it all the way through.",
        prompt:
          "Rewrite the following three sentences to fix the broken parallelism. Then write one original sentence with a list of at least four items in perfect parallel form. (1) 'The coach told us to stay focused, keeping our heads up, and that we should communicate.' (2) 'His writing is crisp, clear, and he always gets to the point.' (3) 'She wanted career success, a strong relationship, and to be financially independent.' Total: 80–120 words.",
        wordCountMin: 75,
        wordCountMax: 130,
        criteria: [
          { name: "All three rewrites are parallel", description: "Each corrected sentence has all list items in the same grammatical form.", weight: 0.4 },
          { name: "Original sentence maintains parallel form", description: "The new sentence holds the parallel pattern across all four or more items.", weight: 0.35 },
          { name: "Meaning is preserved in rewrites", description: "The corrected sentences say the same thing as the originals — the fix didn't change the content.", weight: 0.25 },
        ],
      },
      {
        id: "gm-5",
        title: "Semicolons, Dashes, and Colons",
        lesson:
          "Three marks most writers avoid and misuse. The semicolon joins two closely related independent clauses without a conjunction; it's a soft period. The colon introduces what follows: a list, a quotation, or an elaboration of what came before. The em dash adds an interruption — like this — or a sudden addition at the end of a sentence. Each has one job. Using them correctly signals that you understand clause structure.",
        prompt:
          "Write three separate sentences: one using a semicolon correctly, one using a colon correctly, and one using an em dash correctly. Then write a fourth sentence that uses all three marks. Each sentence should be original — not a textbook example. Total: 80–120 words.",
        wordCountMin: 75,
        wordCountMax: 130,
        criteria: [
          { name: "Each mark used correctly in isolation", description: "The semicolon, colon, and em dash sentences each demonstrate proper usage for that specific mark.", weight: 0.45 },
          { name: "Combined sentence uses all three correctly", description: "The fourth sentence correctly deploys all three marks without forcing them.", weight: 0.35 },
          { name: "Sentences are original and readable", description: "The examples feel like real writing, not mechanical demonstrations of a rule.", weight: 0.2 },
        ],
      },
    ],
  },

  // ── GRAMMAR: WORD-LEVEL EDITING ──────────────────────────────────────────

  {
    id: "word-level-editing",
    title: "Word-Level Editing",
    genre: "grammar",
    difficulty: "beginner",
    description:
      "Most editing problems live at the word level: weak verbs propped up by adverbs, nouns that are really hidden verbs, filler phrases that delay the sentence's actual work, and vague placeholders where specific words should be. These drills isolate each problem so you can see and fix it.",
    exercises: [
      {
        id: "wle-1",
        title: "Kill the Adverb",
        lesson:
          "Most adverbs are a tax on weak verbs. 'She walked slowly' signals that you chose the wrong verb — the fix is 'she shuffled.' 'He spoke softly' becomes 'he murmured.' The adverb is doing work the verb should be doing. The test: if removing the adverb makes the sentence worse, you need a stronger verb. If it makes it better, cut was always the right move.",
        prompt:
          "Rewrite these five sentences by replacing the verb-plus-adverb with a single stronger verb. (1) 'He spoke softly to the child.' (2) 'She walked quickly past the building.' (3) 'He ate his food hurriedly.' (4) 'She looked carefully at the document.' (5) 'He moved nervously around the room.' Then write two original sentences using strong single verbs with no adverbs at all. Total: 80–120 words.",
        wordCountMin: 75,
        wordCountMax: 130,
        criteria: [
          { name: "Adverbs eliminated in all five rewrites", description: "No -ly adverb remains attached to a verb in any of the five sentences.", weight: 0.4 },
          { name: "Replacement verbs are genuinely stronger", description: "Each new verb carries the meaning the adverb was propping up — it is more specific, not just different.", weight: 0.4 },
          { name: "Original sentences use strong single verbs", description: "The two new sentences contain no verb-adverb combinations.", weight: 0.2 },
        ],
      },
      {
        id: "wle-2",
        title: "Cut the Filler",
        lesson:
          "Filler phrases are padding that delays the sentence's actual work. 'It is important to note that' → cut entirely. 'Due to the fact that' → 'because.' 'In order to' → 'to.' 'At this point in time' → 'now.' 'In the process of making a determination' → 'deciding.' These aren't just wordiness — they're a kind of dishonesty, performing weight the sentence doesn't have.",
        prompt:
          "Cut every filler phrase from this passage without changing the meaning. Then list each cut with what you replaced it (or just deleted). Passage: 'It is important to note that, at this point in time, the organization is in the process of making a determination as to whether or not the proposal is, in fact, viable. Due to the fact that resources are limited in nature, it will be necessary to evaluate each and every option in order to make the best possible decision.' Total: 60–100 words.",
        wordCountMin: 55,
        wordCountMax: 110,
        criteria: [
          { name: "All filler phrases identified and cut", description: "Every padding phrase is removed or replaced — none survive in the rewritten version.", weight: 0.45 },
          { name: "Meaning preserved completely", description: "The rewritten passage says the same thing as the original.", weight: 0.35 },
          { name: "Rewritten version is substantially shorter", description: "The cut version is at least 30% shorter than the original.", weight: 0.2 },
        ],
      },
      {
        id: "wle-3",
        title: "Unmask the Nominalization",
        lesson:
          "A nominalization turns a verb or adjective into a noun: 'make a decision' (the verb 'decide' is hiding), 'give consideration to' (the verb 'consider'), 'have a discussion' ('discuss'), 'reach an agreement' ('agree'). Nominalizations make prose slow and bureaucratic. They bury the action in a noun and force you to add a weak verb like 'make,' 'give,' 'have,' or 'reach' just to hold the sentence together.",
        prompt:
          "Rewrite these five sentences to eliminate the nominalization and restore the real verb. (1) 'The committee will make a recommendation next week.' (2) 'She gave a performance that moved the audience.' (3) 'We need to come to an agreement on the terms.' (4) 'The report provides an analysis of the data.' (5) 'He made an attempt to reach them by phone.' Total: 60–100 words.",
        wordCountMin: 55,
        wordCountMax: 110,
        criteria: [
          { name: "Nominalizations replaced with direct verbs", description: "Each sentence uses an active verb where the original hid one inside a noun.", weight: 0.5 },
          { name: "Sentences are shorter and more direct", description: "The rewritten versions are visibly tighter — the weak supporting verb ('make,' 'give,' 'have') is gone.", weight: 0.3 },
          { name: "No meaning lost in conversion", description: "The rewritten sentences say everything the originals said.", weight: 0.2 },
        ],
      },
      {
        id: "wle-4",
        title: "Vague to Specific",
        lesson:
          "Vague nouns — 'thing,' 'situation,' 'aspect,' 'issue,' 'area,' 'stuff' — are placeholders. The writer knows what they mean but the reader doesn't. The same goes for vague verbs: 'get,' 'make,' 'do,' 'have.' The move: find what you actually mean and say it. 'The situation got worse' might become 'the infection spread to his lungs.' More specific, sometimes more words, always better.",
        prompt:
          "Rewrite these four sentences by replacing every vague noun and verb with specific ones. Invent plausible details where needed. (1) 'The thing about that situation is that it got worse.' (2) 'She did something that changed how everything worked.' (3) 'There were issues with the way they handled things.' (4) 'He got some stuff together and made it work.' Then write one original sentence using nothing but specific nouns and verbs. Total: 80–130 words.",
        wordCountMin: 75,
        wordCountMax: 140,
        criteria: [
          { name: "All vague nouns replaced", description: "No 'thing,' 'stuff,' 'situation,' 'aspect,' 'issue,' or 'area' in the rewrites.", weight: 0.35 },
          { name: "Specific verbs replace placeholder verbs", description: "No 'got,' 'made,' 'did,' 'handled' as main verbs — each replaced with something precise.", weight: 0.35 },
          { name: "Invented details are plausible and concrete", description: "The added specifics are believable and put the reader in a real situation.", weight: 0.3 },
        ],
      },
      {
        id: "wle-5",
        title: "The 25% Cut",
        lesson:
          "The average first draft is 20–30% longer than it needs to be — not because of filler phrases, but because of sentences that restate what the previous sentence said, qualifiers that make claims softer without making them more accurate, and adjectives that add nothing because they're already implied. Cut until cutting hurts. Then you're done.",
        prompt:
          "Cut this passage by at least 25% without losing any of the meaning. Submit only the cut version with a word count at the end. Original (86 words): 'In my personal opinion, the most important thing that writers can do to really improve their writing is to make a regular, consistent practice of reading their work out loud, because it is through the process of vocalizing the words that they are able to identify the places where the sentences are not flowing smoothly and where the rhythm is not quite working as it should be.'",
        wordCountMin: 40,
        wordCountMax: 65,
        criteria: [
          { name: "Cut is at least 25%", description: "The submitted version is 65 words or fewer (25% below the 86-word original).", weight: 0.3 },
          { name: "Core meaning fully preserved", description: "The advice in the original — read your work aloud to find rhythm and flow problems — is still intact.", weight: 0.5 },
          { name: "No good ideas cut, only redundancy", description: "The cuts are fat, not muscle — nothing essential was removed.", weight: 0.2 },
        ],
      },
    ],
  },

  // ── GRAMMAR: SENTENCE CLARITY ────────────────────────────────────────────

  {
    id: "sentence-clarity",
    title: "Sentence Clarity",
    genre: "grammar",
    difficulty: "beginner",
    description:
      "Clear sentences are grammatically unambiguous — the reader never has to reread to figure out who's doing what. This track drills the structural errors that cause confusion: dangling modifiers, unclear pronoun references, redundant pairs, comma splices, and misplaced limiting words.",
    exercises: [
      {
        id: "scl-1",
        title: "The Dangling Modifier",
        lesson:
          "A modifier dangles when the noun it's supposed to modify isn't in the sentence. 'Running to the station, my hat blew off' — my hat wasn't running to the station. A participial phrase at the start of a sentence always modifies the subject. If the subject isn't doing the thing in the phrase, you have a dangling modifier. The fix: make the subject the person doing the action in the phrase.",
        prompt:
          "Fix these four dangling modifiers, then briefly note what was wrong with each. (1) 'Walking into the office, the smell of coffee filled the air.' (2) 'Having finished the report, the weekend felt like a relief.' (3) 'Turning the corner, the library came into view.' (4) 'Exhausted from the long day, the couch looked inviting.' Then write two original sentences that use participial phrases correctly. Total: 80–130 words.",
        wordCountMin: 75,
        wordCountMax: 140,
        criteria: [
          { name: "All four modifiers correctly fixed", description: "Each rewritten sentence has the participial phrase modifying the actual subject.", weight: 0.45 },
          { name: "Each error briefly identified", description: "One phrase per sentence explains what was dangling and why.", weight: 0.3 },
          { name: "Original sentences use participial phrases correctly", description: "The two new sentences have participial phrases that modify their subjects.", weight: 0.25 },
        ],
      },
      {
        id: "scl-2",
        title: "Unclear Pronoun References",
        lesson:
          "A pronoun must refer unambiguously to one noun. 'Jake told Marcus that he was wrong' — who's wrong, Jake or Marcus? When a pronoun could refer to more than one noun, replace it with the name. The test: read the sentence cold, without context. Could two readers reasonably disagree about who 'he' or 'she' refers to? If yes, the reference is unclear.",
        prompt:
          "Fix the ambiguous pronoun references in these five sentences. (1) 'After Sarah called Jennifer, she felt better.' (2) 'The manager told the employee that his report was late.' (3) 'Jake and his brother argued until he stormed off.' (4) 'When the dog bit the child, it was taken to the vet.' (5) 'The CEO told the CFO that his projections were wrong.' For each fix, note which interpretation you chose and why. Total: 70–110 words.",
        wordCountMin: 65,
        wordCountMax: 120,
        criteria: [
          { name: "All five ambiguous references resolved", description: "Each sentence now unambiguously identifies who the pronoun refers to.", weight: 0.4 },
          { name: "Chosen interpretation is noted and plausible", description: "Each fix is accompanied by a brief explanation of which reading was chosen.", weight: 0.35 },
          { name: "No new ambiguity introduced", description: "The rewrites don't create different pronoun problems.", weight: 0.25 },
        ],
      },
      {
        id: "scl-3",
        title: "Redundant Pairs",
        lesson:
          "Redundant pairs say the same thing twice: 'each and every,' 'first and foremost,' 'past history,' 'future plans,' 'end result,' 'unexpected surprise.' One word is always enough. The same logic applies to redundant modifiers: 'free gift,' 'true facts,' 'advance warning,' 'final conclusion.' The modifier adds nothing because the meaning is already inside the noun. Cut one, keep one.",
        prompt:
          "Fix each of these ten redundant pairs or phrases by keeping only the necessary word. Then write three original sentences that are completely free of redundancy of any kind. (1) each and every (2) past history (3) unexpected surprise (4) end result (5) first and foremost (6) free gift (7) true facts (8) final conclusion (9) future plans (10) advance warning. Total: 60–100 words.",
        wordCountMin: 55,
        wordCountMax: 110,
        criteria: [
          { name: "All ten redundancies correctly fixed", description: "Each pair is reduced to its single essential word.", weight: 0.4 },
          { name: "Correct word retained in each case", description: "The kept word is the one that carries the full meaning.", weight: 0.35 },
          { name: "Original sentences contain no redundancy", description: "The three new sentences pass the redundancy test — no word says what another word already said.", weight: 0.25 },
        ],
      },
      {
        id: "scl-4",
        title: "Fix the Run-On",
        lesson:
          "A run-on isn't just a long sentence — it's two independent clauses joined only by a comma (a comma splice) or nothing at all. 'It was raining, we couldn't play' — comma splice. The fixes: use a period, a semicolon, a coordinating conjunction, or a subordinating conjunction. Long sentences are fine; structural errors are not. Each fix creates a different relationship between the ideas.",
        prompt:
          "Fix these four run-ons using four different methods — one per sentence: (A) a period, (B) a semicolon, (C) a coordinating conjunction (for/and/nor/but/or/yet/so), (D) a subordinating conjunction. Label which method you used. (A) 'The draft was finished, he sent it immediately.' (B) 'She knew the deadline was tomorrow she worked through the night.' (C) 'The data was clear nobody wanted to act on it.' (D) 'The interview went well he still didn't get the job.' Total: 60–100 words.",
        wordCountMin: 55,
        wordCountMax: 110,
        criteria: [
          { name: "Each fix uses the specified method", description: "Method A uses a period, B a semicolon, C a coordinating conjunction, D a subordinating conjunction.", weight: 0.4 },
          { name: "All four are now grammatically correct", description: "No run-ons or comma splices remain.", weight: 0.4 },
          { name: "Methods are labeled", description: "Each sentence is marked with which fix was applied.", weight: 0.2 },
        ],
      },
      {
        id: "scl-5",
        title: "The Misplaced Modifier",
        lesson:
          "A modifier should sit next to what it modifies. When it doesn't, you get confusion — or comedy. 'She almost drove her children to school every day' (she almost drove, but didn't?) vs. 'She drove her children to school almost every day.' The most common culprits: 'only,' 'almost,' 'nearly,' 'just,' and 'even.' These limiting words must appear directly in front of the word they limit.",
        prompt:
          "Fix the misplaced modifier in each sentence, then explain in one phrase what the original accidentally said. (1) 'He only eats vegetables on Tuesdays.' (2) 'She almost read every book on the shelf.' (3) 'I just need five minutes of your time.' (4) 'The professor only gives extra credit for perfect scores.' (5) 'They nearly drove 500 miles to see the concert.' Then write two original sentences using 'only' and 'almost' in their correct positions. Total: 80–120 words.",
        wordCountMin: 75,
        wordCountMax: 130,
        criteria: [
          { name: "All five modifiers correctly repositioned", description: "Each 'only,' 'almost,' 'nearly,' or 'just' now sits directly before the word it limits.", weight: 0.4 },
          { name: "Original misreading identified", description: "Each fix includes a brief note on what the original accidentally said.", weight: 0.35 },
          { name: "Original sentences place limiting words correctly", description: "The two new sentences demonstrate correct placement without error.", weight: 0.25 },
        ],
      },
    ],
  },

  // ── GRAMMAR: SENTENCE ARCHITECTURE ──────────────────────────────────────

  {
    id: "sentence-architecture",
    title: "Sentence Architecture",
    genre: "grammar",
    difficulty: "intermediate",
    description:
      "Beyond grammar correctness, sentences can be engineered for emphasis, rhythm, and logic. This track teaches the structural moves that control what a reader notices and feels: end-weight, periodic vs. cumulative construction, subordination, the deliberate fragment, and the long-then-short pattern.",
    exercises: [
      {
        id: "arch-1",
        title: "End-Weight",
        lesson:
          "The most important information in a sentence belongs at the end. This is end-weight. The beginning holds what the reader already knows; the end holds what's new. 'Budget cuts were the reason the program was eliminated' buries the key information mid-sentence. 'The program was eliminated because of budget cuts' puts the cause last, where it lands harder. The end of a sentence is the stress position — use it deliberately.",
        prompt:
          "Rewrite these four sentences to put the most important information at the end. Then write two original sentences where you've deliberately placed new or surprising information in the stress position. (1) 'Budget cuts were the reason the program was eliminated.' (2) 'Jealousy, according to police, was the suspect's motive.' (3) 'By midnight, three thousand people had signed the petition.' (4) 'What he had been hiding for twenty years came out in the interview.' Total: 80–130 words.",
        wordCountMin: 75,
        wordCountMax: 140,
        criteria: [
          { name: "Key information moved to sentence-end", description: "In all four rewrites, the new or most important information appears in the final position.", weight: 0.45 },
          { name: "Stress position used deliberately in originals", description: "The two new sentences consciously place emphasis-worthy content at the end.", weight: 0.35 },
          { name: "Rewrites don't distort the meaning", description: "The same information is present — only the word order changed.", weight: 0.2 },
        ],
      },
      {
        id: "arch-2",
        title: "Periodic vs. Cumulative",
        lesson:
          "A cumulative sentence leads with the main clause and adds modifying details after: 'She left the room, slamming the door, her face unreadable.' A periodic sentence delays the main clause until the end, building suspense: 'After twenty years of silence, after everything that had been said and unsaid, she finally called.' The cumulative is faster and more natural. The periodic is more formal and more dramatic. Choose based on the effect you want.",
        prompt:
          "Write two pairs of sentences — one cumulative and one periodic — for two different events. Each sentence: 20–40 words. Label them. Then write one sentence explaining what emotional effect each structure creates in your examples. Total: 100–160 words.",
        wordCountMin: 95,
        wordCountMax: 170,
        criteria: [
          { name: "Both structures used correctly in each pair", description: "Cumulative sentences lead with the main clause; periodic sentences withhold the main clause until the end.", weight: 0.45 },
          { name: "Both pairs are present and labeled", description: "Four sentences total, two pairs, each labeled cumulative or periodic.", weight: 0.25 },
          { name: "Explanation identifies a genuine difference in effect", description: "The one-sentence explanation names something real about how each structure lands differently.", weight: 0.3 },
        ],
      },
      {
        id: "arch-3",
        title: "Subordination Creates Hierarchy",
        lesson:
          "Joining two ideas with 'and' says they're equal. Subordinating one says which matters more: 'He was tired, and he made mistakes' treats both facts the same. 'Because he was tired, he made mistakes' makes the first clause the cause. 'Although he was tired, he made no mistakes' makes tiredness a conceded fact and the clean performance the main point. Coordination equals; subordination ranks.",
        prompt:
          "Rewrite these four coordinated sentences as subordinated versions that make the hierarchy of ideas explicit. (1) 'She was nervous and her voice shook.' (2) 'The experiment failed and we had to start over.' (3) 'He hadn't eaten and he couldn't concentrate.' (4) 'The deadline passed and no one noticed.' After each rewrite, name the logical relationship your subordinating conjunction establishes (cause, concession, condition, result). Total: 100–150 words.",
        wordCountMin: 95,
        wordCountMax: 160,
        criteria: [
          { name: "Subordination correctly applied in all four", description: "Each rewrite uses a subordinating conjunction and places the main idea in the independent clause.", weight: 0.4 },
          { name: "Main clause contains the more important idea", description: "The independent clause carries the point; the subordinate clause carries the context.", weight: 0.35 },
          { name: "Logical relationships accurately named", description: "Each label (cause, concession, condition, result) correctly describes what the conjunction creates.", weight: 0.25 },
        ],
      },
      {
        id: "arch-4",
        title: "The Deliberate Fragment",
        lesson:
          "A sentence fragment is an error when it's accidental. It's a tool when it's deliberate. A fragment placed after a long sentence creates emphasis by contrast. 'She had spent fifteen years building the company, turning down acquisitions, working through the nights, sacrificing everything. Gone.' The fragment hits because everything before it was so long. Rule: use fragments for emphasis only. They must be earned by what precedes them.",
        prompt:
          "Write three pairs. In each pair: write a long sentence (30–50 words) followed by a deliberate fragment (2–5 words) that punches the main point home. The fragment should feel inevitable — the only possible ending. Total: 90–180 words.",
        wordCountMin: 85,
        wordCountMax: 190,
        criteria: [
          { name: "Each fragment is emphatic and deliberate", description: "Each short fragment carries a punch — it's not a sentence that accidentally got cut off.", weight: 0.4 },
          { name: "Fragments are earned by what precedes them", description: "The long sentences set up the weight that the fragment lands.", weight: 0.4 },
          { name: "Contrast between long and short creates impact", description: "The length difference is noticeable and intentional.", weight: 0.2 },
        ],
      },
      {
        id: "arch-5",
        title: "Long-Then-Short for Argument",
        lesson:
          "In argumentative prose, sentence length can carry the logic. Long sentences do the intellectual work — they qualify, develop, accumulate. Short sentences deliver verdicts. The pattern: a long sentence that builds complexity, followed by a short sentence (under 8 words) that lands the point, is one of the most reliable structures in persuasive writing. The long sentence earns the short one.",
        prompt:
          "Write two paragraphs of 80–120 words each arguing opposite sides of any question. In each paragraph, use the long-then-short pattern at least twice: a long sentence developing an idea, followed by a short sentence (under 8 words) that delivers the point. Total: 160–240 words.",
        wordCountMin: 155,
        wordCountMax: 250,
        criteria: [
          { name: "Both paragraphs argue clearly opposing positions", description: "One paragraph argues one side; the other argues the opposite.", weight: 0.2 },
          { name: "Long-then-short pattern used at least twice per paragraph", description: "Each paragraph contains two or more long-sentence/short-sentence pairs.", weight: 0.4 },
          { name: "Short sentences land the key claim", description: "Each short sentence delivers a verdict or conclusion — it isn't filler.", weight: 0.25 },
          { name: "Pattern feels earned, not decorative", description: "The rhythm serves the argument — the short sentences carry more weight because of what comes before.", weight: 0.15 },
        ],
      },
    ],
  },

  // ── GRAMMAR: THE REVISION PASS ───────────────────────────────────────────

  {
    id: "revision-pass",
    title: "The Revision Pass",
    genre: "grammar",
    difficulty: "intermediate",
    description:
      "Editing everything at once means doing everything poorly. This track teaches a three-pass system: redundancy first, structure second, word-level third. Each pass has a single focus. The sequence matters — cut first so you're not polishing sentences you'll delete, restructure second, polish last.",
    exercises: [
      {
        id: "rp-1",
        title: "First Pass: Cut Redundancy",
        lesson:
          "The first pass looks for only one thing: redundancy. Any sentence that restates what the previous sentence said. Any word that repeats a word from the same sentence without adding meaning. Any qualifier that makes a claim softer without making it more accurate. This pass doesn't restructure or improve — it only removes what's said twice.",
        prompt:
          "Make one focused pass through this paragraph cutting only redundancy. Don't restructure sentences, don't improve the argument — just find what's said twice and remove one instance. Mark each cut with [brackets]. Original (78 words): 'The report was long and comprehensive, covering every aspect of the situation in exhaustive detail. It examined the background history of the issue, the current state of affairs at present, and the various different options available. The authors concluded in their conclusion that further study would be needed before any final decision could be made. It was a thorough and comprehensive piece of work.' Total: 40–65 words.",
        wordCountMin: 35,
        wordCountMax: 70,
        criteria: [
          { name: "Only redundancy cut — no restructuring", description: "No sentences are reordered or rephrased — only duplicate content removed.", weight: 0.35 },
          { name: "Each cut removes something said twice", description: "Every bracketed deletion is a genuine repetition, not an idea cut for length.", weight: 0.4 },
          { name: "Resulting paragraph is at least 15% shorter", description: "The submitted version is meaningfully tighter than the original.", weight: 0.25 },
        ],
      },
      {
        id: "rp-2",
        title: "Second Pass: Restructure",
        lesson:
          "The second pass looks at structure — not individual words, but how sentences relate to each other. Is the most important idea buried in the middle? Should two short sentences be combined? Should one long tangled sentence be split? This pass ignores word choice entirely. It works only on sentence order, length, and logical sequence.",
        prompt:
          "Restructure this paragraph — reorder sentences, split or combine them — to improve flow and put emphasis where it belongs. Do not change individual words or cut content. Then write one sentence explaining what you changed and why. Original: 'Writing is hard. Most people give up before they improve. There is a reason most books about writing are actually about finishing, not craft. Deliberate practice is the only thing that reliably produces improvement. Athletes know this. The gap between knowing that and doing it is where most writers live.' Total: 80–120 words.",
        wordCountMin: 75,
        wordCountMax: 130,
        criteria: [
          { name: "Content unchanged", description: "The same ideas are present — no words added, no ideas cut.", weight: 0.3 },
          { name: "Structure is improved", description: "The reordering creates better logical flow or puts the main point in a stronger position.", weight: 0.4 },
          { name: "Explanation identifies the specific structural change", description: "The one-sentence note names what moved and why it works better there.", weight: 0.3 },
        ],
      },
      {
        id: "rp-3",
        title: "Third Pass: Word-Level",
        lesson:
          "The third pass is last because word-level work done before cutting and restructuring is wasted — you polish sentences you'll cut, or you improve words in sentences that will change shape. This pass replaces weak verbs, cuts adverbs, makes vague nouns specific. It touches individual words, not sentences.",
        prompt:
          "Make one focused word-level pass through this paragraph: replace weak verbs, cut adverbs, make vague nouns specific. Do not restructure or cut full sentences. Mark each change in brackets with what you changed it to. Original: 'He very quickly walked to the place where the thing was happening and got there just in time to see the situation develop in a bad way. He carefully looked at everything around him and then slowly moved toward the main area where the people were.' Total: 50–80 words.",
        wordCountMin: 45,
        wordCountMax: 90,
        criteria: [
          { name: "Adverbs replaced or eliminated", description: "No -ly adverb modifying a verb survives the pass.", weight: 0.35 },
          { name: "Weak verbs replaced with stronger ones", description: "'Got,' 'walked,' 'looked,' 'moved' are replaced with more specific verbs.", weight: 0.35 },
          { name: "No full sentences cut or restructured", description: "The sentence count and structure are the same — only individual words changed.", weight: 0.3 },
        ],
      },
      {
        id: "rp-4",
        title: "All Three Passes in Sequence",
        lesson:
          "The three-pass system works because each pass has a single focus. When you do all three at once — which is what most writers mean by 'editing' — you do all three poorly. Redundancy first, so you're not polishing sentences you'll cut. Structure second, so you're not restructuring sentences whose words will change. Word-level last.",
        prompt:
          "Run all three passes on this paragraph, in order. After each pass, write one sentence noting the main thing you changed. Then submit the final version. Original (91 words): 'There are many different reasons why people give up on their goals. One reason is that the goals they set are very unrealistic. Another reason is that people often fail to make regular progress on a consistent basis. Research studies have shown that people who regularly track their progress on a consistent basis are more likely to achieve success. In conclusion, goal achievement is quite difficult for most people and giving up is a common and frequent occurrence.' Total: 80–150 words.",
        wordCountMin: 75,
        wordCountMax: 160,
        criteria: [
          { name: "Three passes clearly labeled and sequential", description: "Pass 1 (redundancy), Pass 2 (structure), Pass 3 (word-level) are each labeled with a brief note.", weight: 0.3 },
          { name: "Each pass addresses only its designated focus", description: "Pass 1 doesn't restructure; Pass 2 doesn't change words; Pass 3 doesn't cut sentences.", weight: 0.35 },
          { name: "Final version is substantially tighter", description: "The result is meaningfully shorter and cleaner than the 91-word original.", weight: 0.35 },
        ],
      },
      {
        id: "rp-5",
        title: "Edit Your Own Draft",
        lesson:
          "The hardest editing is on your own work — you know what you meant, which makes it hard to read what you actually wrote. The three-pass system forces you to read for one thing at a time, which reduces the problem. Write a draft. Then edit it cold, pass by pass, as if someone else wrote it.",
        prompt:
          "Write a paragraph of 140–180 words arguing for any position you hold. Then run all three passes and submit the original plus the edited version. The edited version must be at least 20% shorter. Label what changed between the two versions in 2–3 sentences. Total: 200–300 words.",
        wordCountMin: 190,
        wordCountMax: 310,
        criteria: [
          { name: "Original paragraph makes a clear, specific argument", description: "The draft is arguing something — not just describing a topic.", weight: 0.2 },
          { name: "Edited version is at least 20% shorter", description: "The final version is measurably tighter than the original draft.", weight: 0.3 },
          { name: "Argument is stronger in the edited version", description: "The editing improved the clarity and directness of the position — not just the length.", weight: 0.3 },
          { name: "Changes are noted and specific", description: "The 2–3 sentence summary identifies what was cut and what improved.", weight: 0.2 },
        ],
      },
    ],
  },

  // ── ADULT BOOK REPORT ────────────────────────────────────────────────────

  {
    id: "adult-book-report",
    title: "Adult Book Report",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "Not a plot summary. Not a star rating. A real argument about a real book — what it's doing, whether it works, and who needs to read it. Six exercises take you from 'I liked it' to writing the kind of review that changes how someone thinks about a book.",
    exercises: [
      {
        id: "abr-1",
        title: "What Is This Book Actually About?",
        lesson:
          "There's what happens and there's what a book is about. 'Moby-Dick is about a ship captain hunting a whale' is plot. 'Moby-Dick is about obsession eating everything good in a man's life' is what it's about. Adult readers go to the second level. The summary isn't wrong if it has plot — it's wrong if it has only plot. Your job: find the human question at the center.",
        prompt: "Write a summary of a book you've read that captures what it's really about, not just what happens.",
        wordCountMin: 50,
        wordCountMax: 130,
        criteria: [
          { name: "Goes below plot", description: "The summary identifies the book's real subject — the human question or tension at its center — not just events.", weight: 0.5 },
          { name: "Accurate and specific", description: "The description is true to the book and specific enough that a reader of it would recognize it.", weight: 0.3 },
          { name: "Useful to a stranger", description: "Someone who hasn't read the book gets an accurate sense of what it is.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Get something down",
            passThreshold: 50,
            wordCountMin: 50,
            wordCountMax: 100,
            criteria: [
              { name: "Covers the book's subject", description: "The summary communicates what the book is about — even if it stays at the plot level for now.", weight: 0.4 },
              { name: "Accurate to the book", description: "What's described matches what the book actually does.", weight: 0.4 },
              { name: "Readable to a stranger", description: "Someone unfamiliar with the book understands it from this summary.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Think of the last book you finished. Write a 50–100 word summary of what it's about. Don't worry about being literary — just capture it accurately, as you'd tell a friend who asked." },
              { prompt: "Pick any book you've read in the last year. Summarize it in 50–100 words as you would to a friend who asked 'what's it about?' No overthinking — just get it on the page." },
              { prompt: "Think of a book you read years ago that stuck with you. Summarize what it's about in 50–100 words from memory. What do you remember it being about?" },
              { prompt: "Pick a book you've recommended to someone. Write 50–100 words summarizing why you told them to read it — start with what it's about." },
              { prompt: "Think of a book you loved as a teenager that you'd read differently now. Summarize what it's about in 50–100 words as you understand it today." },
            ],
          },
          {
            label: "Get below the plot",
            passThreshold: 65,
            wordCountMin: 60,
            wordCountMax: 110,
            criteria: [
              { name: "Identifies real subject beneath plot", description: "The summary captures the book's human question or thematic tension — not just what happens.", weight: 0.5 },
              { name: "Avoids pure plot dump", description: "Character names, events, and settings are subordinate to the book's real subject.", weight: 0.3 },
              { name: "Specific, not vague", description: "The real subject is named specifically — not just 'it's about grief' but what kind of grief, or what about grief.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Pick a book you've read. Write 60–110 words capturing what it's REALLY about — not what happens, but what human question it's asking. One sentence for plot; the rest for the real subject." },
              { prompt: "Pick a book you've read. Write 60–110 words summarizing it, but ban yourself from using character names, plot events, or setting details. Only the ideas, tensions, and questions the book wrestles with." },
              { prompt: "Think of a nonfiction book you've read. Write 60–110 words capturing what it's actually arguing — not just what topic it covers, but the specific claim it makes about that topic." },
              { prompt: "Pick a book where the surface and the real subject feel very different — a war novel that's actually about friendship, a love story that's actually about class. Write 60–110 words teasing apart the two levels." },
              { prompt: "Pick a book you found difficult, confusing, or slow. Write 60–110 words trying to articulate what it's wrestling with — even if you're not fully sure you understand it yet." },
            ],
          },
          {
            label: "Plot + real subject, woven",
            passThreshold: 75,
            wordCountMin: 70,
            wordCountMax: 130,
            criteria: [
              { name: "Both levels served", description: "The summary gives enough plot to orient a stranger and enough thematic content to convey what the book is really doing.", weight: 0.4 },
              { name: "Woven, not labeled", description: "The two levels aren't separated by 'on the surface... but really...' — they're integrated.", weight: 0.3 },
              { name: "Could help a stranger decide", description: "After reading this, someone unfamiliar with the book has enough to decide whether to pick it up.", weight: 0.3 },
            ],
            variants: [
              { prompt: "Pick a book you know well. Write one sentence that is the complete plot summary (under 20 words). Then write 60–100 words on what the book is really about — the question it keeps returning to." },
              { prompt: "Write a 70–130 word summary that does two jobs simultaneously: gives a reader enough plot to follow the context, while communicating the book's real subject. Don't label them — weave them together." },
              { prompt: "Pick a book where the author's stated subject and the book's actual effect feel different — a comedy that's secretly devastating, a self-help book that's really a memoir. Write 70–130 words capturing both layers." },
              { prompt: "Write a 70–130 word summary of a book you've read that a stranger could read and decide whether or not to pick it up. Include: what happens (briefly), what it's really about, and one word for the reading experience." },
              { prompt: "Pick any book. Write 70–130 words describing what you thought the book was about while reading it — and what you think it's about now, looking back. Same book, two different understandings." },
            ],
          },
        ],
      },

      {
        id: "abr-2",
        title: "Have an Opinion, Not Just a Feeling",
        lesson:
          "'I loved it' is a feeling. An opinion has a claim, a subject, and a because. 'This is one of the most accurate portraits of a long marriage I've read, because it never resolves the central tension — it just holds it' — that's an opinion. Claim: one of the most accurate. Subject: portrayal of marriage. Because: holds the tension rather than resolving it. A feeling is about you. An opinion is about the book.",
        prompt: "Write an argument about a book you've read — not just your reaction, but a specific, supportable claim.",
        wordCountMin: 60,
        wordCountMax: 140,
        criteria: [
          { name: "Contains a real claim", description: "The writing makes a specific, arguable assertion about the book — not just a reaction.", weight: 0.4 },
          { name: "Has a 'because'", description: "The claim is supported by a reason — what the book does that earns the verdict.", weight: 0.4 },
          { name: "Arguable by a stranger", description: "A reasonable person who has read the book could disagree — it's not just personal preference.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Just react",
            passThreshold: 50,
            wordCountMin: 40,
            wordCountMax: 80,
            criteria: [
              { name: "Honest reaction expressed", description: "The writing conveys a genuine response to the book — not hedged or generic.", weight: 0.5 },
              { name: "Specific to this book", description: "The reaction is about this particular book, not a generic sentiment that could apply to anything.", weight: 0.3 },
              { name: "Clear to a reader", description: "Someone who has read the book understands what you're reacting to.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Think of the last book you finished. Write 40–80 words about your honest reaction to it. Did you like it? Dislike it? Feel complicated about it? Just get it on the page — don't edit yourself." },
              { prompt: "Think of a book you had a strong reaction to — loved it or hated it or something in between. Write 40–80 words describing that reaction as honestly as you can." },
              { prompt: "Think of a book where your opinion changed as you read it — you started one way and ended another. Write 40–80 words about that shift and where you landed." },
              { prompt: "Think of a book everyone seems to love that you didn't connect with, or one that surprised you after you expected to dislike it. Write 40–80 words about your honest reaction." },
              { prompt: "Think of a book you'd recommend to someone specific. Write 40–80 words about why — just get your genuine reasons on the page, unfiltered." },
            ],
          },
          {
            label: "Turn the feeling into a claim",
            passThreshold: 65,
            wordCountMin: 60,
            wordCountMax: 110,
            criteria: [
              { name: "Contains a claim", description: "There's a specific assertion about what the book does, not just how you felt about it.", weight: 0.4 },
              { name: "Has a because", description: "The claim is anchored to something the book actually does — a craft choice, a structural decision, a pattern.", weight: 0.4 },
              { name: "About the book's choices", description: "The argument is about what the author did, not about the reader's expectations or preferences.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Take your reaction to a book and turn it into an argument. It needs: a specific claim about what the book does, and a because. 'This is one of the best books I've read about X because it Y.' 60–110 words." },
              { prompt: "Pick a book you loved. Write 60–110 words making the case for why it's good — not listing what you liked, but arguing why it succeeds at what it's trying to do." },
              { prompt: "Pick a book you thought was overrated or disappointing. Write 60–110 words making a specific argument about where it falls short. The argument should be about the book's choices, not your preferences." },
              { prompt: "Pick a book you felt complicated about — parts you loved, parts that didn't work. Write 60–110 words making two claims: one positive, one critical. Both should be arguable, not just reactions." },
              { prompt: "Pick a book you've recommended to someone. Write 60–110 words making the case to a skeptic — someone who's heard of it but isn't convinced. What's the specific argument for why they should read it?" },
            ],
          },
          {
            label: "An argument worth disagreeing with",
            passThreshold: 75,
            wordCountMin: 80,
            wordCountMax: 140,
            criteria: [
              { name: "Clear, arguable claim", description: "The central assertion is specific enough that a reader can identify it and engage with it.", weight: 0.4 },
              { name: "Supported by observation", description: "The claim is backed by at least one specific observation about what the book does.", weight: 0.3 },
              { name: "Specific enough to disagree with", description: "A fan of the book — or a critic — could push back on the argument's terms. It's not just preference.", weight: 0.3 },
            ],
            variants: [
              { prompt: "Write 80–140 words making an argument about a book you've read that a reasonable person could disagree with. Not 'it was confusing' (inarguable) but something specific to the book's choices and intentions." },
              { prompt: "Write 80–140 words arguing that a widely praised book has a significant flaw. Be specific about what the flaw is and why it matters — not just that it bothered you, but that it works against something the book is trying to do." },
              { prompt: "Write 80–140 words arguing that a book you loved is good for specific, craft-level reasons. The argument should make someone understand what the book does — not just feel your enthusiasm." },
              { prompt: "Write 80–140 words making a comparative claim: this book does something better than any other you've read on the same subject. What is that thing, and what specifically does this book do to earn it?" },
              { prompt: "Write 80–140 words making an argument about a book's ending — whether it worked or didn't, and why the answer matters for the whole book. Argue about the craft choice, not just whether you liked the resolution." },
            ],
          },
        ],
      },

      {
        id: "abr-3",
        title: "Use the Page",
        lesson:
          "Book reports without evidence are opinions without proof. You have to go back to the page. Find the moment — a sentence, a paragraph, a scene — where the author's skill or failure is most visible. Quote it or describe it precisely. Then explain what it proves about your argument. The evidence doesn't speak for itself — you have to tell the reader what they're looking at and why it matters.",
        prompt: "Find a specific moment in a book and use it to support an argument about the book.",
        wordCountMin: 80,
        wordCountMax: 160,
        criteria: [
          { name: "Moment is specific", description: "The evidence is a particular scene, passage, sentence, or decision — not a general pattern.", weight: 0.4 },
          { name: "Moment is explained", description: "The writing tells the reader what the author is doing in this moment, not just describes what happens.", weight: 0.4 },
          { name: "Connected to a claim", description: "The moment is used as evidence for something — it proves or illustrates an argument.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Find a moment",
            passThreshold: 50,
            wordCountMin: 60,
            wordCountMax: 110,
            criteria: [
              { name: "Moment is specific and located", description: "The writing names a particular moment in the book — where it occurs and what exactly happens.", weight: 0.5 },
              { name: "Accurately described", description: "The description of the moment is faithful to what's on the page.", weight: 0.3 },
              { name: "Particular, not general", description: "This is one specific thing, not a general observation about the book's patterns.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Pick a book you've read. Find one specific moment — a sentence, paragraph, or scene — that you remember clearly. Describe it precisely in 60–110 words. Don't evaluate it yet — just capture it accurately." },
              { prompt: "Pick a book and find the moment you think shows the author at their best. Describe that moment in 60–110 words — where does it happen, and what specifically occurs?" },
              { prompt: "Pick a book and find a moment that confused, bothered, or disappointed you. Describe it precisely in 60–110 words — what actually happens, and what the author seems to be doing." },
              { prompt: "Pick a book with a memorable first page. Describe what happens on that first page in 60–110 words — what does the author do, sentence by sentence, to open the book?" },
              { prompt: "Pick a book with an ending you remember. Describe exactly how it ends in 60–110 words — what happens, what the last image or line is, what note it closes on." },
            ],
          },
          {
            label: "Introduce and explain",
            passThreshold: 65,
            wordCountMin: 80,
            wordCountMax: 140,
            criteria: [
              { name: "Moment introduced in context", description: "The reader knows where in the book this falls and what's happening around it.", weight: 0.3 },
              { name: "Author's move explained", description: "The writing explains what the author is doing in this moment — not just what happens, but the craft choice behind it.", weight: 0.5 },
              { name: "Beginning of an argument", description: "The explanation points toward a larger claim — why this moment matters.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Pick a specific moment from a book. Introduce it (where it falls, what's happening), describe it precisely, then write one to two sentences explaining what the author is doing there. 80–140 words." },
              { prompt: "Find a moment in a book where the writing itself — the sentences, word choices, rhythm — is doing something notable. Describe the moment, quote or closely paraphrase it, and name the craft technique being used. 80–140 words." },
              { prompt: "Find a moment where a book fails — a scene that doesn't work, a sentence that clunks, a choice that undermines the book. Describe it precisely and explain what went wrong. 80–140 words." },
              { prompt: "Find a moment that is key to understanding the book's argument (nonfiction) or its theme (fiction). Describe it, explain what it does, and connect it to the book's larger purpose. 80–140 words." },
              { prompt: "Find the moment you'd hand to a friend to convince them to read this book. Set it up briefly, describe or quote it, and explain in one to two sentences why this moment does it for you. 80–140 words." },
            ],
          },
          {
            label: "Moment as evidence",
            passThreshold: 75,
            wordCountMin: 100,
            wordCountMax: 160,
            criteria: [
              { name: "Claim is stated", description: "There is a clear, arguable assertion that the moment is meant to support.", weight: 0.3 },
              { name: "Evidence is specific and grounded", description: "The moment is precisely described — specific enough that someone who has read the book recognizes it.", weight: 0.4 },
              { name: "Claim and evidence are connected", description: "The writing explains how this specific moment proves or illustrates the claim.", weight: 0.3 },
            ],
            variants: [
              { prompt: "Write 100–160 words using one specific moment from a book as evidence for an argument. Structure: claim → moment (described or quoted) → what the moment proves. The claim should be arguable; the moment should support it directly." },
              { prompt: "Write 100–160 words arguing for or against a specific craft choice the author makes — how they handle time, perspective, structure, or voice. Ground your argument in one moment where that choice is most visible." },
              { prompt: "Write 100–160 words using a specific moment to show where the author's argument is strongest or most vulnerable. This should feel like close reading — you're explaining what's on the page and what it does." },
              { prompt: "Write 100–160 words where you introduce a specific moment, quote or closely paraphrase it, and then unpack it: what the author is doing, whether it works, and why it matters for the book as a whole." },
              { prompt: "Write 100–160 words using two moments from the same book — one that works, one that doesn't — to argue something about the book's overall quality or its inconsistency." },
            ],
          },
        ],
      },

      {
        id: "abr-4",
        title: "Criticize Specifically",
        lesson:
          "Vague criticism is as useless as vague praise. 'The ending was disappointing' is a complaint. 'The resolution contradicts the character logic established in the first two acts' is criticism — it names what failed, why it failed, and against what standard. You don't have to be right. But you have to be specific. Good criticism is a service to the reader: it tells them what to watch for, not just that you didn't like something.",
        prompt: "Write a specific criticism of something that doesn't work in a book you've read.",
        wordCountMin: 70,
        wordCountMax: 150,
        criteria: [
          { name: "Specific flaw named", description: "The criticism identifies an exact thing — not 'the pacing was off' but what specifically caused it.", weight: 0.4 },
          { name: "Craft argument, not preference", description: "The criticism is about what the book was trying to do and where it falls short — not about the reader's expectations.", weight: 0.4 },
          { name: "Fair to the author", description: "The criticism acknowledges what the book was attempting before arguing it failed.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Name what bothered you",
            passThreshold: 50,
            wordCountMin: 50,
            wordCountMax: 90,
            criteria: [
              { name: "Specific flaw named", description: "The writing names something particular that didn't work — not just a vague dissatisfaction.", weight: 0.5 },
              { name: "Honest, not hedged", description: "The criticism is stated clearly — not buried in apologies or qualifications.", weight: 0.3 },
              { name: "Recognizable to another reader", description: "Someone who has read the book would know what you're referring to.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Think of a book — one you liked overall is fine — that had something that didn't work for you. Write 50–90 words naming what bothered you. Don't defend yourself or apologize. Just name it." },
              { prompt: "Think of a book you didn't finish. Write 50–90 words about why you stopped — what specifically broke the contract between you and the book." },
              { prompt: "Think of a book you liked but thought was overpraised. Write 50–90 words identifying what you think critics or readers missed or overvalued." },
              { prompt: "Think of a book with a character you didn't believe in — someone who felt fake or inconsistent. Write 50–90 words naming specifically what made them unconvincing." },
              { prompt: "Think of a book with a plot development that felt unearned — a twist, a resolution, a death, a reconciliation. Write 50–90 words explaining why it didn't land." },
            ],
          },
          {
            label: "Make it a craft argument",
            passThreshold: 65,
            wordCountMin: 70,
            wordCountMax: 120,
            criteria: [
              { name: "Names the craft choice", description: "The criticism identifies what the author did — the specific decision being criticized.", weight: 0.35 },
              { name: "Explains what it was meant to do", description: "The argument acknowledges what the author was probably trying to accomplish.", weight: 0.3 },
              { name: "Explains why it failed at that function", description: "The criticism argues specifically why the choice doesn't do what it needed to do.", weight: 0.35 },
            ],
            variants: [
              { prompt: "Take something that bothered you in a book and turn it into a craft argument. Not: 'I didn't like the ending.' Instead: name what the author did, what it was probably meant to do, and why it failed at that function. 70–120 words." },
              { prompt: "Pick a pacing problem in a book you've read — a section that dragged, a plot that jumped too fast, a subplot that went nowhere. Write 70–120 words explaining what the structural problem is and what it cost the book." },
              { prompt: "Pick a book where the author's voice worked against the material — too ironic for a serious subject, too earnest for a dark one, too distant for an intimate story. Write 70–120 words making that argument." },
              { prompt: "Pick a book with a resolution you found unsatisfying. Write 70–120 words arguing specifically why the ending doesn't work — what it needed to do that it doesn't do." },
              { prompt: "Pick a book that would have been better shorter. Write 70–120 words making the case for what should have been cut and why those pages work against the book." },
            ],
          },
          {
            label: "Specific, fair, curious",
            passThreshold: 75,
            wordCountMin: 90,
            wordCountMax: 150,
            criteria: [
              { name: "Specific", description: "The flaw named is exact — a reader knows where to look for it.", weight: 0.35 },
              { name: "Fair", description: "The criticism acknowledges what the book was attempting and doesn't punish it for not being a different book.", weight: 0.3 },
              { name: "Curious about intention", description: "The writing considers why the author might have made this choice — it's an examination, not just a verdict.", weight: 0.35 },
            ],
            variants: [
              { prompt: "Write 90–150 words of criticism of a book you've read. The criticism must be: specific (names the exact issue), fair (acknowledges what the book was attempting), and curious (considers why the author might have made this choice)." },
              { prompt: "Write 90–150 words arguing that a specific craft choice in a book undermines its larger purpose. Explain the choice, explain the purpose, and explain the conflict between them." },
              { prompt: "Write 90–150 words criticizing a book you ultimately liked. The criticism should be real — not softened to protect your overall review — and specific enough that a reader would know exactly where to look." },
              { prompt: "Write 90–150 words of criticism that a fan of the book could read without feeling dismissed. Acknowledge real strengths before identifying what doesn't work — and be specific about both." },
              { prompt: "Write 90–150 words where you take a criticism you've heard of a book you love — steelman it honestly — then either agree with it, refine it, or push back with your own specific counter-argument." },
            ],
          },
        ],
      },

      {
        id: "abr-5",
        title: "Describe the Reading Experience",
        lesson:
          "Some books are about their ideas. But some books are mostly about what it feels like to read them — pacing, rhythm, dread, delight, the texture of the author's world. This isn't about plot or argument. It's about what happens when you're in the chair with the pages turning. The question isn't 'what does the book argue?' but 'what does it feel like to be inside it?' That's harder to write than a summary. It's also more useful to a reader deciding whether to pick it up.",
        prompt: "Describe what it feels like to read a specific book — not what it's about, but the experience of reading it.",
        wordCountMin: 70,
        wordCountMax: 150,
        criteria: [
          { name: "About experience, not content", description: "The description is about the act of reading — pace, tone, texture, mood — not about plot events or argument.", weight: 0.5 },
          { name: "Specific to this book", description: "The description couldn't apply to any book — it captures something particular about this one.", weight: 0.3 },
          { name: "Useful to a prospective reader", description: "After reading this, someone could make an informed decision about whether this reading experience is for them.", weight: 0.2 },
        ],
        stages: [
          {
            label: "What did it feel like?",
            passThreshold: 50,
            wordCountMin: 50,
            wordCountMax: 90,
            criteria: [
              { name: "Describes experience, not plot", description: "The writing captures the feeling of reading, not what happens in the book.", weight: 0.5 },
              { name: "Specific over generic", description: "The description is particular — it isn't just 'it was a fast read' but something more precise.", weight: 0.3 },
              { name: "Honest", description: "The reaction feels genuine, not like a promotional blurb.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Think of a book you've read recently. Write 50–90 words describing what it felt like to read it — not what it's about, but the experience of turning the pages. Fast or slow? Dense or light? Compulsive or meditative?" },
              { prompt: "Think of a book you read very quickly because you couldn't stop. Write 50–90 words capturing what created that pull — what made it hard to put down." },
              { prompt: "Think of a book you read slowly and deliberately — not because it was difficult but because you wanted to stay in it. Write 50–90 words about that quality." },
              { prompt: "Think of a book that changed in texture as you read it — started one way and became something different. Write 50–90 words describing that shift and what caused it." },
              { prompt: "Think of a book that felt like hard work — not bad, but demanding. Write 50–90 words capturing what kind of effort it required and whether that effort felt worth it." },
            ],
          },
          {
            label: "Be specific about the texture",
            passThreshold: 65,
            wordCountMin: 70,
            wordCountMax: 120,
            criteria: [
              { name: "Texture described specifically", description: "The writing names concrete qualities — sentence rhythm, pacing, emotional register — not just general impressions.", weight: 0.5 },
              { name: "Avoids plot summary", description: "The description stays in the experience of reading — plot events aren't used as substitutes for describing the experience.", weight: 0.3 },
              { name: "Particular to this book", description: "The description couldn't be pasted onto another book without revision.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write 70–120 words describing the reading experience of a specific book without describing its plot. What's the texture of its prose? Its pacing? The quality of attention it demands from the reader?" },
              { prompt: "Write 70–120 words describing a book's voice — not what the narrator says, but how they say it. What does the voice sound like? What's its register? What kind of reader does it assume?" },
              { prompt: "Write 70–120 words describing the pacing of a book: how fast it moves, where it accelerates, where it slows, and whether those rhythms match what the book is doing." },
              { prompt: "Write 70–120 words describing the world a book puts you inside. Not the plot events — the sensory and emotional texture of being in that place and time." },
              { prompt: "Write 70–120 words comparing the reading experience of two books by the same author, or two books on the same subject. Focus on texture and experience, not content or argument." },
            ],
          },
          {
            label: "Describe it so I know if it's for me",
            passThreshold: 75,
            wordCountMin: 90,
            wordCountMax: 150,
            criteria: [
              { name: "Helps a stranger decide", description: "After reading this, someone unfamiliar with the book can make an informed judgment about whether this reading experience appeals to them.", weight: 0.4 },
              { name: "Specific to this book", description: "The description couldn't apply to most books — it captures something irreplaceable about this one.", weight: 0.4 },
              { name: "No plot required", description: "The reader doesn't need to know the plot to understand what the experience is like.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write 90–150 words describing the reading experience of a book so accurately that a stranger could decide whether it's for them — without knowing anything about the plot. Just the experience of reading it." },
              { prompt: "Write 90–150 words capturing what's unique about reading a specific author — the quality that can't be found in anyone else's work. What's the experience only they provide?" },
              { prompt: "Write 90–150 words describing the reading experience of a difficult book — something demanding, dense, or structurally unusual. Make the difficulty legible and help a reader decide if it's worth it." },
              { prompt: "Write 90–150 words capturing the emotional register of a book — not the emotion of the plot, but the emotion of reading it. What do you feel while you're inside it? What mood does it create?" },
              { prompt: "Write 90–150 words describing the reading experience of a book that people tend to either love or hate strongly. Try to describe the quality that produces both reactions — what the book does that some find essential and others find insufferable." },
            ],
          },
        ],
      },

      {
        id: "abr-6",
        title: "The Full Report",
        lesson:
          "A full adult book report isn't a summary, a rating, or a plot description. It's an argument. Here's the structure: say what the book is (one or two sentences of honest summary). Make a claim — your argument about it. Offer evidence — a specific moment. Name one honest criticism. Say who should read it and why. The whole thing should feel like advice from someone who read it carefully and has something real to say.",
        prompt: "Write a complete adult book report: summary, argument, evidence, criticism, and recommendation.",
        wordCountMin: 150,
        wordCountMax: 280,
        criteria: [
          { name: "All elements present", description: "The report includes: what the book is, a central argument, evidence from the text, an honest criticism, and a recommendation.", weight: 0.35 },
          { name: "Argument is the spine", description: "The report is organized around a claim — the other elements support or complicate it.", weight: 0.35 },
          { name: "Specific and useful", description: "A stranger who reads this gets something genuinely useful for deciding whether to read the book.", weight: 0.3 },
        ],
        stages: [
          {
            label: "Get it all on the page",
            passThreshold: 50,
            wordCountMin: 130,
            wordCountMax: 220,
            criteria: [
              { name: "All elements attempted", description: "The report tries to include: what it's about, your overall take, something specific that works, something honest about what doesn't, and a recommendation.", weight: 0.4 },
              { name: "Honest and specific", description: "The writing is genuine — not promotional, not hedged to avoid having a position.", weight: 0.4 },
              { name: "Useful to a reader", description: "Someone reading this gets actual information about the book.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a complete adult book report on a book you've read. Include: what it's about (2–3 sentences), your overall take (2–3 sentences), and who you'd recommend it to (1–2 sentences). 130–220 words. Don't worry about polish — just get it all down." },
              { prompt: "Pick a book you've read recently. Write a complete report: summary, your reaction, a specific thing you admired, a specific thing that didn't work, and a recommendation. 130–220 words." },
              { prompt: "Pick a book you loved. Write a complete report: what it is, what makes it good, where it falls short, and who should read it. 130–220 words." },
              { prompt: "Pick a book you had complicated feelings about — parts you loved, parts that frustrated you. Write a complete report that holds both honestly. 130–220 words." },
              { prompt: "Pick a book you didn't finish but read enough of to have a real opinion. Write a complete report that's honest about where you stopped and why, but still gives a reader something useful. 130–220 words." },
            ],
          },
          {
            label: "Lead with the argument",
            passThreshold: 65,
            wordCountMin: 150,
            wordCountMax: 240,
            criteria: [
              { name: "Opens with the argument", description: "The first sentence or two makes the central claim — the reader knows what you think before the summary.", weight: 0.4 },
              { name: "Everything serves the claim", description: "The summary, evidence, and criticism all support or complicate the opening argument.", weight: 0.35 },
              { name: "Specific evidence used", description: "The report grounds its argument in at least one specific moment or observation from the book.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a 150–240 word book report that leads with your argument — your central claim about the book — before summarizing. Don't bury the lede. The first sentence should tell the reader what you think." },
              { prompt: "Write a 150–240 word book report organized around a single claim. Everything in the report — summary, evidence, criticism — supports or complicates that central argument." },
              { prompt: "Write a 150–240 word book report that opens by situating the book: what question or subject is it addressing, and what does it add to what else exists on that topic?" },
              { prompt: "Write a 150–240 word book report that opens with the reading experience (one paragraph of texture), then pivots to your argument. The opening should do work — not just set the scene." },
              { prompt: "Write a 150–240 word book report that takes a position against the book's dominant reception — the common view of whether it's good, what it's about, who it's for. State the counter-argument clearly." },
            ],
          },
          {
            label: "Polished, specific, useful",
            passThreshold: 75,
            wordCountMin: 180,
            wordCountMax: 280,
            criteria: [
              { name: "Argument clear in the opening", description: "The central claim appears in the first two sentences and governs the rest of the piece.", weight: 0.25 },
              { name: "Evidence used", description: "At least one specific moment from the book is introduced and connected to the argument.", weight: 0.25 },
              { name: "Honest criticism present", description: "The report names something that doesn't work, specifically — not just softened acknowledgment that the book isn't for everyone.", weight: 0.2 },
              { name: "Recommendation is specific", description: "The recommendation names the right reader — not 'everyone should read this' but who exactly and why.", weight: 0.3 },
            ],
            variants: [
              { prompt: "Write a 180–280 word adult book report polished enough to share. It needs: a clear argument in the opening, at least one specific moment used as evidence, one honest criticism, and a recommendation that names the right reader." },
              { prompt: "Write a 180–280 word book report that could live on a blog or in a book club discussion. Specific enough to prove you read it carefully; readable enough that someone who hasn't read it gets something from it." },
              { prompt: "Write a 180–280 word book report about a nonfiction book, structured around the book's central argument: what it claims, how well it proves it, what it misses, and who needs to read it." },
              { prompt: "Write a 180–280 word book report that ends with a recommendation more specific than 'everyone should read this.' Who exactly is this book for? Who might not connect with it? The recommendation should feel like advice, not marketing." },
              { prompt: "Write a 180–280 word book report about a book you'd describe as 'important but not enjoyable' or 'enjoyable but not important.' Hold both truths in the same piece without resolving the tension." },
            ],
          },
        ],
      },
    ],
  },

  // ── NUT GRAF ─────────────────────────────────────────────────────────────

  {
    id: "nut-graf",
    title: "The Nut Graf",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "The nut graf is the paragraph that answers 'why are we here?' It comes after the lede and before the deep dive. It states the argument, makes the stakes real, and tells the reader why they should keep going. Most writers skip it or bury it. This track drills it until it's automatic.",
    exercises: [
      {
        id: "ng-1",
        title: "Say the Thing",
        lesson:
          "The nut graf is where you stop telling the story and start making the case. After the lede earns attention, the nut graf answers the obvious question: why are we here? Most writers are too subtle — they assume the reader will connect the dots. The reader won't. Say the thing directly.",
        prompt: "Write a nut graf that states plainly what the essay is about and why it matters.",
        wordCountMin: 50,
        wordCountMax: 120,
        criteria: [
          { name: "States the argument plainly", description: "The nut graf says directly what the essay is about — not implied, not hinted at.", weight: 0.5 },
          { name: "No hedging", description: "No 'this piece will explore' or 'there are many ways to look at this' — just the thing.", weight: 0.3 },
          { name: "Reader knows why they're here", description: "After reading this paragraph, a stranger knows what they're getting and why they should keep going.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Get it on the page",
            passThreshold: 50,
            wordCountMin: 50,
            wordCountMax: 100,
            criteria: [
              { name: "States what the essay is about", description: "The paragraph communicates the essay's subject and argument, however roughly.", weight: 0.5 },
              { name: "More than a topic sentence", description: "The paragraph does more than name a subject — it says something about it.", weight: 0.3 },
              { name: "A reader could follow it", description: "Someone unfamiliar with the essay would understand what they're about to read.", weight: 0.2 },
            ],
            variants: [
              { prompt: "You're writing an essay about how most career advice is useless because it ignores luck. Write the nut graf — the paragraph that states plainly what the essay is about and why it matters. 50–100 words." },
              { prompt: "You're writing an essay about how open-plan offices made collaboration worse, not better. Write the nut graf. 50–100 words." },
              { prompt: "You're writing an essay about how self-help books have made people more anxious about self-improvement, not less. Write the nut graf — what the essay is, why it matters. 50–100 words." },
              { prompt: "You're writing an essay about how the way we talk about 'hustle' has changed what young people think work is supposed to feel like. Write the nut graf. 50–100 words." },
              { prompt: "You're writing an essay about how expertise and communication ability are inversely correlated — the more you know, the harder it is to explain. Write the nut graf. 50–100 words." },
            ],
          },
          {
            label: "Say it plainly",
            passThreshold: 65,
            wordCountMin: 50,
            wordCountMax: 100,
            criteria: [
              { name: "Argument stated directly", description: "The paragraph says the thing — not 'this essay explores' but what the essay actually argues.", weight: 0.5 },
              { name: "No weasel language", description: "No 'perhaps,' 'it could be argued,' 'in many ways' — the argument is stated with conviction.", weight: 0.3 },
              { name: "Stakes are present", description: "The paragraph gives the reader a reason to care — not just what the essay is about, but why it matters.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a nut graf for an essay arguing that most productivity advice is counterproductive because it treats attention as infinitely expandable. Say the argument directly. No hedging. No 'this piece will explore.' Just the thing. 50–100 words." },
              { prompt: "Write a nut graf for an essay arguing that the obsession with 'data-driven decisions' in companies has made leadership worse, not better. State the argument plainly. 50–100 words." },
              { prompt: "Write a nut graf for an essay arguing that people dramatically underestimate how much their childhood home shaped their taste in everything. No hedging — say it. 50–100 words." },
              { prompt: "Write a nut graf for an essay arguing that the way we talk about 'community' online is a substitute for actual community, not an extension of it. Plain, direct, no weaseling. 50–100 words." },
              { prompt: "Write a nut graf for an essay arguing that working from home revealed which meetings were always unnecessary. State the argument, not just the topic. 50–100 words." },
            ],
          },
          {
            label: "Argument + stakes + why you",
            passThreshold: 75,
            wordCountMin: 60,
            wordCountMax: 120,
            criteria: [
              { name: "Argument is specific and arguable", description: "The nut graf makes a claim a reasonable person could disagree with.", weight: 0.4 },
              { name: "Stakes are real", description: "The paragraph tells the reader why this matters — not in general, but specifically.", weight: 0.35 },
              { name: "Voice is present", description: "The paragraph sounds like a person making a case, not a proposal being filed.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a nut graf for an essay arguing that the rise of remote work didn't change what people want from a job — it just removed the things that kept them from asking for it. Include: the argument, the stakes, and a hint of why this writer is the one saying it. 60–120 words." },
              { prompt: "Write a nut graf for an essay arguing that social media hasn't polarized opinions — it's just made visible the polarization that was already there. Argument, stakes, voice. 60–120 words." },
              { prompt: "Write a nut graf for an essay arguing that parents who prioritize their children above everything else are often worse parents because of it. Make the argument specific, the stakes real, and the voice present. 60–120 words." },
              { prompt: "Write a nut graf for an essay arguing that the advice to 'be yourself' is useless at best and harmful at worst. Argument, stakes, voice — all three. 60–120 words." },
              { prompt: "Write a nut graf for an essay arguing that the way companies describe their values tells you exactly what problems they've been unable to solve. Specific argument, real stakes, writer's voice present. 60–120 words." },
            ],
          },
        ],
      },

      {
        id: "ng-2",
        title: "Make the Stakes Real",
        lesson:
          "Vague stakes are no stakes. 'This matters because the world is changing' is meaningless. 'This matters because the policy takes effect in March and 40,000 people lose coverage' means something. Stakes must be specific. The nut graf should tell the reader exactly why they should spend the next ten minutes here — not in general, but in particular.",
        prompt: "Write a nut graf where the stakes are specific enough to actually matter to a reader.",
        wordCountMin: 50,
        wordCountMax: 120,
        criteria: [
          { name: "Stakes are specific", description: "The paragraph names particular consequences, not vague abstractions about 'society' or 'the world.'", weight: 0.5 },
          { name: "Stakes affect the reader", description: "The consequences named are ones the reader might actually care about — not just important in the abstract.", weight: 0.3 },
          { name: "Argument and stakes are connected", description: "The stakes follow directly from the argument — they're not a separate 'why this matters' paragraph grafted on.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Name the stakes",
            passThreshold: 50,
            wordCountMin: 50,
            wordCountMax: 100,
            criteria: [
              { name: "Stakes are named", description: "The paragraph identifies what's at risk or what changes if the argument is true.", weight: 0.5 },
              { name: "More specific than 'this matters'", description: "The stakes are more concrete than a generic claim about importance.", weight: 0.3 },
              { name: "Connected to the argument", description: "The stakes follow from what the essay is actually arguing.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a nut graf for an essay about how companies measure the wrong things with employee surveys. Name the stakes — what actually goes wrong when this happens? 50–100 words." },
              { prompt: "Write a nut graf for an essay about how writing in the passive voice trains people to avoid accountability. Name what's actually at stake. 50–100 words." },
              { prompt: "Write a nut graf for an essay about how the way schools teach history shapes what adults think is possible to change. Name the stakes specifically. 50–100 words." },
              { prompt: "Write a nut graf for an essay about how the advice to 'network' has been so vague it's actively unhelpful. What are the actual stakes of getting this wrong? 50–100 words." },
              { prompt: "Write a nut graf for an essay about how the proliferation of expert opinion online has made people less trusting of actual expertise. Name the stakes. 50–100 words." },
            ],
          },
          {
            label: "Stakes the reader feels",
            passThreshold: 65,
            wordCountMin: 50,
            wordCountMax: 110,
            criteria: [
              { name: "Stakes are felt, not just named", description: "The reader feels why this matters — not just understands it abstractly.", weight: 0.5 },
              { name: "Specific enough to be real", description: "The stakes are concrete — a particular consequence, a particular person, a particular moment.", weight: 0.3 },
              { name: "No generic importance language", description: "No 'this is increasingly important' or 'we must pay attention' — the stakes are shown, not announced.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a nut graf for an essay about how the culture of 'always be closing' in sales created a generation of people who distrust service encounters. The stakes should feel real and specific — not 'trust is eroding' but something more precise. 50–110 words." },
              { prompt: "Write a nut graf for an essay about how the pressure to have a 'personal brand' has made professional writing more bland, not more interesting. Specific stakes that the reader feels. 50–110 words." },
              { prompt: "Write a nut graf for an essay about how cities that make parking free make driving the only viable option and then complain about traffic. Stakes specific enough to be real. 50–110 words." },
              { prompt: "Write a nut graf for an essay about how the reflex to 'both sides' every issue has made journalists worse at covering things that are simply true. Specific, felt stakes. 50–110 words." },
              { prompt: "Write a nut graf for an essay about how we've made vulnerability a performance and robbed it of its actual function. Stakes that the reader actually feels. 50–110 words." },
            ],
          },
          {
            label: "Specific, real, and connected",
            passThreshold: 75,
            wordCountMin: 60,
            wordCountMax: 120,
            criteria: [
              { name: "Stakes are specific and felt", description: "The consequences are concrete, particular, and felt by the reader — not abstract importance.", weight: 0.4 },
              { name: "Stakes are proportionate", description: "The stakes match the essay's actual argument — not inflated to seem more important than they are.", weight: 0.35 },
              { name: "Argument and stakes are inseparable", description: "The stakes don't feel bolted on — they're the natural consequence of the argument being true.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a nut graf for an essay arguing that how managers give feedback shapes what their reports think they're capable of — permanently. The stakes should be specific, proportionate, and inseparable from the argument. 60–120 words." },
              { prompt: "Write a nut graf for an essay arguing that the language of 'passion' in job descriptions filters for the wrong people and poisons team culture. Specific stakes, correctly proportioned, connected to the argument. 60–120 words." },
              { prompt: "Write a nut graf for an essay arguing that parents who helicopter-schedule their children are denying them the ability to self-direct — which is the only skill that compounds. Stakes specific and felt. 60–120 words." },
              { prompt: "Write a nut graf for an essay arguing that the shift from owning music to streaming it changed our relationship to songs in ways we haven't fully reckoned with. Real, specific, connected stakes. 60–120 words." },
              { prompt: "Write a nut graf for an essay arguing that the way we teach writing in schools produces people who are afraid of their own opinions. The stakes follow directly from the argument — specific and felt. 60–120 words." },
            ],
          },
        ],
      },

      {
        id: "ng-3",
        title: "The Why Now",
        lesson:
          "The best nut grafs answer the timeliness question. Not 'this has always been true' but what specifically happened, changed, or became visible that makes this the right moment to write about it. Timing is an argument. If you can't answer why now, the essay may not be ready.",
        prompt: "Write a nut graf that answers why this essay is being written at this specific moment.",
        wordCountMin: 50,
        wordCountMax: 120,
        criteria: [
          { name: "Answers why now", description: "The paragraph identifies what changed or what became visible that makes this the right moment for this essay.", weight: 0.5 },
          { name: "Timeliness is specific", description: "The 'why now' is concrete — a specific development, not 'things are changing' or 'we live in unprecedented times.'", weight: 0.3 },
          { name: "Timing and argument are connected", description: "The reason for writing now connects directly to what the essay is arguing.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Name the moment",
            passThreshold: 50,
            wordCountMin: 50,
            wordCountMax: 100,
            criteria: [
              { name: "Identifies a specific moment", description: "The paragraph points to something particular that happened or changed — not just 'things are different now.'", weight: 0.5 },
              { name: "More than 'this is timely'", description: "The 'why now' is substantive — a real change in circumstance, not just an assertion of relevance.", weight: 0.3 },
              { name: "Connects to the essay", description: "The moment named is connected to what the essay actually argues.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a nut graf for an essay about how the pandemic permanently changed what people expect from their employers. Identify the specific moment that makes this essay necessary now. 50–100 words." },
              { prompt: "Write a nut graf for an essay about how generative AI is changing what it means to be a writer. Name the specific development that makes this the moment to write about it. 50–100 words." },
              { prompt: "Write a nut graf for an essay about how the collapse of local news has changed how people understand their own communities. Identify the specific moment. 50–100 words." },
              { prompt: "Write a nut graf for an essay about how inflation changed the way people in their thirties think about home ownership. Name the specific shift that makes this essay timely. 50–100 words." },
              { prompt: "Write a nut graf for an essay about how the end of the zero-interest-rate era changed how startups think about growth. Name the specific moment. 50–100 words." },
            ],
          },
          {
            label: "Why this moment specifically",
            passThreshold: 65,
            wordCountMin: 50,
            wordCountMax: 110,
            criteria: [
              { name: "Specific, not generic timeliness", description: "The 'why now' is precise — not 'we live in a time of change' but the particular change that matters.", weight: 0.5 },
              { name: "Creates urgency", description: "The reader understands why this couldn't have been written two years ago and shouldn't wait two more.", weight: 0.3 },
              { name: "Timing serves the argument", description: "The moment isn't just a hook — it's connected to what the essay is actually arguing.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a nut graf for an essay about how remote work made middle managers' actual function visible — and it wasn't what anyone expected. Why is this the moment to write it? Be specific, not generic. 50–110 words." },
              { prompt: "Write a nut graf for an essay about how the rise of Substack revealed what audiences actually want from nonfiction versus what legacy media was giving them. Specific timing. 50–110 words." },
              { prompt: "Write a nut graf for an essay about how the normalization of layoffs at profitable companies changed what employee loyalty means. Why now specifically? 50–110 words." },
              { prompt: "Write a nut graf for an essay about how social media made it impossible to separate a writer's work from their persona — and what that's done to criticism. Specific, non-generic timeliness. 50–110 words." },
              { prompt: "Write a nut graf for an essay about how the mainstreaming of therapy-speak has changed how people talk about conflict at work. Why this moment? Be precise. 50–110 words." },
            ],
          },
          {
            label: "Timing as argument",
            passThreshold: 75,
            wordCountMin: 60,
            wordCountMax: 120,
            criteria: [
              { name: "Timing is the argument", description: "The 'why now' isn't just context — it's part of what the essay is arguing.", weight: 0.4 },
              { name: "Specific and earned", description: "The moment named is precise, and the reader understands exactly why it matters for this essay.", weight: 0.35 },
              { name: "Creates genuine urgency", description: "The reader feels that this essay matters at this moment — not as a trick, but as a real observation.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a nut graf where the timing isn't just context — it's part of the argument itself. Essay topic: how the mass adoption of AI writing tools is making it harder to know what human voice sounds like anymore. 60–120 words." },
              { prompt: "Write a nut graf where the timing is the argument. Essay: how the return-to-office mandates revealed that most office culture was built around surveillance, not collaboration. 60–120 words." },
              { prompt: "Write a nut graf where the moment changes the meaning of the argument. Essay: how the first generation of people who grew up with smartphones is now old enough to tell us what it did to them. 60–120 words." },
              { prompt: "Write a nut graf where timing and argument are inseparable. Essay: how the collapse of Twitter/X is proving what people always suspected about what held professional communities together online. 60–120 words." },
              { prompt: "Write a nut graf where the 'why now' is itself evidence for the essay's claim. Essay: how the fact that everyone is suddenly writing about attention spans proves the point about what's happening to attention spans. 60–120 words." },
            ],
          },
        ],
      },

      {
        id: "ng-4",
        title: "Make a Promise",
        lesson:
          "The nut graf is a contract with the reader. It tells them what they're getting and implicitly promises to deliver it. Write it wrong — too vague, too broad, too ambitious — and the reader doesn't trust you with their time. Write it right and you've earned the next thousand words. The promise should be specific enough to be kept.",
        prompt: "Write a nut graf that makes a specific promise the essay can keep.",
        wordCountMin: 50,
        wordCountMax: 120,
        criteria: [
          { name: "Makes a specific promise", description: "The paragraph tells the reader what they will get from this essay — specifically, not vaguely.", weight: 0.5 },
          { name: "Promise is keepable", description: "The promise is scoped to what an essay can actually deliver — not 'I will change how you think about everything.'", weight: 0.3 },
          { name: "Earns the reader's time", description: "After reading this paragraph, the reader has a reason to keep going.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Make any promise",
            passThreshold: 50,
            wordCountMin: 50,
            wordCountMax: 100,
            criteria: [
              { name: "States what the reader will get", description: "The paragraph communicates what the essay is going to deliver.", weight: 0.5 },
              { name: "More than a topic statement", description: "The promise is about what the reader will understand or see differently, not just what subject will be covered.", weight: 0.3 },
              { name: "Scoped to an essay", description: "The promise is something an essay can actually make good on.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a nut graf for an essay about why most interview processes select for people who are good at interviews, not people who are good at jobs. Make a promise to the reader — what will they get from this? 50–100 words." },
              { prompt: "Write a nut graf for an essay about how most meeting agendas are theatrical rather than functional. What does this essay promise to show the reader? 50–100 words." },
              { prompt: "Write a nut graf for an essay about how the rise of 'content' changed what writers think they're supposed to be doing. What does this essay promise? 50–100 words." },
              { prompt: "Write a nut graf for an essay about how people who grew up poor and became successful often have the hardest time managing money. What will the reader understand after reading this? 50–100 words." },
              { prompt: "Write a nut graf for an essay about how the language of 'disruption' in tech was a way of avoiding accountability for harm. What does the essay promise to show? 50–100 words." },
            ],
          },
          {
            label: "A promise worth keeping",
            passThreshold: 65,
            wordCountMin: 50,
            wordCountMax: 110,
            criteria: [
              { name: "Promise is specific", description: "The reader knows exactly what they're getting — not 'a new perspective' but a specific insight or argument.", weight: 0.45 },
              { name: "Promise is honest", description: "The promise doesn't oversell — it's something the essay can actually deliver.", weight: 0.35 },
              { name: "Creates forward momentum", description: "After the nut graf, the reader wants to keep going to see the promise fulfilled.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a nut graf for an essay about how the advice to 'show don't tell' has been applied so broadly that writers now avoid the kind of plain statement that only they could make. Make a promise that's specific and honest — not oversold. 50–110 words." },
              { prompt: "Write a nut graf for an essay about how the best managers you've ever had all did something counterintuitive. The promise should be specific enough that the reader knows what they're getting. 50–110 words." },
              { prompt: "Write a nut graf for an essay about how the biggest decisions in most people's lives are made by default, not by choice. Make a specific, honest promise. 50–110 words." },
              { prompt: "Write a nut graf for an essay about how the shift to Slack changed what 'thinking together' means in a company. Promise something specific and keepable. 50–110 words." },
              { prompt: "Write a nut graf for an essay about how most people's expertise is more fragile than they think — and a specific kind of situation reveals it. Make a promise the essay can keep. 50–110 words." },
            ],
          },
          {
            label: "The contract",
            passThreshold: 75,
            wordCountMin: 60,
            wordCountMax: 120,
            criteria: [
              { name: "Contract is clear", description: "The reader knows exactly what they're agreeing to spend the next few minutes reading — argument, scope, and payoff.", weight: 0.4 },
              { name: "Earns trust", description: "The nut graf makes the reader confident the writer knows what they're doing — the promise feels reliable.", weight: 0.35 },
              { name: "Scoped and honest", description: "The promise is ambitious enough to be worth keeping but honest enough to actually be kept.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a nut graf that functions as a real contract: the reader knows exactly what argument they're about to read, why it matters, and what they'll understand differently afterward. Essay topic: how the metrics companies use to evaluate success shape what employees think is worth doing. 60–120 words." },
              { prompt: "Write a nut graf that earns the reader's trust — they feel the writer knows what they're arguing and can deliver on it. Essay: how the reflex to be 'balanced' in opinion writing has made most op-eds less useful than a confident one-sided argument. 60–120 words." },
              { prompt: "Write a nut graf that makes a contract and fulfills it in miniature — the paragraph itself demonstrates what the essay promises to do. Essay: how asking better questions is a more learnable skill than most people realize. 60–120 words." },
              { prompt: "Write a nut graf where the promise is the most interesting part — where you can feel the writer is about to show you something you haven't seen before. Essay: how the way companies announce layoffs reveals their real culture better than any value statement. 60–120 words." },
              { prompt: "Write a nut graf that is simultaneously a promise, an argument, and a reason to keep reading — all in one paragraph. Essay: how the pressure to have an opinion about everything has made most people's opinions about anything worse. 60–120 words." },
            ],
          },
        ],
      },

      {
        id: "ng-5",
        title: "Two Sentences Maximum",
        lesson:
          "The best nut grafs are ruthlessly short. You should be able to state the argument, the stakes, and the why now in two sentences. If you can't, the argument probably isn't clear yet — even to you. Write it long first. Then cut until two sentences carry the whole thing.",
        prompt: "Write a nut graf in two sentences or fewer.",
        wordCountMin: 15,
        wordCountMax: 60,
        criteria: [
          { name: "Two sentences or fewer", description: "The nut graf is at most two sentences long.", weight: 0.3 },
          { name: "Both jobs done", description: "The two sentences cover the argument and the stakes — nothing essential is missing.", weight: 0.4 },
          { name: "No wasted words", description: "Every word in the two sentences is doing a job — nothing is padding.", weight: 0.3 },
        ],
        stages: [
          {
            label: "Get it under control",
            passThreshold: 50,
            wordCountMin: 15,
            wordCountMax: 60,
            criteria: [
              { name: "Short", description: "The nut graf is no longer than three sentences.", weight: 0.3 },
              { name: "States the argument", description: "The argument is present — the reader knows what the essay is claiming.", weight: 0.4 },
              { name: "States the stakes", description: "The reason to care is present, however briefly.", weight: 0.3 },
            ],
            variants: [
              { prompt: "Write a nut graf for an essay about how most startups fail not because of bad ideas but because of bad timing. Keep it under 60 words. Get the argument and the stakes in there." },
              { prompt: "Write a nut graf for an essay about how the way we praise children for being 'smart' makes them afraid of difficulty. Under 60 words. Argument and stakes." },
              { prompt: "Write a nut graf for an essay about how the shift from owning software to subscribing to it changed our relationship to the tools we use. Under 60 words." },
              { prompt: "Write a nut graf for an essay about how the performative nature of busyness signals status but destroys thinking. Under 60 words. Argument, stakes, no filler." },
              { prompt: "Write a nut graf for an essay about how cities that were 'discovered' by remote workers during the pandemic haven't recovered from it. Under 60 words." },
            ],
          },
          {
            label: "Exactly two sentences",
            passThreshold: 65,
            wordCountMin: 15,
            wordCountMax: 50,
            criteria: [
              { name: "Two sentences", description: "The nut graf is exactly two sentences — not one, not three.", weight: 0.3 },
              { name: "First sentence: the argument", description: "The first sentence states what the essay is claiming.", weight: 0.35 },
              { name: "Second sentence: the stakes or why now", description: "The second sentence tells the reader why it matters or why this is the moment.", weight: 0.35 },
            ],
            variants: [
              { prompt: "Write a two-sentence nut graf. Sentence 1: the argument. Sentence 2: why it matters. Essay: how the normalization of 'quiet quitting' revealed what the employment contract always actually said." },
              { prompt: "Write a two-sentence nut graf. Sentence 1: the claim. Sentence 2: the stakes. Essay: how the advice to 'build in public' benefits audiences but punishes the builders." },
              { prompt: "Write a two-sentence nut graf. Sentence 1: what the essay argues. Sentence 2: why now. Essay: how the collapse of mid-size companies is eliminating the career path where most people learned to manage." },
              { prompt: "Write a two-sentence nut graf. First sentence is the argument. Second sentence is why the reader should care. Essay: how writing tools that autocomplete your sentences are changing what writers think they're capable of." },
              { prompt: "Write a two-sentence nut graf — argument then stakes. Essay: how the language people use to describe their job in their bio reveals everything about how they feel about that job." },
            ],
          },
          {
            label: "Nothing wasted",
            passThreshold: 75,
            wordCountMin: 15,
            wordCountMax: 50,
            criteria: [
              { name: "Two sentences, complete", description: "Two sentences that cover argument, stakes, and nothing else.", weight: 0.3 },
              { name: "Every word earns its place", description: "No word could be cut without losing something essential.", weight: 0.4 },
              { name: "Sounds like a person, not a filing", description: "The two sentences have a voice — they sound like someone making a case, not writing a proposal.", weight: 0.3 },
            ],
            variants: [
              { prompt: "Write a two-sentence nut graf where every single word earns its place — nothing could be cut without losing something essential. Essay: how the people who are best at giving feedback are almost never the ones promoted to give it professionally." },
              { prompt: "Write a two-sentence nut graf with no wasted words and a real voice. Essay: how working in public has made writers optimize for legibility over honesty." },
              { prompt: "Write a two-sentence nut graf — tight, voiced, nothing wasted. Essay: how the constant availability of information has made people worse at sitting with uncertainty." },
              { prompt: "Write a two-sentence nut graf where each word is doing a job. Essay: how the framing of creative work as 'passion' has made it acceptable to pay people less for it." },
              { prompt: "Write a two-sentence nut graf that sounds like a person who has thought hard about something and is now saying it as precisely as possible. Essay: how the places that feel most like 'home' are rarely the ones we grew up in." },
            ],
          },
        ],
      },

      {
        id: "ng-6",
        title: "Lede Into Nut Graf",
        lesson:
          "The lede earns attention. The nut graf converts it. Together they're the most important 200 words of any essay. The pivot between them — the moment you stop being indirect and start stating the argument — is the most critical sentence in the piece. Write it wrong and the reader feels the gear-shift. Write it right and they don't notice it at all.",
        prompt: "Write a lede followed by a nut graf — the pivot between them should feel inevitable, not jarring.",
        wordCountMin: 100,
        wordCountMax: 220,
        criteria: [
          { name: "Lede earns attention", description: "The opening sentences pull the reader in — they have a reason to keep going before the argument is stated.", weight: 0.35 },
          { name: "Nut graf states the argument", description: "The nut graf says plainly what the essay is about and why it matters.", weight: 0.35 },
          { name: "Pivot feels inevitable", description: "The transition from lede to nut graf doesn't feel like a gear-shift — the nut graf seems to grow out of the lede.", weight: 0.3 },
        ],
        stages: [
          {
            label: "Write both, don't worry about the seam",
            passThreshold: 50,
            wordCountMin: 100,
            wordCountMax: 200,
            criteria: [
              { name: "Lede is present", description: "There is an opening that does something other than state the argument — a scene, an observation, a question, a surprising fact.", weight: 0.35 },
              { name: "Nut graf is present", description: "There is a paragraph that states what the essay is about.", weight: 0.35 },
              { name: "They're connected", description: "The lede and nut graf are about the same subject — they don't feel like two separate pieces.", weight: 0.3 },
            ],
            variants: [
              { prompt: "Write a lede and nut graf for an essay about how the best managers you've had almost never gave you direct advice — they asked questions. Don't worry about the seam yet. Just get both down. 100–200 words." },
              { prompt: "Write a lede and nut graf for an essay about how the shift from phone calls to texts changed how people argue. Lede first, nut graf second. 100–200 words." },
              { prompt: "Write a lede and nut graf for an essay about how open offices were sold on collaboration but delivered surveillance. Get both down. 100–200 words." },
              { prompt: "Write a lede and nut graf for an essay about how the first job someone has shapes what they think work is supposed to feel like for the rest of their career. 100–200 words." },
              { prompt: "Write a lede and nut graf for an essay about how the word 'authentic' has been so overused in marketing that it now signals inauthenticity. Both. 100–200 words." },
            ],
          },
          {
            label: "Make the pivot work",
            passThreshold: 65,
            wordCountMin: 110,
            wordCountMax: 210,
            criteria: [
              { name: "Pivot is smooth", description: "The transition from lede to nut graf doesn't announce itself — the reader moves from one to the other without noticing the gear-shift.", weight: 0.4 },
              { name: "Lede creates the conditions for the nut graf", description: "The lede raises a question or sets up a tension that the nut graf then answers or names.", weight: 0.35 },
              { name: "Nut graf is plain and direct", description: "The nut graf says the thing — after the lede's indirection, the nut graf states the argument clearly.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a lede and nut graf for an essay about how the way companies talk about 'culture fit' is often a proxy for 'people like us.' The pivot should be smooth — the nut graf should feel like it grows out of the lede. 110–210 words." },
              { prompt: "Write a lede and nut graf for an essay about how we've medicalized normal human unhappiness. Focus on making the transition feel inevitable. 110–210 words." },
              { prompt: "Write a lede and nut graf for an essay about how the experience of rereading a book you loved at twenty is a reliable way to figure out how much you've changed. Make the pivot smooth. 110–210 words." },
              { prompt: "Write a lede and nut graf for an essay about how asking for feedback at work and actually using it are two completely different skills. The lede should create the conditions for the nut graf. 110–210 words." },
              { prompt: "Write a lede and nut graf for an essay about how the suburbs were designed to eliminate boredom and instead created a different and more chronic kind of it. Smooth pivot. 110–210 words." },
            ],
          },
          {
            label: "Seamless",
            passThreshold: 75,
            wordCountMin: 120,
            wordCountMax: 220,
            criteria: [
              { name: "Seam is invisible", description: "The reader can't identify exactly where the lede ends and the nut graf begins — it flows as one piece of writing.", weight: 0.4 },
              { name: "Lede earns the argument", description: "By the time the nut graf states the claim, the reader is already half-convinced — the lede did the work.", weight: 0.35 },
              { name: "200 words that pull", description: "The combined lede and nut graf create forward momentum — the reader is pulled into the essay, not just informed of its topic.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a lede and nut graf for an essay about how expertise in one domain makes people overconfident in adjacent ones. Make the seam invisible — the reader shouldn't feel the gear-shift. 120–220 words." },
              { prompt: "Write a lede and nut graf for an essay about how the advice to 'find your why' has made people more confused about motivation, not less. The 200 words should pull. 120–220 words." },
              { prompt: "Write a lede and nut graf for an essay about how the way people decorate their home office reveals exactly how they thought about the pandemic. Seamless transition, strong pull. 120–220 words." },
              { prompt: "Write a lede and nut graf for an essay about how companies that talk most about 'innovation' are usually the least innovative. Make the seam invisible. 120–220 words." },
              { prompt: "Write a lede and nut graf for an essay about how the moment you stop being bad at something is often when you stop improving. Seamless. The reader is pulled in before they notice the argument starting. 120–220 words." },
            ],
          },
        ],
      },
    ],
  },

  // ── WRITING ARGUMENTS ────────────────────────────────────────────────────

  {
    id: "writing-arguments",
    title: "Writing Arguments",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "An argument isn't a fight. It's a claim, supported by evidence, tested against the strongest objection, and resolved. Most opinion writing skips two of those four steps. This track builds the full structure until it's instinct.",
    exercises: [
      {
        id: "arg-1",
        title: "One Sentence Claim",
        lesson:
          "Most opinion writing buries its claim or never fully makes one. The claim is one sentence. Specific. Arguable — a reasonable person could disagree. Yours. 'Technology is changing how we think' is not a claim. 'Search has made us worse at holding opinions because we know we can always look up the answer' is a claim. Write the one sentence.",
        prompt: "Write a single-sentence claim on a topic you have an actual opinion about.",
        wordCountMin: 10,
        wordCountMax: 50,
        criteria: [
          { name: "One sentence", description: "The claim is a single sentence.", weight: 0.2 },
          { name: "Specific", description: "The claim is about something particular, not a broad topic.", weight: 0.4 },
          { name: "Arguable", description: "A reasonable person who has thought about the topic could disagree.", weight: 0.4 },
        ],
        stages: [
          {
            label: "Write any claim",
            passThreshold: 50,
            wordCountMin: 10,
            wordCountMax: 50,
            criteria: [
              { name: "Is a claim", description: "The sentence asserts something — it doesn't just name a topic or ask a question.", weight: 0.5 },
              { name: "Specific enough to argue about", description: "The claim is particular enough that someone could push back on it.", weight: 0.5 },
            ],
            variants: [
              { prompt: "Write one sentence that is a claim about work — something you actually believe, specific enough that a thoughtful person could disagree. Just the sentence." },
              { prompt: "Write one sentence that is a claim about technology — not 'technology is changing things' but something specific you believe about how it works or what it does. Just the sentence." },
              { prompt: "Write one sentence that is a claim about how organizations work — something specific you've observed or believe. Just the sentence." },
              { prompt: "Write one sentence that is a claim about how people make decisions — something specific and arguable. Just the sentence." },
              { prompt: "Write one sentence that is a claim about education, media, or culture — something specific you believe that others might dispute. Just the sentence." },
            ],
          },
          {
            label: "Sharpen it",
            passThreshold: 65,
            wordCountMin: 10,
            wordCountMax: 45,
            criteria: [
              { name: "Specific, not general", description: "The claim is about a particular thing, not a broad category.", weight: 0.4 },
              { name: "Arguable by someone smart", description: "A thoughtful person who has considered the topic could make a reasonable case against it.", weight: 0.4 },
              { name: "One sentence", description: "The claim fits in a single sentence.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write one sentence: a sharp, specific claim about why most meetings are structured wrong. Specific enough that someone could argue the opposite with a straight face." },
              { prompt: "Write one sentence: a sharp claim about what remote work actually revealed about office culture — not 'things changed' but what specific thing became visible." },
              { prompt: "Write one sentence: a specific claim about why most feedback is useless — particular enough to be arguable." },
              { prompt: "Write one sentence: a sharp claim about what expertise actually is — or what it isn't — specific and arguable." },
              { prompt: "Write one sentence: a specific claim about why people change careers — particular, arguable, yours." },
            ],
          },
          {
            label: "One sentence that stands alone",
            passThreshold: 75,
            wordCountMin: 10,
            wordCountMax: 45,
            criteria: [
              { name: "Completely specific", description: "Every word in the claim is necessary — no vague qualifiers, no hedging.", weight: 0.4 },
              { name: "Strong enough to anchor an essay", description: "This sentence could be the thesis of a 1,500-word piece — it has enough in it to develop.", weight: 0.35 },
              { name: "Yours alone", description: "The claim sounds like a particular person's specific observation, not a generic take.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write one sentence — your sharpest, most specific claim about what makes writing good or bad. The claim should be strong enough to anchor a full essay and specific enough to be only yours." },
              { prompt: "Write one sentence — your most specific claim about how power actually works inside organizations, as opposed to how the org chart says it works." },
              { prompt: "Write one sentence — your sharpest claim about what the internet has done to a specific thing you care about. Specific. No hedging. Strong enough to build on." },
              { prompt: "Write one sentence — your most specific claim about why something everyone accepts as good advice is actually wrong or incomplete." },
              { prompt: "Write one sentence — your sharpest claim about what most people get wrong about a topic you know well. Strong enough to anchor an essay. Specific enough to be yours." },
            ],
          },
        ],
      },

      {
        id: "arg-2",
        title: "Evidence from What You Know",
        lesson:
          "The best evidence in personal essays and Substack isn't statistics — it's what you've seen. Specific moments, specific conversations, specific failures. Not 'research shows' but 'every time I've watched someone do X, I've noticed Y.' Evidence from your own observation is harder to refute and more interesting to read. The question isn't 'can I prove this?' but 'what do I actually know about this?'",
        prompt: "Support a claim using only evidence from your own observation and experience — no research, no statistics.",
        wordCountMin: 80,
        wordCountMax: 160,
        criteria: [
          { name: "Evidence is from direct observation", description: "The support comes from things the writer has actually seen, heard, or experienced — not research or general knowledge.", weight: 0.5 },
          { name: "Evidence is specific", description: "The observations are particular — a specific moment, a specific person, a specific pattern noticed over time.", weight: 0.3 },
          { name: "Evidence supports the claim", description: "The observations connect to the claim — the reader can see why they count as evidence.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Just name what you've seen",
            passThreshold: 50,
            wordCountMin: 80,
            wordCountMax: 140,
            criteria: [
              { name: "Uses personal observation", description: "The evidence comes from things the writer has actually seen or experienced.", weight: 0.5 },
              { name: "Specific, not general", description: "The observations are particular — not 'I've noticed people do this' but something more concrete.", weight: 0.3 },
              { name: "Connected to a claim", description: "The observations are offered as support for something the writer believes.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Make this claim and then support it with two or three things you've personally observed: 'The people who talk most confidently about a subject are rarely the ones who know it best.' Only your own experience — no research. 80–140 words." },
              { prompt: "Make this claim and then support it with things you've actually seen: 'Most feedback is given for the person giving it, not the person receiving it.' Your observation only. 80–140 words." },
              { prompt: "Make this claim and support it from your own experience: 'The best decisions I've seen people make were made quickly; the worst took forever.' Personal observation only. 80–140 words." },
              { prompt: "Make this claim and support it with what you've seen: 'People are most honest about what they want when they're describing someone else's situation.' Your evidence only. 80–140 words." },
              { prompt: "Make this claim and support it from what you know: 'The moment someone gets a title, they start spending time protecting it.' Specific things you've observed. 80–140 words." },
            ],
          },
          {
            label: "Specific moments, not patterns",
            passThreshold: 65,
            wordCountMin: 90,
            wordCountMax: 150,
            criteria: [
              { name: "Evidence is a moment, not a pattern", description: "The writer offers a specific scene or instance — not just 'I've noticed this happens' but an actual time it happened.", weight: 0.5 },
              { name: "Moment is detailed enough to be real", description: "The specific instance has enough detail that it feels like a memory, not a constructed example.", weight: 0.3 },
              { name: "Moment supports the claim", description: "The specific instance counts as evidence — the reader can see why.", weight: 0.2 },
            ],
            variants: [
              { prompt: "State a claim you hold about how people behave in groups. Then support it with one specific moment — an actual time you saw this happen. Not 'I've noticed' but 'I remember when.' 90–150 words." },
              { prompt: "State a claim about what makes writing good or bad. Then support it with a specific moment — a piece you read, a sentence that stopped you, something you wrote and failed at. Specific instance, not general observation. 90–150 words." },
              { prompt: "State a claim about how people make career decisions. Support it with a specific moment from your own life or something you witnessed. Enough detail that it feels like a real memory. 90–150 words." },
              { prompt: "State a claim about how organizations handle failure. Support it with one specific moment you witnessed — actual event, actual people, actual outcome. 90–150 words." },
              { prompt: "State a claim about how people change their minds. Support it with a specific moment — a time you changed yours, or watched someone else change theirs — with enough detail to be real. 90–150 words." },
            ],
          },
          {
            label: "Evidence that does real work",
            passThreshold: 75,
            wordCountMin: 100,
            wordCountMax: 160,
            criteria: [
              { name: "Evidence is specific and real", description: "The observation is detailed enough to feel like actual experience, not a constructed example.", weight: 0.35 },
              { name: "Evidence is hard to dismiss", description: "The specific instance is credible and interesting enough that the reader can't easily wave it away.", weight: 0.35 },
              { name: "Claim and evidence are tightly connected", description: "The reader can see exactly how the specific instance supports the claim — the connection is explicit.", weight: 0.3 },
            ],
            variants: [
              { prompt: "Make a specific claim about how expertise changes the way someone communicates. Then support it with evidence from your own observation that is so specific and detailed it would be hard to dismiss. Make the connection between evidence and claim explicit. 100–160 words." },
              { prompt: "Make a specific claim about what happens to teams when someone new joins who is clearly more capable than the current members. Support it with real observed evidence — specific enough to be hard to dismiss. 100–160 words." },
              { prompt: "Make a claim about what people's relationship with money reveals about them. Support it with evidence from your own experience that is specific, real, and tightly connected to the claim. 100–160 words." },
              { prompt: "Make a claim about how the pressure to be positive affects the quality of feedback in creative work. Support it with specific, real evidence — something you observed or experienced — that is hard to dismiss. 100–160 words." },
              { prompt: "Make a claim about what people actually mean when they say they want more 'work-life balance.' Support it with specific evidence from your own observation — real, detailed, connected. 100–160 words." },
            ],
          },
        ],
      },

      {
        id: "arg-3",
        title: "The Steel Man",
        lesson:
          "Most arguments fail not because they're wrong but because they don't take the other side seriously. The steel man is the strongest version of the argument against yours — not the weakest one you can knock down. Writing a real steel man is hard: it requires understanding why thoughtful people who have actually considered the question disagree with you. If you can't, your argument probably isn't ready.",
        prompt: "Write the strongest possible case against an argument you hold.",
        wordCountMin: 80,
        wordCountMax: 160,
        criteria: [
          { name: "Takes the other side seriously", description: "The steel man represents a position a thoughtful, informed person could actually hold.", weight: 0.5 },
          { name: "Strongest version, not weakest", description: "This is the best argument against the writer's position — not the easiest one to dismiss.", weight: 0.3 },
          { name: "Honest", description: "The writer doesn't secretly undermine the steel man — they present it as compellingly as possible.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Try to argue the other side",
            passThreshold: 50,
            wordCountMin: 80,
            wordCountMax: 140,
            criteria: [
              { name: "Argues against the writer's own position", description: "The paragraph makes a case for the opposing view, not a caricature of it.", weight: 0.5 },
              { name: "Has at least one real point", description: "The opposing argument contains at least one observation a thoughtful person would recognize as valid.", weight: 0.3 },
              { name: "Not a straw man", description: "The argument isn't so weak it's obviously set up to be knocked down.", weight: 0.2 },
            ],
            variants: [
              { prompt: "You believe that most workplace feedback is given for the benefit of the giver, not the receiver. Write the strongest case against this — the argument that feedback, done right, is genuinely useful and the problem is execution, not the concept. 80–140 words." },
              { prompt: "You believe that passion-based career advice sets people up to fail. Write the strongest case against this — the argument that following passion is exactly the right guidance and the failures are due to unrealistic expectations, not bad advice. 80–140 words." },
              { prompt: "You believe that most meetings could be emails. Write the strongest case that meetings serve functions emails can't — social, political, relational — and that people who hate meetings are missing what they actually do. 80–140 words." },
              { prompt: "You believe that the way we teach writing in schools makes people afraid of their own opinions. Write the strongest case that school writing instruction is actually useful preparation for professional communication. 80–140 words." },
              { prompt: "You believe that expertise and communication ability are inversely correlated. Write the strongest case that this is wrong — that the best experts are usually also the best communicators, and the failures are outliers. 80–140 words." },
            ],
          },
          {
            label: "The version a smart person would make",
            passThreshold: 65,
            wordCountMin: 90,
            wordCountMax: 150,
            criteria: [
              { name: "Smart person would make this argument", description: "The steel man is the version of the opposing argument that a thoughtful, informed person would actually advance.", weight: 0.5 },
              { name: "Contains real insight", description: "The opposing argument reveals something true that the writer's original position underweights.", weight: 0.3 },
              { name: "Genuinely hard to dismiss", description: "The writer couldn't easily brush this aside — it requires a real response.", weight: 0.2 },
            ],
            variants: [
              { prompt: "You believe that the rise of remote work has made people lonelier in ways they don't admit. Write the steel man — the argument a smart, well-meaning person would make that remote work has actually improved people's social lives by freeing them from forced proximity. Make it genuinely hard to dismiss. 90–150 words." },
              { prompt: "You believe that 'authentic leadership' is often an excuse for leaders to impose their personality on teams without accountability. Steel man it: write the version of the 'authentic leadership' argument that a thoughtful person would find compelling. 90–150 words." },
              { prompt: "You believe social media makes people's stated opinions less honest, not more. Write the steel man — the argument that social media has given voice to people who were previously silenced and made public discourse more honest overall. Make it real. 90–150 words." },
              { prompt: "You believe that most self-help books would be better as blog posts. Write the steel man: the argument that the long-form book format does something for the reader that a blog post genuinely can't. Make it compelling. 90–150 words." },
              { prompt: "You believe that data-driven management has made companies worse at the things that actually matter. Write the steel man — the argument that measurement and accountability have improved organizations in ways that are easy to underestimate. Make it genuinely hard to dismiss. 90–150 words." },
            ],
          },
          {
            label: "Better than your own argument",
            passThreshold: 75,
            wordCountMin: 100,
            wordCountMax: 160,
            criteria: [
              { name: "Steel man is genuinely strong", description: "The opposing argument is compelling enough that the reader might find it more persuasive than the writer's original position.", weight: 0.45 },
              { name: "Reveals a real tension", description: "The steel man surfaces a genuine difficulty in the writer's argument — not a technicality but a real problem.", weight: 0.35 },
              { name: "Writer has not secretly undermined it", description: "The steel man is presented at full strength — no sly undercutting, no setup for an easy rebuttal.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a steel man of the argument against something you believe strongly — and make it better than your own argument. The reader should finish thinking the opposing view is more compelling than they expected. No undercutting. Full strength. 100–160 words." },
              { prompt: "Take something you've written or argued recently. Write the steel man of the strongest objection to it — and make it so good that you'd have to think carefully to respond. The steel man reveals a real tension in your argument. 100–160 words." },
              { prompt: "Write the steel man of the argument that expertise is overrated and generalists outperform specialists in most real-world situations. Make it better than the specialists' own argument. 100–160 words." },
              { prompt: "Write the steel man of the argument that most Substack writers are just building audiences for ideas that haven't been tested against real editing or institutional accountability. Make it genuinely uncomfortable to hold your original position. 100–160 words." },
              { prompt: "Write the steel man of the argument that optimizing for individual productivity is the wrong frame and collective coordination is what actually matters. Make it stronger than the productivity-side argument. 100–160 words." },
            ],
          },
        ],
      },

      {
        id: "arg-4",
        title: "The Response",
        lesson:
          "After the steel man, you have to answer it. Not by dismissing it. Not by pretending it doesn't land. By absorbing what's true in it — acknowledging the real tension — and then showing why your claim still holds anyway. The response that says 'yes, and still...' is almost always stronger than the one that says 'but actually you're wrong because...'",
        prompt: "Respond to the strongest objection to your argument — absorb what's true in it, then show why your claim still stands.",
        wordCountMin: 80,
        wordCountMax: 160,
        criteria: [
          { name: "Absorbs what's true", description: "The response acknowledges the real force of the objection — it doesn't pretend it doesn't land.", weight: 0.4 },
          { name: "Shows why the claim still holds", description: "After acknowledging the tension, the response explains why the original argument survives.", weight: 0.4 },
          { name: "Doesn't dismiss", description: "The response doesn't wave the objection away — it engages with it seriously.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Acknowledge and hold your ground",
            passThreshold: 50,
            wordCountMin: 80,
            wordCountMax: 140,
            criteria: [
              { name: "Acknowledges the objection", description: "The response recognizes that the objection has real force — it doesn't just ignore it.", weight: 0.4 },
              { name: "Holds the original position", description: "The response doesn't abandon the claim — it shows why it still stands.", weight: 0.4 },
              { name: "Doesn't simply restate", description: "The response doesn't just repeat the original argument louder — it engages with the specific objection.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Steel man: Most career advice is useless not because of bad intent, but because the person giving it succeeded in their specific era, with their specific advantages. Telling someone today to 'build relationships' or 'do great work and you'll be recognized' fails to account for structural tailwinds that no longer exist. The advice isn't wrong — it's contextually inapplicable, which is worse.",
                prompt: "Write a response to this steel man. Acknowledge what's true in it, then show why your argument that most career advice is useless still holds. 80–140 words.",
              },
              {
                given: "Steel man: Experts are bad at teaching not because they're arrogant, but because genuine expertise makes it structurally impossible to remember what not-knowing felt like. The tacit knowledge that makes you excellent is, by definition, inaccessible to conscious reflection. This isn't a character flaw — it's a feature of how mastery works.",
                prompt: "Write a response to this steel man. Absorb what's true in it, then show why there's still something worth arguing about. 80–140 words.",
              },
              {
                given: "Steel man: The productivity industry doesn't fail because it gives bad advice. It fails because productivity is the wrong problem for most people to solve. The constraint isn't how much you get done — it's whether what you're doing is worth doing. Optimizing a system built around the wrong goals is worse than having no system.",
                prompt: "Write a response. Acknowledge the real point. Show why your argument about productivity advice survives it. 80–140 words.",
              },
              {
                given: "Steel man: Social media hasn't made people less honest about their opinions — it's revealed how dishonest people always were. The social pressure to say acceptable things existed long before Instagram. Social media just made this visible. Blaming the platform for the behavior misreads which came first.",
                prompt: "Write a response to this steel man. Take it seriously, then show where your original argument still holds. 80–140 words.",
              },
              {
                given: "Steel man: People don't stay in jobs they've outgrown out of fear or inertia — they stay because 'outgrowing a job' is genuinely ambiguous. You rarely know whether you've hit the ceiling or whether you're in a difficult phase that will pass. Leaving too early is at least as common a mistake as staying too long.",
                prompt: "Write a response. Absorb what's true. Show why your argument still stands. 80–140 words.",
              },
            ],
          },
          {
            label: "Yes, and still",
            passThreshold: 65,
            wordCountMin: 90,
            wordCountMax: 150,
            criteria: [
              { name: "'Yes, and still' structure", description: "The response acknowledges what's true in the objection before explaining why the claim survives — not dismissal, not capitulation.", weight: 0.45 },
              { name: "Acknowledgment is genuine", description: "The 'yes' isn't a trick setup for 'but actually' — the writer really admits what the objection gets right.", weight: 0.35 },
              { name: "Claim survives specifically", description: "The response explains exactly how the claim stands after absorbing the objection — not just 'my point still stands.'", weight: 0.2 },
            ],
            variants: [
              {
                given: "Steel man: The argument that remote work has made people lonelier ignores that for many people — introverts, people in difficult social environments, caregivers — remote work has been enormously liberating. The loneliness claim generalizes from a particular type of person and calls it universal.",
                prompt: "Write a response using the 'yes, and still' structure. Genuinely acknowledge what this gets right. Then show, specifically, why the loneliness argument survives. 90–150 words.",
              },
              {
                given: "Steel man: The claim that self-help books should be blog posts ignores what the book format actually does: it creates a sustained argument that can change how someone thinks over multiple reading sessions. A blog post is consumed and forgotten. A book is lived with. The length isn't padding — it's the product.",
                prompt: "Write a 'yes, and still' response. Acknowledge the genuine point about the book format. Show where your original argument holds even after conceding it. 90–150 words.",
              },
              {
                given: "Steel man: Saying that most meetings could be emails assumes the only function of a meeting is information transfer. But meetings do other things: they create accountability, signal priority, build relationships, and allow people to process information together in real time. Eliminate meetings and you lose these functions — you don't just make the emails longer.",
                prompt: "Write a 'yes, and still' response. Really acknowledge what meetings do. Then show why the argument against how most meetings are run survives. 90–150 words.",
              },
              {
                given: "Steel man: The critique of passion-based career advice assumes that people who follow passion are naive. But most people who give this advice have watched people build excellent careers by doing work they genuinely love, in ways that wouldn't have happened if they'd been purely strategic. The advice works — the sample is just self-selected.",
                prompt: "Write a 'yes, and still' response. Acknowledge what the self-selection point actually concedes. Show why the original criticism of passion advice survives. 90–150 words.",
              },
              {
                given: "Steel man: The argument that data-driven management has made companies worse assumes that pre-data management was good. But the alternative to measuring performance isn't enlightened judgment — it's whoever can make the best political case for themselves. Data, with all its problems, at least creates accountability to something outside personal preference.",
                prompt: "Write a 'yes, and still' response to this steel man. Genuinely acknowledge the accountability point. Then show why the original argument about what's been lost survives. 90–150 words.",
              },
            ],
          },
          {
            label: "The response that makes the argument stronger",
            passThreshold: 75,
            wordCountMin: 100,
            wordCountMax: 160,
            criteria: [
              { name: "Argument is stronger after the response", description: "The response doesn't just survive the objection — it makes the original claim more credible by engaging seriously with what was right about the challenge.", weight: 0.45 },
              { name: "Concession is real", description: "The writer gives genuine ground — not token acknowledgment before pivoting away.", weight: 0.35 },
              { name: "Survival is specific", description: "The response explains precisely how and why the claim holds after absorbing the objection.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Steel man: The argument that most feedback is given for the giver's benefit ignores situations where feedback is systematically withheld to protect the giver — where the problem isn't self-serving feedback but no feedback at all. If you've been in an environment where honest feedback is absent because giving it is too costly, you'd trade for the self-serving kind.",
                prompt: "Write a response that makes your original argument stronger by engaging seriously with this. Real concession, specific survival. 100–160 words.",
              },
              {
                given: "Steel man: The critique of 'authentic leadership' assumes that the alternative is leaders who effectively perform a role that serves their team. But most of the 'inauthentic' leadership people endure is exactly this: leaders performing a role while optimizing for their own advancement. At least authentic leaders are transparent about what they're doing.",
                prompt: "Write a response that makes the original argument stronger by genuinely wrestling with this point. 100–160 words.",
              },
              {
                given: "Steel man: The argument that the 'follow your passion' advice sets people up to fail ignores that the people most harmed by this advice were going to struggle anyway — because they'd been given no other framework for evaluating what work is worth doing. At least passion gives them something to aim at. The alternative, for many people, is pure market logic, which produces its own misery.",
                prompt: "Write a response that makes your original critique stronger — by genuinely absorbing what's true here. Real concession, specific survival. 100–160 words.",
              },
              {
                given: "Steel man: The claim that open-plan offices hurt collaboration ignores that some of the most productive creative environments in history — newsrooms, trading floors, design studios — are open plan. The problem isn't openness; it's openness combined with work that requires sustained concentration. The critique conflates two different things.",
                prompt: "Write a response that makes the original argument about open offices stronger by engaging seriously with this distinction. 100–160 words.",
              },
              {
                given: "Steel man: The argument that we've made busyness a status symbol assumes people have a choice. For most people, busyness isn't a performance — it's economic reality. Two jobs, caregiving responsibilities, no slack. Critiquing the performance of busyness is a critique that only people with enough slack to step back can make.",
                prompt: "Write a response that makes your original argument stronger — by genuinely conceding what's right here and showing, specifically, what survives. 100–160 words.",
              },
            ],
          },
        ],
      },

      {
        id: "arg-5",
        title: "The Full Structure",
        lesson:
          "Claim. Evidence. Objection. Response. That's the whole structure. Most opinion writing has the claim and some evidence. It skips the objection entirely — which means the reader supplies it, uncontested, in their head. A piece that walks through all four is hard to argue with, not because it's necessarily right, but because it has done the work.",
        prompt: "Write a complete argument: claim, evidence from your own observation, the strongest objection, and your response.",
        wordCountMin: 150,
        wordCountMax: 280,
        criteria: [
          { name: "All four elements present", description: "The piece contains a claim, evidence, an objection, and a response to that objection.", weight: 0.35 },
          { name: "Each element is real", description: "The claim is specific and arguable, the evidence is from observation, the objection is the strongest version, and the response absorbs rather than dismisses.", weight: 0.4 },
          { name: "Reads as one piece", description: "The four elements flow as a coherent argument, not a checklist being ticked off.", weight: 0.25 },
        ],
        stages: [
          {
            label: "Get all four down",
            passThreshold: 50,
            wordCountMin: 150,
            wordCountMax: 250,
            criteria: [
              { name: "All four elements present", description: "The piece has a claim, evidence, an objection, and a response — all four.", weight: 0.5 },
              { name: "Elements are real", description: "Each element does something — the claim is arguable, the evidence is specific, the objection isn't a straw man, the response engages.", weight: 0.3 },
              { name: "Connected", description: "The four elements are about the same argument — they don't feel like separate pieces.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a complete four-part argument on this claim: 'The people who get promoted most often are not the best performers — they're the best at managing their visibility.' Claim, evidence from your observation, the strongest objection, your response. 150–250 words." },
              { prompt: "Write a complete four-part argument on a claim you hold about how organizations handle failure. Claim, evidence (your observation), strongest objection, response. All four. 150–250 words." },
              { prompt: "Write a complete four-part argument on a claim you hold about what makes writing good or bad. Claim, evidence, strongest objection, response. 150–250 words." },
              { prompt: "Write a complete four-part argument on this: 'Most hiring processes are better at filtering for confidence than for competence.' Claim, evidence, strongest objection, your response. 150–250 words." },
              { prompt: "Write a complete four-part argument on a claim you hold about education — either how people learn or how schools teach. All four elements. 150–250 words." },
            ],
          },
          {
            label: "Each element at full strength",
            passThreshold: 65,
            wordCountMin: 160,
            wordCountMax: 260,
            criteria: [
              { name: "Claim is specific and arguable", description: "The opening claim is sharp enough to be contested.", weight: 0.25 },
              { name: "Evidence is from direct observation", description: "The evidence is specific, real, and comes from the writer's own experience.", weight: 0.25 },
              { name: "Objection is the strongest version", description: "The objection is what a thoughtful critic would actually say, not a straw man.", weight: 0.25 },
              { name: "Response absorbs and survives", description: "The response acknowledges what's true in the objection and shows why the claim still holds.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a four-part argument on a claim you hold about how people change their minds — or don't. Each element at full strength: sharpest claim, most specific evidence, strongest objection, most honest response. 160–260 words." },
              { prompt: "Write a four-part argument on a claim about what remote work revealed about office culture that was already true before the pandemic. Each element fully developed. 160–260 words." },
              { prompt: "Write a four-part argument on a claim about why most advice is useless or actively harmful. Sharp claim, real evidence, strongest objection, honest response. 160–260 words." },
              { prompt: "Write a four-part argument on a claim about expertise and communication — either that experts communicate poorly or that they actually communicate better than non-experts. All four elements at full strength. 160–260 words." },
              { prompt: "Write a four-part argument on a claim about how the incentive structures of social media have changed how people form and express opinions. Four elements, each fully developed. 160–260 words." },
            ],
          },
          {
            label: "One coherent argument",
            passThreshold: 75,
            wordCountMin: 180,
            wordCountMax: 280,
            criteria: [
              { name: "Reads as one piece", description: "The four elements flow as a coherent argument — the transitions are earned, the piece has momentum.", weight: 0.35 },
              { name: "All four elements at full strength", description: "Each of the four parts is doing real work — nothing is weak, nothing is skipped.", weight: 0.4 },
              { name: "Argument is hard to dismiss", description: "By engaging seriously with the objection, the overall argument becomes more credible — not weaker.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a complete four-part argument — claim, evidence, objection, response — that reads as one coherent piece of thinking, not a checklist. Topic: something you believe about how creative work gets evaluated versus how it gets made. 180–280 words." },
              { prompt: "Write a complete four-part argument that flows as one piece. Topic: a claim about what the best professional relationships you've had have in common, and what that reveals about how most professional relationships are structured wrong. 180–280 words." },
              { prompt: "Write a complete four-part argument that reads naturally — the seams between claim, evidence, objection, and response shouldn't be visible. Topic: something you believe about how institutions resist change even when they publicly commit to it. 180–280 words." },
              { prompt: "Write a complete four-part argument as one flowing piece. Topic: a claim about what people get wrong about motivation — either their own or other people's. 180–280 words." },
              { prompt: "Write a complete four-part argument that reads as a unified piece of thinking. Topic: a claim about what the way someone gives credit (or doesn't) reveals about how they think about their work. 180–280 words." },
            ],
          },
        ],
      },

      {
        id: "arg-6",
        title: "Argue Something Uncertain",
        lesson:
          "The easiest arguments to write are the ones you've already made to yourself a hundred times. The harder and more interesting exercise: pick something you're genuinely uncertain about, stake a position anyway, and make the case. Commitment under uncertainty is a skill. The goal isn't to be right — it's to think in public, out loud, to completion.",
        prompt: "Pick something you're genuinely uncertain about, stake a position, and argue it.",
        wordCountMin: 100,
        wordCountMax: 200,
        criteria: [
          { name: "Position is staked despite uncertainty", description: "The writer commits to a specific claim even though they acknowledge genuine uncertainty about it.", weight: 0.4 },
          { name: "Uncertainty is honest", description: "The writer admits what they don't know or can't prove — without using it as an excuse to avoid committing.", weight: 0.35 },
          { name: "Argument is made anyway", description: "Despite the uncertainty, the writer makes a real case for their position — not just a list of both sides.", weight: 0.25 },
        ],
        stages: [
          {
            label: "Pick a side anyway",
            passThreshold: 50,
            wordCountMin: 100,
            wordCountMax: 170,
            criteria: [
              { name: "A side is taken", description: "The writer stakes a specific position — not 'there are arguments on both sides' but an actual claim.", weight: 0.5 },
              { name: "Uncertainty is acknowledged", description: "The writer is honest that they're not sure — they're committing despite uncertainty, not pretending it away.", weight: 0.3 },
              { name: "Some argument is made", description: "The writer offers reasons for their position, even if tentative.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Pick something you're genuinely uncertain about — you could argue either way — and stake a position. Acknowledge that you're not sure. Make the case for the side you're choosing anyway. 100–170 words." },
              { prompt: "Pick a genuine disagreement you've had with yourself — a question where you keep changing your mind. Stake a position today. Say why. Acknowledge what you're giving up by choosing this side. 100–170 words." },
              { prompt: "Write about something you think is probably true but can't prove — a hunch or intuition you've developed from observation. Stake it as a claim. Argue for it. Acknowledge its limits. 100–170 words." },
              { prompt: "Pick a question you've thought about a lot without arriving at a firm answer. Pick the side you lean toward — even slightly — and argue it. Acknowledge what the other side gets right. 100–170 words." },
              { prompt: "Write about a claim you've held and then abandoned and then held again. Where do you land today? Stake it and argue it, acknowledging the uncertainty. 100–170 words." },
            ],
          },
          {
            label: "Commit without pretending certainty",
            passThreshold: 65,
            wordCountMin: 110,
            wordCountMax: 180,
            criteria: [
              { name: "Committed despite uncertainty", description: "The writer takes a clear position and argues it, while being honest that they might be wrong.", weight: 0.4 },
              { name: "Uncertainty is productive", description: "The acknowledgment of uncertainty makes the argument more credible, not weaker — the writer isn't hiding their limits.", weight: 0.35 },
              { name: "Argument is real", description: "The case made for the chosen position is a real argument, not just a statement of preference.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Pick something you're uncertain about that has real stakes — where being wrong would matter. Stake a position, argue it, and be honest about what you can't know. The uncertainty shouldn't make the argument weaker — it should make it more trustworthy. 110–180 words." },
              { prompt: "Argue a position you hold about something in your field or area of work that you can't fully prove. Commit to the claim. Acknowledge the limits. Make the argument anyway. 110–180 words." },
              { prompt: "Write about a question where smart people you respect land on different sides. Pick a side — even a slight lean — commit to it, and argue it while being honest that you're not certain. 110–180 words." },
              { prompt: "Argue a claim about the future — something you think is probably true about how something will change. You can't know. Say so. Stake the position and make the case. 110–180 words." },
              { prompt: "Write about something you believe that you've never said out loud because you're not sure enough. Say it here. Argue it. Acknowledge the uncertainty — then make the case anyway. 110–180 words." },
            ],
          },
          {
            label: "Uncertainty as the argument",
            passThreshold: 75,
            wordCountMin: 120,
            wordCountMax: 200,
            criteria: [
              { name: "Uncertainty is the point", description: "The argument is stronger because it's made under uncertainty — the writer's intellectual honesty is itself part of the case.", weight: 0.4 },
              { name: "Position is fully argued", description: "Despite the uncertainty, the writer makes a real, complete case — not a hedge dressed up as an argument.", weight: 0.35 },
              { name: "The reader is convinced to think, not just to agree", description: "The piece creates a sense that this is worth thinking about — the writer's commitment under uncertainty invites the reader to commit too.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write an argument about something genuinely uncertain where the uncertainty itself is part of the case. The fact that you're not sure — and are arguing anyway — should be what makes the reader take it seriously. 120–200 words." },
              { prompt: "Write about a question you think is underexplored because people are waiting to be more certain before they argue it publicly. Argue it now, from uncertainty, and make the uncertainty an asset. 120–200 words." },
              { prompt: "Write an argument about something you've changed your mind on — where your current position is held with less certainty than your previous one. Argue the new position. Let the uncertainty make it more honest. 120–200 words." },
              { prompt: "Write about something you think will turn out to be true — a long-term bet you'd make if pressed. Make the argument. Acknowledge you might be wrong. Make the uncertainty into a reason to read it, not a reason to discount it. 120–200 words." },
              { prompt: "Write an argument where being uncertain is, itself, part of the point — where the willingness to commit despite uncertainty is the thing you're arguing for, demonstrated by doing it. 120–200 words." },
            ],
          },
        ],
      },
    ],
  },

  // ── TRANSITIONS ──────────────────────────────────────────────────────────

  {
    id: "transitions",
    title: "Transitions",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "'Furthermore.' 'Additionally.' 'In conclusion.' These words announce a transition without making one. A real transition shows how two ideas are connected — it doesn't just label them as connected. Six exercises on the sentence that does the most invisible work in an essay.",
    exercises: [
      {
        id: "tr-1",
        title: "Kill the Connector Words",
        lesson:
          "'Furthermore,' 'Additionally,' 'Moreover,' 'In conclusion,' 'On the other hand' — these words don't make a transition. They announce that one is coming. The reader still has to make the leap themselves. A real transition does the work: it shows how two ideas are related rather than naming the relationship. Write the connection; don't label it.",
        prompt: "Connect two ideas without using any transition words.",
        wordCountMin: 20,
        wordCountMax: 80,
        criteria: [
          { name: "No connector words", description: "The transition contains no 'however,' 'furthermore,' 'additionally,' 'moreover,' 'on the other hand,' 'in conclusion,' or similar.", weight: 0.4 },
          { name: "Ideas are connected", description: "The reader understands how the two ideas relate — the connection is shown, not labeled.", weight: 0.4 },
          { name: "Reads naturally", description: "The transition doesn't feel forced — it sounds like thinking, not a technique being applied.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Write the connection",
            passThreshold: 50,
            wordCountMin: 20,
            wordCountMax: 70,
            criteria: [
              { name: "No transition words used", description: "No 'however,' 'but,' 'additionally,' 'furthermore,' 'moreover,' 'on the other hand,' or similar connector words.", weight: 0.5 },
              { name: "The two ideas are bridged", description: "The reader can follow from one idea to the next — the bridge exists, even if rough.", weight: 0.3 },
              { name: "Doesn't feel mechanical", description: "The connection doesn't read like a fill-in-the-blank exercise.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Idea 1: We tell ourselves we're being productive when we're actually just staying busy. The feeling of motion is addictive — moving fast makes us feel like we're going somewhere, even when we're not.\n\nIdea 2: The projects that actually matter almost always require long periods of apparent stillness — reading, thinking, waiting for something to become clear.",
                prompt: "Write 1–2 sentences connecting these two ideas without using any transition words (no 'however,' 'but,' 'additionally,' 'furthermore'). Show the connection; don't label it. 20–70 words.",
              },
              {
                given: "Idea 1: Most people who give advice are really processing their own regrets. The advice is for them, not for you.\n\nIdea 2: This doesn't make the advice useless. Sometimes what someone needed to hear at thirty is exactly what you need to hear at twenty-five.",
                prompt: "Write 1–2 sentences connecting these two ideas without any transition words. The connection should feel earned, not announced. 20–70 words.",
              },
              {
                given: "Idea 1: Experts are often the least confident people in the room about their field. They know what they don't know.\n\nIdea 2: The people who sound most certain are usually the ones who have thought about the topic least.",
                prompt: "Connect these two ideas without using any transition words. The relationship between the ideas should be visible without being labeled. 20–70 words.",
              },
              {
                given: "Idea 1: Cities are machines for producing encounters with strangers. That's what makes them uncomfortable and irreplaceable.\n\nIdea 2: Suburbs optimize for the opposite — maximum comfort, minimum unexpected encounter. They work exactly as designed.",
                prompt: "Write the transition between these two ideas using no connector words. Show the relationship; don't announce it. 20–70 words.",
              },
              {
                given: "Idea 1: Reading slowly is a form of respect — for the author, for the ideas, for your own attention.\n\nIdea 2: We live in a culture that rewards finishing, not understanding. The metric is books read, not ideas absorbed.",
                prompt: "Connect these ideas without transition words. The bridge should be felt, not labeled. 20–70 words.",
              },
            ],
          },
          {
            label: "The ideas connect themselves",
            passThreshold: 65,
            wordCountMin: 25,
            wordCountMax: 75,
            criteria: [
              { name: "No connector words at all", description: "Absolutely no 'however,' 'but,' 'yet,' 'additionally,' 'furthermore,' or similar words.", weight: 0.4 },
              { name: "Connection is clear and earned", description: "The reader immediately understands the relationship between the two ideas — the transition explains it without announcing it.", weight: 0.4 },
              { name: "Sounds like writing, not a technique", description: "The transition reads as natural prose, not a bridge constructed to pass an exercise.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Idea 1: The best managers don't give you the answer — they ask questions that make you figure it out yourself. You leave the conversation thinking you solved it alone.\n\nIdea 2: This is why management is so hard to evaluate. The best management looks like nothing happened.",
                prompt: "Write the transition without any connector words. It should feel like the ideas were always going to end up together. 25–75 words.",
              },
              {
                given: "Idea 1: Startups fail most often not from lack of effort but from solving the wrong problem with great execution.\n\nIdea 2: This is why market research is so dangerous when done wrong. You can convince yourself you've validated something that the market will later ignore.",
                prompt: "Connect these without connector words. The logic of the connection should do the work, not a linking word. 25–75 words.",
              },
              {
                given: "Idea 1: Open-plan offices were sold on collaboration but delivered surveillance. People became aware of how they looked while working, not just whether they were working.\n\nIdea 2: Headphones became the new office door — the signal that said 'I am here but not available.'",
                prompt: "Write the transition without any connector words. The two ideas should connect through the logic of the writing, not through a labeled relationship. 25–75 words.",
              },
              {
                given: "Idea 1: The shift from phone calls to texts changed how arguments work. You can no longer hear someone's voice break — or your own.\n\nIdea 2: This is probably why text arguments escalate faster. You're arguing with a version of the other person that can't be embarrassed by itself.",
                prompt: "Connect without connector words. The bridge should be invisible. 25–75 words.",
              },
              {
                given: "Idea 1: Feedback that is only positive trains people to stop showing you their actual problems.\n\nIdea 2: Eventually you stop seeing their problems at all — not because they've been solved, but because they've been hidden.",
                prompt: "Write the transition between these two ideas without any connector words. Show the causal link directly. 25–75 words.",
              },
            ],
          },
          {
            label: "Invisible seam",
            passThreshold: 75,
            wordCountMin: 30,
            wordCountMax: 80,
            criteria: [
              { name: "Transition is invisible", description: "A reader moving through the prose doesn't notice the transition — they just feel the argument moving.", weight: 0.4 },
              { name: "Connection is shown, never named", description: "The relationship between ideas is demonstrated through the writing itself, not described.", weight: 0.4 },
              { name: "Reads as one piece", description: "The two ideas and their connection feel like one continuous thought, not two thoughts bolted together.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Idea 1: The companies that talk most about their culture are usually the ones where culture is most contested. The manifesto is written when the reality has stopped being reliable.\n\nIdea 2: Values statements work the same way. They describe what the organization is trying to enforce, not what it naturally does.",
                prompt: "Write a transition that is completely invisible — no connector words, no announced relationship. The two ideas should read as one continuous thought. 30–80 words.",
              },
              {
                given: "Idea 1: People who grew up moving often have a different relationship to the idea of home — not that they don't want one, but that they've stopped expecting places to hold them.\n\nIdea 2: This is why they often build unusually strong attachment to people instead. Place didn't stay; people did.",
                prompt: "Write an invisible transition. No connector words. The seam disappears into the prose. 30–80 words.",
              },
              {
                given: "Idea 1: The advice to 'find your voice' assumes voice is something you find — that it's hiding somewhere and the task is location. \n\nIdea 2: Voice is actually something you build through accumulated decisions about what you're willing to say and what you're willing to leave out.",
                prompt: "Write a transition so smooth the reader doesn't feel it. No connector words. One continuous thought. 30–80 words.",
              },
              {
                given: "Idea 1: Meetings at large companies are often about establishing that you were in the room. The decision was made elsewhere.\n\nIdea 2: This is why so many people leave meetings not knowing what was decided. Nothing was — the meeting was for another purpose.",
                prompt: "Write an invisible transition between these ideas. No connector words. The ideas should feel continuous. 30–80 words.",
              },
              {
                given: "Idea 1: Writing for an audience changes what you say — but it also changes what you notice. You start to see things as potential sentences.\n\nIdea 2: After a while it becomes hard to have an experience that isn't also, somewhere in the back of your mind, being composed.",
                prompt: "Write a transition that disappears into the prose. No connector words. The two ideas become one. 30–80 words.",
              },
            ],
          },
        ],
      },

      {
        id: "tr-2",
        title: "The Echo",
        lesson:
          "The simplest and most reliable transition is the echo: end one idea on a word or phrase, and open the next idea with that same word or phrase. The repetition IS the bridge. It tells the reader we're still in the same world, just looking from a different angle. It doesn't sound like a technique — it sounds like thinking.",
        prompt: "Connect two ideas by echoing a word or phrase from the end of the first into the opening of the second.",
        wordCountMin: 30,
        wordCountMax: 100,
        criteria: [
          { name: "Echo is present", description: "A specific word or phrase from the end of the first idea appears at or near the start of the second.", weight: 0.4 },
          { name: "Echo does real work", description: "The repeated word is the bridge — it shows how the two ideas are connected, not just that they follow each other.", weight: 0.4 },
          { name: "Feels natural", description: "The repetition sounds like deliberate prose, not a mechanical device.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Find the echo word",
            passThreshold: 50,
            wordCountMin: 30,
            wordCountMax: 90,
            criteria: [
              { name: "A word or phrase echoes", description: "The same word or phrase appears at the end of one idea and the beginning of the next.", weight: 0.5 },
              { name: "The echo connects the ideas", description: "The repeated word is meaningful — it shows a relationship between the two thoughts.", weight: 0.3 },
              { name: "Reads naturally", description: "The echo doesn't feel forced or awkward.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Idea 1: The best writing advice is almost always the most obvious: write every day, read widely, revise ruthlessly. The reason it doesn't work isn't that it's wrong — it's that it treats writing as a discipline problem when it's actually a clarity problem.\n\nIdea 2: Clarity is what most writing advice skips. It's harder to teach than discipline, harder to fake, and harder to evaluate.",
                prompt: "Write the transition using the echo technique. Take a word from the end of Idea 1 and open Idea 2 with it. The echo should be the bridge. 30–90 words.",
              },
              {
                given: "Idea 1: The most useful thing about writing in public isn't the feedback — it's the commitment. Saying something in front of people means you have to actually believe it, or at least be willing to defend it.\n\nIdea 2: Defending a position is different from holding one. Most people hold positions loosely until they have to argue for them.",
                prompt: "Use the echo technique to bridge these ideas. Find a word at the end of Idea 1 and echo it into the start of Idea 2. 30–90 words.",
              },
              {
                given: "Idea 1: Good institutions fail not because of bad people but because of bad incentives. The people inside are usually doing exactly what the system rewards.\n\nIdea 2: Changing what the system rewards is the hardest kind of change. It requires the people who benefit from the current incentives to redesign them.",
                prompt: "Bridge these ideas with an echo. A word from the end of the first idea should open the second. 30–90 words.",
              },
              {
                given: "Idea 1: Expertise creates blind spots. The more fluent you become in a domain, the harder it is to see what's strange about it from the outside.\n\nIdea 2: This is why outsiders sometimes solve problems that insiders have been living with for years. They haven't been trained to ignore the right things.",
                prompt: "Use the echo technique. End Idea 1 on a word and open Idea 2 with it. The echo is the transition. 30–90 words.",
              },
              {
                given: "Idea 1: The way someone responds to being wrong tells you most of what you need to know about how they'll handle being right.\n\nIdea 2: People who handle being wrong well are almost always easier to work with when they're right. They don't need the win to be total.",
                prompt: "Write the transition using an echo. Find the word at the end of the first idea and bring it into the second. 30–90 words.",
              },
            ],
          },
          {
            label: "The echo does the work",
            passThreshold: 65,
            wordCountMin: 35,
            wordCountMax: 90,
            criteria: [
              { name: "Echo is the bridge, not decoration", description: "The repeated word carries the meaning of the transition — remove it and the two ideas fall apart.", weight: 0.5 },
              { name: "Repetition feels intentional", description: "The echo sounds like a deliberate choice, not an accident or a crutch.", weight: 0.3 },
              { name: "Connection is tighter for the echo", description: "The transition is stronger using this technique than it would be with a connector word.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Idea 1: Most people don't quit bad jobs — they wait until leaving feels like the obvious move. The discomfort has to become undeniable before the decision becomes easy.\n\nIdea 2: Easy decisions are usually late ones. The moment it feels obvious to leave, you've probably been there six months too long.",
                prompt: "Write the transition using the echo. The repeated word should be the actual reason the two ideas connect. Not decoration — the bridge itself. 35–90 words.",
              },
              {
                given: "Idea 1: Working in public forces you to finish things. A piece you keep to yourself can always be revised tomorrow; a piece you've sent exists in its current form.\n\nIdea 2: Finished things are a different object than drafts. They have edges. They can be agreed with or argued against. Drafts can only be worked on.",
                prompt: "Use an echo where the repeated word is the actual hinge between the ideas. The echo is why they connect. 35–90 words.",
              },
              {
                given: "Idea 1: The hardest part of any argument isn't finding evidence — it's knowing which evidence actually matters. Most writers gather too much and then include it all.\n\nIdea 2: Evidence that matters is evidence that would change the reader's mind if they didn't have it. The test is subtraction: does the argument collapse without this?",
                prompt: "Write the transition. The echo word should be why the transition works, not just a repetition. 35–90 words.",
              },
              {
                given: "Idea 1: The best editors don't fix your writing — they show you where the writing is avoiding something. The avoidance is almost always the interesting thing.\n\nIdea 2: Interesting things in writing are usually uncomfortable things. The sentence that makes the writer stop and reconsider is usually the one that needed to be written.",
                prompt: "Use the echo to bridge these ideas. The repeated word should be the connection, not just an overlap. 35–90 words.",
              },
              {
                given: "Idea 1: Specialization makes you more valuable in a narrow band and more vulnerable everywhere else. The depth that makes you excellent also makes you fragile.\n\nIdea 2: Fragility in a career is only a problem if the narrow band disappears. Most specialists spend their careers hoping it won't.",
                prompt: "Write the transition using an echo where the repeated word is doing structural work — it's why the ideas belong together. 35–90 words.",
              },
            ],
          },
          {
            label: "Natural and structural",
            passThreshold: 75,
            wordCountMin: 40,
            wordCountMax: 100,
            criteria: [
              { name: "Echo is structurally necessary", description: "The repeated word is what makes the transition work — the connection depends on it.", weight: 0.4 },
              { name: "Completely natural", description: "A reader wouldn't identify this as a technique — it sounds like fluent thinking.", weight: 0.4 },
              { name: "Tighter than alternatives", description: "This transition is better than what a connector word would produce.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Idea 1: What we call 'original' thinking is usually recombination — taking things from different domains and noticing that they apply somewhere new. The originality is in the noticing, not the elements.\n\nIdea 2: Noticing is a skill that gets stronger with practice and weaker with speed. You have to slow down enough to see what's in front of you, which is harder than it sounds.",
                prompt: "Write the transition. The echo should be structurally necessary and completely natural. A reader shouldn't feel the technique. 40–100 words.",
              },
              {
                given: "Idea 1: Titles are strange — they compress an entire relationship into a word. 'Manager' or 'Director' or 'Lead' carries meaning that wasn't negotiated, only conferred.\n\nIdea 2: Conferred meaning tends to decay. The title means less over time unless the work behind it keeps giving it content.",
                prompt: "Use the echo technique. Make it structural and invisible. 40–100 words.",
              },
              {
                given: "Idea 1: The places we do our best thinking are rarely the places designated for thinking. The shower, the walk, the commute — the thinking happens in the margins.\n\nIdea 2: Margins are being optimized away. Every gap is being filled with content, with productivity, with something. The space where thinking used to happen has been colonized.",
                prompt: "Write the transition using an echo that is both structurally necessary and completely natural — the seam between the ideas disappears. 40–100 words.",
              },
              {
                given: "Idea 1: The problem with most writing advice is that it's delivered at the level of the sentence when the real problem is at the level of the argument. Fix the sentences and the piece still fails; fix the argument and the sentences often fix themselves.\n\nIdea 2: Arguments fail for different reasons than sentences. A sentence fails when it's unclear. An argument fails when it doesn't take seriously the person it's trying to persuade.",
                prompt: "Bridge these ideas with an echo that is invisible and structural. The technique should disappear into the prose. 40–100 words.",
              },
              {
                given: "Idea 1: The people who are most afraid of being seen as arrogant often compensate in ways that are more off-putting than arrogance itself — constant hedging, excessive deference, refusal to take a stand.\n\nIdea 2: Taking a stand is the thing most people want from the people they look up to. The refusal to do it is not humility — it's a different kind of self-protection.",
                prompt: "Write the echo transition. Make it structurally necessary and sound completely natural. 40–100 words.",
              },
            ],
          },
        ],
      },

      {
        id: "tr-3",
        title: "The Pivot",
        lesson:
          "Moving from one idea to a contrasting one is where most writers reach for 'however' or 'but.' These work in conversation but feel lazy on the page. A pivot earns the turn by showing what the two contrasting ideas share — their common ground — and then making the contrast visible from there. You move toward the contrast, not away from the first idea.",
        prompt: "Write a transition that pivots to a contrasting idea without using 'however,' 'but,' or 'on the other hand.'",
        wordCountMin: 25,
        wordCountMax: 90,
        criteria: [
          { name: "No 'however' or 'but'", description: "The pivot doesn't use 'however,' 'but,' 'yet,' 'on the other hand,' or similar contrast words.", weight: 0.35 },
          { name: "Contrast is earned", description: "The transition shows why the contrasting idea belongs here — the pivot is motivated, not just announced.", weight: 0.4 },
          { name: "Common ground is visible", description: "The transition reveals what the two contrasting ideas share before or as it shows where they differ.", weight: 0.25 },
        ],
        stages: [
          {
            label: "Earn the turn",
            passThreshold: 50,
            wordCountMin: 25,
            wordCountMax: 80,
            criteria: [
              { name: "No contrast words", description: "The pivot doesn't use 'however,' 'but,' 'yet,' 'although,' or 'on the other hand.'", weight: 0.4 },
              { name: "Contrast is present", description: "The reader understands that the argument has turned — a contrasting idea has been introduced.", weight: 0.4 },
              { name: "The turn is motivated", description: "The contrast doesn't appear from nowhere — there's a reason the reader is being taken to the other side.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Idea 1: People who read widely tend to be better conversationalists. They have more to draw on, more unexpected connections, more ways of framing what someone else is saying.\n\nContrasting idea: Heavy readers are sometimes the worst conversationalists — too quick to map what you're saying onto something they've already read, too eager to surface the reference.",
                prompt: "Write a pivot from the first idea to the contrasting one without using 'however,' 'but,' 'yet,' or 'on the other hand.' Earn the turn. 25–80 words.",
              },
              {
                given: "Idea 1: Clear writing usually reflects clear thinking. When a sentence is hard to follow, the thought behind it is usually hard to follow too.\n\nContrasting idea: Some of the most interesting thinking is genuinely difficult to render clearly — not because it's confused, but because it's complex in ways that resist simplification.",
                prompt: "Pivot to the contrasting idea without contrast words. Show why the turn is earned. 25–80 words.",
              },
              {
                given: "Idea 1: Remote work gave people more autonomy over their time and most of them used it well — they worked more hours, not fewer, and reported higher satisfaction.\n\nContrasting idea: The people who used it worst were the people who most needed the structure that an office provides. For them, autonomy was the problem, not the solution.",
                prompt: "Write the pivot without 'however,' 'but,' or 'yet.' Earn the contrast. 25–80 words.",
              },
              {
                given: "Idea 1: Specificity in writing is almost always better than generality. The concrete detail does more work than the abstract claim.\n\nContrasting idea: There are arguments that need to be made at the level of principle, and specificity can undermine them — turning an argument about systems into an argument about one case.",
                prompt: "Pivot to the contrasting idea without contrast words. The turn should be motivated, not just announced. 25–80 words.",
              },
              {
                given: "Idea 1: The people who get the most done tend to be the ones who protect their time most aggressively — they say no, they block their calendar, they're unavailable.\n\nContrasting idea: The people who seem to get the most done are sometimes just the ones most willing to make their effort visible. The correlation between productivity and protectiveness might run the other way.",
                prompt: "Write the pivot without 'however,' 'but,' or 'yet.' Earn the turn. 25–80 words.",
              },
            ],
          },
          {
            label: "Show the common ground first",
            passThreshold: 65,
            wordCountMin: 30,
            wordCountMax: 85,
            criteria: [
              { name: "Common ground is shown", description: "The transition reveals what the two ideas share before or as the contrast appears.", weight: 0.4 },
              { name: "No contrast words", description: "No 'however,' 'but,' 'yet,' 'although,' 'on the other hand.'", weight: 0.3 },
              { name: "Contrast feels inevitable", description: "By the time the contrasting idea appears, the reader feels it was always going to arrive.", weight: 0.3 },
            ],
            variants: [
              {
                given: "Idea 1: Editors who make writers feel good about their work often get better drafts — not because writers need encouragement, but because they stop hiding their real ideas.\n\nContrasting idea: Editors who make writers feel too comfortable get lazy drafts. The slight anxiety of showing something to someone who might not like it is what makes writers prepare.",
                prompt: "Write the pivot showing common ground first — what both ideas agree on — before the contrast appears. No contrast words. 30–85 words.",
              },
              {
                given: "Idea 1: The case for specialization is strong: specialists know more, earn more, and solve harder problems than generalists in their domain.\n\nContrasting idea: The case against specialization is also strong: specialists are fragile, they can't see outside their frame, and the most interesting problems sit between domains.",
                prompt: "Write the pivot that shows what both sides share before revealing the contrast. No 'however' or 'but.' 30–85 words.",
              },
              {
                given: "Idea 1: Transparency in organizations builds trust. When people understand the reasoning behind decisions, they're more likely to accept them even when they disagree.\n\nContrasting idea: Too much transparency creates paralysis. When everyone knows everything, every decision becomes a negotiation, and the people with the most time to argue have the most influence.",
                prompt: "Pivot from one to the other by showing first what they share. No contrast words. 30–85 words.",
              },
              {
                given: "Idea 1: Learning in public accelerates growth — the feedback, the accountability, and the conversations you wouldn't have had otherwise more than compensate for the embarrassment of being a beginner.\n\nContrasting idea: Learning in public also changes what you learn. You start optimizing for legibility rather than understanding — for the explanation, not the thing.",
                prompt: "Write the pivot showing common ground before the contrast. No 'however,' 'but,' or similar. 30–85 words.",
              },
              {
                given: "Idea 1: Long-form writing makes arguments that short-form can't — it has the space to build context, acknowledge complexity, and earn its conclusions.\n\nContrasting idea: Most long-form writing uses its length to avoid commitment. The essay that takes 5,000 words to say something a good paragraph could say is not more rigorous — it's less.",
                prompt: "Write the pivot from one idea to the contrasting one, showing first what they agree on. No contrast words. 30–85 words.",
              },
            ],
          },
          {
            label: "The contrast feels earned",
            passThreshold: 75,
            wordCountMin: 35,
            wordCountMax: 90,
            criteria: [
              { name: "Contrast is fully earned", description: "The pivot reveals the contrast as a natural consequence of thinking deeply about the first idea — not as an opposition imposed from outside.", weight: 0.45 },
              { name: "No contrast words anywhere", description: "The pivot contains no 'however,' 'but,' 'yet,' 'although,' 'still,' 'on the other hand,' or similar.", weight: 0.3 },
              { name: "The two ideas need each other", description: "After the pivot, the reader feels both ideas are stronger for being placed in contrast — the tension is generative.", weight: 0.25 },
            ],
            variants: [
              {
                given: "Idea 1: Writing about your own experience gives your work authority that secondhand sources can't. You were there. You know what it felt like from the inside.\n\nContrasting idea: Writing about your own experience also limits you in ways that secondhand research doesn't. You only know what it felt like from the inside, which is exactly one perspective.",
                prompt: "Write a pivot where the contrast is completely earned — it grows out of the first idea rather than being imposed on it. No contrast words anywhere. 35–90 words.",
              },
              {
                given: "Idea 1: The pressure to have a 'take' on everything has produced more opinion writing than ever — and more opinion writers who can produce a take on anything faster than they can think about it.\n\nContrasting idea: The problem isn't the takes — it's the speed. Given enough time, most good writers can have a good take. The speed requirement filters for something else.",
                prompt: "Write the pivot so the contrast feels like a consequence of the first idea, not an opposition. No contrast words. 35–90 words.",
              },
              {
                given: "Idea 1: Vulnerability in writing — admitting uncertainty, showing the seams — makes the reader trust the writer more. It signals that the writer isn't performing certainty they don't have.\n\nContrasting idea: Performed vulnerability is now a genre. The essay that leads with its wounds has become a formula, and readers can feel the difference between real uncertainty and uncertainty used as a device.",
                prompt: "Write the pivot where the contrast grows naturally from the first idea. No contrast words anywhere in the transition. 35–90 words.",
              },
              {
                given: "Idea 1: Deadlines improve writing. The constraint forces decision-making — you stop looking for the perfect word and use the good one.\n\nContrasting idea: Deadlines also damage writing in a specific way. They train writers to stop before the work is actually finished, and after enough deadlines, stopping before finished starts to feel like finished.",
                prompt: "Write the pivot where the contrast is completely earned — a reader feels it was implied in the first idea. No contrast words. 35–90 words.",
              },
              {
                given: "Idea 1: The best interviews feel like conversations — the subject forgets they're being recorded and says the thing they'd never say in a prepared statement.\n\nContrasting idea: The conversation that makes someone forget they're being recorded also makes them say things they didn't mean to say, didn't have time to think through, and will regret.",
                prompt: "Write the pivot so the contrast emerges from the first idea as its natural complication. No contrast words anywhere. 35–90 words.",
              },
            ],
          },
        ],
      },

      {
        id: "tr-4",
        title: "The Bridge Sentence",
        lesson:
          "Some transitions require a single sentence that does two jobs simultaneously: close the idea before it and open the idea after it. This sentence belongs to both paragraphs at once. It's the hardest kind of transition to write and the most invisible when done right. The reader doesn't notice it. They just feel the essay moving.",
        prompt: "Write one sentence that closes one idea and opens the next simultaneously.",
        wordCountMin: 30,
        wordCountMax: 90,
        criteria: [
          { name: "Closes the first idea", description: "The bridge sentence brings the previous idea to a point of rest.", weight: 0.35 },
          { name: "Opens the next idea", description: "The bridge sentence creates a forward pull — the reader wants to know what comes next.", weight: 0.35 },
          { name: "Does both in one sentence", description: "A single sentence carries both functions simultaneously — it belongs to both paragraphs.", weight: 0.3 },
        ],
        stages: [
          {
            label: "Write the bridge",
            passThreshold: 50,
            wordCountMin: 30,
            wordCountMax: 80,
            criteria: [
              { name: "Both functions attempted", description: "The bridge sentence tries to close what came before and open what comes next.", weight: 0.5 },
              { name: "One sentence", description: "The bridge is a single sentence, not a paragraph.", weight: 0.3 },
              { name: "Creates forward pull", description: "After the bridge, the reader wants to keep going.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Paragraph 1 ends with: ...and this is why most advice about how to be more creative is advice about how to feel more comfortable, not how to actually produce different work.\n\nParagraph 2 begins with: The difference between comfort and output is the difference that most creative advice papers over...",
                prompt: "Write one sentence that could stand between these two paragraphs — closing the first idea and opening the second. Include a sentence of context before and after your bridge so we can see it working. 30–80 words total.",
              },
              {
                given: "Paragraph 1 ends with: ...which is why the people who are best at managing others are almost never the ones most visibly in charge.\n\nParagraph 2 begins with: What visible leadership does instead is something different from management...",
                prompt: "Write one bridge sentence between these paragraphs — it closes the first and opens the second. Include a little context around it. 30–80 words total.",
              },
              {
                given: "Paragraph 1 ends with: ...and so the meeting ends without a decision, and everyone files out knowing that the next meeting will begin the same way.\n\nParagraph 2 begins with: What keeps this cycle going is not stupidity but incentives...",
                prompt: "Write the bridge sentence between these two paragraphs. One sentence that closes one and opens the other. Show it in context. 30–80 words total.",
              },
              {
                given: "Paragraph 1 ends with: ...and this explains why the most experienced people in a room are often the last to propose an unconventional solution.\n\nParagraph 2 begins with: Unconventional solutions have a cost that only people who've paid it fully understand...",
                prompt: "Write one bridge sentence that belongs to both paragraphs — closing the first and opening the second. 30–80 words including context.",
              },
              {
                given: "Paragraph 1 ends with: ...so the essay that reads well is usually not the essay as first written, but the essay that survived a writer willing to throw away what didn't work.\n\nParagraph 2 begins with: Throwing things away requires a specific kind of detachment from your own work...",
                prompt: "Write the bridge sentence. One sentence that closes paragraph 1 and opens paragraph 2. Show it in context. 30–80 words total.",
              },
            ],
          },
          {
            label: "One sentence, two jobs",
            passThreshold: 65,
            wordCountMin: 35,
            wordCountMax: 85,
            criteria: [
              { name: "Closes and opens simultaneously", description: "The sentence performs both functions at once — it is neither purely closing nor purely opening.", weight: 0.5 },
              { name: "Could belong to either paragraph", description: "You could attach the bridge sentence to the end of the previous paragraph or the beginning of the next — it belongs to both.", weight: 0.3 },
              { name: "Creates momentum", description: "The bridge sentence doesn't just connect — it accelerates the reader into what comes next.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Paragraph 1 ends with: ...which is what makes the advice to 'just start' so frustrating — it skips over the part where you have to know what you're starting.\n\nParagraph 2 begins with: Knowing what you're starting is the problem that most productivity frameworks are designed to avoid...",
                prompt: "Write one bridge sentence that simultaneously closes the first paragraph and opens the second. It should feel like it could belong to either paragraph. Show it in context. 35–85 words.",
              },
              {
                given: "Paragraph 1 ends with: ...and the people who stay in those jobs longest are not the ones who most believe in the company — they're the ones who have the fewest options.\n\nParagraph 2 begins with: Options are what loyalty-building programs are really designed to eliminate...",
                prompt: "Write the bridge sentence that does both jobs simultaneously. Include context. 35–85 words.",
              },
              {
                given: "Paragraph 1 ends with: ...so the feedback that lands is not always the most accurate feedback, but the feedback delivered by someone the recipient trusts.\n\nParagraph 2 begins with: Trust takes time that most feedback processes don't budget for...",
                prompt: "Write one sentence that closes the first and opens the second simultaneously — belonging to both. 35–85 words with context.",
              },
              {
                given: "Paragraph 1 ends with: ...which is why the organizations that are best at admitting mistakes are also usually the ones that make fewer of them.\n\nParagraph 2 begins with: Fewer mistakes is not the goal that drives most organizational behavior...",
                prompt: "Write the bridge sentence. One sentence, two jobs. Show it in context. 35–85 words.",
              },
              {
                given: "Paragraph 1 ends with: ...and so the writer who publishes regularly is not the one with the most to say, but the one with the lowest threshold for what counts as ready.\n\nParagraph 2 begins with: The threshold for ready is almost always set by fear, not quality...",
                prompt: "Write one bridge sentence that belongs to both paragraphs simultaneously. Context included. 35–85 words.",
              },
            ],
          },
          {
            label: "Invisible and inevitable",
            passThreshold: 75,
            wordCountMin: 40,
            wordCountMax: 90,
            criteria: [
              { name: "Bridge is invisible", description: "A reader moving through the prose doesn't notice the bridge — they just feel the argument moving forward.", weight: 0.4 },
              { name: "Both jobs done perfectly", description: "The sentence closes the first idea with precision and opens the second with pull.", weight: 0.4 },
              { name: "Feels inevitable", description: "After reading it, the reader can't imagine a different bridge — this is the only sentence that could go here.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Paragraph 1 ends with: ...and the clarity that comes from writing it down is not the same as understanding — it's the feeling of understanding, which is close enough to be dangerous.\n\nParagraph 2 begins with: The danger in feeling like you understand something is that it removes the pressure to keep questioning it...",
                prompt: "Write a bridge sentence so invisible and inevitable that the reader can't feel the seam. Show it in context. 40–90 words.",
              },
              {
                given: "Paragraph 1 ends with: ...which is why the best managers often look like they're doing nothing — because what they're doing is creating the conditions for everyone else to do something.\n\nParagraph 2 begins with: Creating conditions is the hardest work to make visible, which is also why it's the most undersupported...",
                prompt: "Write the invisible bridge sentence. It should feel like the only sentence that could go here. 40–90 words with context.",
              },
              {
                given: "Paragraph 1 ends with: ...so the problem with most writing about productivity is not that it's wrong — it's that it addresses a symptom while ignoring the diagnosis.\n\nParagraph 2 begins with: The diagnosis, if you're willing to make it, is almost never about productivity at all...",
                prompt: "Write the bridge sentence that is invisible and inevitable — it closes and opens simultaneously, and the reader doesn't feel the seam. 40–90 words with context.",
              },
              {
                given: "Paragraph 1 ends with: ...and the people who left during the Great Resignation were not necessarily looking for better jobs — they were looking for proof that better jobs were possible.\n\nParagraph 2 begins with: Proof is a strange thing to go looking for in a labor market...",
                prompt: "Write the bridge sentence. Invisible. Inevitable. Both jobs done. Show it in context. 40–90 words.",
              },
              {
                given: "Paragraph 1 ends with: ...which is why the first version of any argument is almost always an argument with yourself, and not a very interesting one.\n\nParagraph 2 begins with: The interesting argument starts when you let the other side be as smart as you are...",
                prompt: "Write the bridge sentence that closes and opens simultaneously, so smoothly the reader can't feel the transition. 40–90 words with context.",
              },
            ],
          },
        ],
      },

      {
        id: "tr-5",
        title: "Three Ideas in Flow",
        lesson:
          "A transition isn't just between two ideas — it's a chain. Three ideas in sequence means two transitions, and they can't use the same technique. Vary them. The rhythm of an essay is built from these invisible moments. When they work, the reader feels the essay moving on its own. When they don't, the reader feels every seam.",
        prompt: "Write three connected ideas with two earned transitions between them — vary the technique for each.",
        wordCountMin: 100,
        wordCountMax: 200,
        criteria: [
          { name: "Three ideas are present", description: "The writing contains three distinct ideas, each with its own substance.", weight: 0.25 },
          { name: "Two transitions are earned", description: "Both transitions show how ideas are connected — neither uses connector words or announces the relationship.", weight: 0.45 },
          { name: "Techniques vary", description: "The two transitions use different methods — they don't both echo, or both pivot, or both use the same approach.", weight: 0.3 },
        ],
        stages: [
          {
            label: "Get three ideas connected",
            passThreshold: 50,
            wordCountMin: 100,
            wordCountMax: 180,
            criteria: [
              { name: "Three ideas present", description: "There are three distinct ideas, each doing something.", weight: 0.3 },
              { name: "Both transitions connect", description: "The reader can follow from one idea to the next — the connections exist.", weight: 0.4 },
              { name: "No major seams", description: "The transitions aren't jarring — the reader doesn't feel thrown.", weight: 0.3 },
            ],
            variants: [
              { prompt: "Write three connected ideas about how people handle being wrong — about the first reaction, what happens next, and what it reveals about them. Two transitions, both earned. 100–180 words." },
              { prompt: "Write three connected ideas about how the way someone talks about their job reveals their relationship to it. Three ideas, two transitions, no connector words. 100–180 words." },
              { prompt: "Write three connected ideas about what makes feedback useful or useless. Each idea builds on the last. Earn both transitions. 100–180 words." },
              { prompt: "Write three connected ideas about how expertise changes the way you read — what you notice, what you miss, and what you wish you could see again for the first time. Two earned transitions. 100–180 words." },
              { prompt: "Write three connected ideas about the relationship between speed and quality in writing — a first idea, a complication, and where you land. Both transitions earned. 100–180 words." },
            ],
          },
          {
            label: "Vary the technique",
            passThreshold: 65,
            wordCountMin: 110,
            wordCountMax: 190,
            criteria: [
              { name: "Different techniques used", description: "The two transitions use noticeably different methods — one might echo, one might pivot, or one might bridge while the other shows common ground.", weight: 0.45 },
              { name: "Both transitions are earned", description: "Neither transition uses connector words — both show the connection.", weight: 0.35 },
              { name: "Three ideas each have substance", description: "Each of the three ideas is worth something — none is a placeholder.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write three connected ideas about how the best writing advice is almost always too simple to be useful and too true to ignore. Use two different transition techniques — don't repeat yourself. 110–190 words." },
              { prompt: "Write three connected ideas about what changes when someone gains real authority — how they speak, what they notice, what they stop noticing. Two transitions, two different techniques. 110–190 words." },
              { prompt: "Write three connected ideas about the gap between what people say they want from work and what they actually want. Each transition uses a different technique. 110–190 words." },
              { prompt: "Write three connected ideas about what makes a piece of nonfiction feel alive rather than competent. Vary your transition techniques between idea 1→2 and idea 2→3. 110–190 words." },
              { prompt: "Write three connected ideas about how institutions talk about change versus how they actually handle it. Two earned transitions, two different techniques. 110–190 words." },
            ],
          },
          {
            label: "The chain holds",
            passThreshold: 75,
            wordCountMin: 120,
            wordCountMax: 200,
            criteria: [
              { name: "Chain is seamless", description: "The three ideas flow as one continuous piece of thinking — the reader doesn't feel the transitions at all.", weight: 0.4 },
              { name: "Techniques are distinct and appropriate", description: "Each transition uses a different technique that is the right technique for that particular move.", weight: 0.35 },
              { name: "Ideas earn each other", description: "Each idea is stronger for what came before it — the sequence creates something that couldn't exist in isolation.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write three connected ideas — each earning the next — about what happens to someone's relationship with an opinion once they've argued for it publicly. The chain should be seamless. Two distinct transitions, both invisible. 120–200 words." },
              { prompt: "Write three connected ideas about the difference between being persuaded and being convinced — and what that difference reveals about how arguments actually work. Seamless chain. Varied, invisible transitions. 120–200 words." },
              { prompt: "Write three connected ideas about what the best writers you've read have in common — not technique, but disposition. The chain should hold completely. Two transitions, two different techniques, both invisible. 120–200 words." },
              { prompt: "Write three connected ideas about how ambition changes as people age — not necessarily diminishes, but transforms. Seamless. Each idea earns the next. Varied transitions. 120–200 words." },
              { prompt: "Write three connected ideas about what gets lost when writing is optimized for search engines or social sharing. The chain should be tight — three ideas that need each other, two transitions that disappear. 120–200 words." },
            ],
          },
        ],
      },

      {
        id: "tr-6",
        title: "Rescue the Clunky Transition",
        lesson:
          "'However, it is also important to note that...' is a placeholder. It reserves the space while you figure out what the connection actually is. Rescuing a clunky transition means finding the real connection and writing it directly. The goal isn't to replace the connector word — it's to discover what you were actually trying to say between those two ideas.",
        prompt: "Take a clunky, labeled transition and rewrite it until it disappears into the prose.",
        wordCountMin: 40,
        wordCountMax: 120,
        criteria: [
          { name: "Connector words removed", description: "The rewritten transition contains no 'however,' 'furthermore,' 'additionally,' 'in conclusion,' or similar.", weight: 0.3 },
          { name: "Real connection found", description: "The rewrite reveals what the two ideas actually have in common or how they actually relate.", weight: 0.5 },
          { name: "Reads better than the original", description: "The rewritten transition is clearer, more natural, and more accurate than the clunky version.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Find the real connection",
            passThreshold: 50,
            wordCountMin: 40,
            wordCountMax: 100,
            criteria: [
              { name: "Connector words gone", description: "The rewrite removes the labeled transition words.", weight: 0.3 },
              { name: "Something is connecting the ideas", description: "The reader can follow from one idea to the next — even if the connection is rough.", weight: 0.4 },
              { name: "Better than the original", description: "The rewrite is an improvement on the clunky version.", weight: 0.3 },
            ],
            variants: [
              {
                given: "Original transition: 'Furthermore, it is also important to note that on the other hand, there are many perspectives to consider regarding this issue. In conclusion, this demonstrates that experts and non-experts alike have valid viewpoints.'\n\nContext: The paragraph before argues that expertise is real and valuable. The paragraph after argues that experts routinely overestimate how much they understand about adjacent fields.",
                prompt: "Rewrite this clunky transition. Find the real connection between the two ideas and write it directly. Remove all connector words. 40–100 words.",
              },
              {
                given: "Original transition: 'However, it should also be noted that this is not always the case. Additionally, there are many other factors to consider. Moreover, the situation is more complex than it first appears.'\n\nContext: The paragraph before argues that remote workers are more productive. The paragraph after argues that the productivity gains disappear for work that requires spontaneous collaboration.",
                prompt: "Rescue this transition. Find what actually connects these two ideas and write it. No connector words. 40–100 words.",
              },
              {
                given: "Original transition: 'On the other hand, we must also consider the flip side of this argument. Furthermore, the opposite perspective has merit as well. In addition, both sides have valid points to make.'\n\nContext: The paragraph before argues that feedback culture has made people better at receiving criticism. The paragraph after argues that it has also made people better at performing receptivity without actually changing anything.",
                prompt: "Rescue this transition. What is the real relationship between these two ideas? Write it directly, without connector words. 40–100 words.",
              },
              {
                given: "Original transition: 'However, there is another way to look at this. Additionally, many experts disagree. Furthermore, the evidence is more nuanced than initially presented.'\n\nContext: The paragraph before argues that open-plan offices hurt individual productivity. The paragraph after argues that individual productivity is the wrong metric for evaluating workspaces.",
                prompt: "Rewrite this transition by finding and writing the actual connection between the two ideas. No connector words. 40–100 words.",
              },
              {
                given: "Original transition: 'In conclusion, this shows that the issue is complex. Moreover, it is also worth noting that other factors play a role. Furthermore, a more holistic view is necessary.'\n\nContext: The paragraph before argues that people underestimate how much their environment shapes their behavior. The paragraph after argues that this insight is most useful not for changing yourself but for choosing your environment more carefully.",
                prompt: "Find the real connection and write it. No placeholder language, no connector words. Better than the original. 40–100 words.",
              },
            ],
          },
          {
            label: "Write the actual thought",
            passThreshold: 65,
            wordCountMin: 45,
            wordCountMax: 110,
            criteria: [
              { name: "The actual thought is on the page", description: "The rewrite says what the clunky transition was trying to say — but directly, without placeholders.", weight: 0.5 },
              { name: "No connector words", description: "No 'however,' 'furthermore,' 'additionally,' 'in conclusion,' or similar anywhere in the transition.", weight: 0.3 },
              { name: "Reads as prose, not machinery", description: "The rewritten transition reads as natural writing, not a filled-in template.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Original: 'However, it is also important to consider the other side. Furthermore, this nuance is often overlooked. In addition, the full picture is more complex.'\n\nContext: Before: most people who say they want feedback actually want validation. After: this doesn't mean feedback is useless — it means the request for feedback and the ability to use it are different skills.",
                prompt: "Write the actual thought that connects these two ideas. No placeholders. No connector words. Just the real transition. 45–110 words.",
              },
              {
                given: "Original: 'On the other hand, we should not be too hasty in our conclusions. Moreover, there are many ways to interpret this data. Additionally, context matters greatly.'\n\nContext: Before: the companies that grew fastest in the last decade often had the worst long-term outcomes for employees. After: this pattern wasn't invisible to the people working there — it was a trade they were willing to make.",
                prompt: "Rescue this. Write the actual relationship between these two ideas, directly and without connector words. 45–110 words.",
              },
              {
                given: "Original: 'Furthermore, it is worth noting that this raises important questions. In addition, the implications are significant. Moreover, further study is needed.'\n\nContext: Before: the best managers rarely look like they're managing. After: this makes management almost impossible to evaluate from the outside, which is why most organizations promote for the wrong things.",
                prompt: "Write the actual thought between these two ideas. No placeholder language. No connector words. Direct. 45–110 words.",
              },
              {
                given: "Original: 'However, the opposite can also be true. Additionally, this depends on many factors. Furthermore, both approaches have merit in different situations.'\n\nContext: Before: writers who publish often build larger audiences faster. After: writers who publish rarely but carefully have a much higher conversion rate when they do publish — the scarcity does real work.",
                prompt: "Find the actual connection between these ideas and write it directly. No connector words anywhere. 45–110 words.",
              },
              {
                given: "Original: 'In conclusion, this demonstrates the complexity of the issue. Moreover, there are no easy answers. Additionally, we must consider all perspectives before drawing conclusions.'\n\nContext: Before: the pressure to have an opinion on everything has made most people's opinions on anything worse. After: this is not an argument for having fewer opinions — it's an argument for protecting the conditions under which good opinions can form.",
                prompt: "Write the real transition between these ideas — what they actually have to do with each other. No connector words. No placeholder language. 45–110 words.",
              },
            ],
          },
          {
            label: "Disappears into prose",
            passThreshold: 75,
            wordCountMin: 50,
            wordCountMax: 120,
            criteria: [
              { name: "Transition is invisible", description: "The rewritten transition doesn't call attention to itself — the reader moves through it without noticing.", weight: 0.4 },
              { name: "Real connection is precise", description: "The transition doesn't just connect the ideas — it connects them at exactly the right point.", weight: 0.4 },
              { name: "Better by every measure", description: "The rewrite is clearer, more natural, and more accurate than the clunky original in every way.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Original: 'However, there is another dimension to this problem that deserves attention. Furthermore, the implications of this should not be underestimated. Moreover, this adds another layer of complexity to the issue at hand.'\n\nContext: Before: the most interesting arguments are the ones where you're not sure you're right. After: this uncertainty is not a weakness in the argument — it's what makes the reader trust it.",
                prompt: "Rewrite this transition so it disappears into the prose. The reader shouldn't feel it. The real connection should be precise, not just present. 50–120 words.",
              },
              {
                given: "Original: 'On the other hand, we must also acknowledge that the situation is more nuanced. In addition, there are counterarguments worth considering. Furthermore, a balanced view is necessary for a complete understanding.'\n\nContext: Before: cities that become 'hot' quickly often lose what made them interesting. After: this pattern is not accidental — the things that make a place interesting are almost always things that can't survive being expensive.",
                prompt: "Rescue this transition. Make it invisible. Make the real connection precise. Better by every measure. 50–120 words.",
              },
              {
                given: "Original: 'However, it should also be noted that this is not always the case in every situation. Additionally, context and circumstances play an important role. In conclusion, a more nuanced approach is warranted.'\n\nContext: Before: writing quickly produces more usable ideas than writing slowly. After: the ideas produced quickly are raw material — they need the slow work to become anything.",
                prompt: "Write the real transition between these ideas so it disappears. Precise. Invisible. Better in every way than the original. 50–120 words.",
              },
              {
                given: "Original: 'Furthermore, this raises important questions about the nature of the phenomenon. In addition, these questions have significant implications. Moreover, they deserve more attention than they typically receive.'\n\nContext: Before: the ability to sound confident about things you don't fully understand is a valuable professional skill. After: it becomes a liability the moment you're in a room with someone who does understand.",
                prompt: "Rewrite this clunky transition into something invisible and precise. The connection should be exact, not approximate. 50–120 words.",
              },
              {
                given: "Original: 'However, we should not overlook the other side of this argument. Additionally, the counterargument has merit. Furthermore, taking a more balanced view allows us to see the full picture.'\n\nContext: Before: most people's creative blocks are not about running out of ideas — they're about not trusting the ideas they have. After: the way to build that trust is not by having better ideas — it's by shipping worse ones until the judgment calibrates.",
                prompt: "Write the real transition so it completely disappears into the prose. Precise connection, invisible execution, better by every measure. 50–120 words.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ── THE ENDING ───────────────────────────────────────────────────────────

  {
    id: "the-ending",
    title: "The Ending",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "Most essays don't end — they stop. Or they recap everything the reader just read. A good ending earns its place by doing something the body couldn't: opening the idea out, landing the final weight, or leaving the reader somewhere new. Six exercises on the hardest sentence in nonfiction.",
    exercises: [
      {
        id: "end-1",
        title: "Don't Summarize",
        lesson:
          "The reflex at the end of an essay is to recap what you've said. Resist it. The reader was there — summarizing insults their attention and adds words without adding thought. An ending has to earn its place by doing something the body couldn't: open the idea out, land the final weight, or leave the reader somewhere new.",
        prompt: "Write a closing paragraph for an essay that doesn't summarize anything from the body.",
        wordCountMin: 70,
        wordCountMax: 140,
        criteria: [
          { name: "Doesn't summarize", description: "The ending doesn't recap or restate points from the body.", weight: 0.4 },
          { name: "Does something new", description: "The ending adds something beyond what the body established.", weight: 0.4 },
          { name: "Last sentence lands", description: "The final sentence doesn't trail off — it arrives somewhere.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Just try to end it",
            passThreshold: 50,
            wordCountMin: 70,
            wordCountMax: 120,
            criteria: [
              { name: "Doesn't summarize", description: "The ending doesn't restate or recap what came before.", weight: 0.5 },
              { name: "Ends on something", description: "The ending arrives at an observation, image, or thought — rather than trailing off.", weight: 0.3 },
              { name: "Has a real last sentence", description: "The last sentence feels intentional, not like an unfinished thought.", weight: 0.2 },
            ],
            variants: [
              { prompt: "You've just finished an essay arguing that most productivity advice makes people less productive. Write the closing paragraph. Don't summarize. Don't tell the reader what to do. Just end it. 70–120 words." },
              { prompt: "You've just finished an essay arguing that expertise makes people worse at explaining what they know. Write the closing paragraph. Don't recap your points. End somewhere. 70–120 words." },
              { prompt: "You've just finished an essay about why people stay in jobs they've outgrown. Write the closing paragraph — not a summary, not a call to action. A real ending. 70–120 words." },
              { prompt: "You've just finished an essay about how advice is almost always autobiographical and often useless to the person receiving it. Write the closing paragraph without summarizing or moralizing. 70–120 words." },
              { prompt: "You've just finished an essay arguing that the cities people choose to live in reveal something true about them. Write the closing paragraph. No recap. No prescription. 70–120 words." },
            ],
          },
          {
            label: "No looking back",
            passThreshold: 65,
            wordCountMin: 70,
            wordCountMax: 120,
            criteria: [
              { name: "Stands alone", description: "The ending doesn't depend on the body — it closes the idea on its own terms without referencing earlier points.", weight: 0.4 },
              { name: "Moves the idea forward", description: "The ending opens the argument outward or deepens it rather than restating it.", weight: 0.4 },
              { name: "Arrives somewhere specific", description: "The ending lands on a particular observation or image, not a generality.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a closing paragraph for an essay about how we overestimate how much our opinions will change over time. The ending can't reference any point from the body — it closes the idea on its own terms. 70–120 words." },
              { prompt: "Write a closing paragraph for an essay about why people with the least experience often give advice most confidently. Don't look back at the argument — just close it. 70–120 words." },
              { prompt: "Write a closing paragraph for an essay about how institutions outlive their original purpose. No recap, no call to action. The ending earns its place on its own. 70–120 words." },
              { prompt: "Write a closing paragraph for an essay about how people underestimate how much their environment shapes their thinking. Nothing from the body — close the idea independently. 70–120 words." },
              { prompt: "Write a closing paragraph for an essay about why most people's 'five-year plan' is fiction they tell themselves. No recap. End somewhere real. 70–120 words." },
            ],
          },
          {
            label: "Do what the body couldn't",
            passThreshold: 75,
            wordCountMin: 80,
            wordCountMax: 140,
            criteria: [
              { name: "Contributes something new", description: "The ending does work the body couldn't — opens a larger frame, drops a heavier weight, or reveals a complication the argument couldn't contain.", weight: 0.4 },
              { name: "No summary, no moral", description: "The ending doesn't recap or tell the reader what to think.", weight: 0.35 },
              { name: "Last sentence is the right one", description: "The piece ends where it should — not because the writer ran out, but because this is the right note to stop on.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write the closing paragraph of an essay arguing that ambition and contentment are less compatible than we pretend. The ending should do something the argument couldn't — open it up, complicate it, or land somewhere the body was building toward without knowing it. 80–140 words." },
              { prompt: "Write the closing paragraph of an essay about how social media changed what it means to have a private thought. Don't summarize. Don't moralize. Do something the body couldn't. 80–140 words." },
              { prompt: "Write the closing paragraph of an essay about how we've made busyness a status symbol. Leave the reader with something to carry — not a verdict, not a recap. 80–140 words." },
              { prompt: "Write the closing paragraph of an essay about why people read fewer books as they age even when they still love reading. End somewhere the argument wasn't trying to go. 80–140 words." },
              { prompt: "Write the closing paragraph of an essay about how we talk about 'work-life balance' in ways that reveal how little we believe it's possible. Do something with the ending the body couldn't. 80–140 words." },
            ],
          },
        ],
      },

      {
        id: "end-2",
        title: "The Zoom Out",
        lesson:
          "One reliable ending move is to pull back to something larger. The essay was about one specific thing; the ending reveals it's about something bigger — without saying 'this is really about X.' The reader should feel the expansion, not be told about it. The zoom can go to a longer time horizon, a wider context, or the universal version of the particular.",
        prompt: "Write an ending that pulls back from the essay's specific subject to something larger, without naming what you're doing.",
        wordCountMin: 70,
        wordCountMax: 140,
        criteria: [
          { name: "Frame widens", description: "The ending moves to a larger context, longer time horizon, or more universal version of the essay's specific subject.", weight: 0.4 },
          { name: "Shown, not stated", description: "The expansion is felt by the reader, not announced — the writer doesn't say 'this is really about X.'", weight: 0.4 },
          { name: "Earns the zoom", description: "The wider frame feels earned by the essay, not arbitrary.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Try the pull-back",
            passThreshold: 50,
            wordCountMin: 70,
            wordCountMax: 120,
            criteria: [
              { name: "Pulls back to something larger", description: "The ending moves to a wider frame than the essay's specific subject.", weight: 0.5 },
              { name: "Doesn't announce itself", description: "The writer doesn't say 'this is really about X' — they show the larger thing.", weight: 0.3 },
              { name: "Feels like an ending", description: "The paragraph closes the piece rather than opening a new argument.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write the ending of an essay about open-plan offices. Zoom out from the specific office question to something larger about how we've organized work and why. Don't say what you're doing — just do it. 70–120 words." },
              { prompt: "Write the ending of an essay about why people stop reading fiction in their thirties. Zoom out to something larger — about attention, about how we change, about what adults tell themselves they don't have time for. 70–120 words." },
              { prompt: "Write the ending of an essay about why so many people are starting newsletters. Zoom out from newsletters to something larger about what people are looking for that institutions stopped providing. 70–120 words." },
              { prompt: "Write the ending of an essay about why people over-explain their food choices. Zoom out to something larger about status, identity, or the need to be understood. 70–120 words." },
              { prompt: "Write the ending of an essay about why so many people have complicated feelings about their hometown. Zoom out from the personal to the larger thing it's really about. 70–120 words." },
            ],
          },
          {
            label: "Show the larger frame",
            passThreshold: 65,
            wordCountMin: 70,
            wordCountMax: 120,
            criteria: [
              { name: "Larger frame is specific", description: "The zoom out lands on a specific larger idea, not a vague abstraction like 'human nature' or 'the way things are.'", weight: 0.45 },
              { name: "Both scales coexist", description: "The ending holds both the essay's specific subject and the larger frame — it doesn't abandon one for the other.", weight: 0.35 },
              { name: "Not announced", description: "The expansion is shown, not labeled.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write an ending that zooms out from an essay about how we talk about screen time for children. The larger frame should be specific — not 'parenting is hard' but something more precise about what this particular anxiety reveals. 70–120 words." },
              { prompt: "Write an ending that zooms out from an essay about why people make their beds every morning even when no one will see it. The larger frame should be concrete — what specific human need does this small ritual point to? 70–120 words." },
              { prompt: "Write an ending that zooms out from an essay about why people have strong opinions about how others spend their money. The zoom should land on something specific, not just 'judgment is human.' 70–120 words." },
              { prompt: "Write an ending that zooms out from an essay about why group chats always get worse over time. The larger frame should be precise — what does this small social phenomenon reveal about something bigger? 70–120 words." },
              { prompt: "Write an ending that zooms out from an essay about why so many people fantasize about quitting their job. The zoom should land somewhere specific — not 'work is hard' but something more precise about what the fantasy is really for. 70–120 words." },
            ],
          },
          {
            label: "Earned and felt",
            passThreshold: 75,
            wordCountMin: 80,
            wordCountMax: 140,
            criteria: [
              { name: "Zoom is earned", description: "The larger frame feels like the natural destination of the essay's argument, not a detour.", weight: 0.4 },
              { name: "Reader feels the expansion", description: "The ending creates a sense of the essay opening outward — the reader experiences widening, not just reads a wider claim.", weight: 0.35 },
              { name: "Specific at both scales", description: "Both the specific subject and the larger frame are precise — no vague abstractions at either level.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write the closing paragraph of an essay about how remote work changed people's relationship to their city — not just commuting, but belonging. The ending zooms out to something larger in a way that feels earned by everything the essay built. 80–140 words." },
              { prompt: "Write the closing paragraph of an essay about why people feel guilty about not calling their parents more. The zoom out should arrive somewhere specific and earned — not 'family is complicated' but the particular thing this guilt is really about. 80–140 words." },
              { prompt: "Write the closing paragraph of an essay about how self-help books promise transformation and deliver information. The zoom out should be earned and specific — the reader should feel the frame widening without being told it is. 80–140 words." },
              { prompt: "Write the closing paragraph of an essay about why people who don't watch sports find it hard to explain why to people who do. The ending zooms out to something larger that earns the whole essay's argument. 80–140 words." },
              { prompt: "Write the closing paragraph of an essay about how the word 'community' has been so overused it no longer means anything. The zoom out should be earned and specific — the reader feels the essay opening to a larger idea without being told what it is. 80–140 words." },
            ],
          },
        ],
      },

      {
        id: "end-3",
        title: "The Concrete Image",
        lesson:
          "Abstract endings evaporate. When you end on something concrete — a specific object, gesture, scene, or detail — the reader carries it with them. The image doesn't illustrate the argument; it holds it. The best endings in nonfiction are often physical: a chair, a coat, the specific blue of something. The abstraction lives inside the image, not alongside it.",
        prompt: "Write an ending that lands on a concrete image or detail rather than an abstract statement.",
        wordCountMin: 60,
        wordCountMax: 130,
        criteria: [
          { name: "Ends on something concrete", description: "The ending closes on a specific, physical thing — not an abstraction or general statement.", weight: 0.5 },
          { name: "Image carries the argument", description: "The concrete detail holds the essay's meaning without needing the argument spelled out alongside it.", weight: 0.3 },
          { name: "Specific, not generic", description: "The image is particular enough to picture — not 'a chair' but the right chair.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Find something to end on",
            passThreshold: 50,
            wordCountMin: 60,
            wordCountMax: 110,
            criteria: [
              { name: "Ends on a concrete thing", description: "The ending closes on a specific, physical object, gesture, or detail — not an abstract statement.", weight: 0.5 },
              { name: "Specific enough to picture", description: "The concrete thing has a quality or particularity — not just 'a book' but something more specific.", weight: 0.3 },
              { name: "Feels like an ending", description: "The image closes the piece rather than opening a new thread.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write the ending of an essay about how the pandemic changed how people think about home. End on a specific, concrete image or detail — something physical. No abstractions in the last sentence. 60–110 words." },
              { prompt: "Write the ending of an essay about how we mark time differently as we get older. End on something concrete — a specific object or gesture, not 'time passes differently.' 60–110 words." },
              { prompt: "Write the ending of an essay about why people keep things they no longer use. End on a concrete, specific image — a particular object in a particular place. 60–110 words." },
              { prompt: "Write the ending of an essay about how offices changed when everyone went remote. End on something physical — a specific object, space, or absence. 60–110 words." },
              { prompt: "Write the ending of an essay about how people talk about money differently with strangers than with family. End on a concrete, specific image or moment. 60–110 words." },
            ],
          },
          {
            label: "Let the image carry it",
            passThreshold: 65,
            wordCountMin: 60,
            wordCountMax: 110,
            criteria: [
              { name: "Image does the work alone", description: "The ending doesn't explain what the image means — the image holds the argument without help.", weight: 0.5 },
              { name: "No explanation alongside it", description: "There is no sentence telling the reader what the image represents or why it matters.", weight: 0.3 },
              { name: "Right image for this essay", description: "The concrete thing earns its place by fitting the essay's specific argument.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write the ending of an essay about how expertise changes the way you see your field — how you notice what others miss and miss what beginners see. End on a concrete image that holds this without explaining it. The image does the work alone. 60–110 words." },
              { prompt: "Write the ending of an essay about the particular loneliness of being the person who knows the most about a topic in any given room. End on something physical that holds the feeling without naming it. 60–110 words." },
              { prompt: "Write the ending of an essay about what it feels like to return to a place you lived long ago. End on one specific concrete detail — don't explain what the detail means. 60–110 words." },
              { prompt: "Write the ending of an essay about how people change their relationship to ambition after a failure. End on a concrete, specific image that carries the argument without spelling it out. 60–110 words." },
              { prompt: "Write the ending of an essay about how email changed the texture of work in ways nobody planned for. End on something physical and specific — don't explain what it represents. 60–110 words." },
            ],
          },
          {
            label: "The image is the argument",
            passThreshold: 75,
            wordCountMin: 70,
            wordCountMax: 130,
            criteria: [
              { name: "Image is inseparable from meaning", description: "The concrete ending and the essay's argument are fused — the image couldn't be swapped for a different one without losing the meaning.", weight: 0.45 },
              { name: "No abstraction in the final sentence", description: "The last sentence is concrete — no words like 'ultimately,' 'this shows,' or abstract nouns.", weight: 0.35 },
              { name: "Specific and earned", description: "The image is precise and feels inevitable — it couldn't be anyone else's ending to this essay.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write the closing paragraph of an essay about how we manage the gap between what we say we value and what we actually do. End on a specific concrete image that IS the argument — not one that illustrates it. No abstractions in the final sentence. 70–130 words." },
              { prompt: "Write the closing paragraph of an essay about how people curate their bookshelves to project an identity. End on a concrete, specific image that holds the essay's full argument without any explanation. 70–130 words." },
              { prompt: "Write the closing paragraph of an essay about how we deal with the obsolescence of skills we worked hard to develop. The last sentence should be concrete, and the argument should live inside it. 70–130 words." },
              { prompt: "Write the closing paragraph of an essay about how the language we use to talk about work has changed in the last decade. End on something concrete and specific — a word, a phrase, a gesture — that holds the insight without explaining it. 70–130 words." },
              { prompt: "Write the closing paragraph of an essay about how we decide what's worth remembering. End on a single concrete image — specific, earned, and final. The image is the argument. 70–130 words." },
            ],
          },
        ],
      },

      {
        id: "end-4",
        title: "The Turn",
        lesson:
          "The ending can reframe what came before. Not a twist — a shift in understanding. The essay made an argument; the ending reveals a complication the argument couldn't contain. The reader finishes thinking slightly differently than they expected when they began the last paragraph. The turn doesn't contradict the argument — it deepens it.",
        prompt: "Write an ending that reframes or complicates the essay's argument rather than confirming it.",
        wordCountMin: 80,
        wordCountMax: 150,
        criteria: [
          { name: "Reframes, doesn't contradict", description: "The turn deepens or complicates the argument — it doesn't reverse or undermine what came before.", weight: 0.4 },
          { name: "Earned by the essay", description: "The reframe feels like where the argument was always heading, not an afterthought.", weight: 0.4 },
          { name: "Reader ends somewhere new", description: "After the ending, the reader understands the argument slightly differently than before the last paragraph.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Try the turn",
            passThreshold: 50,
            wordCountMin: 80,
            wordCountMax: 130,
            criteria: [
              { name: "Something shifts", description: "The ending changes something about how the argument is understood — a new angle, a complication, a deepening.", weight: 0.5 },
              { name: "Doesn't contradict", description: "The turn deepens the argument, not reverses it.", weight: 0.3 },
              { name: "Feels like an ending", description: "The shift closes the piece rather than opening a new argument.", weight: 0.2 },
            ],
            variants: [
              { prompt: "You've been arguing that most career advice is useless because it ignores luck. Write an ending that turns: acknowledge what's still true about the advice even after accepting the luck argument. 80–130 words." },
              { prompt: "You've been arguing that cities are getting worse at being cities. Write an ending that turns: reveal a complication to that argument that makes it more honest. 80–130 words." },
              { prompt: "You've been arguing that social media makes people less honest about their opinions. Write an ending that turns — show the thing the argument was missing, without undoing the argument. 80–130 words." },
              { prompt: "You've been arguing that most people underestimate how much their upbringing shapes their politics. Write an ending that turns — find the complication your own argument generates. 80–130 words." },
              { prompt: "You've been arguing that the obsession with 'passion' in career advice sets people up to fail. Write an ending that turns: acknowledge what's true about passion that your argument underplays. 80–130 words." },
            ],
          },
          {
            label: "Earn the turn",
            passThreshold: 65,
            wordCountMin: 80,
            wordCountMax: 130,
            criteria: [
              { name: "Turn is earned, not arbitrary", description: "The reframe feels like where the argument was always heading — the reader sees how the essay built toward this.", weight: 0.45 },
              { name: "Deepens, doesn't reverse", description: "The ending makes the argument richer, not weaker — it holds the tension rather than collapsing it.", weight: 0.35 },
              { name: "Reader arrives somewhere new", description: "After the ending, the reader understands something about the argument they didn't before the last paragraph.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write the ending of an essay arguing that expertise makes you worse at teaching what you know. The ending turns — reveal what's true about expertise the argument can't fully dismiss — and feel earned rather than tacked on. 80–130 words." },
              { prompt: "Write the ending of an essay arguing that how companies talk about 'culture' reveals how little they understand their own employees. The ending turns: find the complication that makes the argument more honest. 80–130 words." },
              { prompt: "Write the ending of an essay arguing that people read fewer books not because they have less time but because they have more options. The ending turns: reveal what's still real about the 'less time' argument, and where that leaves the essay. 80–130 words." },
              { prompt: "Write the ending of an essay arguing that optimism is often a way of avoiding hard conversations rather than enabling them. The turn: what's the thing about optimism the essay can't dismiss? 80–130 words." },
              { prompt: "Write the ending of an essay arguing that the self-help industry tells people what they want to hear. The turn: find where your own critique applies to the essay you just wrote. 80–130 words." },
            ],
          },
          {
            label: "The turn that deepens everything",
            passThreshold: 75,
            wordCountMin: 90,
            wordCountMax: 150,
            criteria: [
              { name: "Reframes the whole essay", description: "The turn changes how the reader understands the entire argument — not just the ending.", weight: 0.4 },
              { name: "Honest, not just clever", description: "The reframe reveals a real tension or complication, not just a rhetorical flourish.", weight: 0.35 },
              { name: "Holds the complexity", description: "The ending holds both the argument and its complication simultaneously — it doesn't choose one or collapse the tension.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write the closing paragraph of an essay arguing that most 'life lessons' are survivorship bias dressed up as wisdom. The ending turns in a way that reframes the whole essay — find the complication that makes both the argument and its opposite feel more true. 90–150 words." },
              { prompt: "Write the closing paragraph of an essay arguing that remote work has made people lonelier in ways they won't admit. The ending turns: reveal the thing that makes the argument more complicated, and hold both truths simultaneously. 90–150 words." },
              { prompt: "Write the closing paragraph of an essay arguing that people who say they 'don't care what others think' are usually the most sensitive to it. The turn should reframe the essay's argument in a way that makes it more honest and more complicated. 90–150 words." },
              { prompt: "Write the closing paragraph of an essay arguing that most creative advice is useless because creativity can't be systematized. The ending turns: find the thing that makes this argument harder to hold than it sounds, and end there. 90–150 words." },
              { prompt: "Write the closing paragraph of an essay arguing that the way we talk about mental health has made it harder to talk honestly about unhappiness. The turn deepens the argument — find the complication that makes it more true, not less. 90–150 words." },
            ],
          },
        ],
      },

      {
        id: "end-5",
        title: "Hold the Tension",
        lesson:
          "The weakest endings resolve too cleanly. They tell the reader what to think, tie the bow, and leave nothing behind. The best endings hold a tension the essay raised but couldn't — or shouldn't — resolve. Ambiguity isn't a failure. It's honesty about hard things. The reader should finish the piece with something to carry, not a verdict.",
        prompt: "Write an ending that holds a tension rather than resolving it.",
        wordCountMin: 80,
        wordCountMax: 150,
        criteria: [
          { name: "Tension is held, not resolved", description: "The ending sits with the essay's central tension rather than collapsing it into a clean verdict.", weight: 0.45 },
          { name: "Deliberate, not evasive", description: "The unresolved ending is honest — it's not vague because the writer gave up, but because the tension is genuinely unresolvable.", weight: 0.35 },
          { name: "Reader has something to carry", description: "The ending leaves the reader with a genuine tension to think about, not just a trailing off.", weight: 0.2 },
        ],
        stages: [
          {
            label: "Resist the resolution",
            passThreshold: 50,
            wordCountMin: 70,
            wordCountMax: 120,
            criteria: [
              { name: "Doesn't resolve", description: "The ending doesn't collapse the essay's tension into a clean verdict or conclusion.", weight: 0.5 },
              { name: "Still feels like an ending", description: "The lack of resolution is deliberate — the piece closes without closing the question.", weight: 0.3 },
              { name: "Leaves something behind", description: "The reader finishes with something to think about, not just a trailing off.", weight: 0.2 },
            ],
            variants: [
              { prompt: "You've written an essay about whether ambition makes people happier or less happy. Write an ending that refuses to answer the question — but deliberately, not evasively. 70–120 words." },
              { prompt: "You've written an essay about whether it's better to specialize deeply or stay broad in your career. Write an ending that holds both possibilities without resolving them. 70–120 words." },
              { prompt: "You've written an essay about whether the internet has made public discourse better or worse. Write an ending that holds the genuine complexity — don't give the reader a verdict. 70–120 words." },
              { prompt: "You've written an essay about whether people who leave their hometown are happier than people who stay. Write an ending that refuses to resolve the question — hold both truths. 70–120 words." },
              { prompt: "You've written an essay about whether sharing your personal life online is authenticity or performance. Write an ending that holds the tension — don't choose a side. 70–120 words." },
            ],
          },
          {
            label: "Deliberate, not evasive",
            passThreshold: 65,
            wordCountMin: 80,
            wordCountMax: 130,
            criteria: [
              { name: "Ambiguity is earned", description: "The ending is unresolved because the tension is genuinely unresolvable — not because the writer avoided the hard conclusion.", weight: 0.45 },
              { name: "Both sides are real", description: "The tension held in the ending gives real weight to both possibilities — it doesn't stack the deck.", weight: 0.35 },
              { name: "Ends with something specific", description: "The ending doesn't trail into vague 'who can say' territory — it holds a specific tension.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write the ending of an essay about whether it's possible to give someone honest feedback without damaging the relationship. The ending holds the tension deliberately — it doesn't resolve because it can't, not because you avoided it. 80–130 words." },
              { prompt: "Write the ending of an essay about whether it's better to know things early in life or figure them out yourself. Hold both possibilities with equal weight — the tension is real, not performed. 80–130 words." },
              { prompt: "Write the ending of an essay about whether 'do what you love' career advice has made people more or less satisfied. The ending is unresolved because the evidence genuinely points both ways. 80–130 words." },
              { prompt: "Write the ending of an essay about whether nostalgia is useful or harmful. Hold both simultaneously — with specific weight on each side. 80–130 words." },
              { prompt: "Write the ending of an essay about whether it matters whether writers write for themselves or for an audience. The ending refuses the clean answer — and earns that refusal. 80–130 words." },
            ],
          },
          {
            label: "Hold it without losing it",
            passThreshold: 75,
            wordCountMin: 90,
            wordCountMax: 150,
            criteria: [
              { name: "Tension held with precision", description: "The ending names or enacts the specific tension — not a vague 'it's complicated' but the exact pull between two real things.", weight: 0.4 },
              { name: "Unresolved but not unfinished", description: "The piece feels complete even though the question is open — the ending is the right place to stop.", weight: 0.35 },
              { name: "Reader is trusted", description: "The ending doesn't tell the reader what to do with the tension — it trusts them to sit with it.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write the closing paragraph of an essay arguing that the things we're most proud of are often the things that made us worst to be around during the process. Hold the tension — the pride is real and the cost is real — without resolving either. 90–150 words." },
              { prompt: "Write the closing paragraph of an essay about whether having children makes people happier. Hold the genuine tension — don't land on a side, but hold the exact pull between what the research says and what people experience. 90–150 words." },
              { prompt: "Write the closing paragraph of an essay about whether it's possible to be both a dedicated parent and someone who does ambitious creative work. Hold both simultaneously — precisely, without collapsing. 90–150 words." },
              { prompt: "Write the closing paragraph of an essay about whether it's better to tell the truth or protect someone's feelings. Hold the genuine moral tension — specific enough that the reader feels both weights. 90–150 words." },
              { prompt: "Write the closing paragraph of an essay about whether people who leave difficult situations are brave or giving up. Hold the tension precisely — both readings are real, and the ending trusts the reader to live in that. 90–150 words." },
            ],
          },
        ],
      },

      {
        id: "end-6",
        title: "The Full Closing Paragraph",
        lesson:
          "A complete closing paragraph has weight and restraint simultaneously. It doesn't summarize. It doesn't moralize. It doesn't trail off because you ran out of things to say. It uses one deliberate technique — a zoom, an image, a turn, a held tension — and stops exactly when it should. The last sentence should feel like a door closing, not a paragraph running out.",
        prompt: "Write a complete, polished closing paragraph using one deliberate technique.",
        wordCountMin: 90,
        wordCountMax: 170,
        criteria: [
          { name: "Uses a deliberate technique", description: "The ending employs one clear method: zoom out, concrete image, turn, or held tension.", weight: 0.35 },
          { name: "No summary, no moral", description: "The ending doesn't recap or tell the reader what to think.", weight: 0.35 },
          { name: "Last sentence is the right one", description: "The piece ends where it should — it feels finished, not abandoned.", weight: 0.3 },
        ],
        stages: [
          {
            label: "Get it down",
            passThreshold: 50,
            wordCountMin: 90,
            wordCountMax: 150,
            criteria: [
              { name: "Attempts a real ending", description: "The paragraph tries to close an essay rather than summarize or moralize.", weight: 0.4 },
              { name: "No recap", description: "The ending doesn't restate points from the body.", weight: 0.4 },
              { name: "Has a last sentence", description: "The paragraph ends somewhere — it doesn't stop mid-thought.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a complete closing paragraph for an essay about why most people's relationship with email has become adversarial. Pick any ending technique — zoom, image, turn, or held tension — and use it. 90–150 words." },
              { prompt: "Write a complete closing paragraph for an essay about why people who are very good at their jobs often struggle to explain how they do it. Use one deliberate ending technique. 90–150 words." },
              { prompt: "Write a complete closing paragraph for an essay about how the language around 'hustle' has changed in the last decade. Pick an ending technique and use it. 90–150 words." },
              { prompt: "Write a complete closing paragraph for an essay about why people keep journals even when they never reread them. Use one deliberate ending technique. 90–150 words." },
              { prompt: "Write a complete closing paragraph for an essay about how people's relationship with their phone changes when they travel. Pick a technique and close it. 90–150 words." },
            ],
          },
          {
            label: "Commit to the technique",
            passThreshold: 65,
            wordCountMin: 90,
            wordCountMax: 160,
            criteria: [
              { name: "Technique is clearly employed", description: "A reader could identify which ending technique was used — zoom, image, turn, or held tension.", weight: 0.4 },
              { name: "Technique serves the essay", description: "The technique chosen fits this particular essay's argument — it's not generic.", weight: 0.35 },
              { name: "Ends cleanly", description: "The paragraph closes with a final sentence that has weight and finality.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a closing paragraph for an essay about whether it's better to know your weaknesses or focus on your strengths. Choose one technique (zoom, image, turn, or tension) and commit to it. The technique should be identifiable. 90–160 words." },
              { prompt: "Write a closing paragraph for an essay about how the way we describe our jobs has become more aspirational and less accurate. Choose one ending technique and execute it clearly. 90–160 words." },
              { prompt: "Write a closing paragraph for an essay about why people are bad at predicting what will make them happy. Choose one technique and use it deliberately. 90–160 words." },
              { prompt: "Write a closing paragraph for an essay about how the proliferation of options in every domain has made decisions harder and satisfaction rarer. One technique, clearly employed. 90–160 words." },
              { prompt: "Write a closing paragraph for an essay about why people give up creative hobbies when they start to get good at them. Pick a technique and execute it with intention. 90–160 words." },
            ],
          },
          {
            label: "Polished and deliberate",
            passThreshold: 75,
            wordCountMin: 100,
            wordCountMax: 170,
            criteria: [
              { name: "Technique is mastered, not just present", description: "The ending doesn't just use a technique — it uses it well. The zoom lands, the image carries weight, the turn deepens, or the tension holds precisely.", weight: 0.4 },
              { name: "Every sentence earns its place", description: "Nothing in the closing paragraph is padding — each sentence has a reason to be there.", weight: 0.35 },
              { name: "Last sentence is the only possible last sentence", description: "The ending couldn't end any earlier or later — it stops exactly when it should.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a polished closing paragraph for an essay about how we've made 'following your passion' into career advice even though passion doesn't scale to the demands of a job. Deliberate technique, well-executed. Every sentence earns its place. 100–170 words." },
              { prompt: "Write a polished closing paragraph for an essay about why people who read a lot often feel lonelier than non-readers, not less. One technique, done well — not just present. 100–170 words." },
              { prompt: "Write a polished closing paragraph for an essay about how we use busyness to avoid the question of what we actually want. Every sentence has a reason to be there. The last sentence is the only possible last sentence. 100–170 words." },
              { prompt: "Write a polished closing paragraph for an essay about why people who are very funny in person are often disappointing in writing — and vice versa. One technique, executed well. No wasted words. 100–170 words." },
              { prompt: "Write a polished closing paragraph for an essay about how we've collectively decided that being busy is the same as being important. Deliberate technique, earned ending, nothing wasted. 100–170 words." },
            ],
          },
        ],
      },
    ],
  },


  {
    id: "the-paragraph",
    title: "The Paragraph",
    genre: "nonfiction",
    difficulty: "beginner",
    description:
      "A paragraph is a unit of thought, not a unit of length. This track drills the four moves that make nonfiction paragraphs work: an arguable topic sentence, a concrete example that makes the claim real, an implication that says what it means, and a turn that connects to what follows. Master each move separately, then put them together.",
    exercises: [
      {
        id: "para-1",
        title: "The Topic Sentence",
        lesson:
          "An arguable topic sentence commits to a position. It doesn't name a topic — 'This paragraph is about productivity' — it makes a claim about one: 'Productivity culture is mostly a way to avoid the work that scares you.' The test is simple: could a thoughtful person disagree? If not, you haven't written a topic sentence — you've written a heading. The goal is one sentence that a reader could push back on.",
        prompt:
          "Write one sentence that makes an arguable claim about a topic. The sentence should be contestable — a thoughtful person could disagree. Not 'Social media has changed communication' but 'Social media has made people worse at sitting with their own thoughts.' One sentence, 10–25 words.",
        wordCountMin: 8,
        wordCountMax: 30,
        criteria: [
          { name: "Arguable claim", description: "The sentence makes a position a thoughtful reader could contest — not a fact, not a category label.", weight: 0.6 },
          { name: "Specific enough to matter", description: "Not 'X is complicated' or 'X has changed' — a claim specific enough to be interesting.", weight: 0.4 },
        ],
        stages: [
          {
            label: "Get arguable",
            passThreshold: 50,
            wordCountMin: 8,
            wordCountMax: 30,
            criteria: [
              { name: "Position, not topic", description: "The sentence commits to a view — not just 'this paragraph is about X' but 'X does/means/causes Y.'", weight: 0.6 },
              { name: "Someone could disagree", description: "A reasonable person could push back on this sentence — it's not a fact or a tautology.", weight: 0.4 },
            ],
            variants: [
              { prompt: "Write a topic sentence about remote work. Not 'remote work has become common' — that's a heading. Take a position: something about remote work that you could argue either way. 10–25 words." },
              { prompt: "Write a topic sentence about social media. Something arguable — not 'social media has changed how we communicate' (too vague). A claim a thoughtful person could contest. 10–25 words." },
              { prompt: "Write a topic sentence about advice. Not 'people give a lot of advice' — a position: something about why advice works or doesn't, who it serves, or what's wrong with it. 10–25 words." },
              { prompt: "Write a topic sentence about ambition. Take a position — something about ambition that isn't just 'ambition is important' or 'ambition can go too far.' A specific, arguable claim. 10–25 words." },
              { prompt: "Write a topic sentence about reading. Not 'reading is good for you' — that's a bumper sticker. A specific, contestable claim about what reading does or doesn't do. 10–25 words." },
            ],
          },
          {
            label: "Commit harder",
            passThreshold: 65,
            wordCountMin: 8,
            wordCountMax: 25,
            criteria: [
              { name: "No hedging", description: "No 'often,' 'sometimes,' 'can,' 'may,' 'tends to' — the sentence stakes a clean position without weasel words.", weight: 0.45 },
              { name: "Specific target", description: "The sentence is about something specific, not 'people in general' or 'modern society' — a named thing, behavior, or institution.", weight: 0.35 },
              { name: "Arguable and interesting", description: "The claim is debatable and interesting enough that a reader would want to know more.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write an unhedged topic sentence about meetings. No 'meetings can sometimes be' or 'many meetings tend to.' Commit. 10–22 words." },
              { prompt: "Write an unhedged topic sentence about expertise. Pick a specific claim about experts, expertise, or credentials — no hedging. 10–22 words." },
              { prompt: "Write an unhedged topic sentence about parenting advice. Take a clear position — not 'parenting advice is complicated' but something a parent could agree or disagree with. No qualifiers. 10–22 words." },
              { prompt: "Write an unhedged topic sentence about productivity. Not 'productivity culture can be harmful.' Commit to the sharpest version of your position. 10–22 words." },
              { prompt: "Write an unhedged topic sentence about friendship. Something specific about how adult friendships work, fade, or fail — no hedging. 10–22 words." },
            ],
          },
          {
            label: "One sentence, full commitment",
            passThreshold: 75,
            wordCountMin: 8,
            wordCountMax: 22,
            criteria: [
              { name: "One clean sentence", description: "No compound clauses that hedge in the second half — one idea, clean and fully committed.", weight: 0.35 },
              { name: "Specific and contestable", description: "Names something specific and takes a position that a real person would want to argue with.", weight: 0.45 },
              { name: "Implies the paragraph to follow", description: "The reader can predict what the next sentence might need to do — the claim creates an obligation.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write one tight, fully committed topic sentence about status — social status, professional status, or perceived status. Under 22 words, no hedging, specific enough to argue with." },
              { prompt: "Write one tight, fully committed topic sentence about feedback — giving it, receiving it, or avoiding it. Under 22 words, clean single claim." },
              { prompt: "Write one tight, fully committed topic sentence about attention — how we spend it, how we lose it, or what it means to pay it. Under 22 words." },
              { prompt: "Write one tight, fully committed topic sentence about education — formal education, self-education, or credentials specifically. Under 22 words, fully committed." },
              { prompt: "Write one tight, fully committed topic sentence about failure — how we talk about it, respond to it, or use it. One sentence, no qualifiers, under 22 words." },
            ],
          },
        ],
      },

      {
        id: "para-2",
        title: "The Concrete Example",
        lesson:
          "After you stake a position, you have to make it real. Not with another abstract claim — with something specific: a named person, a single incident, a number with human scale, an image the reader can picture. Abstract claims can be nodded at and forgotten. Specific examples have to be answered. The example doesn't prove your claim — it earns the reader's patience while you make the case.",
        prompt:
          "Given a topic sentence, write the next sentence (or two) that grounds the claim in something concrete. A specific person, place, incident, or detail — something pictureable. 20–60 words total.",
        wordCountMin: 15,
        wordCountMax: 65,
        criteria: [
          { name: "Specific and pictureable", description: "The example is concrete enough to visualize — not 'many people' or 'some situations' but a named thing or incident.", weight: 0.5 },
          { name: "Connects to the claim", description: "The example grounds the topic sentence — it's evidence for that position, not just an adjacent thought.", weight: 0.5 },
        ],
        stages: [
          {
            label: "Give an example",
            passThreshold: 50,
            wordCountMin: 15,
            wordCountMax: 65,
            criteria: [
              { name: "Something concrete added", description: "At least one specific detail, person, place, or incident — not another abstract claim.", weight: 0.5 },
              { name: "Related to the topic sentence", description: "The example is clearly connected to the claim — not a tangent.", weight: 0.5 },
            ],
            variants: [
              {
                given: "Most productivity advice skips the part where the work is hard.",
                prompt: "Write the next sentence that gives a concrete example — a specific product, author, technique, or piece of advice that illustrates this. Not another generalization. 15–50 words.",
              },
              {
                given: "We've made 'be yourself' into advice without asking who that self is supposed to be.",
                prompt: "Write the next sentence with a concrete example — a specific moment, product, platitude, or cultural artifact that shows this in action. 15–50 words.",
              },
              {
                given: "Social media doesn't make people narcissists; it rewards a specific kind of performance.",
                prompt: "Write the next sentence giving a concrete example of that performance — a specific format, behavior, or convention that illustrates what 'performance' means here. 15–50 words.",
              },
              {
                given: "Job descriptions have become documents that describe the job no one actually does.",
                prompt: "Write the next sentence with a concrete example — a specific kind of requirement, title, or phrasing that makes this visible. 15–50 words.",
              },
              {
                given: "The genre of 'founder story' has converged on a single narrative shape regardless of what actually happened.",
                prompt: "Write the next sentence giving a concrete example — a specific story, moment, or element that every founder story includes. 15–50 words.",
              },
            ],
          },
          {
            label: "Make it specific",
            passThreshold: 65,
            wordCountMin: 20,
            wordCountMax: 60,
            criteria: [
              { name: "Named or pictureable", description: "The example is specific enough to picture — a named book/person/event/place, not 'someone once' or 'there are cases.'", weight: 0.45 },
              { name: "Does not repeat the claim", description: "The example adds something new — it doesn't just restate the topic sentence in different words.", weight: 0.35 },
              { name: "Right scale", description: "The example is specific enough to be concrete but not so micro it feels arbitrary.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Advice scales to the person giving it, not the person receiving it.",
                prompt: "Write 1–2 sentences with a specific example — name a real type of advice, a real context, or a real dynamic that makes this claim visible. Don't restate the claim. 20–55 words.",
              },
              {
                given: "Every new technology gets described in the language of the thing it's replacing.",
                prompt: "Write 1–2 sentences with a specific example — name an actual technology and what older thing it was described as. Specific enough that a reader could picture the moment. 20–55 words.",
              },
              {
                given: "The open-plan office was designed to encourage collaboration and achieved the opposite.",
                prompt: "Write 1–2 sentences grounding this in something specific — a study, a type of behavior, or a particular consequence. Named or pictureable. 20–55 words.",
              },
              {
                given: "Most professional development doesn't transfer — people learn the vocabulary, not the skill.",
                prompt: "Write 1–2 sentences with a specific example — a type of training, a familiar situation, or a particular kind of knowledge that illustrates this transfer gap. 20–55 words.",
              },
              {
                given: "We've turned 'setting boundaries' into the solution to every interpersonal problem.",
                prompt: "Write 1–2 sentences giving a specific example — a situation, a kind of conversation, or a particular use of the phrase that makes this visible. Named or concrete. 20–55 words.",
              },
            ],
          },
          {
            label: "Right example, right weight",
            passThreshold: 75,
            wordCountMin: 20,
            wordCountMax: 55,
            criteria: [
              { name: "Example illuminates the claim", description: "Not just any concrete detail — the example makes the topic sentence more credible or revealing, not just decorated.", weight: 0.5 },
              { name: "Efficient — no wasted words", description: "The example is specific without being padded — it uses the minimum detail to make the claim real.", weight: 0.3 },
              { name: "Creates forward momentum", description: "After the example, the reader wants to know what it means — not done yet, but not lost.", weight: 0.2 },
            ],
            variants: [
              {
                given: "The most influential books in any field are rarely the best ones — they're the ones that arrived at the right moment.",
                prompt: "Write 1–2 sentences with the single best example of this — a book, a moment, a field — efficient and illuminating. No padding. 20–50 words.",
              },
              {
                given: "Status anxiety in professional life doesn't disappear as you climb — the goalposts move with you.",
                prompt: "Write 1–2 sentences with a specific, efficient example — one that makes the 'moving goalpost' visible without explaining it. 20–50 words.",
              },
              {
                given: "The language we use to talk about mental health has expanded the category so far it's become hard to distinguish distress from disorder.",
                prompt: "Write 1–2 sentences with the most illuminating example — a specific term, diagnostic category, or common usage that shows this expansion. Efficient. 20–50 words.",
              },
              {
                given: "Platforms don't just host creators — they train them, gradually, toward what performs.",
                prompt: "Write 1–2 sentences with a specific example — a format, a behavior, or a platform dynamic that makes 'training toward performance' visible. Illuminating, not just decorative. 20–50 words.",
              },
              {
                given: "Every generation thinks the one after it doesn't know how to do the hard things.",
                prompt: "Write 1–2 sentences with one efficient, well-chosen example — specific enough to be concrete, general enough to be recognizable. No padding. 20–50 words.",
              },
            ],
          },
        ],
      },

      {
        id: "para-3",
        title: "The Implication",
        lesson:
          "After the example, you have to say what it means. Not summarize it — interpret it. This is the 'so what' sentence: it draws out what the example reveals and says why the reader should care. Without it, your paragraph is observation without argument. The implication is what separates a paragraph from a list of facts. It's the move that earns your claim.",
        prompt:
          "Given a topic sentence and an example, write the sentence that says what the example means — the implication, the 'so what.' Not a summary. An interpretation that connects back to the claim. 15–40 words.",
        wordCountMin: 10,
        wordCountMax: 45,
        criteria: [
          { name: "Interpretation, not summary", description: "The sentence says what the example means — it doesn't just restate what happened.", weight: 0.5 },
          { name: "Connects to the claim", description: "The implication draws a line between the example and the original position.", weight: 0.5 },
        ],
        stages: [
          {
            label: "Say what it means",
            passThreshold: 50,
            wordCountMin: 10,
            wordCountMax: 45,
            criteria: [
              { name: "Some interpretation present", description: "The sentence adds meaning — it doesn't just repeat or describe the example.", weight: 0.55 },
              { name: "Related to the argument", description: "The interpretation points back toward the topic sentence, not in a new direction.", weight: 0.45 },
            ],
            variants: [
              {
                given: "Topic sentence: 'Most feedback is really self-expression dressed up as advice.' Example: 'When a manager tells a writer to cut the fluff, they often mean cut what doesn't sound like how I would write this.'",
                prompt: "Write one sentence that says what this example means — the 'so what.' Not a summary. What does this reveal? 10–40 words.",
              },
              {
                given: "Topic sentence: 'The résumé is a form that teaches applicants to lie in a specific, socially acceptable way.' Example: 'Responsibilities become led, attendance at meetings becomes collaborated cross-functionally, and being assigned to a project becomes drove initiative.'",
                prompt: "Write one sentence of interpretation — what does this linguistic inflation reveal about the form itself? 10–40 words.",
              },
              {
                given: "Topic sentence: 'We've confused being heard with being agreed with.' Example: 'In workplace conflict mediation, employees often report feeling unheard immediately after a manager restates their concern verbatim and then proceeds to the same conclusion.'",
                prompt: "Write one sentence that says what this reveals — the implication of that gap between being heard and feeling heard. 10–40 words.",
              },
              {
                given: "Topic sentence: 'Wellness culture has made self-improvement feel like a moral category.' Example: 'A person who takes cold showers and journals every morning is described — and describes themselves — as disciplined, as doing the work, in terms once reserved for spiritual practice.'",
                prompt: "Write one sentence of interpretation — what does this language reveal about what wellness culture is actually doing? 10–40 words.",
              },
              {
                given: "Topic sentence: 'Professional networking has made a social obligation out of what used to be opportunistic.' Example: 'Conferences now include scheduled connection time, apps send prompts to check in with your network, and LinkedIn has a weekly reconnect feature that suggests people you haven't talked to in years.'",
                prompt: "Write one sentence saying what this systematization of networking means — the implication of turning connection into a scheduled task. 10–40 words.",
              },
            ],
          },
          {
            label: "Connect precisely",
            passThreshold: 65,
            wordCountMin: 12,
            wordCountMax: 40,
            criteria: [
              { name: "Connects example to topic sentence", description: "The implication draws a direct line between what was shown and the original claim — not a tangent.", weight: 0.45 },
              { name: "Adds meaning, not decoration", description: "The sentence says something that couldn't be omitted — it adds an insight the example alone doesn't deliver.", weight: 0.4 },
              { name: "Doesn't overreach", description: "The implication is earned by the example — it doesn't make a claim larger than the evidence supports.", weight: 0.15 },
            ],
            variants: [
              {
                given: "Topic sentence: 'Nostalgia is rarely about the past — it's about a self we've stopped believing in.' Example: 'People rarely feel nostalgic about the difficult parts of the periods they idealize. The nostalgia isn't for the place or time but for the feeling of possibility that accompanied it.'",
                prompt: "Write one sentence of implication that connects this observation precisely back to the claim — what does it reveal about the function of nostalgia? 12–38 words.",
              },
              {
                given: "Topic sentence: 'Expertise doesn't make people more uncertain — it makes them certain about a narrower set of things.' Example: 'Ask a cardiologist about the dietary causes of heart disease and you'll get specificity and hedging. Ask them what their patient should do about a neck ache and they'll have an opinion immediately.'",
                prompt: "Write one implication sentence that draws the line between this observation and the original claim. Precise, not overstated. 12–38 words.",
              },
              {
                given: "Topic sentence: 'The language of self-improvement has shifted the responsibility for structural problems onto individuals.' Example: 'Books about thriving in a toxic workplace outsell books about why workplaces become toxic.'",
                prompt: "Write one sentence of precise implication — what does this book market tell us about how we're being told to think about structural problems? 12–38 words.",
              },
              {
                given: "Topic sentence: 'High-status hobbies have migrated from what you collect to what you've done.' Example: 'Marathon finisher medals displayed in home offices. Instagram accounts dedicated to peak summits. The experience itself becomes the credential.'",
                prompt: "Write one sentence of implication that connects these examples precisely to the claim about status. 12–38 words.",
              },
              {
                given: "Topic sentence: 'Transparency in organizations often means the appearance of openness rather than the fact of it.' Example: 'Town halls where leaders take questions typically feature pre-submitted questions, filtered by HR, answered with prepared talking points.'",
                prompt: "Write one implication sentence — what does this theater of transparency reveal? Connect it precisely to the original claim. 12–38 words.",
              },
            ],
          },
          {
            label: "Stakes are clear",
            passThreshold: 75,
            wordCountMin: 12,
            wordCountMax: 38,
            criteria: [
              { name: "Reader knows why it matters", description: "The implication makes clear what's at stake — not just what the example shows, but why anyone should care.", weight: 0.45 },
              { name: "Sharp and unpadded", description: "The sentence is tight — no 'this shows us that' or 'we can see from this that' windup.", weight: 0.35 },
              { name: "Earns the argument", description: "The paragraph would be weaker without this sentence — it does irreplaceable work.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Topic sentence: 'Hustle culture doesn't produce high performers — it produces people who are very busy.' Example: 'Research on creative output consistently shows that the most productive periods for writers, scientists, and artists average four to five focused hours, not twelve-hour grinds. The rest is either shallow work or recovery from overexertion.'",
                prompt: "Write one sharp implication sentence — stakes clear, no windup, does irreplaceable work. What does this reveal that matters? 12–35 words.",
              },
              {
                given: "Topic sentence: 'The way we teach writing produces writers who can answer prompts but not writers who have anything to say.' Example: 'The five-paragraph essay, which most American students internalize between grades five and twelve, is a form that rewards structure over argument. A student who masters it has learned to fill boxes, not to think on paper.'",
                prompt: "Write one sharp implication sentence — clear stakes, no hedging, nothing that could be omitted. 12–35 words.",
              },
              {
                given: "Topic sentence: 'We've made following the data into an ethical position, when it's often a way to avoid making a judgment call.' Example: 'Every content recommendation algorithm optimizes for engagement because engagement is measurable — not because the people building it believe engagement is the same as value.'",
                prompt: "Write one sharp implication sentence. What's actually at stake here? No windup, clean, earns the paragraph. 12–35 words.",
              },
              {
                given: "Topic sentence: 'The celebrity interview has become a negotiation between access and honesty, and access always wins.' Example: 'Profile subjects approve quotes. They negotiate what topics are off-limits before sitting down. The journalist's job shifts from interrogating a subject to flattering them into revealing something mildly interesting.'",
                prompt: "Write one sharp implication sentence — what does this journalism-by-negotiation reveal that matters? Stakes clear, no padding. 12–35 words.",
              },
              {
                given: "Topic sentence: 'Mentorship has become a word that means free consulting for people who can't reciprocate.' Example: 'The mentor-mentee relationship, as it actually exists in professional life, is almost always initiated by the person seeking advice, scheduled on their terms, and benefits them exclusively. The mentor gets the moral credit of generosity.'",
                prompt: "Write one tight implication sentence — what does this dynamic reveal, and why does it matter? No windup. 12–35 words.",
              },
            ],
          },
        ],
      },

      {
        id: "para-4",
        title: "The Complete Paragraph",
        lesson:
          "A working paragraph has three moves: a claim, something concrete that makes it real, and a sentence that says what it means. You've practiced each in isolation. Now they go together — and the challenge is different. Each part has to earn its place. The example can't be generic. The implication can't be a restatement. And the whole thing should feel like one idea, not three sentences that happen to be adjacent.",
        prompt:
          "Write a complete paragraph with three moves: an arguable topic sentence, a specific concrete example, and an implication that says what the example means. 60–120 words.",
        wordCountMin: 50,
        wordCountMax: 130,
        criteria: [
          { name: "Arguable topic sentence", description: "Opens with a position, not a topic — someone could contest it.", weight: 0.35 },
          { name: "Specific example", description: "Something concrete and pictureable after the claim — not another abstraction.", weight: 0.35 },
          { name: "Implication is present", description: "A sentence that says what the example means — not a summary, an interpretation.", weight: 0.3 },
        ],
        stages: [
          {
            label: "All three parts present",
            passThreshold: 50,
            wordCountMin: 50,
            wordCountMax: 130,
            criteria: [
              { name: "Claim is present", description: "The paragraph opens with an arguable position — something, not nothing.", weight: 0.35 },
              { name: "Something concrete is present", description: "At least one specific detail or example appears after the claim.", weight: 0.35 },
              { name: "Implication is present", description: "A sentence that adds interpretation — says what the example reveals.", weight: 0.3 },
            ],
            variants: [
              { prompt: "Write a complete paragraph about how people talk about money. Three moves: claim, example, implication. 60–120 words." },
              { prompt: "Write a complete paragraph about how workplaces handle disagreement. Three moves: arguable opening, specific example, what it means. 60–120 words." },
              { prompt: "Write a complete paragraph about the way cities are changing. Three moves: position, concrete detail, interpretation. 60–120 words." },
              { prompt: "Write a complete paragraph about what success has come to mean. Three moves: claim, example, implication. 60–120 words." },
              { prompt: "Write a complete paragraph about how the internet has changed expertise. Three moves: arguable opening, specific example, so what. 60–120 words." },
            ],
          },
          {
            label: "Parts connect",
            passThreshold: 65,
            wordCountMin: 60,
            wordCountMax: 120,
            criteria: [
              { name: "Example earns its place", description: "The example doesn't just follow the claim — it makes the claim more credible or visible.", weight: 0.4 },
              { name: "Implication interprets, not restates", description: "The final sentence adds meaning — doesn't just repeat the topic sentence or describe the example.", weight: 0.4 },
              { name: "Three sentences feel like one thought", description: "The paragraph moves forward — it doesn't feel like three separate facts that happen to be near each other.", weight: 0.2 },
            ],
            variants: [
              { prompt: "Write a connected paragraph about how we talk about failure. Claim → example that earns it → implication that interprets, not restates. 60–115 words." },
              { prompt: "Write a connected paragraph about the relationship between education and class. Each sentence earns its place — the example makes the claim visible, the implication adds meaning. 60–115 words." },
              { prompt: "Write a connected paragraph about how social media has changed political argument. Three moves that connect — not three sentences that are each just okay. 60–115 words." },
              { prompt: "Write a connected paragraph about parenting in public. Arguable claim → specific example → interpretation that adds something the example alone doesn't. 60–115 words." },
              { prompt: "Write a connected paragraph about how ambition changes as people age. Claim → example → implication that doesn't just restate. 60–115 words." },
            ],
          },
          {
            label: "One unit of thought",
            passThreshold: 75,
            wordCountMin: 70,
            wordCountMax: 115,
            criteria: [
              { name: "Paragraph is one idea, fully developed", description: "Feels like a unit — beginning, middle, and end — not three sentences that happen to share a topic.", weight: 0.4 },
              { name: "No wasted sentence", description: "Every sentence does something the others can't — no doubling, no padding, no throat-clearing.", weight: 0.35 },
              { name: "Implication earns the paragraph", description: "The final sentence makes the whole paragraph worth reading — it's the payoff.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a tight, complete paragraph about the way professional networks actually work. One idea, fully developed, no wasted sentence, implication that earns it. 70–110 words." },
              { prompt: "Write a tight, complete paragraph about how we've medicalized ordinary unhappiness. Every sentence does something the others don't. Final sentence is the payoff. 70–110 words." },
              { prompt: "Write a tight, complete paragraph about the gap between how leaders talk and how organizations function. One unit of thought, no padding, earned ending. 70–110 words." },
              { prompt: "Write a tight, complete paragraph about what authenticity means in a professional context. Every sentence earns its place. The final sentence says something the earlier ones couldn't. 70–110 words." },
              { prompt: "Write a tight, complete paragraph about how cities use the language of culture to justify development. One idea, three moves, no wasted words. 70–110 words." },
            ],
          },
        ],
      },

      {
        id: "para-5",
        title: "The Turn Sentence",
        lesson:
          "The last sentence of a paragraph is the bridge. It can reframe what came before, complicate the claim, zoom out to the larger stakes, or raise the question the next paragraph will answer. A good turn makes what follows feel inevitable. It tells the reader: we're not done, we're going somewhere. Without it, every paragraph feels like a complete stop — and the reader has no reason to keep going.",
        prompt:
          "Write the last sentence of a paragraph — the turn. It should either reframe what came before, complicate the claim, or raise the question that comes next. The reader should feel: there's more, and I want it. 15–35 words.",
        wordCountMin: 10,
        wordCountMax: 40,
        criteria: [
          { name: "Creates forward movement", description: "The sentence implies there is more — the reader doesn't feel finished.", weight: 0.5 },
          { name: "Earns its position", description: "The sentence couldn't go anywhere else in the paragraph — it belongs at the end.", weight: 0.5 },
        ],
        stages: [
          {
            label: "Bridge to what follows",
            passThreshold: 50,
            wordCountMin: 10,
            wordCountMax: 40,
            criteria: [
              { name: "Something continues", description: "The sentence implies the argument isn't finished — it points toward a next move.", weight: 0.55 },
              { name: "Not a summary", description: "The last sentence doesn't just recap — it pivots or gestures forward.", weight: 0.45 },
            ],
            variants: [
              {
                given: "Most productivity advice is really advice about how to feel productive — to tick boxes, complete sprints, track habits — rather than how to produce work that matters. The system becomes the point. The work it was supposed to enable gets deferred.",
                prompt: "Write the turn sentence — the last sentence that bridges to what comes next. Don't summarize. Pivot or point forward. 10–35 words.",
              },
              {
                given: "The mentor-mentee relationship, as it actually exists in most industries, almost always benefits the mentee exclusively. The mentor gives time, judgment, and access; the mentee takes them. The transaction is dressed up as generosity.",
                prompt: "Write the turn sentence. Not a summary of what was said — a sentence that implies the next move. 10–35 words.",
              },
              {
                given: "We've made soft skills into the name for everything that resists being measured — empathy, communication, judgment, trust. The name does a quiet job: it ranks these skills below hard ones before anyone has to argue for that ranking.",
                prompt: "Write the last sentence — a turn that doesn't just sum up but opens a door. 10–35 words.",
              },
              {
                given: "Open offices were designed to maximize collaboration and have instead maximized noise management. Workers wear headphones to recreate the isolation the open office removed. The headphones have become the office.",
                prompt: "Write the turn sentence. The paragraph has made its point — the last sentence should take us somewhere. 10–35 words.",
              },
              {
                given: "The phrase 'I don't have time' is almost never about time. Time exists; priorities exist; the phrase is a way of assigning blame to a neutral resource rather than owning the choice.",
                prompt: "Write a turn sentence that doesn't summarize this but pushes through it — complicates, zooms out, or raises the question that follows. 10–35 words.",
              },
            ],
          },
          {
            label: "Clear direction",
            passThreshold: 65,
            wordCountMin: 12,
            wordCountMax: 38,
            criteria: [
              { name: "Reader knows where we're going", description: "The turn gives the reader a direction — a question, a tension, a category — without spelling out the next paragraph.", weight: 0.45 },
              { name: "Complicates or reframes", description: "The sentence doesn't just extend the current thought — it introduces a new angle on it.", weight: 0.35 },
              { name: "Proportionate to the paragraph", description: "The turn's scope matches the paragraph — not too small (a detail), not too large (a thesis).", weight: 0.2 },
            ],
            variants: [
              {
                given: "Status anxiety doesn't disappear as you become more successful — the frame shifts. Early in a career, the question is will I make it? Later, the question is did I make it enough? The goalposts always recede by roughly the distance you've traveled.",
                prompt: "Write a turn sentence that gives the reader a clear direction without spelling out the next paragraph. It should reframe or complicate. 12–35 words.",
              },
              {
                given: "The genre of the apology letter has become formalized to the point of meaninglessness. Each element has a standard slot: the acknowledgment, the I take full responsibility, the commitment to do better. The form has been so thoroughly learned that following it signals nothing.",
                prompt: "Write a turn sentence — reader gets a clear direction, the sentence complicates or reframes, doesn't just add more to the list. 12–35 words.",
              },
              {
                given: "Efficiency in the workplace is never neutral. When a process is made faster, someone's judgment gets automated away. The question is never whether to be efficient but whose expertise the efficiency is built on.",
                prompt: "Write the turn sentence with a clear direction forward — not a summary, not just an extension. Complicates or reframes. 12–35 words.",
              },
              {
                given: "Books about habits consistently treat habit formation as the solution to problems that are actually about will, attention, or values. You can have excellent habits and still not do the work that matters. The behavior is easier to engineer than the motivation.",
                prompt: "Write a turn sentence that gives the reader direction — complicates or reframes what was just said. Not a summary. 12–35 words.",
              },
              {
                given: "Startup pitching has developed its own formal register — a vocabulary of disruption, scalability, runway, and moats that signals insider status while often obscuring what the company actually does. The language is designed to be recognized by investors, not understood by users.",
                prompt: "Write the turn sentence. Clear direction, something reframed or complicated, proportionate to the paragraph. 12–35 words.",
              },
            ],
          },
          {
            label: "Next paragraph feels inevitable",
            passThreshold: 75,
            wordCountMin: 12,
            wordCountMax: 35,
            criteria: [
              { name: "Creates a specific obligation", description: "The turn creates an expectation specific enough that a reader knows what the next paragraph has to deliver.", weight: 0.45 },
              { name: "Clean and precise", description: "No loose language — the sentence is exact and earns its effect with precise word choice.", weight: 0.35 },
              { name: "Feels necessary, not tacked on", description: "The sentence couldn't be cut — the paragraph would feel unfinished without it.", weight: 0.2 },
            ],
            variants: [
              {
                given: "The feedback sandwich — criticism between two compliments — is one of the most widely taught management techniques and one of the least effective. People remember the meat, not the bread. Sandwiching criticism doesn't soften it; it makes the praise feel like a preamble to the real point.",
                prompt: "Write a turn sentence that makes the next paragraph feel inevitable — creates a specific obligation, clean and precise. 12–32 words.",
              },
              {
                given: "We've reframed laziness as burnout so thoroughly that it's become difficult to distinguish between the two. Both involve not wanting to do the work. Both feel like exhaustion. But their causes, and their remedies, are different.",
                prompt: "Write the turn sentence that makes the next paragraph feel inevitable. The reader should know exactly what has to come next, without being told explicitly. 12–32 words.",
              },
              {
                given: "The advice to find your passion collapses the difference between what you enjoy and what you're willing to do badly for years. Most people don't discover what they love — they stumble into it and then work until they're good enough that it starts loving them back.",
                prompt: "Write a precise turn sentence — creates a specific obligation for what follows, feels necessary, clean word choice. 12–32 words.",
              },
              {
                given: "Busyness has become the primary status signal of the professional class — not wealth, not achievement, not taste, but the performance of having too much to do. The person who says I'm slammed is claiming a kind of importance.",
                prompt: "Write the turn sentence that makes the next paragraph feel inevitable. Specific obligation, precise, necessary. 12–32 words.",
              },
              {
                given: "The best writing advice is almost always about reading — read widely, read in your genre, read what you want to write. But the actual transfer from reading to writing is not automatic. Most readers, even voracious ones, have not figured out how to read like a writer.",
                prompt: "Write a turn sentence that creates a specific, precise obligation for the next paragraph. The reader should know what's coming — and want it. 12–32 words.",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "the-turn",
    title: "The Turn",
    genre: "nonfiction",
    difficulty: "intermediate",
    description:
      "Every essay that moves has a turn — a moment where the direction shifts and the piece becomes more than it seemed. This track drills five types of essay-level pivot: the reframe (it's actually about something else), the complication (yes, and also this), the zoom-out (here's what the small thing means), the personal turn (here's where it becomes about me), and the implication (here's where the argument actually leads). Learn to recognize them. Then learn to pull them off.",
    exercises: [
      {
        id: "turn-1",
        title: "The Reframe",
        lesson:
          "The reframe is the most disorienting — and most powerful — turn in opinion writing. You present a situation as everyone sees it, then show it's actually about something else entirely. Not a counterargument. A re-interpretation. The reader was seeing X; now they see Y, and they can't unsee it. 'We thought this was about productivity. It's actually about the fear of finding out you're not capable.' The test: does the reader finish the turn differently than they entered it?",
        prompt:
          "Given a setup that frames a situation one way, write the turn that reframes it — shows it's actually about something else. The reframe should be specific: name what it's really about. 50–100 words.",
        wordCountMin: 40,
        wordCountMax: 110,
        criteria: [
          { name: "Reframe is present", description: "The turn shifts the interpretation — the reader understands the situation differently after the pivot.", weight: 0.55 },
          { name: "Names what it's actually about", description: "The turn is specific — it doesn't just say there's more here but names the deeper thing.", weight: 0.45 },
        ],
        stages: [
          {
            label: "Reframe present",
            passThreshold: 50,
            wordCountMin: 40,
            wordCountMax: 110,
            criteria: [
              { name: "Interpretation shifts", description: "The reader understands the situation differently after the turn — some reframing is present.", weight: 0.55 },
              { name: "Something deeper named", description: "The turn gestures at what the situation is really about, even if vaguely.", weight: 0.45 },
            ],
            variants: [
              {
                given: "We talk about the loneliness epidemic as if it were a technology problem — too much screen time, not enough face time. The evidence is taken seriously, the concern is genuine, the proposed solutions all involve spending less time on phones.",
                prompt: "Write the turn: what is the loneliness epidemic actually about, underneath the technology framing? Reframe it. 40–100 words.",
              },
              {
                given: "The obsession with productivity tools — apps, systems, methods, planners — gets diagnosed as a time management problem. Not enough hours, too many distractions, poor prioritization. The market for solutions is enormous.",
                prompt: "Write the turn: what is the productivity tool obsession actually about, beyond time management? Reframe it specifically. 40–100 words.",
              },
              {
                given: "The discourse around toxic positivity treats it as a communication problem — telling someone to look on the bright side when they need to be heard. Therapists flag it, HR departments warn against it, guides for better conversations address it.",
                prompt: "Write the turn: what is toxic positivity actually about, beneath the communication framing? Name the deeper thing. 40–100 words.",
              },
              {
                given: "The personal finance internet presents debt as a discipline problem. You spent too much, saved too little, didn't budget correctly. The solution is always behavioral: track expenses, build habits, cut the daily coffee.",
                prompt: "Write the turn: what is the framing of debt-as-discipline actually about? What is it really? Reframe with specificity. 40–100 words.",
              },
              {
                given: "The conversation around work-life balance treats exhaustion as a scheduling problem. Too many meetings, unclear boundaries, inadequate vacation. Fix the calendar and the overwork resolves.",
                prompt: "Write the turn: what is the work-life balance conversation actually about, beyond scheduling? Name the deeper thing it won't say directly. 40–100 words.",
              },
            ],
          },
          {
            label: "Specific reframe",
            passThreshold: 65,
            wordCountMin: 50,
            wordCountMax: 100,
            criteria: [
              { name: "Reframe is specific", description: "The turn names exactly what the situation is really about — not there's more here but the specific underlying thing.", weight: 0.5 },
              { name: "Reframe follows from the setup", description: "The reframe is earned by the setup — not a non-sequitur, a re-reading of the same material.", weight: 0.3 },
              { name: "Reader sees the setup differently", description: "After the turn, the setup feels like evidence for the new interpretation, not just a preamble.", weight: 0.2 },
            ],
            variants: [
              {
                given: "The genre of the book about extraordinary productivity — the four-hour workweek, the morning routine of billionaires, the one habit that changes everything — keeps producing new entries because none of the previous ones worked. The reader buys the new one anyway.",
                prompt: "Write a specific reframe: what is this genre actually about? Name the specific psychological or social function it's performing. The reframe should make the setup feel like evidence. 50–95 words.",
              },
              {
                given: "Every few years the conversation turns to why there aren't more women in tech leadership. The diagnoses rotate: pipeline problem, bias in hiring, lack of mentors, confidence gap. New programs are launched. The numbers shift incrementally.",
                prompt: "Write a specific reframe: what is this recurring conversation actually about? Name the specific thing it's doing, or not doing. Make the setup feel like evidence for the reframe. 50–95 words.",
              },
              {
                given: "True crime has become one of the dominant entertainment genres — podcasts, documentaries, books, subreddits. The audience is overwhelmingly women. The commentary on this fact tends to be either appreciative or vaguely uncomfortable.",
                prompt: "Write a specific reframe: what is the true crime phenomenon actually about? Name the specific thing the genre is doing for its audience. Make the setup feel like evidence. 50–95 words.",
              },
              {
                given: "The annual ritual of New Year's resolutions is widely acknowledged to fail. People know this. Studies confirm this. The jokes about failed resolutions circulate in January. And then January comes again and the resolutions are made.",
                prompt: "Write a specific reframe: what are New Year's resolutions actually about? Not self-improvement — the specific psychological or social function they serve regardless of whether they work. 50–95 words.",
              },
              {
                given: "Hustle culture discourse now runs in both directions simultaneously: people performing busyness and celebrating it on one side, people performing self-care and rejecting hustle on the other. Both groups are posting about it constantly.",
                prompt: "Write a specific reframe: what is this dual discourse — both the hustle and the anti-hustle — actually about? Name the single thing both sides are doing. 50–95 words.",
              },
            ],
          },
          {
            label: "Reframe changes the piece",
            passThreshold: 75,
            wordCountMin: 80,
            wordCountMax: 200,
            criteria: [
              { name: "Setup earned the reframe", description: "The setup earns the pivot — the reframe feels inevitable once it lands, not surprising in a cheap way.", weight: 0.4 },
              { name: "Reframe is the real argument", description: "The reframe isn't decoration — it's the essay's actual claim. Everything before it was setup.", weight: 0.35 },
              { name: "Reader finishes the turn different", description: "The turn changes what the reader thinks they're reading about — the piece is now about something more true.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a short passage (setup + reframe) about the self-help industry. Set up how it appears to work, then turn to what it's actually about. The reframe should be the essay's real argument. 80–180 words." },
              { prompt: "Write a short passage (setup + reframe) about the way we talk about passion in the context of work. Set up the conventional framing, then turn to what the passion discourse is really doing. 80–180 words." },
              { prompt: "Write a short passage (setup + reframe) about the modern performance of being overwhelmed. Set up how it presents, then turn to what the overwhelm is actually about. Reframe is the real argument. 80–180 words." },
              { prompt: "Write a short passage (setup + reframe) about the way American culture treats therapy. Set up the conventional framing, then turn to reveal what the therapy conversation is actually doing. 80–180 words." },
              { prompt: "Write a short passage (setup + reframe) about the founder apology — the public statement after a company does something bad. Set up how it works, then turn to what it's really about. 80–180 words." },
            ],
          },
        ],
      },

      {
        id: "turn-2",
        title: "The Complication",
        lesson:
          "The complication turn builds a case — then introduces the thing that makes it harder. Not 'actually I'm wrong' and not a full counterargument. More like: yes, and also this. The complication doesn't undo what came before; it makes it more true and more difficult. The case you made was right. The complication is also right. The reader finishes the turn thinking: this is messier than I thought — and that's exactly why it matters.",
        prompt:
          "Given a clean argument, write the complication turn — the thing that makes the argument harder without undoing it. The complication should be specific, not vague. 50–100 words.",
        wordCountMin: 40,
        wordCountMax: 110,
        criteria: [
          { name: "Complication is present", description: "The turn introduces something that makes the argument harder — doesn't undo it, but doesn't let it off easy.", weight: 0.5 },
          { name: "Doesn't collapse the original claim", description: "The complication adds difficulty without capitulating — the original position still stands.", weight: 0.5 },
        ],
        stages: [
          {
            label: "Complication present",
            passThreshold: 50,
            wordCountMin: 40,
            wordCountMax: 110,
            criteria: [
              { name: "Something complicates the case", description: "The turn introduces a real difficulty — not just 'but some people disagree.'", weight: 0.55 },
              { name: "Case is not abandoned", description: "The original argument still stands — the complication doesn't concede the point.", weight: 0.45 },
            ],
            variants: [
              {
                given: "The best thing a manager can do for a struggling employee is give direct, honest feedback. Vague encouragement delays the reckoning, trains learned helplessness, and ultimately wastes everyone's time. Most employees, when surveyed, say they want more honesty from their managers, not less.",
                prompt: "Write the complication turn — the thing that makes direct feedback harder without abandoning the case for it. Something specific. 40–100 words.",
              },
              {
                given: "Cities should make it dramatically easier to build housing. Restrictive zoning inflates rents, limits density, and concentrates opportunity in places that can only expand by excluding people. The evidence on this is not subtle.",
                prompt: "Write the complication turn — something that makes the pro-housing case harder without giving it up. Not just NIMBYs will resist. Something specific. 40–100 words.",
              },
              {
                given: "Remote work has been good for most knowledge workers. Commutes were a tax on attention and health. Flexibility has redistributed power toward employees. Productivity metrics, where they can be measured, are flat to positive.",
                prompt: "Write the complication turn — something real and specific that makes the pro-remote case harder, without abandoning it. 40–100 words.",
              },
              {
                given: "Telling people to follow their passion is bad advice for most people. Passion is often discovered through competence, not before it. The people who appear to be following their passion have usually gotten good at something first and named the feeling later.",
                prompt: "Write the complication — something that makes the anti-passion argument harder without conceding that follow your passion is right. Specific. 40–100 words.",
              },
              {
                given: "Social media platforms have made political polarization worse. The algorithmic amplification of outrage, the collapse of local media, the shift from broadcast to peer-to-peer are well-documented. The research on this is substantial.",
                prompt: "Write the complication turn — something that makes the polarization argument harder without abandoning it. Not just it's complicated. Something specific. 40–100 words.",
              },
            ],
          },
          {
            label: "Complication earns its place",
            passThreshold: 65,
            wordCountMin: 50,
            wordCountMax: 100,
            criteria: [
              { name: "Complication is specific", description: "Not 'but it's more complex than that' — a precise, named thing that genuinely complicates the case.", weight: 0.45 },
              { name: "Complication is honest", description: "The writer doesn't minimize it — the difficulty is real, not hedged away.", weight: 0.35 },
              { name: "Original claim survives", description: "The argument is harder, not abandoned — the complication enriches rather than collapses.", weight: 0.2 },
            ],
            variants: [
              {
                given: "The argument for eating less meat on environmental grounds is solid. Animal agriculture accounts for significant greenhouse emissions. Land use, water use, and biodiversity loss all point the same direction. The arithmetic is not ambiguous.",
                prompt: "Write a specific, honest complication — something that genuinely makes this argument harder to act on or advocate for, without conceding that the underlying case is wrong. The complication must earn its place. 50–95 words.",
              },
              {
                given: "Diversity and inclusion initiatives in corporate America have largely failed to move the needle on representation at senior levels. Twenty years of programs, training, and stated commitments have produced marginal change. The gap between rhetoric and outcome is large.",
                prompt: "Write a specific, honest complication — something that makes this failure harder to characterize as pure corporate hypocrisy. Name the specific thing that complicates the easy conclusion. 50–95 words.",
              },
              {
                given: "The rise of AI writing tools will change what writing means as a skill. Work that relied on a fluency advantage — emails, reports, first drafts — is increasingly automatable. The market value of writing is already shifting.",
                prompt: "Write a specific, honest complication — something that makes this argument about AI and writing harder, without pretending the disruption isn't real. Must be precise, not vague. 50–95 words.",
              },
              {
                given: "Affirmative action in college admissions has been an imperfect but meaningful tool for increasing representation at elite universities. Students who benefited from these programs have gone on to positions that shape institutions. The downstream effects are real.",
                prompt: "Write a specific complication — something that makes the case for affirmative action harder without conceding the opposition's main argument. Honest and precise. 50–95 words.",
              },
              {
                given: "The gig economy has given certain workers — drivers, freelancers, delivery workers — a degree of scheduling flexibility they didn't have before. The ability to choose hours is real. For workers with caregiving responsibilities, this has genuine value.",
                prompt: "Write a specific complication — something that makes the flexibility argument for gig work harder, without simply restating the critique of precarity. What is specifically difficult here? 50–95 words.",
              },
            ],
          },
          {
            label: "Complication makes it more true",
            passThreshold: 75,
            wordCountMin: 80,
            wordCountMax: 200,
            criteria: [
              { name: "Argument is harder and more interesting", description: "The complication doesn't weaken the piece — it makes the argument feel more honest and therefore more credible.", weight: 0.4 },
              { name: "Complication is fully developed", description: "Not a one-line caveat — the complication gets real space and is treated with the same seriousness as the main argument.", weight: 0.35 },
              { name: "Piece is stronger for the turn", description: "A reader who finishes the passage trusts the writer more because they acknowledged the difficulty.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a passage that makes a clear argument about meritocracy — then complicates it in a way that makes the argument stronger, not weaker. The complication gets real space. 80–180 words." },
              { prompt: "Write a passage that makes a clear argument about parenting advice culture — then complicates it honestly. The difficulty should make the piece more credible. The complication is fully developed. 80–180 words." },
              { prompt: "Write a passage that makes a clear argument about the relationship between money and happiness — then complicates it in a way that makes the argument more honest. Complication treated seriously. 80–180 words." },
              { prompt: "Write a passage that makes a clear argument about expertise and public trust — then complicates it. The complication makes the argument harder and more true. Fully developed. 80–180 words." },
              { prompt: "Write a passage that makes a clear argument about how social media has changed friendship — then complicates it honestly. The piece should be stronger for acknowledging the difficulty. 80–180 words." },
            ],
          },
        ],
      },

      {
        id: "turn-3",
        title: "The Zoom-Out",
        lesson:
          "The zoom-out turn starts small and specific — a scene, a detail, a single case — then widens to reveal what it represents. The specific thing earns the reader's attention. The zoom-out earns their time. The move: here's the small thing; here's what it means about the large thing. The danger is zooming too far. The generalization has to be earned by the specific — if the specific could have supported several different generalizations equally well, you haven't zoomed; you've leapt.",
        prompt:
          "Given a specific scene or detail, write the zoom-out — the sentence or paragraph that reveals what the small thing represents. The zoom must be earned: the specific thing should point toward this conclusion and not equally toward several others. 50–120 words.",
        wordCountMin: 40,
        wordCountMax: 130,
        criteria: [
          { name: "Zoom-out is present", description: "The turn moves from specific to general — the reader understands what the small thing represents.", weight: 0.5 },
          { name: "Zoom is earned by the specific", description: "The general claim follows from the particular — the specific pointed here and not equally elsewhere.", weight: 0.5 },
        ],
        stages: [
          {
            label: "Get wide",
            passThreshold: 50,
            wordCountMin: 40,
            wordCountMax: 130,
            criteria: [
              { name: "Movement from specific to general", description: "The turn widens — the reader leaves the scene with something larger.", weight: 0.55 },
              { name: "Connection is present", description: "The general claim is connected to the specific — not a non-sequitur.", weight: 0.45 },
            ],
            variants: [
              {
                given: "In 2007, when the first iPhone was announced, Steve Jobs described it as an iPod, a phone, and an internet communicator — three things. He said the word phone last. Within five years, the phone function was the least-used feature on the device for most people.",
                prompt: "Write the zoom-out — what does this detail reveal about something larger? Move from this specific to the general. 40–110 words.",
              },
              {
                given: "The term quiet quitting — doing the minimum required by a job without formally resigning — became a major discourse topic in 2022. The phrase went viral. Then journalists began pointing out that what it described had always existed and had previously been called having a job.",
                prompt: "Write the zoom-out — what does the naming of quiet quitting reveal about something larger? Move from this specific to the general. 40–110 words.",
              },
              {
                given: "LinkedIn's Top Voice badges, awarded to frequent contributors to the platform, have become a credential that people list on their actual résumés. A credential issued by the platform for using the platform, treated as evidence of professional distinction.",
                prompt: "Write the zoom-out — what does this credential phenomenon reveal about something larger? The specific should point toward the generalization. 40–110 words.",
              },
              {
                given: "When Borders Books closed in 2011, many longtime employees reported that the chain had spent its last years heavily investing in CD and DVD inventory as those markets collapsed, while underinvesting in its website and e-book capabilities.",
                prompt: "Write the zoom-out — what does the Borders story reveal about something larger? Move from this specific case to the general thing it illustrates. 40–110 words.",
              },
              {
                given: "The most-watched content on YouTube by total view hours is not produced by professional studios or major influencers. It is videos of someone playing a video game, or someone explaining something in a calm voice, or someone doing something quietly and repetitively for a long time.",
                prompt: "Write the zoom-out — what does this viewing pattern reveal about something larger? The specific should earn the generalization. 40–110 words.",
              },
            ],
          },
          {
            label: "Zoom is earned",
            passThreshold: 65,
            wordCountMin: 50,
            wordCountMax: 120,
            criteria: [
              { name: "Generalization is specific", description: "The claim reached by zooming out is itself specific — not this tells us something about human nature but a named, arguable claim.", weight: 0.45 },
              { name: "Specific earns this zoom and not another", description: "The particular detail pointed toward this generalization — another generalization would feel like a stretch from the same material.", weight: 0.35 },
              { name: "Zoom doesn't overreach", description: "The claim is proportionate — the small thing supports this size of generalization, not something larger.", weight: 0.2 },
            ],
            variants: [
              {
                given: "In the early days of Twitter, the platform's most prominent use case was breaking news — eyewitness accounts, real-time updates, the raw first draft of events. That's still how it's described in media narratives. The actual dominant use case, by volume and engagement, has been people arguing about things that already happened.",
                prompt: "Write the earned zoom-out — the generalization this specific points toward, not a different one equally available from the same material. Specific claim, proportionate. 50–110 words.",
              },
              {
                given: "The section of bookstores labeled Business is now dominated by books about personal habits, routines, mindsets, and individual optimization. Books about how industries work, how organizations fail, or how economic structures shape outcomes are shelved elsewhere, if stocked at all.",
                prompt: "Write the earned zoom-out — what does this shelf composition reveal? The specific should point toward this claim and not equally toward several others. Specific, proportionate. 50–110 words.",
              },
              {
                given: "TED talks — originally short, idea-dense presentations by practitioners — are now predominantly delivered by authors, consultants, and professional speakers whose primary product is the talk itself. The credential of having given a TED talk is used to book more speaking engagements.",
                prompt: "Write the earned zoom-out — what does this evolution of the TED talk reveal? The specific should point here and not equally elsewhere. Specific claim. 50–110 words.",
              },
              {
                given: "College application essays — a genre in which 17-year-olds are asked to produce a polished personal narrative about formative experiences — are now widely assisted by consultants, coaches, and increasingly AI. The genre asks for authenticity and is optimized for performance.",
                prompt: "Write the earned zoom-out — what does this genre and its optimization reveal about something larger? Specific, proportionate, earned by the particular. 50–110 words.",
              },
              {
                given: "The most-followed accounts on professional networking platforms are rarely people doing the most interesting work in their fields. They're people who are good at describing work in ways that generate engagement — which is a different skill, optimized for a different audience.",
                prompt: "Write the earned zoom-out — what does this follower dynamic reveal? The specific should point here, not equally to something else. Specific claim, not overreached. 50–110 words.",
              },
            ],
          },
          {
            label: "Zoom changes the stakes",
            passThreshold: 75,
            wordCountMin: 80,
            wordCountMax: 200,
            criteria: [
              { name: "Specific is fully rendered", description: "The scene or detail is given enough space that the reader is actually inside it before the zoom.", weight: 0.35 },
              { name: "Zoom reveals what the specific alone couldn't", description: "The widening makes the specific more significant than it appeared on its own — not just description, revelation.", weight: 0.4 },
              { name: "Stakes are clear after the zoom", description: "The reader finishes knowing why the small thing matters — not just that it represents something, but what that representation means.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a passage that starts with a specific, fully rendered scene about how people behave in open-plan offices — then zooms out to reveal what it means. The specific earns the zoom. Stakes are clear. 80–180 words." },
              { prompt: "Write a passage that starts with a specific detail about how people talk about their jobs on LinkedIn — then zooms out to reveal what it represents. The zoom reveals something the specific alone couldn't. 80–180 words." },
              { prompt: "Write a passage that starts with a specific, rendered scene about a performance review conversation — then zooms out to what this ritual reveals. Stakes clear after the zoom. 80–180 words." },
              { prompt: "Write a passage that starts with a specific detail about how news organizations cover tech companies — then zooms out to what it means. Specific earns the zoom; the widening reveals something the particular couldn't alone. 80–180 words." },
              { prompt: "Write a passage that starts with a specific scene about how people describe their career changes — then zooms out to what this narrative pattern reveals. Stakes are clear after the zoom. 80–180 words." },
            ],
          },
        ],
      },

      {
        id: "turn-4",
        title: "The Personal Turn",
        lesson:
          "The personal turn moves from argument to confession — or from observation to implication for the writer's own life. It's the moment an essay stops being about people and becomes about the writer too. The personal turn works not because vulnerability is inherently interesting but because it makes the argument concrete in the one way the writer can be certain of: their own experience. Done right, it doesn't make the essay smaller — it makes the claim feel lived-in rather than theoretical.",
        prompt:
          "Given an argument about people or we, write the turn where it becomes about you specifically. Not vague admission — a specific moment, habit, or recognition. The personal turn should make the argument more credible, not just more emotional. 50–110 words.",
        wordCountMin: 40,
        wordCountMax: 120,
        criteria: [
          { name: "Writer enters the piece", description: "The turn moves from third person or we to a specific first-person recognition or admission.", weight: 0.5 },
          { name: "Personal moment is specific", description: "Not I'm guilty of this too — a concrete moment, habit, or detail from the writer's own experience.", weight: 0.5 },
        ],
        stages: [
          {
            label: "Writer enters",
            passThreshold: 50,
            wordCountMin: 40,
            wordCountMax: 120,
            criteria: [
              { name: "First person appears", description: "The writer enters the piece — some specific self-implication, not just we all do this.", weight: 0.55 },
              { name: "Connection to the argument", description: "The personal moment is connected to the argument — not a tangent about the writer.", weight: 0.45 },
            ],
            variants: [
              {
                given: "We outsource our judgment constantly — to algorithms, to reviews, to what people we respect are watching. The friction of deciding has become unpleasant enough that we've made entire industries out of removing it. The recommendation is the product.",
                prompt: "Write the personal turn — where do you specifically outsource your judgment? A concrete moment or habit, not a vague admission. 40–100 words.",
              },
              {
                given: "People consume enormous amounts of content about doing things they never do. Podcasts about exercise listened to while sitting still. Books about focused work read in five-minute phone checks. The gap between intake and output is consistent and rarely examined.",
                prompt: "Write the personal turn — where specifically does this gap show up in your own life? Concrete, not vague. 40–100 words.",
              },
              {
                given: "The habit of performing competence — answering quickly, hedging rarely, projecting certainty — is so thoroughly rewarded in professional environments that most people don't notice when they've stopped being honest about what they don't know.",
                prompt: "Write the personal turn — where specifically do you perform competence rather than admit uncertainty? A concrete moment, not a general confession. 40–100 words.",
              },
              {
                given: "We seek feedback from people we know will be gentle with us. We ask the question in a way that contains the answer we want. We share our work with people who will be enthusiastic and withhold it from people who might see its problems.",
                prompt: "Write the personal turn — where specifically do you engineer feedback to get the answer you want? Concrete, specific to you. 40–100 words.",
              },
              {
                given: "People use busyness to avoid decisions. A full schedule is a legitimate excuse for not doing the thing you're ambivalent about. The ambivalence never has to be examined because the calendar already answered the question.",
                prompt: "Write the personal turn — where specifically do you use busyness to avoid something you're ambivalent about? Name the thing. 40–100 words.",
              },
            ],
          },
          {
            label: "Personal turn is specific",
            passThreshold: 65,
            wordCountMin: 50,
            wordCountMax: 110,
            criteria: [
              { name: "Specific concrete detail", description: "Not I'm guilty of this too — a named behavior, moment, or pattern from the writer's actual life.", weight: 0.5 },
              { name: "Not performative vulnerability", description: "The admission is honest, not performed — it doesn't feel designed to seem relatable.", weight: 0.3 },
              { name: "Connects argument to lived experience", description: "The personal turn makes the argument feel inhabited — the writer knows this from the inside.", weight: 0.2 },
            ],
            variants: [
              {
                given: "Most people who describe themselves as readers are describing an identity, not a practice. The books are bought, stacked, started, shelved. The identity persists regardless. Reading is the aspiration; having read is the brand.",
                prompt: "Write a specific personal turn — not I identify with this but a concrete detail about your own reading behavior that demonstrates the gap between identity and practice. Not performative. 50–100 words.",
              },
              {
                given: "The advice to just start — ship the imperfect thing, publish the rough draft, launch and iterate — is correct and still not followed by most of the people who give it. The advice is most popular among people who are, in some area of their life, also not following it.",
                prompt: "Write a specific personal turn — name the specific thing you haven't shipped, the draft you haven't published, the thing you're iterating toward but not launching. Concrete, not general. 50–100 words.",
              },
              {
                given: "People who write about productivity are often in a complicated relationship with their own productivity. The writing is, in part, working out the problem they haven't solved. The blog post about focus was written by someone struggling to focus.",
                prompt: "Write a specific personal turn — where does your writing or any output you produce outpace your actual practice? Name the gap with specificity. 50–100 words.",
              },
              {
                given: "Comparison is the mechanism by which ambition becomes either fuel or poison. The comparison that motivates you when you're behind the person you want to catch becomes the comparison that drains you when you've caught them and found someone further ahead.",
                prompt: "Write a specific personal turn — name the specific comparison you make most often, or the specific person you measure against. Concrete detail, not a general pattern. 50–100 words.",
              },
              {
                given: "We talk about finding your voice as if it were a discovery — uncovering something that was always there. But voice is closer to a construction: the accumulated choices about what to include, what to omit, what to say directly, and what to leave in the subtext.",
                prompt: "Write a specific personal turn — what specific choices have constructed your voice? Name them. Not I'm still finding mine but what's actually in there. 50–100 words.",
              },
            ],
          },
          {
            label: "Personal turn earns the argument",
            passThreshold: 75,
            wordCountMin: 80,
            wordCountMax: 200,
            criteria: [
              { name: "Personal moment is fully rendered", description: "The self-implication is given enough space to be real — not a line, an actual moment with detail.", weight: 0.35 },
              { name: "Personal makes the argument more credible", description: "The essay is stronger for the turn — the writer's specific experience is evidence for the claim, not just atmosphere.", weight: 0.4 },
              { name: "Turn doesn't become confession for its own sake", description: "The personal element serves the argument — it doesn't take the essay off-course into memoir.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a passage that makes an argument about how people relate to creative work they haven't finished — then turns personal. The personal moment should make the argument more credible. Fully rendered, serves the argument. 80–180 words." },
              { prompt: "Write a passage that makes an argument about how ambition changes in your 30s or 40s — then turns personal with specificity. The self-implication is real, not performed, and strengthens the case. 80–180 words." },
              { prompt: "Write a passage that makes an argument about how we consume information differently than we believe we do — then turns personal. The personal moment is evidence, not just confession. Fully rendered. 80–180 words." },
              { prompt: "Write a passage about the gap between the writing life as imagined and as practiced — then turn it personal. The specific detail should be the most honest thing in the piece. Serves the argument. 80–180 words." },
              { prompt: "Write a passage that makes an argument about how people respond to criticism — then turns to your own specific response. The personal turn makes the argument more true, not just more relatable. 80–180 words." },
            ],
          },
        ],
      },

      {
        id: "turn-5",
        title: "The Implication Turn",
        lesson:
          "The implication turn is the move where you follow an argument to where it actually leads — somewhere the reader might not have expected, and might not entirely like. The surface argument was the entrance. The implication is the destination. Done well, it feels like revelation: of course that's where this was always going. Done poorly, it feels like a pivot to a different argument. The key is that the implication must be earned by the argument — it follows, it doesn't just follow on from.",
        prompt:
          "Given a well-made argument, write the implication turn — where this argument actually leads, which is somewhere more uncomfortable or larger than the surface claim. The implication must follow from the argument, not just follow it. 50–100 words.",
        wordCountMin: 40,
        wordCountMax: 110,
        criteria: [
          { name: "Implication is present", description: "The turn follows the argument to a consequential conclusion — somewhere it hadn't yet gone.", weight: 0.5 },
          { name: "Implication follows from the argument", description: "The conclusion is earned by the case that was made — it follows logically, not arbitrarily.", weight: 0.5 },
        ],
        stages: [
          {
            label: "Follow the argument",
            passThreshold: 50,
            wordCountMin: 40,
            wordCountMax: 110,
            criteria: [
              { name: "Argument is extended", description: "The turn takes the argument somewhere it hadn't been — a consequence, a follow-on, a larger claim.", weight: 0.55 },
              { name: "Extension is connected", description: "The implication follows from the argument — it's not just a different topic.", weight: 0.45 },
            ],
            variants: [
              {
                given: "If the best predictor of academic achievement is parental income, and parental income is strongly correlated with zip code, then the quality of a school matters less than where it's located — and where it's located is determined by who can afford to live there.",
                prompt: "Write the implication turn — follow this argument to where it actually leads. What does it mean if this is true? 40–100 words.",
              },
              {
                given: "Most knowledge work is not measurable in real time. The outputs are long-cycle, collaborative, and contextual. Which means most management of knowledge workers is the management of inputs — hours, presence, activity — as a proxy for outputs that can't be directly observed.",
                prompt: "Write the implication turn — follow this argument to its conclusion. What does it actually mean if this is right? 40–100 words.",
              },
              {
                given: "If social media platforms are designed to maximize time-on-platform, and time-on-platform is maximized by emotional arousal, and emotional arousal is generated most efficiently by content that provokes fear, anger, or outrage, then the platforms are not accidentally serving more outrage — they are fulfilling their design function.",
                prompt: "Write the implication turn — follow this to where it leads. If this is the design function, what does that mean? 40–100 words.",
              },
              {
                given: "Writing that gets shared is not the same as writing that's read carefully. Shareable writing performs its argument in the headline or the first paragraph — the share happens before the reading is complete. Which means the incentives for viral writing are orthogonal to the incentives for writing that changes minds.",
                prompt: "Write the implication turn — follow this to its conclusion. What does this mean for writing, for media, for argument? 40–100 words.",
              },
              {
                given: "If expertise is increasingly available on demand — through AI, through search, through specialists you can access by the hour — then the value of having expertise is declining relative to the value of knowing what to do with it. The generalist who can integrate isn't obsolete; the narrow specialist might be.",
                prompt: "Write the implication turn — follow the argument to where it leads. What does this mean for education, for careers, for how people should be spending their time? 40–100 words.",
              },
            ],
          },
          {
            label: "Implication is specific",
            passThreshold: 65,
            wordCountMin: 50,
            wordCountMax: 100,
            criteria: [
              { name: "Implication names something specific", description: "Not this has implications — the implication itself is named: a specific consequence, obligation, or uncomfortable conclusion.", weight: 0.5 },
              { name: "Implication is uncomfortable or surprising", description: "The conclusion goes somewhere the reader didn't quite expect — not shocking, but somewhere the argument hadn't been taken yet.", weight: 0.3 },
              { name: "Follows the argument's own logic", description: "The implication is earned — it follows the argument's logic rather than borrowing its energy for a different destination.", weight: 0.2 },
            ],
            variants: [
              {
                given: "If the advice economy — the market for books, newsletters, courses, and coaching — profits from people remaining in need of advice, then the incentive is not to help people stop needing advice but to generate new categories of need. The successful advice business is not the one that produces the most capable people; it's the one that produces the most engaged students.",
                prompt: "Write a specific implication — name precisely what this means. Something the argument leads to that is uncomfortable or hasn't been said yet. Follows from the logic. 50–95 words.",
              },
              {
                given: "If the stories we tell about successful companies are almost always written after the fact — when success makes the early decisions look prescient — then business strategy as a field is largely the study of post-hoc rationalization. The framework was constructed after the outcome was known.",
                prompt: "Write a specific implication — where does this lead? Name the uncomfortable conclusion for the business book industry, for strategy, for how people make decisions. 50–95 words.",
              },
              {
                given: "If most people's political opinions are formed by their social group membership first and their reasoning second — if the reasoning is mostly post-hoc justification of the group position — then persuasion by argument is less effective than it appears. People who seem to be convinced by arguments may have simply moved groups.",
                prompt: "Write a specific implication — follow this to its conclusion. What does this mean for political writing, for public debate, for anyone trying to change minds? Name the specific thing. 50–95 words.",
              },
              {
                given: "If attention is a finite resource and every digital product is designed to maximize its capture, then the neutral choice — the choice to use a phone without strategic awareness — is not a free choice. It's a choice made in a context designed to produce a particular outcome.",
                prompt: "Write a specific implication — follow this to where it leads. What does the design of attention capture mean for how we think about agency, behavior, and responsibility? Specific. 50–95 words.",
              },
              {
                given: "If the most important factor in a writer getting better is the volume of feedback on their work, and most writers receive very little feedback after school, then the primary determinant of adult writing development is whether you happen to be in a context that provides feedback — which is largely a matter of luck and social capital.",
                prompt: "Write a specific implication — follow this argument to its conclusion. What does it mean for how writing is taught, for how writers develop, for advice about getting better? 50–95 words.",
              },
            ],
          },
          {
            label: "Implication is the real argument",
            passThreshold: 75,
            wordCountMin: 80,
            wordCountMax: 200,
            criteria: [
              { name: "Surface argument was the setup", description: "Looking back, the argument was leading here all along — the implication reveals the essay's actual destination.", weight: 0.4 },
              { name: "Implication is fully stated", description: "The conclusion gets space — it's not a one-line gesture but a fully articulated consequence.", weight: 0.35 },
              { name: "Reader finishes differently than they started", description: "The implication turn changes the reader's understanding of what the essay was about.", weight: 0.25 },
            ],
            variants: [
              { prompt: "Write a passage that builds an argument about credentialism — the use of degrees, certifications, and titles as proxies for competence — then reveals the implication that was the real argument all along. The implication fully stated, the reader finishes differently. 80–180 words." },
              { prompt: "Write a passage that builds an argument about the attention economy — then turns to the implication that makes it the real argument. The surface was the entrance; the implication is the destination. Fully stated. 80–180 words." },
              { prompt: "Write a passage that builds an argument about the way people choose careers — then reveals the implication the argument was leading to. Reader finishes with a different understanding of what the piece was about. 80–180 words." },
              { prompt: "Write a passage that builds an argument about feedback culture in professional environments — then follows it to the implication that is the real argument. The implication is uncomfortable and fully stated. 80–180 words." },
              { prompt: "Write a passage that builds an argument about the relationship between writing and thinking — then reveals the implication. The surface argument was setup; the implication is where the essay actually lives. Reader finishes differently. 80–180 words." },
            ],
          },
        ],
      },
    ],
  },

];

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getExercise(trackId: string, exerciseId: string): Exercise | undefined {
  return getTrack(trackId)?.exercises.find((e) => e.id === exerciseId);
}
