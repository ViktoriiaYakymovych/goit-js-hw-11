import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const URL = 'https://pixabay.com/api/';
const API_KEY = '36706686-66124fda296938ef4c6de376b';

const refs = {
    searchFormEl: document.getElementById('search-form'),
    galleryEl: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};

let page = 1;
let searchQuery = '';
let totalImages = 0;
const gallery = new SimpleLightbox('.gallery');

async function fetchApi(value, page) {
    const { data } = await axios.get(
    `${URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=10`
    );

    return data;
}

refs.searchFormEl.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();
    searchQuery = e.target.searchQuery.value.trim();
    onclearInput();
    page = 1;
    totalImages = 0;

    refs.galleryEl.innerHTML = '';

    if (searchQuery === '') return Notiflix.Notify.info('Please write something');


    try {
        const resp = await fetchApi(searchQuery, page);
        console.log(resp.hits);

        if (resp.hits.length === 0) {
        return Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
        );
        }

        if (resp.hits.length >= 10)
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
}

function addHidden() {
    refs.loadMoreBtn.classList.add('hidden');
};

function removeHidden() {
    refs.loadMoreBtn.classList.remove('hidden');
}

function onclearInput() {
    refs.searchFormEl.reset();
};

function createMarkup(data) {
    return data.reduce(
    (
        markup,
        { webformatURL, largeImageURL, tags, likes, views, comments, downloads, }
    ) => {
        return (
        markup +
        `<div class="photo-card">
        <a href="${largeImageURL}" target="_blank"><img src="${webformatURL}" alt="${tags}" width='300' height='200' loading="lazy" /></a>
        <div class="info">
        <p class="info-item">
            <b>Likes: </b>
            <span>${likes}</span>
        </p>
        <p class="info-item">
            <b>Views: </b>
            <span>${views}</span>
        </p>
        <p class="info-item">
            <b>Comments: </b>
            <span>${comments}</span>
        </p>
        <p class="info-item">
            <b>Downloads: </b>
            <span>${downloads}</span>
        </p>
        </div>
        </div>`
            );
    },
    ''
    );
}

function renderMarkup(markup) { 
    refs.galleryEl.insertAdjacentHTML("beforeend", markup);
};

function scrollBy() { 
    const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
    });
}


