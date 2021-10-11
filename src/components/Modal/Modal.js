import ReactDOM from 'react-dom';
import './Modal.css';

export default function Modal({ title, children }) {
  return ReactDOM.createPortal(
    <>
      <div className="Modal__overlay" />
      <div className="Modal">
        <h1>{title}</h1>
        <div className="Modal__content">{children}</div>
      </div>
    </>,
    document.getElementById('modal-root')
  );
}
