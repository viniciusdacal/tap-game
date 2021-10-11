import cx from 'classnames';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Card from '../Card/Card';
import useBoard from './useBoard';
import './Board.css';

const Board = () => {
  const {
    counter,
    deck,
    gameState,
    isMatching,
    nextCard,
    round,
    start,
    tap,
    tick,
    whoScore,
  } = useBoard();

  return (
    <div className="Board">
      {gameState === 'stopped' && (
        <Modal title="Tap">
          <strong>Hey, welcome</strong>
          <p>How this works?</p>
          <p>Two players will receive half of the deck.</p>
          <p>
            Each one will throw cards in the stack, one at a time, counting from
            1 to 13.
          </p>
          <p>
            If the card value in the stack matches the counting, the first one
            to tap the stack, get all stack for itself.
          </p>
          <p>
            If you tap the stack when it's not a match, the other player will
            receive the cards in the stack.
          </p>
          <p>You win when the other player looses all its cards.</p>
          <Button onClick={start}>Start</Button>
        </Modal>
      )}

      {gameState === 'finished' && (
        <Modal title="Tap">
          <strong>You {deck.piles.player1.length ? 'Win' : 'Loose'}</strong>
          {deck.piles.player1.length ? (
            <p>That's awesome! Congrats! Let's play another round.</p>
          ) : (
            <>
              <p>Whoops! Let's play another round.</p>
            </>
          )}
          <Button onClick={start}>Play Again</Button>
        </Modal>
      )}
      <div className="Board__other-player">
        {deck.piles.computer.map((_, index) => (
          <Card
            key={index}
            flipped
            style={
              index > 0
                ? {
                    top: 0,
                    position: 'absolute',
                    transform: `translateY(-${index * 1}px)`,
                  }
                : { position: 'relative', right: 0, top: 0 }
            }
          />
        ))}
      </div>
      <div
        className={cx('Board__stack', {
          'Board__stack--is-matching': isMatching,
        })}
        onClick={() => gameState === 'started' && tap('player1')}
      >
        {!deck.piles.stack.length && whoScore === 'computer' && (
          <FaArrowLeft key={tick} className="Board__stack__move-to-left" />
        )}
        {!deck.piles.stack.length && whoScore === 'player1' && (
          <FaArrowRight key={tick} className="Board__stack__move-to-right" />
        )}

        {deck.piles.stack.map((card, index) => (
          <Card
            key={index}
            suit={card.suit}
            value={card.value}
            style={{
              position: 'absolute',
              transform: `rotate(${index % 2 ? '-' : ''}${
                (index * 21) % 12
              }deg)`,
            }}
          />
        ))}
        <div className="Board__counter">{counter}</div>
      </div>
      <button
        className="Board__next-button"
        onClick={nextCard}
        disabled={round !== 'player1' || gameState !== 'started'}
      >
        {deck.piles.player1.map((_, index) => (
          <Card
            key={index}
            flipped
            style={
              index > 0
                ? {
                    top: 0,
                    position: 'absolute',
                    transform: `translateY(-${index * 1}px)`,
                  }
                : { position: 'relative', right: 0, top: 0 }
            }
          />
        ))}
      </button>
    </div>
  );
};

export default Board;
