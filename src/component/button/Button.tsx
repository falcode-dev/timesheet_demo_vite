import React from "react";
import "./Button.css";

type ButtonProps = {
    label: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    color?: "primary" | "secondary";
    disabled?: boolean;
    icon?: React.ReactNode;
    className?: string;
};

export const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    type = "button",
    color = "primary",
    disabled = false,
    icon,
    className = "",
}) => {
    return (
        <button
            type={type}
            className={`btn btn-${color} ${disabled ? "btn-disabled" : ""} ${className}`.trim()}
            onClick={!disabled ? onClick : undefined}
        >
            {icon && <span className="btn-icon">{icon}</span>}
            <span>{label}</span>
        </button>
    );
};
