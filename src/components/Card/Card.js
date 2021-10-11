import cx from 'classnames';
import { cards } from './graphics';
import './Card.css';

import { CARD_SUITS, CARD_NAMES } from '../DeckOfCards/constants';

const Card = ({ value, suit, style, flipped }) => {
  const suitName = CARD_SUITS[suit];
  const cardName = CARD_NAMES[value];

  const CardSVG =
    suit != null ? cards[`${cardName}${suitName}`] : cards[cardName];

  return (
    <div
      style={style}
      className={cx('Card', {
        [`Card--${suitName}`]: suit != null,
      })}
    >
      {flipped && <div className="Card__back" />}
      {CardSVG && (
        <div className="Card__inner">
          <CardSVG />
        </div>
      )}
    </div>
  );
};

export default Card;
