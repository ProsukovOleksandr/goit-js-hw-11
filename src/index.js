import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {fetchData} from './api.js';
const formEl = document.querySelector('.search-form');
const inputEl = formEl[0];
const loadMoreBtn = document.querySelector('.load-more');
const galeryEl = document.querySelector('.gallery');
loadMoreBtn.classList.add('is-hidden');
let page;
let lightbox;
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
  return (html = `
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
    `);
}

formEl.addEventListener('submit', event => {
  event.preventDefault();
  page = 1;
  galeryEl.innerHTML = ' ';
  loadMoreBtn.classList.remove('is-hidden');
  console.log(fetchData())
  fetchData(inputEl.value, page, limit).then(headlines => {
      let data = headlines.data;
      if (data.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again'
        );
        return;
      }
      let cards = data.hits.map(element => {
        let card = createImgMarkup(element);
        return card;
      });
      galeryEl.insertAdjacentHTML('beforeend', cards.join(''));
      lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionsDelay: 250,
        disableScroll: false,
      });
    });
});

loadMoreBtn.addEventListener('click', () => {
  page += 1;
  fetchData(inputEl.value, page, limit).then(headlines => {
      let data = headlines.data;
     let cards = data.hits.map(element => {
        let card = createImgMarkup(element);
        return card;
      });
      galeryEl.insertAdjacentHTML('beforeend', cards.join(''));
      lightbox.refresh();
    })
    .catch(() => {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.classList.add('is-hidden');
    });
});
Notiflix.Notify.init({
  width: '280px',
  position: 'right-top', // 'right-top' - 'right-bottom' - 'left-top' - 'left-bottom' - 'center-top' - 'center-bottom' - 'center-center'
  distance: '10px',
  opacity: 1,
  borderRadius: '5px',
  rtl: false,
  timeout: 3000,
  messageMaxLength: 110,
  backOverlay: false,
  backOverlayColor: 'rgba(0,0,0,0.5)',
  plainText: true,
  showOnlyTheLastOne: false,
  clickToClose: false,
  pauseOnHover: true,

  ID: 'NotiflixNotify',
  className: 'notiflix-notify',
  zindex: 4001,
  fontFamily: 'Quicksand',
  fontSize: '13px',
  cssAnimation: true,
  cssAnimationDuration: 400,
  cssAnimationStyle: 'fade', // 'fade' - 'zoom' - 'from-right' - 'from-top' - 'from-bottom' - 'from-left'
  closeButton: false,
  useIcon: true,
  useFontAwesome: false,
  fontAwesomeIconStyle: 'basic', // 'basic' - 'shadow'
  fontAwesomeIconSize: '34px',

  failure: {
    background: '#ff5549',
    textColor: '#fff',
    childClassName: 'notiflix-notify-failure',
    notiflixIconColor: 'rgba(0,0,0,0.2)',
    fontAwesomeClassName: 'fas fa-times-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(255,85,73,0.2)',
  },
});
