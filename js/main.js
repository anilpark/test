import {Joke} from "./Joke.js";

window.onload = loaded;

function API() {
    const URLs = {
        random : () =>' https://api.chucknorris.io/jokes/random',
        category : category => `https://api.chucknorris.io/jokes/random?category=${category}`,
        search : request => `https://api.chucknorris.io/jokes/search?query=${request}`
    }

    return {
        getJoke: async function(type, param){
            const res = await fetch(URLs[type]( param ) );
            return await res.json();
        },
        getCategories: async function() {
            const CATEGORIES_URL = 'https://api.chucknorris.io/jokes/categories';

            let res = await fetch(CATEGORIES_URL);
            return await res.json();
        }
    }
}

function findJokes() {
    const way = document.forms.form.way.value;

    const api = new API();

    //to prevent error if no category selected or input is empty
    if(way !== 'random' && !getParam()) return;

    api.getJoke(way, getParam()).then(res => {
        clearJokeBox();

        if(res.total) res.result.forEach(item => new Joke(item).insert())
        else new Joke(res).insert();
    })

    function getParam() {
        switch (way) {
            case 'category':
                return document.forms.form.category.value;
            case 'search':
                return document.querySelector('#searchReq').value;
            default: return;
        }
    }
}

//better call this via setInterval to update existing jokes upd-time
function insertLiked() {
    const liked = JSON.parse( localStorage.getItem('liked') );
    if(liked) liked.forEach(item => {
        let likedJoke = new Joke(item);
        likedJoke.insertToLikedList();
    });
}

function clearJokeBox(){
    document.querySelector('.found-jokes-box').innerHTML = '';
}

function insertCategories(value) {
    let input = document.createElement('input');
    let div = document.querySelector('#categories-box');
    let label = document.createElement('label');

    input.type = 'radio';
    input.id = `cat-${value}`
    input.name = 'category';
    input.value = value;

    label.innerHTML = value;
    label.setAttribute('for',  `${input.id}`);
    div.append(input);
    div.append(label);
}

function loaded() {
    const api = new API();

    api.getCategories().then( res => {
        res.forEach( item => {
            insertCategories(item);
        } );
    });

    const btn = document.querySelector('.get-joke-btn');
    btn.onclick = findJokes;

    $('.burger').on('click', function(e) {
        e.preventDefault;
        $(this).toggleClass('burger-active');
        $('.favourite-section').toggleClass('shown');
        $('.main-container').toggleClass('hidden');
        $('.bg-shadow').toggleClass('shown');
    });

    insertLiked();
}