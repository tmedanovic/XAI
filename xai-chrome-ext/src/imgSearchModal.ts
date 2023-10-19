import { Spinner } from "spin.js";
import { getImageResults } from "./services/googleimg.service";
import { spinnerOpts } from "./services/spinner.service";
import { Item } from "./models/googleImgSearchRes.model";
import * as tingle from 'tingle.js';

const imgSearchModalViewTmplate = require("./views/imgsearch.ejs");

export async function showImgSearchView() {

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

    const renderedHtml = imgSearchModalViewTmplate();
    modal.setContent(renderedHtml);


    modal.addFooterBtn('Close', 'tingle-btn tingle-btn--danger tingle-btn--pull-right', () => {
        modal.close();
    });

    modal.open();

    const imgSearchTxt = <HTMLInputElement>document.querySelector(".xai-txt-img-search");
    imgSearchTxt.focus();

    const imgSearchBtn = <HTMLInputElement>document.querySelector(".xai-btn-exec-img-search");

    const createThumbEl = (x: Item) => {

        const resThumbEl = <HTMLImageElement>document.createElement("img");
        resThumbEl.classList.add("xai-img-search-thumb");
        resThumbEl.src = x.image.thumbnailLink;
        resThumbEl.width = x.image.thumbnailWidth;

        resThumbEl.onerror = (e) => {
            const errImg = chrome.runtime.getURL("/images/sad-face.png");
            resThumbEl.src = errImg;
        };

        resThumbEl.setAttribute("data-img-src", x.link);
        resThumbEl.setAttribute("data-thumb-src", x.image.thumbnailLink);
        resThumbEl.setAttribute("data-thumb-width", x.image.thumbnailWidth.toString());

        resThumbEl.addEventListener("click", () => {

            const thumbs = document.querySelectorAll('.xai-img-search-thumb');
            thumbs.forEach((thumb) => {
                thumb.classList.remove('xai-img-search-thumb-selected');
            });
            resThumbEl.classList.add("xai-img-search-thumb-selected");

            const imgPreviewModal = new tingle.modal({
                footer: true,
                stickyFooter: false,
                closeMethods: ['button', 'escape'],
                closeLabel: "Close",
                cssClass: ['tingle-custom-content']
            });

            const imgPreviewWrapper = document.createElement('div');
            imgPreviewWrapper.style.display = "flex";
            imgPreviewWrapper.style.justifyContent = "center";

            const imgPreview = document.createElement("img");
            imgPreview.classList.add("xai-img-preview");
            imgPreview.src = x.link;

            imgPreviewWrapper.appendChild(imgPreview);

            imgPreviewModal.setContent(imgPreviewWrapper);
            imgPreviewModal.addFooterBtn('Attach image', 'tingle-btn tingle-btn--primary tingle-btn--pull-right xai-btn-select-img', () => {

                const selectedImgWrapper = <HTMLDivElement>document.querySelector('.xai-selected-img-wrapper ');
                const selectedImg = <HTMLImageElement>document.querySelector('.xai-img-search-thumb-selected');
                const tweetSelectedImg = <HTMLImageElement>document.querySelector('.xai-selected-img');
                const imgSrc = selectedImg.getAttribute("data-img-src");

                tweetSelectedImg.width = parseInt(selectedImg.getAttribute("data-thumb-width"));
                tweetSelectedImg.setAttribute("data-img-src", imgSrc);
                tweetSelectedImg.src = selectedImg.getAttribute("data-thumb-src");
                selectedImgWrapper.style.display = "block";

                tweetSelectedImg.addEventListener("click", () => {
                    Object.assign(document.createElement('a'), {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        href: imgSrc,
                    }).click();
                });

                imgPreviewModal.close();
                modal.close();

            });

            imgPreviewModal.addFooterBtn('Close', 'tingle-btn tingle-btn--danger tingle-btn--pull-right', () => {
                imgPreviewModal.close();
            });

            imgPreviewModal.open();
        });

        return resThumbEl;
    }

    imgSearchBtn.addEventListener("click", async () => {

        const imgResultsContainer = document.querySelector("#xai-tweet-img-results");
        const nextPageBtnWrapper = <HTMLDivElement>document.querySelector('.xai-img-next-page')

        // Remove previous results
        imgResultsContainer.innerHTML ='';
        nextPageBtnWrapper.innerHTML = '';

        const imgRes = await getImageResults(imgSearchTxt.value);

        imgRes.items.forEach(x => {
            const thumbEl = createThumbEl(x);
            imgResultsContainer.appendChild(thumbEl);
        });

        if (imgRes.queries.nextPage && imgRes.queries.nextPage.length > 0) {

            nextPageBtnWrapper.style.marginTop = "5px";
            const nextPageBtn = document.createElement("btn");
            nextPageBtn.innerHTML = "Load next page";
            nextPageBtn.style.width = "100%";
            nextPageBtn.style.textAlign = "center";
            nextPageBtn.classList.add("tingle-btn", "tingle-btn--deafult", "tingle-btn--small", "xai-img-search-next-page-btn");
            nextPageBtn.setAttribute("data-si-next", imgRes.queries.nextPage[0].startIndex.toString());

            nextPageBtn.addEventListener("click", async () => {

                const nextPage = nextPageBtn.getAttribute("data-si-next");

                if (nextPage) {

                    const spinner = new Spinner(spinnerOpts).spin(<HTMLElement>imgResultsContainer);
                    const imgRes2 = await getImageResults(imgSearchTxt.value, parseInt(nextPage));

                    imgRes2.items.forEach(x => {
                        const thumbEl = createThumbEl(x);
                        imgResultsContainer.appendChild(thumbEl);
                    });

                    if (imgRes2.queries.nextPage && imgRes2.queries.nextPage.length > 0) {
                        const nextpage2 = imgRes2.queries.nextPage[0].startIndex.toString();
                        nextPageBtn.setAttribute("data-si-next", nextpage2);
                    } else {
                        nextPageBtn.removeAttribute("data-si-next");
                    }

                    spinner.stop();

                    // Oh, this is so bad, let's pretend it's not here for now
                    setTimeout(() => {
                        imgResultsContainer.scrollTop = imgResultsContainer.scrollHeight;
                    }, 200);
                }

            });

            nextPageBtnWrapper.appendChild(nextPageBtn);
        }
    });
}