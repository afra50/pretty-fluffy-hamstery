import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/ui/button.scss";

const Button = ({
	children,
	to,
	onClick,
	variant = "primary", // dostępne: primary, secondary, outline, light
	type = "button",
	className = "",
	...props
}) => {
	// Zmiana na pojedynczy podkreślnik
	const classNames = `custom_btn btn_${variant} ${className}`;

	if (to) {
		return (
			<Link to={to} className={classNames} {...props}>
				{children}
			</Link>
		);
	}

	return (
		<button type={type} className={classNames} onClick={onClick} {...props}>
			{children}
		</button>
	);
};

export default Button;
