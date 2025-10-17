import React, { forwardRef } from "react";
import "./Input.css";

/** Input コンポーネント Props 型 */
export type InputProps = {
    /** ラベル（任意） */
    label?: string;

    /** 入力値 */
    value?: string;

    /** 値変更ハンドラ */
    onChange?: (value: string) => void;

    /** プレースホルダーテキスト */
    placeholder?: string;

    /** input タイプ */
    type?: string;

    /** 無効状態 */
    disabled?: boolean;

    /** 追加クラス */
    className?: string;

    /** 幅（px, %, rem など指定可） */
    width?: string;

    /** 右側の装飾（アイコンなど） */
    suffix?: React.ReactNode;
};

/**
 * 共通 Input コンポーネント
 * - forwardRef 対応（例：ref.current?.showPicker()）
 * - width / suffix / disabled / label 対応
 * - アプリ全体でのフォーム共通デザインに利用
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
            width = "100%",
            suffix,
        },
        ref
    ) => {
        /** 入力変更時ハンドラ（null安全対応） */
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.value);
        };

        /** クラス構築 */
        const wrapperClass = ["input-wrapper", className].filter(Boolean).join(" ");
        const inputClass = ["input-field", disabled ? "disabled" : ""].filter(Boolean).join(" ");

        return (
            <div className={wrapperClass} style={{ width }}>
                {label && (
                    <label className="input-label">
                        {label}
                    </label>
                )}

                <div className="input-inner">
                    <input
                        ref={ref}
                        type={type}
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={inputClass}
                    />
                    {suffix && <span className="input-suffix">{suffix}</span>}
                </div>
            </div>
        );
    }
);

Input.displayName = "Input"; // forwardRefでのデバッグ名付与
