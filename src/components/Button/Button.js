import './Button.css';

export default function Button({ children, ...restProps }) {
  return (
    <button className="Button" {...restProps}>
      {children}
    </button>
  );
}
