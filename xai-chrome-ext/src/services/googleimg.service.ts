import { GoogleImgSearchResult } from "../models/googleImgSearchRes.model";

export const getImageResults = async (query: string, startIndex?: number): Promise<GoogleImgSearchResult> => {
    let url = `https://www.googleapis.com/customsearch/v1?key=${ process.env.GOOGLE_IMAGE_SEARCH_API_KEY }&cx=${ process.env.GOOGLE_IMAGE_SEARCH_API_CX }&searchType=image&q=${query}`;
    if(startIndex) {
        url += `$startIndex=${startIndex}`;
    }
    const rawResponse = await fetch(url);
    
    return <GoogleImgSearchResult>(<unknown> rawResponse.json());
}
