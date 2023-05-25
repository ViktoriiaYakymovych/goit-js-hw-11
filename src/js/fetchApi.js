import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36706686-66124fda296938ef4c6de376b';

export async function fetchApi(value, page) {
    const { data } = await axios.get(
    `${URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );

    return data;
};