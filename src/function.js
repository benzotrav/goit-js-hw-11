import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import pictureCard from './hbs/cards.hbs';
import ApiService from './js/searcher.js';


const refs = {
    formEl: document.querySelector('.search-form'),
    galleryEl: document.querySelector('.gallery'),
     sentinel: document.querySelector('#sentinel'),
};
const apiService = new ApiService();

function renderGallery(data) {
    let markup = '';
    data.hits.map(item => { markup += pictureCard(item) });
  
    refs.galleryEl.insertAdjacentHTML("beforeend", markup);
}
const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay:250,
    enableKeyboard: true,
});
lightbox.refresh();

refs.formEl.addEventListener('submit', onSearch);

function onSearch(e) {
    e.preventDefault();
    outputClear(); 
    apiService.resetPage();
    apiService.query = e.currentTarget.elements.searchQuery.value;
        if (apiService.query.trim() === "") {
            Notiflix.Notify.failure('Please fill in the field');
            return;
        }
    apiService.getPicters().then(({ data }) => {
        appendPicters(data.hits);
        lightbox.refresh();
        if (data.totalHits === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
            return;
        }        
            if (data.totalHits !== 0) {
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images!`);
        }       
    });    
}   

function appendPicters(card) {
    refs.galleryEl.insertAdjacentHTML('beforeend', pictureCard(card));
}

function outputClear() {
    refs.galleryEl.innerHTML = '';
};   

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && apiService.query !== '') {
     apiService.incrementPage();
        apiService.getPicters().then(({ data }) => {
            appendPicters(data.hits);
            lightbox.refresh();
      });
    }
  });
};
const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.sentinel);

const offset = 700;
const scrollUp = document.querySelector('.scroll-up');
const getTop = () => window.pageYOffset || document.documentElement.scrollTop;

window.addEventListener('scroll', () => {
    if (getTop() > offset) {
        scrollUp.classList.add('scroll-up__active');
    } else {
        scrollUp.classList.remove('scroll-up__active');
    }
});
scrollUp.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
})