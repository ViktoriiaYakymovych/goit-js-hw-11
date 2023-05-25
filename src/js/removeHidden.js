import { refs } from "./refs.js";

export function removeHidden() {
    refs.loadMoreBtn.classList.remove('hidden');
};