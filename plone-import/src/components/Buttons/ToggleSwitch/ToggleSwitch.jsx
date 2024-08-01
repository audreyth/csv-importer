import "./style.scss";

export const ToggleSwitch = ({ id, checked, onChange, label }) => {
  return (
    <div className="toggle-switch">
      <input type="checkbox" id={id} checked={checked} onChange={onChange} className="toggle-switch__checkbox" />
      <label className="toggle-switch__label" htmlFor={id}>
        <span className="toggle-switch__inner" />
        <span className="toggle-switch__switch" />
      </label>
      <span className="toggle-switch__text">{label}</span>
    </div>
  );
};
