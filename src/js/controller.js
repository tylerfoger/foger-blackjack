import { bust, getGameState, getCard, giveCard } from './model.js';
import {
  getDOMstrings,
  updateCard,
  flippedCards,
  addCard,
  removeCards,
} from './view.js';

const DOM = getDOMstrings();
const data = getGameState();

const randomCard = () => {
  return Math.floor(Math.random() * 11 + 1);
};

const updateBoth = function (rec, id) {
  // Put card in data structure
  const newCard = randomCard();
  giveCard(rec, newCard);
  // Put card in UI
  updateCard(id, cardImgString(newCard));
};

// Assigns a random suite to the cards
const cardImgString = (val) => {
  let suite;
  let s = ['H', 'D', 'C', 'S'];
  s = s.sort(() => Math.random() - 0.5);
  suite = s.pop();

  if (val === 1) {
    val = 'A';
  } else if (val === 11) {
    const faceCards = ['K', 'Q', 'J'];
    val = faceCards[Math.floor(Math.random() * faceCards.length)];
  }
  return `${val}${suite}`;
};

const cards = [DOM.dealerCard2, DOM.playerCard1, DOM.playerCard2];

const setDefaultValues = () => {
  // Update Titles
  if (data.dealerCards[1]) {
    document.querySelector(DOM.dealerTotal).textContent = data.dealerCards[1];
  } else {
    document.querySelector(DOM.dealerTotal).textContent = 0;
  }
  document.querySelector(DOM.playerTotal).textContent = data.playerTotal;
  document.querySelector(DOM.score).textContent = '0';
  document.querySelector(DOM.dealerCard1, 'default');
};

const resetGameState = () => {
  // Reset game values
  data.playerTotal = 0;
  data.playerCards = [];
  data.dealerTotal = 0;
  data.dealerCards = [];

  // Give card and update UI
  updateBoth('player', DOM.playerCard1);
  updateBoth('player', DOM.playerCard2);
  giveCard('dealer', randomCard());
  updateBoth('dealer', DOM.dealerCard2);
};

const setupEventListeners = () => {
  // New Game
  document.querySelector(DOM.newGame).addEventListener('click', () => {
    // Reset game state
    resetGameState();
    // Reset titles in UI
    setDefaultValues();
    // Reset cards in UI
    removeCards('player');
    removeCards('dealer');
    updateCard(DOM.dealerCard1, 'default');
    bust('player');
    document.querySelector(DOM.playerTotal).textContent = data.playerTotal;
  });
  // Hit
  document.querySelector(DOM.hit).addEventListener('click', () => {
    // Add the card to the data structure
    let newCard = randomCard();
    giveCard('player', newCard);
    // Update the new total in the UI
    document.querySelector(DOM.playerTotal).textContent = data.playerTotal;
    // add another card in the ui
    addCard('player', 3, cardImgString(newCard));
  });
  // Stay
  document.querySelector(DOM.stay).addEventListener('click', () => {
    // 1. Flip over dealer's other card and update dealer total
    let reveal = data.dealerCards[0];
    if (reveal === 11) {
      reveal = 10;
    }
    updateCard(DOM.dealerCard1, cardImgString(reveal));
    document.querySelector(DOM.dealerTotal).textContent = data.dealerTotal;
    // 2. Give the dealer cards if they're under 16 and have a lower total than the player
    // prettier-ignore
    if (Number.isInteger(data.playerTotal) === false) {
      if (data.playerTotal === 'Blackjack! 😁') {
        data.playerTotal = 21;
      } else {
        data.playerTotal = 0;
      }
    }
    // prettier-ignore
    while ((data.dealerTotal < data.playerTotal) && (data.dealerTotal < 16)) {
      let newCard = randomCard();
      // Add the card to the data structure
      giveCard('dealer', newCard);
      // Update the new total in the UI
      document.querySelector(DOM.dealerTotal).textContent = data.dealerTotal;
      // add another card in the ui
      let newVal1 = getCard('dealer');
      addCard('dealer', 3, cardImgString(newVal1));
    }
    // prettier-ignore

    if (data.dealerTotal > 21) {
      document.querySelector(DOM.dealerTotal).textContent = `Dealer busted with a total of ${data.dealerTotal}! 😁`;
      document.querySelector(DOM.score).textContent = 'You win! 😎';
    } else if (data.playerTotal > data.dealerTotal) {
      document.querySelector(DOM.score).textContent = 'You win! 😎';
    } else {
      document.querySelector(DOM.score).textContent = 'You lose! 😭';
    }
  });
};

// Start the app
function init() {
  setupEventListeners();
  setDefaultValues();
  flippedCards(cards);
  console.log('Application has started.');
}

init();
