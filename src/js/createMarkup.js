export function createMarkup(data) {
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
    }, '' );
};