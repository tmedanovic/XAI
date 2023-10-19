# XAI

XAI is an X (Twitter) power tool which includes chrome extension and local REST service written in NodeJs for generating tweets using ChatGTP and Twitter API. 
It offers preset buttons that you can define yourself so you can reply or post tweets quickly.
It also includes Google Image Search API integration.

<div style="text-align:center">
    <img width="600px" src="https://github-instructions.s3.amazonaws.com/xai/xai_showcase_gif.gif" />
</div>

## Getting started

### Prerequisites

* Use paid ChatGPT account - it's only way to use ChatGPT API.
    * It works best with ChatGPT Plus subscription (20$/mo) where you can use chat-gpt-4 model
    * You can also use pay-as-you go model (pay per request but you are limited to ChatGPT 3.5) and it's not really good (don't do it)
* Create [ChatGPT API key](https://platform.openai.com/account/api-keys)
    <p align="left" width="100%">
        <img src="https://github-instructions.s3.amazonaws.com/xai/gpt_api_keys.png" />
    </p>
* Apply for [X Developer account](https://developer.twitter.com)
* Setup project on X Dashboard
    * Edit authentication settings
        * Change permissions to Read and Write
        * Set type of app to "Web app.."
        * Set required fields to https://localhost (doesn't matter but it's required)
        <p align="left" width="100%">
            <img src="https://github-instructions.s3.amazonaws.com/xai/x_app_settings.png" />
        </p>
    * Under project Keys and tokens:
        * Generate API key and secret
        * Generate Access token and secret
        <p align="left" width="100%">
            <img src="https://github-instructions.s3.amazonaws.com/xai/x_api_keys.png" />
        </p>

#### Optional
If you want to use Image search feature:
* Apply for [Google custom search API](https://developers.google.com/custom-search/v1/introduction)
    * Click the button "Get a key" and create a project, copy API key
    <p align="left" width="100%">
        <img src="https://github-instructions.s3.amazonaws.com/xai/gsearch_api1.png" />
    </p>
* Create [Gooole search API key](https://programmablesearchengine.google.com/controlpanel/create)
* Select "search the entire web" and "image search."
* Copy CX value from generated code
    <p align="left" width="100%">
        <img src="https://github-instructions.s3.amazonaws.com/xai/gsearch_api.png" />
    </p>

### Running the project

* Clone the project
* Run `npm install` in `xai-nodejs-backend` and `xai-chrome-ext` folders
* Create `.env` file in `xai-nodejs-backend` folder:
    ```
    NODE_ENV=development
    X_API_KEY=<Twitter API key you generated in previous step>
    X_API_SECRET=<Twitter API secret you generated in previous step>
    X_ACCESS_TOKEN=<Twitter access token you generated in previous step>
    X_ACCESS_SECRET=<Twitter access secret you generated in previous step>
    ```
* Create `.env` file in `xai-chrome-ext` folder:
    ```
    CHAT_GPT_API_KEY=<ChatGPT API key you generated in previous step>
    CHAT_GPT_MODEL=gpt-4
    XAI_SERVICE_URL=http://localhost:5000
    GOOGLE_IMAGE_SEARCH_API_KEY=<Google API key you generated in previous step>
    GOOGLE_IMAGE_SEARCH_API_CX=<Google cx generated in previous step>
    ```
* Start `xai-nodejs-backend` service using `npm run dev`
* Build `xai-chrome-ext` using `npm run start` for development mode, `npm run build` for production build
* Add the extension to Chrome:
    1. Go to `chrome://extensions/`
    2. Enable the `Developer mode`
    3. Click on `Load unpacked`
    4. Choose the `dist` directory inside of `xai-chrome-ext` folder 