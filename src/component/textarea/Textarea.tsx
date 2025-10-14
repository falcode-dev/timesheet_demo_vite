import React, { useMemo } from "react";
import "./Textarea.css";

type TextareaProps = {
    label?: string; // ✅ ラベル（指定があれば表示）
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    showCount?: boolean; // ✅ カウンター表示
    maxLength?: number;  // ✅ 最大文字数
    className?: string;
};

export const Textarea: React.FC<TextareaProps> = ({
    label,
    value = "",
    onChange,
    placeholder = "",
    rows = 4,
    disabled = false,
    showCount = false,
    maxLength,
    className = "",
}) => {
    const charCount = useMemo(() => value.replace(/\n/g, "").length, [value]);
    const isOverLimit = maxLength !== undefined && charCount > maxLength;

    return (
        <div className={`textarea-wrapper ${className}`.trim()}>
            {/* ✅ ラベル＆カウンター横並び */}
            {(label || showCount) && (
                <div className="textarea-header">
                    {label && <label className="modal-label">{label}</label>}
                    {showCount && (
                        <span className={`textarea-count ${isOverLimit ? "over-limit" : ""}`}>
                            {charCount}
                            {maxLength ? ` / ${maxLength}` : ""}
                        </span>
                    )}
                </div>
            )}

            <div className="textarea-container">
                <textarea
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={disabled}
                    className={`textarea-field ${disabled ? "disabled" : ""}`}
                />
            </div>
        </div>
    );
};
