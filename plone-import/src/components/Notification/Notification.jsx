import { useState, useEffect } from "react";

import "./style.scss";

export const Notification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return isVisible ? (
    <div className={`notification__${type}`}>
      <p className="notification__message">{message}</p>
    </div>
  ) : null;
};
