import axios from 'axios';
import Notiflix from 'notiflix';

import { query, page, refs } from './function.js';
const PIXABAY_KEY = '27515696-8635174e5d1dc6e80848b95cf';
const LINK = 'https://pixabay.com/api/';

const per_page = 40;

export const notiflixOptions = Notiflix.Notify.init({
  width: '400px',
  position: 'top-right',
  distance: '50px',
  borderRadius: '10px',
  clickToClose: true,
  useIcon: false,
  fontSize: '23px',
});

const fetchPictures = async query => {
  try {
    const response = await axios(
      `${LINK}?image_type=photo&orientation=horisontal&safesearch=true&page=${page}&per_page=${per_page}&key=${PIXABAY_KEY}&q=${query}`,
    );

    const responseData = await response.data.hits;
    // console.log(response.data.hits);
    if (responseData.length === 0) {
      throw new Error();
    }
    // console.log(response);
    // console.log(page);
    if (page === 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`,
        notiflixOptions,
      );
    }
    return responseData;
  } catch (error) {
    // console.log(error);
    refs.btnLoadMore.setAttribute('disabled', 'disabled');
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      notiflixOptions,
    );
  }
};
async function renderMarkup() {
  try {
    const markup = await fetchPictures(query);
    const render = await markup
      .map(data => {
        return `<div  class="photo-card">
        <a href = '${data.largeImageURL}'>
          <img src="${data.webformatURL}" alt="${data.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>${data.likes}
            </p>
            <p class="info-item">
              <b>Views</b>${data.views}
            </p>
            <p class="info-item">
              <b>Comments</b>${data.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>${data.downloads}
            </p>
          </div>
          </a>
        </div>`;
      })
      .join('');

    await refs.gallery.insertAdjacentHTML('beforeend', render);
    refs.btnLoadMore.classList.remove('hidden');
    refs.btnSearchAnchor.classList.remove('hidden');
  } catch (error) {
    'error', error;
  }
}

export default renderMarkup;