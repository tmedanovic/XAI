import '../styles/injects.scss';
import * as tingle from 'tingle.js';
import { Spinner } from 'spin.js';
import Toastify from 'toastify-js';

import { getAllTweetDomElements } from './services/scrape.service';
import { ScrapedTweet } from "./models/scrapedTweet.models.";
import { getChatGPTweetResp } from './services/chatgpt.service';
import { replyToTweet } from './services/xai.service';
import { spinnerOpts } from './services/spinner.service';
import { elementReady } from './util/domHelper';
import { gptAnswerChoices, gptInstructions } from './options/instructions';
import { showImgSearchView } from './imgSearchModal';

const tweetModalViewTmplate = require("./views/tweet.ejs");

async function generateGptResponse(scTweet: ScrapedTweet, prompt: string) {

    const gptta = document.querySelector(`#gpt-textarea`);
    const wrap = document.querySelector(`.xai-reply-wrapper`);
    const spinner = new Spinner(spinnerOpts).spin(<HTMLElement>wrap);

    try {

        const instructions: string[] = [];
        const cbs = document.querySelectorAll('.xai-cb-inst');
        cbs.forEach((instCb: HTMLInputElement) => {
            if (instCb.checked) {
                const instObj = gptInstructions.find(el => el.key === instCb.id);
                instructions.push(instObj.input);
            }
        });

        const gptResp = await getChatGPTweetResp(scTweet.contentText, prompt, instructions);

        if (!gptResp.ok) {
            spinner.stop();
            alert("Gpt API failed");
            return;
        }

        const gtpRespJson = await gptResp.json();

        gptta.innerHTML = gtpRespJson.choices[0].message.content;

        spinner.stop();
    } catch (err) {
        console.error(err);
        spinner.stop();
    }
}

async function reply(modal: tingle.modal, originalTweet: ScrapedTweet) {
    const modalEl = document.querySelector(".tingle-modal");
    const spinner = new Spinner(spinnerOpts).spin(<HTMLElement>modalEl);

    try {

        const replyTweetText = document.querySelector(`#gpt-textarea`).innerHTML;
        const attachedImg = document.querySelector(`.xai-selected-img`);
        let mediaIdString = null;

        if(attachedImg) {
            mediaIdString = attachedImg.getAttribute('data-img-src');
        }

        console.log(replyTweetText);
        await replyToTweet(originalTweet.tweetId, replyTweetText, mediaIdString);
        spinner.stop();
        modal.close();

        Toastify({
            text: "Sucessfully replied to tweet. Click on this notification to open the original tweet.",
            className: "xai-toast-success",
            close: true,
            newWindow: true,
            destination: `https://twitter.com/${originalTweet.userHandle}/status/${originalTweet.tweetId}`
        }).showToast();


    } catch (err) {
        spinner.stop();
        console.error(err);
    }
}

function renderReplyButton() {

    // scrape timeline tweets
    const tweetsScraped = getAllTweetDomElements();

    tweetsScraped.forEach(async scTweet => {

        // Add XAI reply button under each tweet
        const div = document.createElement('div');
        div.className = 'xai-tweet-footer-container';

        const buttonReply = document.createElement("button");
        buttonReply.id = "generated-reply";
        buttonReply.classList.add("xai-button");
        buttonReply.style.display = "flex";
        buttonReply.style.alignItems = "center";
        buttonReply.style.marginTop = "10px";

        buttonReply.onclick = () => {

            const modal = new tingle.modal({
                footer: true,
                stickyFooter: false,
                closeMethods: ['button', 'escape'],
                closeLabel: "Close",
                cssClass: ['tingle-custom-content'],
                onClose: function () {
                    modal.destroy();
                }
            });

            // Clone the original tweet element and remove button we added
            const clonedScTweetEl = <Element>scTweet.contentEl.cloneNode(true);
            const replyButtonChild = clonedScTweetEl.querySelector(".xai-tweet-footer-container");
            clonedScTweetEl.removeChild(replyButtonChild);

            const viewData = {
                originalTweetHtml: clonedScTweetEl.innerHTML,
                originalTweet: scTweet,
                choices: gptAnswerChoices,
                instructions: gptInstructions
            };

            const renderedHtml = tweetModalViewTmplate(viewData);
            modal.setContent(renderedHtml);
            modal.addFooterBtn('Tweet', 'tingle-btn tingle-btn--primary tingle-btn--pull-right', reply.bind(null, modal, scTweet));
            modal.open();

            document.querySelectorAll('.xai-btn-choice').forEach((choiceBtn: Element) => {

                choiceBtn.addEventListener("click", () => {
                    const prompt = choiceBtn.getAttribute('data-prompt');
                    generateGptResponse(scTweet, prompt);
                });
            });

            const imgSearchBtn = document.querySelector('.xai-btn-img-search');
            imgSearchBtn.addEventListener("click", () => {
                showImgSearchView();
            });

            const removeImgBtn = document.querySelector('.xai-selected-img-remove');

            removeImgBtn.addEventListener("click", () => {

                const thumbWrapper = <HTMLDivElement>document.querySelector('.xai-selected-img-wrapper');
                thumbWrapper.style.display = "none";

                const thumbImg = document.createElement('img');
                thumbImg.classList.add('xai-selected-img');

                const originalThumb = document.querySelector('.xai-selected-img');
                originalThumb.replaceWith(thumbImg);

            });
        };

        // Create XAI reply button
        const buttonText = document.createElement("span");
        buttonText.innerHTML = 'XAI reply';
        buttonReply.appendChild(buttonText);

        div.appendChild(buttonReply);

        scTweet.contentEl.appendChild(div);
    });
}

// Create XAI logo button
const xaiLogoWrapper = document.createElement("div");
xaiLogoWrapper.classList.add("xai-logo-wrapper");

const xaiLogo = document.createElement("span");
xaiLogo.innerText = "XAI";
xaiLogoWrapper.appendChild(xaiLogo);

window.document.querySelector("body").appendChild(xaiLogoWrapper);

// Render reply buttton when timeline loads
elementReady('[data-testid="tweet"]').then(() => {
    renderReplyButton();
});

window.onscroll = () => {
    renderReplyButton();
};