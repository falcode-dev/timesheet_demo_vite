import React, { useMemo } from "react";
import "./Textarea.css";

/** Textarea コンポーネントの Props 型 */
export type TextareaProps = {
    /** ラベル（任意） */
    label?: string;

    /** 入力値 */
    value?: string;

    /** 値変更ハンドラ */
    onChange?: (value: string) => void;

    /** プレースホルダー */
    placeholder?: string;

    /** 行数（デフォルト: 4） */
    rows?: number;

    /** 無効状態 */
    disabled?: boolean;

    /** 読み取り専用 */
    readOnly?: boolean;

    /** 文字数カウンターを表示 */
    showCount?: boolean;

    /** 最大文字数（指定時はオーバーで警告表示） */
    maxLength?: number;

    /** 追加クラス名 */
    className?: string;

    /** クリックハンドラ（任意） */
    onClick?: () => void;
};

/**
 * 共通 Textarea コンポーネント
 * - ラベル／文字数カウンター付き
 * - disabled / readOnly 対応
 * - コンパクトなデザイン・再利用性重視
 */
export const Textarea: React.FC<TextareaProps> = ({
    label,
    value = "",
    onChange,
    placeholder = "",
    rows = 4,
    disabled = false,
    readOnly = false,
    showCount = false,
    maxLength,
    className = "",
    onClick,
}) => {
    /** 改行を除いた文字数を算出 */
    const charCount = useMemo(() => value.replace(/\n/g, "").length, [value]);

    /** 文字数オーバー判定 */
    const isOverLimit = maxLength !== undefined && charCount > maxLength;

    /** コンテナクラス結合 */
    const wrapperClass = ["textarea-wrapper", className].filter(Boolean).join(" ");
    const textareaClass = [
        "textarea-field",
        disabled && "disabled",
        readOnly && "readonly",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={wrapperClass}>
            {/* ヘッダー：ラベル + カウンター */}
            {(label || showCount) && (
                <div className="textarea-header">
                    {label && <label className="textarea-label">{label}</label>}
                    {showCount && (
                        <span
                            className={`textarea-count ${isOverLimit ? "over-limit" : ""}`}
                        >
                            {charCount}
                            {maxLength ? ` / ${maxLength}` : ""}
                        </span>
                    )}
                </div>
            )}

            {/* 入力エリア */}
            <div className="textarea-container">
                <textarea
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    onClick={onClick}
                    placeholder={placeholder}
                    rows={rows}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={textareaClass}
                />
            </div>
        </div>
    );
};
