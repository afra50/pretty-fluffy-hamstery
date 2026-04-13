import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/ui/button.scss";

const Button = ({
  children,
  to,
  onClick,
  variant = "primary", // primary, secondary, outline, accent
  type = "button",
  className = "",
  ...props
}) => {
  // Wspólne klasy dla obu typów (button/link)
  const classNames = `custom-btn btn-${variant} ${className}`;

  // Jeśli jest podany adres 'to', renderujemy Link z react-router
  if (to) {
    return (
      <Link to={to} className={classNames} {...props}>
        {children}
      </Link>
    );
  }

  // W innym przypadku renderujemy zwykły button
  return (
    <button type={type} className={classNames} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
