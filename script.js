'use strict';

let gameController = (function () {
  const data = {
    score: 0,
    highScore: 0,
    playerCards: [],
    dealerCards: [],
    playerTotal: 0,
    dealerTotal: 0,
  };

  const getTotals = () => {
    data.playerTotal = data.playerCards.reduce((a, b) => a + b, 0);
    data.dealerTotal = data.dealerCards.reduce((a, b) => a + b, 0);
  };

  let normalizeCardValue = (val, total) => {
    if (total === 'player') {
      total = data.playerTotal;
    } else {
      total = data.dealerTotal;
    }
    // ignore-prettier
    if (val === 1 && total + 11 <= 21) {
      val = 11;
      // ignore-prettier
    } else if (val === 1 && total + 11 > 21) {
      val = 1;
      // Dealing with face cards
    } else if (val === 11) {
      val = 10;
    }
    return val;
  };

  let bust = function (rec) {
    getTotals();
    if (rec === 'player') {
      if (data.playerTotal === 21) {
        data.playerTotal = 'Blackjack! 😁';
      } else if (data.playerTotal > 21) {
        data.playerTotal = 'You busted 😭';
      }
    } else {
      if (data.dealerTotal === 21) {
        data.dealerTotal = 'Blackjack! 😞';
      } else if (data.dealerTotal > 21) {
        //data.dealerTotal = 'Dealer busted, you win! 😎';
        return data.dealerTotal;
      }
    }
  };

  return {
    getGameState: () => {
      return data;
    },
    giveCard: function (rec, val) {
      if (rec === 'player') {
        data.playerCards.push(normalizeCardValue(val, 'player'));
        bust(rec);
      } else {
        data.dealerCards.push(normalizeCardValue(val, 'dealer'));
        bust(rec);
      }
      //return [rec, val];
    },
    getCard: function (rec) {
      let newCard;
      if (rec === 'player') {
        newCard = data.playerCards[data.playerCards.length - 1];
      } else {
        newCard = data.dealerCards[data.dealerCards.length - 1];
      }
      return newCard;
    },
    bust: val => {
      return bust(val);
    },
  };
})();

let UIController = (function () {
  const DOMstrings = {
    dealerCards: '.dealer-cards',
    dealerTotal: '.dealer-total',
    playerCards: '.player-cards',
    playerTotal: '.player-total',
    hit: '.btn-hit',
    stay: '.btn-stay',
    score: '.score',
    highScore: '.high-score',
    newGame: '.btn-new',
    actions: '.actions',
    dealerCard1: '#dealer-card1',
    dealerCard2: '#dealer-card2',
    dealerCard3: '.dealer-card3',
    playerCard1: '#player-card1',
    playerCard2: '#player-card2',
    playerCard3: '.player-card3',
  };

  let changeImage = (id, val) => {
    // For setting default cards
    if (val === 'default') {
      document.querySelector(id).src = './cards/red_back.png';
    } else {
      // Change the card
      document.querySelector(id).src = `./cards/${val}.png`;
    }
  };

  return {
    getDOMstrings: () => {
      return DOMstrings;
    },
    updateCard: (id, val) => {
      changeImage(id, val);
    },
    flippedCards: cards => {
      // Flip cards over
      cards.forEach(card => {
        changeImage(card, 'default');
      });
    },
    addCard: (rec, id, val) => {
      // Add card into UI
      let html = `<img class='${rec}-card${id}' src="./cards/${val}.png" />`;
      // the value of the card
      if (rec === 'player') {
        document
          .querySelector(DOMstrings.playerCards)
          .insertAdjacentHTML('beforeend', html);
      } else {
        document
          .querySelector(DOMstrings.dealerCards)
          .insertAdjacentHTML('beforeend', html);
      }
    },
    removeCards: rec => {
      if (rec === 'player') {
        while (document.querySelector(DOMstrings.playerCard3)) {
          document.querySelector(DOMstrings.playerCard3).remove();
        }
      } else if (rec === 'dealer') {
        while (document.querySelector(DOMstrings.dealerCard3)) {
          document.querySelector(DOMstrings.dealerCard3).remove();
        }
      }
    },
  };
})();

let appController = (function (gameCtrl, uiCtrl) {
  const DOM = uiCtrl.getDOMstrings();
  let data = gameCtrl.getGameState();

  let randomCard = () => {
    return Math.floor(Math.random() * 11 + 1);
  };

  let updateBoth = function (rec, id) {
    // Put card in data structure
    let newCard = randomCard();
    gameCtrl.giveCard(rec, newCard);
    // Put card in UI
    uiCtrl.updateCard(id, cardImgString(newCard));
  };

  const cardImgString = val => {
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

  let setDefaultValues = () => {
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
    gameCtrl.giveCard('dealer', randomCard());
    updateBoth('dealer', DOM.dealerCard2);
  };

  let setupEventListeners = () => {
    // New Game
    document.querySelector(DOM.newGame).addEventListener('click', () => {
      // Reset game state
      resetGameState();
      // Reset titles in UI
      setDefaultValues();
      // Reset cards in UI
      uiCtrl.removeCards('player');
      uiCtrl.removeCards('dealer');
      uiCtrl.updateCard(DOM.dealerCard1, 'default');
      gameCtrl.bust('player');
      document.querySelector(DOM.playerTotal).textContent = data.playerTotal;
    });
    // Hit
    document.querySelector(DOM.hit).addEventListener('click', () => {
      // Add the card to the data structure
      let newCard = randomCard();
      gameCtrl.giveCard('player', newCard);
      // Update the new total in the UI
      document.querySelector(DOM.playerTotal).textContent = data.playerTotal;
      // add another card in the ui
      uiCtrl.addCard('player', 3, cardImgString(newCard));
    });
    // Stay
    document.querySelector(DOM.stay).addEventListener('click', () => {
      // 1. Flip over dealer's other card and update dealer total
      let reveal = data.dealerCards[0];
      if (reveal === 11) {
        reveal = 10;
      }
      uiCtrl.updateCard(DOM.dealerCard1, cardImgString(reveal));
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
        gameCtrl.giveCard('dealer', newCard);
        // Update the new total in the UI
        document.querySelector(DOM.dealerTotal).textContent = data.dealerTotal;
        // add another card in the ui
        let newVal1 = gameCtrl.getCard('dealer');
        uiCtrl.addCard('dealer', 3, cardImgString(newVal1));
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
  return {
    init: function () {
      setupEventListeners();
      setDefaultValues();
      uiCtrl.flippedCards(cards);
      console.log('Application has started.');
    },
  };
})(gameController, UIController);

appController.init();
