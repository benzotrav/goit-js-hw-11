import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import pictureCard from './hbs/cards.hbs';
import API from './api/getPicters.js';

const refs = {
    formEl: document.querySelector('.search-form'),
    galleryEl: document.querySelector('.gallery'), 
}

async function renderGallery() {
    const result = await API.getPicters();
    appendPicters(result.data.totalHits);
    
}
const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay:250,
    enableKeyboard: true,
});
lightbox.refresh()

refs.formEl.addEventListener('submit', onSearch)

function onSearch(e) {
    e.preventDefault();
    outputClear(); 
    API.params.page = 1;
    API.params.q = e.currentTarget.elements.searchQuery.value;
        if (API.params.q.trim() === "") {
            Notiflix.Notify.failure('Please fill in the field');
            return;
        }
        renderGallery();
    API.getPicters().then(({ data } = {}) => {
        appendPicters(data.hits);
        lightbox.refresh();
        if (data?.totalHits === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
            return;
        }        
            if (data?.totalHits !== 0) {
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

window.addEventListener("scroll", () => {
    const docRect = document.documentElement.getBoundingClientRect();
    if (docRect.bottom < document.documentElement.clientHeight + 150) {
        API.params.page += 1;
        API.getPicters().then(({ data } = {}) => {
            appendPicters(data?.hits);
            lightbox.refresh();
        });
    }
});
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