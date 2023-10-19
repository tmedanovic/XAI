export const gptAnswerChoices = [
    { 
        label: "Funny",
        prompt: "Reply to the user's tweet. You find it funny."
    },
    {
        label: "Angry",
        prompt: "Reply to the user's tweet. It makes you angry."
    },
    {
        label: "Agree",
        prompt: "Reply to the user's tweet. Agree with the user."
    },
    {
        label: "Disagree",
        prompt: "Reply to the user's tweet. Disagree with the user."
    },
    {
        label: "Sarcastic joke",
        prompt: "Reply to the user's tweet. Reply with sarcastic joke."
    },
    {
        label: "Interesting",
        prompt: "Reply to the user's tweet. You find tweet very interesting."
    },
    {
        label: "Disturbing",
        prompt: "Reply to the user's tweet. You find tweet very disturbing."
    },
    {
        label: "Wholesome",
        prompt: "Reply to the user's tweet. You find tweet very wholesome."
    },
    {
        label: "Sad",
        prompt: "Reply to the user's tweet. It makes you sad."
    }
];

export const gptInstructions = [
    {
        key: 'rng-spelling-mistake',
        label: "Create spelling mistake",
        input: "You must create one spelling mistake.",
        default: false
    },
    {
        key: 'keep-it-short',
        label: "Keep it short",
        input: "You must keep it short.",
        default: true
    },
    {
        key: 'exclude-hashtags',
        label: "Exclude hashtags",
        input: "Exclude hashtags.",
        default: true
    },
    {
        key: 'avoid-exclamation',
        label: "Avoid exclamation marks",
        input: "Avoid exclamation marks.",
        default: true
    },
    {
        key: 'use-capitalization-sparsely',
        label: "Use proper capitalization sparsely",
        input: "Randomly avoid capitalization rules.",
        default: true
    },
    {
        key: 'use-colloquial-language',
        label: "Use colloquial language",
        input: "Use colloquial language.",
        default: true
    },
    {
        key: 'ask-explanation',
        label: "Ask for explanation",
        input: "Ask for explanation.",
        default: false
    }
];