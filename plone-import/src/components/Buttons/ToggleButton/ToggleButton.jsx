import "./style.scss";

export const ToggleButton = ({ onClick, isToggled, disabled, children }) => {
  return (
    <div className="toggle-button">
      <button className={`toggle-button__${isToggled ? "on" : "off"}`} onClick={onClick} type="button" disabled={disabled}>
        {isToggled ? "ON" : "OFF"}
      </button>
      <p className="toggle-button__text">{children}</p>
    </div>
  );
};
