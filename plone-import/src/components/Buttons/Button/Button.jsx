import "./style.scss";

export const Button = ({ children, disabled, onClick, styleType, type }) => {
  return (
    <button className={`button__${styleType}`} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
};
