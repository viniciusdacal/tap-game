import { useState, useEffect, useReducer, useRef } from 'react';

import DeckOfCards from '../DeckOfCards/DeckOfCards';

const getNextCounter = (counter) => (counter >= 13 ? 1 : counter + 1);

export default function useBoard() {
  const [whoScore, setWhoScore] = useState(null);
  const [gameState, setGameState] = useState('stopped');
  const [round, setRound] = useState('player1');
  const [counter, setCounter] = useState(0);
  const [tick, forceUpdate] = useReducer((x) => x + 1, 0);

  const deckDataRef = useRef(null);
  const counterRef = useRef(0);
  const tapRef = useRef(0);
  const timeoutRef = useRef(null);
  const gameStateRef = useRef(null);

  counterRef.current = counter;
  gameStateRef.current = gameState;

  const deck =
    deckDataRef.current ||
    (deckDataRef.current = new DeckOfCards({
      piles: {
        player1: [],
        computer: [],
        stack: [],
      },
      initialize(instance) {
        instance.shuffle();
        instance.giveTo(['player1', 'computer'], instance.deck.length);
      },
      onNewData() {
        const pilesLengths = [
          deck.piles.computer?.length,
          deck.piles.player1?.length,
        ];

        if (pilesLengths.includes(52)) {
          setGameState('finished');
          return;
        }

        if (
          pilesLengths.includes(0) &&
          counterRef.current !==
            deckDataRef.current.getLastCardFromPile('stack')?.value
        ) {
          setGameState('finished');
          return;
        }

        forceUpdate();
      },
    }));

  function tap(player) {
    const stack = deck.piles.stack;
    if (!stack.length) {
      return;
    }

    if (counterRef.current === stack[stack.length - 1]?.value) {
      setWhoScore(player);
      deck.moveTo('stack', player, deck.piles.stack.length);
    } else {
      setWhoScore(player === 'player1' ? 'computer' : 'player1');
      deck.moveTo(
        'stack',
        player === 'player1' ? 'computer' : 'player1',
        deck.piles.stack.length
      );
    }
    setCounter(0);
  }

  tapRef.current = tap;

  function start() {
    deck.reset();
    setCounter(0);
    setRound('player1');
    setGameState('started');
    setWhoScore(null);
  }

  function nextCard() {
    if (round !== 'player1' || gameStateRef.current !== 'started') {
      return;
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    deck.moveTo('player1', 'stack', 1);
    setCounter(getNextCounter(counterRef.current));
    setRound('computer');
  }

  useEffect(() => {
    if (round !== 'computer' || gameStateRef.current !== 'started') {
      return;
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (
        counterRef.current ===
        deckDataRef.current.getLastCardFromPile('stack')?.value
      ) {
        tapRef.current('computer');
      } else if (deck.piles.computer.length) {
        deck.moveTo('computer', 'stack', 1);
        const nextCounter = getNextCounter(counterRef.current);
        setCounter(nextCounter);

        if (
          nextCounter ===
          deckDataRef.current.getLastCardFromPile('stack')?.value
        ) {
          timeoutRef.current = window.setTimeout(() => {
            tapRef.current('computer');
          }, 2000);
        }
      }
      setRound('player1');
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  return {
    counter,
    deck,
    gameState,
    isMatching:
      counter === deckDataRef.current.getLastCardFromPile('stack')?.value,
    nextCard,
    round,
    start,
    tap,
    tick,
    whoScore,
  };
}
