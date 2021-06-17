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
    document.querySelector(id).src = '/src/img/red_back.png';
  } else {
    // Change the card
    document.querySelector(id).src = `/src/img/${val}.png`;
  }
};

// export default function View() {
//   return {
export function getDOMstrings() {
  return DOMstrings;
}
export function updateCard(id, val) {
  changeImage(id, val);
}
export function flippedCards(cards) {
  // Flip cards over
  cards.forEach((card) => {
    changeImage(card, 'default');
  });
}
export function addCard(rec, id, val) {
  // Add card into UI
  let html = `<img class='${rec}-card${id}' src="src/img/${val}.png" />`;
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
}
export function removeCards(rec) {
  if (rec === 'player') {
    while (document.querySelector(DOMstrings.playerCard3)) {
      document.querySelector(DOMstrings.playerCard3).remove();
    }
  } else if (rec === 'dealer') {
    while (document.querySelector(DOMstrings.dealerCard3)) {
      document.querySelector(DOMstrings.dealerCard3).remove();
    }
  }
}
