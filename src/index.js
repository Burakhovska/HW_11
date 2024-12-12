
import axios from "axios";
import Notiflix from 'notiflix';
// import process from 'process';
// import { Buffer } from 'buffer';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// window.process = process;
// window.Buffer = Buffer;


const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let currentPage =1;
let searchQuery = "";



loadMore.addEventListener('click', onLoad);

function onLoad(){
    currentPage+=1;
    searcherPeactures(searchQuery, currentPage)
    .then(resp => {
        renderSearch(resp)
        const totalHits = resp.totalHits;
        const hitsLength = resp.hits.length;
        let totalPages =Math.ceil(totalHits/hitsLength);
        if(currentPage == totalPages){
            loadMore.hidden = true;
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          }
    })
    .catch(e => {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    })
}


searchForm.addEventListener('submit', onSearch);

function onSearch(evt){
evt.preventDefault()
gallery.innerHTML = "";
 
const valueSearch = new FormData(evt.currentTarget);
searchQuery = valueSearch.get("searchQuery")
searcherPeactures(searchQuery, currentPage)
    .then( async resp => {
        renderSearch(resp)
        const totalHits = resp.totalHits;
        const hitsLength = resp.hits.length;
        let totalPages =Math.ceil(totalHits/hitsLength);
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      if(currentPage !== totalPages){
        loadMore.hidden = false;

      }
    })
    .catch(e => {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    });
}

async function searcherPeactures(searchQuery, page=1) {

        const URL = 'https://pixabay.com/api/'
        const KEY=  '25270264-c044669eeb02d5452a01c2217';
        const Q =searchQuery;
        
        const params = {
        key: KEY,
        q: Q,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 40,
        page: page
    }
        try {
            const response = await axios.get(URL, {params});
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    

let lightbox = new SimpleLightbox('.gallery a', {
    captionPosition: "top",
    captionsData: 'alt',
    captionDelay: 250
});

function renderSearch(resp) {

    const arr = resp.hits;
        const markup = arr.map(({webformatURL, tags, likes, views,comments, downloads, largeImageURL}) => {
            return `<div class="photo-card">
                    <a class="gallery-link" href="${largeImageURL}">
                <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                   </a>
                <div class="info">
                    <p class="info-item">
                    <b>Likes ${likes}</b>
                    </p>
                    <p class="info-item">
                    <b>Views ${views}</b>
                    </p>
                    <p class="info-item">
                    <b>Comments ${comments}</b>
                    </p>
                    <p class="info-item">
                    <b>Downloads ${downloads}</b>
                    </p>
                </div>
                </div>`}).join("");

        gallery.insertAdjacentHTML("beforeend", markup);
        lightbox.refresh(); 


    }

