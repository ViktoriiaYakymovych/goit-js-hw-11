import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { refs } from './js/refs.js';
import { fetchApi } from './js/fetchApi.js';
import { createMarkup } from './js/createMarkup.js';
import { renderMarkup } from './js/renderMarkup.js';
import { removeHidden } from './js/removeHidden.js';
import { addHidden } from './js/addHidden.js';
import { onclearInput } from './js/clearInput.js';
import { scrollBy } from './js/scrollBy.js';


let page = 1;
let searchQuery = '';
let totalImages = 0;
const gallery = new SimpleLightbox('.gallery a');


refs.searchFormEl.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();
    searchQuery = e.target.searchQuery.value.trim();
    onclearInput();
    page = 1;
    totalImages = 0;

    refs.galleryEl.innerHTML = '';

    if (searchQuery === '') {
        addHidden();
        return Notiflix.Notify.info('Please write something')};

    try {
        const resp = await fetchApi(searchQuery, page);
        console.log(resp.hits);

        if (resp.hits.length === 0) {
        return Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
        );
        }

        if (resp.hits.length >= 40)
        removeHidden();

        const markup = await createMarkup(resp.hits);

        renderMarkup(markup);
        Notiflix.Notify.success(`Hooray! We found ${resp.totalHits} images.`);

        totalImages += resp.hits.length;
        scrollBy();

        gallery.refresh();

    } catch (err) {
        console.log(err);
    }
}

refs.loadMoreBtn.addEventListener('click', onClick);

async function onClick() {
page += 1;
try {
    const resp = await fetchApi(searchQuery, page);
    totalImages += resp.hits.length;
    if (totalImages >= resp.totalHits) {
        addHidden();

        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
        const markup = await createMarkup(resp.hits);

        renderMarkup(markup);
        
        scrollBy();
        gallery.refresh();
    } catch (error) {
        console.log(error);
    }
};


