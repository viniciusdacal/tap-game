export default class DeckOfCards {
  constructor({ piles, hasJokers, initialize, onNewData } = {}) {
    this.hasJokers = hasJokers;
    this.deck = DeckOfCards.createDeck(hasJokers);
    this.piles = piles;
    this.initialize = initialize;

    this.initialize(this);

    this.onNewData = () => {
      if (this.isInitialized) {
        onNewData();
      }
    };
    this.isInitialized = true;
  }

  static createDeck(hasJokers) {
    const deck = Array.from({ length: 52 }).map((_, index) => {
      return {
        id: index,
        value: (index % 13) + 1,
        suit: Math.floor(index / 13) % 4,
      };
    });

    if (!hasJokers) {
      return deck;
    }

    return [...deck, { suit: null, value: 0 }, { suit: null, value: 0 }];
  }

  shuffle() {
    const deck = [...this.deck];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const currentCard = deck[i];
      const randomCard = deck[j];
      deck[i] = randomCard;
      deck[j] = currentCard;
    }

    this.deck = deck;

    return this;
  }

  next(totalCards) {
    const cards = this.deck.slice(0, totalCards);
    this.deck = this.deck.slice(totalCards, this.deck.length);

    return cards;
  }

  getDeck() {
    return this.deck;
  }

  getLastCardFromPile(pileName) {
    const pile = this.piles[pileName];
    return pile[pile.length - 1];
  }

  reset() {
    this.deck = DeckOfCards.createDeck(this.hasJokers);
    this.piles = Object.keys(this.piles).reduce(
      (acc, next) => ({
        ...acc,
        [next]: [],
      }),
      {}
    );

    this.initialize(this);
  }

  giveTo(pileNames, total) {
    const pileTotal = total / pileNames.length;

    const piles = {
      ...this.piles,
    };

    pileNames.forEach((pileName) => {
      piles[pileName] = this.next(pileTotal);
    });

    this.piles = piles;

    return this;
  }

  moveTo(fromPileName, toPileName, total) {
    if (!this.piles[fromPileName] || !this.piles[toPileName]) {
      return;
    }

    const fromPile = this.piles[fromPileName];
    const toPile = [...this.piles[toPileName], ...fromPile.slice(0, total)];

    this.piles = {
      ...this.piles,
      [fromPileName]: fromPile.slice(total, fromPile.length),
      [toPileName]: toPile,
    };
    this.onNewData();
  }
}
