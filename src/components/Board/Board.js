import Card from '../Card/Card';
import useBoard from './useBoard';
import cx from 'classnames';
import './Board.css';

const Board = () => {
  const { deck, nextCard, counter, tap, round, finished, isMatching } =
    useBoard();

  return (
    <div className="Board">
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
        onClick={() => !finished && tap('player1')}
      >
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
      </div>
      <div className="Board__counter">{counter}</div>
      <button
        className="Board__next-button"
        onClick={nextCard}
        disabled={round !== 'player1' || finished}
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
