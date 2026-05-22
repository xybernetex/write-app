export const freewitePrompts = [
  "Describe your commute this morning in as much detail as you can remember.",
  "What are you looking at right now? Write about it.",
  "Tell me about the last meal you ate.",
  "Describe someone you saw today.",
  "What did you do for the first hour after you woke up today?",
  "Write about a place you've been trying to forget about.",
  "Describe the view from a window you know well.",
  "What is something you do every day without thinking about it?",
  "Write about a time you were waiting for something.",
  "Describe the last weather you noticed.",
  "Write about something broken.",
  "What's the last thing someone said to you that you're still thinking about?",
  "Describe your hands.",
  "Write about something you own that you could never throw away.",
  "What happened the last time things went wrong in a small way?",
  "Write about someone you used to know.",
  "What's a rule you follow that nobody told you to follow?",
  "Describe a smell that takes you somewhere.",
  "Write about a time you changed your mind about something.",
  "Describe the room you're sitting in right now as if you've never seen it before.",
  "What is the best part of your current daily routine?",
  "Write about a conversation that didn't go the way you expected.",
  "Describe a sound you'd recognize anywhere.",
  "What is something you know how to do that most people don't?",
  "Write about a place you feel completely at ease.",
];

export const sentenceStarters = [
  "The last time I saw her, she was standing in the rain outside a gas station on Route 9, holding a coffee she hadn't touched.",
  "My father had a way of entering a room that made everyone in it suddenly feel they'd been caught doing something wrong.",
  "The thing about silence is that it's never actually silent.",
  "I didn't mean to stay as long as I did.",
  "Every morning, the same ritual: coffee, window, the maple tree, and the question I still haven't answered.",
  "The apartment smelled like someone who had just left.",
  "She said it like it was nothing, which is how I knew it was everything.",
  "Three weeks after the move, I still hadn't unpacked the box with my name on it.",
  "It was the kind of quiet that means something has just been decided.",
  "He was the sort of man who apologized for things that weren't his fault and never apologized for the things that were.",
  "I've been trying to write this for six years.",
  "There are things I know about that street that I've never told anyone.",
  "The last conversation I had with my mother was about nothing, which is what makes it so hard to forget.",
  "I found it in a box I wasn't supposed to open.",
  "What I remember most is the light.",
  "We didn't talk about it then, and we don't talk about it now, and somehow that has become the whole story.",
  "The dog died on a Tuesday in November, and my father cried for the first time I ever saw.",
  "She had a theory about everything, and most of her theories were right.",
  "I was late, which is how I missed it.",
  "The summer I turned fourteen, my grandmother taught me how to lie well.",
];

export type UnfoldingPath = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  questions: string[];
};

export const unfoldingPaths: UnfoldingPath[] = [
  {
    id: "place",
    title: "A Place",
    subtitle: "Somewhere you remember",
    icon: "◈",
    questions: [
      "Think of a place you haven't been in a long time. Name it — just write the name and where it was. Then write one sentence about what it looked like.",
      "Describe one thing in that place you can still picture clearly. Make it specific — not 'a table' but the particular table, its color, its surface.",
      "Was anyone else there? If yes, write one sentence about them. If no, write about what it felt like to be there alone.",
      "What did it smell like, or sound like? Pick one and write about it.",
      "Why does this place still come back to you? What does it mean to you now that it didn't then?",
    ],
  },
  {
    id: "person",
    title: "A Person",
    subtitle: "Someone from your own life",
    icon: "◉",
    questions: [
      "Think of someone specific from your own life — not a famous person. Write their name and one sentence about where you know them from.",
      "Describe one physical detail that is completely specific to them. Not 'tall' or 'dark hair' — something no one else has quite the same way.",
      "What do they want? Not their job or their life goals — what are they always, in some way, reaching for?",
      "Has this person ever surprised you? Write about one moment when they did something you didn't expect.",
      "What would you want to say to this person that you haven't said? Or what did you say that you wish you could take back?",
    ],
  },
  {
    id: "moment",
    title: "A Moment",
    subtitle: "Something that still stays with you",
    icon: "◎",
    questions: [
      "Think of something that happened to you — not the most dramatic thing, just something you still think about. Write one sentence: what happened.",
      "Where were you? Describe the physical place — the room, the street, the light.",
      "What did you do immediately after it happened?",
      "Have you told anyone about it? If yes, how did you describe it to them? If no, why not?",
      "What do you think it meant? Or — if you don't know yet — what do you wish it meant?",
    ],
  },
];
