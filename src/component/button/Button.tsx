import React from "react";
import "./Button.css";

/** ボタンカラー種別 */
export type ButtonColor = "primary" | "secondary";

/** ボタンのProps型 */
export type ButtonProps = {
    /** ボタン内に表示するテキスト */
    label: string;

    /** クリック時のハンドラ */
    onClick?: () => void;

    /** ボタンタイプ */
    type?: "button" | "submit" | "reset";

    /** 色のバリエーション */
    color?: ButtonColor;

    /** 無効状態 */
    disabled?: boolean;

    /** ボタン左側のアイコン */
    icon?: React.ReactNode;

    /** 追加クラス */
    className?: string;
};

/**
 * 共通ボタンコンポーネント
 * - primary / secondary の色指定
 * - disabled 状態
 * - アイコン付きボタン対応
 */
export const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    type = "button",
    color = "primary",
    disabled = false,
    icon,
    className = "",
}) => {
    /** クラス名を整理して構築 */
    const classNames = [
        "btn",
        `btn-${color}`,
        disabled ? "btn-disabled" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={classNames}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled} // ← ネイティブ属性も適用（アクセシビリティ対応）
        >
            {icon && <span className="btn-icon">{icon}</span>}
            <span className="btn-label">{label}</span>
        </button>
    );
};
