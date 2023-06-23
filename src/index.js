import SimpleLightbox from 'simplelightbox';
import { initNotify } from './notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchData } from './api.js';
const formEl = document.querySelector('.search-form');
const inputEl = formEl[0];
const loadMoreBtn = document.querySelector('.load-more');
const galeryEl = document.querySelector('.gallery');
loadMoreBtn.classList.add('is-hidden');
let page;
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsDelay: 250,
  disableScroll: false,
});
const limit = 40;
function createImgMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  let html = `
  <div class="photo-card">
<a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags} loading="lazy"></a>
<div class="info">
  <p class="info-item">
    <b>Likes</b>
    ${likes}
  </p>
  <p class="info-item">
    <b>Views</b>
    ${views}
  </p>
  <p class="info-item">
    <b>Comments</b>
    ${comments}
  </p>
  <p class="info-item">
    <b>Downloads</b>
    ${downloads}
  </p>
</div>
</div>
`;
  return html;
}
formEl.addEventListener('submit', event => {
  event.preventDefault();
  if (inputEl.value.trim() === '') {
    return;
  }
  page = 1;
  galeryEl.innerHTML = ' ';
  fetchData(inputEl.value, page, limit).then(headlines => {
    let data = headlines.data;
    if (data.total === 0) {
      initNotify(
        'Sorry, there are no images matching your search query. Please try again'
      );
      return;
    }
    loadMoreBtn.classList.remove('is-hidden');
    let cards = data.hits.map(element => {
      let card = createImgMarkup(element);
      return card;
    });
    galeryEl.insertAdjacentHTML('beforeend', cards.join(''));
    lightbox.refresh();
  });
});

loadMoreBtn.addEventListener('click', () => {
  page += 1;
  fetchData(inputEl.value, page, limit)
    .then(headlines => {
      console.log(headlines);
      let data = headlines.data;
      if (data.hits.length < limit) {
        initNotify(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.classList.add('is-hidden');
      }
      let cards = data.hits.map(element => {
        let card = createImgMarkup(element);
        return card;
      });
      galeryEl.insertAdjacentHTML('beforeend', cards.join(''));
      lightbox.refresh();
    })
    .catch(() => {
      initNotify("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add('is-hidden');
    });
});
