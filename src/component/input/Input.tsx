import React, { forwardRef } from "react";
import "./Input.css";

type InputProps = {
    label?: string; // 任意のラベル
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    className?: string; // ✅ 独自クラス対応
    width?: string;
    suffix?: React.ReactNode; // ✅ アイコンなどを右側に表示
};

/**
 * ✅ forwardRef対応版 Input
 * - refを受け取れる（例：ref.current?.showPicker()）
 * - width・suffix対応
 * - 現行のデザイン・機能は変更なし
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            value = "",
            onChange,
            placeholder = "",
            type = "text",
            disabled = false,
            className = "",
            width,
            suffix,
        },
        ref
    ) => {
        return (
            <div
                className={`input-wrapper ${className}`.trim()}
                style={{ width: width || "100%" }}
            >
                {label && <label className="input-label">{label}</label>}
                <div className="input-inner">
                    <input
                        ref={ref}
                        type={type}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`input-field ${disabled ? "disabled" : ""}`}
                    />
                    {suffix && <span className="input-suffix">{suffix}</span>}
                </div>
            </div>
        );
    }
);
