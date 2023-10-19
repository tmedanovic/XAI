import express from 'express';
import fetch from "cross-fetch";
import 'dotenv/config';

//v1

import { TwitterClient } from 'twitter-api-client';

const twitterClientV1 = new TwitterClient({
  apiKey: <string>process.env.X_API_KEY,
  apiSecret: <string>process.env.X_API_SECRET,
  accessToken: <string>process.env.X_ACCESS_TOKEN,
  accessTokenSecret: <string>process.env.X_ACCESS_SECRET,
});

//v2
import { TwitterApi } from 'twitter-api-v2';
import { TwitterTweetRequest } from '../interfaces/twitterTweetRequest';
import { TwitterTweetResponse } from '../interfaces/twitterTweetResponse';

const twitterClientV2 = new TwitterApi({
  appKey: <string>process.env.X_API_KEY,
  appSecret: <string>process.env.X_API_SECRET,
  accessToken: <string>process.env.X_ACCESS_TOKEN,
  accessSecret: <string>process.env.X_ACCESS_SECRET,
});

const router = express.Router();

router.post<TwitterTweetRequest, TwitterTweetResponse>('/tweet', async (req, res) => {
  try {
 
      if(!req.body.mediaIdString && !req.body.text) {
        console.log(req.body);
        res.statusMessage = "No text or media provided";
        res.status(400);
        return;
      }

      let tweet = {};
      
      if (req.body.mediaIdString) {
        let mediaResponse = await uploadTweetImage(req.body.mediaIdString, twitterClientV1);
        Object.assign(tweet, { media: {  media_ids: [ mediaResponse.media_id_string ]} });
      };

      if(req.body.text) {
        Object.assign(tweet, { text: req.body.text });
      }

      if(req.body.inReplyToTweetId) {
        Object.assign(tweet, { reply: { in_reply_to_tweet_id: req.body.inReplyToTweetId } });
      }

      console.log(JSON.stringify(tweet));
      let tweetResp = twitterClientV2.v2.tweet(tweet);

      res.json({
        tweetId: (await tweetResp).data.id
      });

    } catch (err) {
      console.error(err);
      res.status(500);
    }
});

const uploadTweetImage = async (url: string, client: TwitterClient) => {

  var b64img: string = await getBase64FromUrl(url);

  const response = await client.media.mediaUpload({
    media_category: "tweet_image",
    media_data: b64img,
  });

  console.log(response.media_id_string);
  return response;

}

const getBase64FromUrl = async (url: string) => {
  const imageUrlData = await fetch(url);
  const buffer = await imageUrlData.arrayBuffer();
  const stringifiedBuffer = Buffer.from(buffer).toString('base64');
  return stringifiedBuffer;
}

export default router;
