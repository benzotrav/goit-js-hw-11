import Notiflix from 'notiflix';
import imgTemplate from './hbs/addNewFiles.hbs';
import fetchApiByName from './api-service/pixabay-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API = new fetchApiByName();
const lightbox = new SimpleLightbox('.photo-link', {
  overlayOpacity: 0.4,
  animationSpeed: 100,
});

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  showMoreBtn: document.querySelector('.load-more '),
};

refs.form.addEventListener('submit', onSearchForm);
refs.showMoreBtn.addEventListener('click', onShowMore);

async function onSearchForm(e) {
  e.preventDefault();

  const inputValue = e.currentTarget.elements.searchQuery.value;

  if (inputValue === '') {
    chekInputNotEmpty();
    return;
  }

  API.resetPage();
  API.queryValue(inputValue);

  try {
    const result = await API.fetchDataFromPixabay();

    resetMarkup();
    rewrightMarkup(result);

    API.setTotalHits(result.data.totalHits);
    lightbox.refresh();
    Notiflix.Notify.success(`Hooray! We found ${API.totalHits} images.`);

    showShowMoreBtn();
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

async function onShowMore() {
  API.increasePage();

  if (API.totalHits <= 20) {
    chekEndOfTotalHits();
    return;
  }

  const result = await API.fetchDataFromPixabay();

  rewrightMarkup(result);
  scrollAfterShowMore();

  API.lastTotalHits();
  lightbox.refresh();
  Notiflix.Notify.success(`Hooray! We found ${API.totalHits} images.`);
}

function rewrightMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', imgTemplate(markup));
}

function resetMarkup() {
  refs.gallery.innerHTML = '';
}

function hideShowMoreBtn() {
  refs.showMoreBtn.classList.add('is-hidden');
}

function showShowMoreBtn() {
  refs.showMoreBtn.classList.remove('is-hidden');
}

function chekInputNotEmpty() {
  Notiflix.Notify.failure('Please enter something in search field');

  hideShowMoreBtn();
  resetMarkup();
}

function chekEndOfTotalHits() {
  hideShowMoreBtn();
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results");
}

function scrollAfterShowMore() {
  let verticalParams = 0;

  const intervalId = setInterval(() => {
    window.scrollBy(0, verticalParams);
    verticalParams += 1;

    if (verticalParams === 20) {
      clearInterval(intervalId);
    }
  }, 20);
}