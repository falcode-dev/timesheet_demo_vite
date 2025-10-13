import React, { useState, useRef, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import "./Select.css";

export type SelectOption = {
    value: string;
    label: string;
};

type SelectProps = {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
};

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "選択してください",
    disabled = false,
    className = "",
}) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    // ✅ 外部クリックで閉じる
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find((opt) => opt.value === value)?.label;

    const handleSelect = (val: string) => {
        onChange?.(val);
        setOpen(false);
    };

    return (
        <div
            ref={wrapperRef}
            className={`select-wrapper ${open ? "open" : ""} ${disabled ? "disabled" : ""
                } ${className}`.trim()}
        >
            {/* 表示部分 */}
            <div
                className="select-display"
                onClick={() => !disabled && setOpen((prev) => !prev)}
            >
                <span
                    className={`select-text ${!selectedLabel ? "placeholder" : ""
                        }`}
                >
                    {selectedLabel || placeholder}
                </span>
                <span className="select-icon">
                    <FaIcons.FaChevronDown />
                </span>
            </div>

            {/* ドロップダウン */}
            {open && (
                <div className="select-option-list">
                    {options.length > 0 ? (
                        options.map((opt) => (
                            <div
                                key={opt.value}
                                className={`select-option ${opt.value === value ? "selected" : ""
                                    }`}
                                onClick={() => handleSelect(opt.value)}
                            >
                                {opt.label}
                            </div>
                        ))
                    ) : (
                        <div className="select-option empty">データがありません</div>
                    )}
                </div>
            )}
        </div>
    );
};
