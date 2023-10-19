export type TwitterTweetRequest = {
  body: {
    username: string;
    text?: string;
    mediaIdString?: string;
    inReplyToTweetId: string;
  };
};
