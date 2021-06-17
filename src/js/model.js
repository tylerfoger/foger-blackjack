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

const normalizeCardValue = (val, total) => {
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

export function bust(rec) {
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
    }
  }
}
export function getGameState() {
  return data;
}

export function giveCard(rec, val) {
  if (rec === 'player') {
    data.playerCards.push(normalizeCardValue(val, 'player'));
    bust(rec);
  } else {
    data.dealerCards.push(normalizeCardValue(val, 'dealer'));
    bust(rec);
  }
}
export function getCard(rec) {
  let newCard;
  if (rec === 'player') {
    newCard = data.playerCards[data.playerCards.length - 1];
  } else {
    newCard = data.dealerCards[data.dealerCards.length - 1];
  }
  return newCard;
}
