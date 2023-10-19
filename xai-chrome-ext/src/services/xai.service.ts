export const createTweet = async (text? : string, mediaIdString? : string) => {

    const tweet = {};

    if(text) {
        Object.assign(tweet, { text: text});
    }

    if(mediaIdString) {
        Object.assign(tweet, { mediaIdString });
    }

    const rawResponse = await fetch(`${ process.env.XAI_SERVICE_URL }/api/v1/twitter/tweet`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tweet)
  });

  const content = await rawResponse.json();
  return content;

}

export const replyToTweet = async (inReplyToTweetId: string, text? : string, mediaIdString? : string) => {

    const tweet = {
      inReplyToTweetId
    };

    if(text) {
        Object.assign(tweet, { text: text});
    }

    if(mediaIdString) {
        Object.assign(tweet, { mediaIdString});
    }

    const rawResponse = await fetch(`${process.env.XAI_SERVICE_URL}/api/v1/twitter/tweet`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tweet)
  });

  const content = await rawResponse.json();
  return content;

}