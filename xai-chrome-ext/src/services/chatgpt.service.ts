
export const getChatGPTweetResp = async (tweetText: string, prompt: string, instructions?: string[]) => {

    const apiKey = process.env.CHAT_GPT_API_KEY;
    const chatGtpModel = process.env.CHAT_GPT_MODEL;

    console.log(`Using model: ${chatGtpModel}`);
    let finalPrompt = prompt;

    if(instructions) {
        for(const inst of instructions) {
            finalPrompt += inst;
        }
    }

    const messages = [];

    messages.push( { role: "user", 'content': finalPrompt + `Here is the tweet: "${ tweetText }"` });
   
    return fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
            "messages": messages,
            model: chatGtpModel,
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })
    });
}
