//Create a list that holds all of your cards
let arrayOfCards = ['fa-anchor', 'fa-anchor', 'fa-bicycle', 'fa-bolt', 'fa-cube', 'fa-diamond', 'fa-diamond', 'fa-plane', 'fa-leaf', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-plane', 'fa-cube'];

let lock = false;       //to lock the card when clicked once
let firstClick = null, secondClick = null;
let li1 = null, li2 = null; //element of firstClick and secondClick
let score = document.querySelector('#final-score');
let scoreVal = 0;
let moves = 0;
let movesUsed = document.querySelector('#final-moves');
let lastTime = document.querySelector('#final-time');
let counter = document.querySelector('.moves');
let machedCard = 0;
const allStars = document.querySelectorAll('.fa-star');
let time = document.querySelector('.displayTime');
let startGame = true;
let gameInterval;
const buttonRestart = document.getElementsByClassName('restart');


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//Timer function that will update every second
function timer() {
    let minutes = 0;
    let seconds = 0;
    gameInterval = setInterval(function () {
        seconds = parseInt(seconds, 10) + 1;
        minutes = parseInt(minutes, 10);
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }
        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        time.innerHTML = minutes + ":" + seconds;
        lastTime.textContent = time.textContent;
    }, 1000);
}

//to add classes of 'open' and 'show' to the card when clicked
function displaySymbol(el) {
    el.classList.add("open");
    el.classList.add("show");
}

function closeUnmatchedCards() {
    let els = document.getElementsByClassName('unMatch');
    Array.from(els).forEach(el => {
        el.classList.remove('unMatch');
        el.classList.remove('show');
        el.classList.remove('open');
    });
}

function incCounter() {
    moves++;
    counter.innerHTML = moves;
    movesUsed.innerHTML = moves;
    //ratings based on moves
    if (moves <= 20 && moves !== 0) {
        changeRating();
    }
}

function changeRating() {
    if (moves <= 12) {      // 3 start rating
        return true;
    } else if (moves > 12 && moves <= 19) {     // 2 star rating
        allStars[0].classList.add('hide')
        allStars[3].classList.add('hide');
    } else if (moves > 19) {                    // 1 star rating
        allStars[1].classList.add('hide');
        allStars[4].classList.add('hide');
    }
}

function defaultValues() {
    // show stars again
    for (let i = 0; i < 3; i++) {
        allStars[i].classList.remove('hide');
    }

    // reset variables
    machedCard = 0;
    startGame = true;
    moves = 0;
    counter.textContent = 0;
    li1 = null;
    li2 = null;
}

// function to create a new card
const newCard = (cardClass) => {
    let li = document.createElement("li");
    li.classList.add("card");
    let icon = document.createElement("i");
    li.appendChild(icon);
    icon.classList.add("fa");
    icon.classList.add(cardClass);
    return li;
}

const pickACard = (card) => {
    card.addEventListener('click', function (e) {
        //start the timer at first click
        if (startGame === true) {
            timer();
            startGame = false;
        }
        let li = e.currentTarget;

        //if the card is already open then ignore it
        if (lock || li.classList.contains('open') && li.classList.contains('show')) {
            return true;
        }

        let icon = li.getElementsByClassName('fa')[0].className;

        if (firstClick === null && secondClick === null) {
            firstClick = icon;
            li1 = li;                                               // element of firstClick
        } else if (firstClick !== null && secondClick === null) {
            secondClick = icon;
            li2 = li;                                               // element secondClick

            if (firstClick === secondClick) {       //cards are matched
                li1.classList.add('match');
                li1.classList.add('true');
                li2.classList.add('match');
                li2.classList.add('true');
                scoreVal += 5;
                score.textContent = scoreVal;
                machedCard++;
                if (machedCard === 8) {
                    gameEnd();
                    $('#popup').modal('show');
                }
                // console.log('Right Choice ');
            } else {
                // console.log('Wrong Choice ');
                li1.classList.add('unMatch');
                li2.classList.add('unMatch');
                scoreVal -= 1 ;
                score.textContent = scoreVal;
                setTimeout(function () {
                    closeUnmatchedCards();
                }, 800)
            }
            incCounter();
            resetClick();
        }
        displaySymbol(li);
    })
}

function resetClick() {
    firstClick = null;
    secondClick = null;
}

function gameEnd() {
    clearInterval(gameInterval);
}

function gameStart() {
    defaultValues();    //to reset to default values

    resetClick();     //reset the click function

    gameEnd();    //stop the timer (for restart game)
    time.innerHTML = '00:00';

    let list = document.getElementsByClassName("deck");

    // clear the board 
    list[0].innerHTML = '';

    // shuffle array of cards for new pattern
    let cardsShuffled = shuffle(arrayOfCards);

    // add the new elements to DOM
    for (let card of cardsShuffled) {
        let li = newCard(card);
        list[0].appendChild(li);
    }

    let cards = list[0].getElementsByClassName("card")
    for (let card of cards) {
        pickACard(card);
    }

}

gameStart();

//when restart button is clicked, so game will start again
Array.from(buttonRestart).forEach(el => {
    el.addEventListener('click', function () {
        gameStart();
    })
});

