import React from "react";
import "./Input.css";

type InputProps = {
    label?: string; // 任意のラベル
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    className?: string; // ✅ 独自クラス対応
};

export const Input: React.FC<InputProps> = ({
    label,
    value = "",
    onChange,
    placeholder = "",
    type = "text",
    disabled = false,
    className = "",
}) => {
    return (
        <div className={`input-wrapper ${className}`.trim()}>
            {/* {label && <label className="input-label">{label}</label>} */}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`input-field ${disabled ? "disabled" : ""}`}
            />
        </div>
    );
};
