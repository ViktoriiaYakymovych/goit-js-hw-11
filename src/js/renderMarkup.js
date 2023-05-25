import { refs } from "./refs.js";

export function renderMarkup(markup) { 
    refs.galleryEl.insertAdjacentHTML("beforeend", markup);
};