import React from "react";
import "./Tabs.css";

/** タブの選択肢型 */
export type TabOption = {
    value: string;
    label: string;
};

/** Tabs コンポーネントの Props 型 */
export type TabsProps = {
    /** 表示するタブ一覧 */
    tabs: TabOption[];

    /** 現在アクティブなタブの値 */
    activeTab: string;

    /** タブ選択時のハンドラ */
    onChange: (value: string) => void;

    /** 無効状態 */
    disabled?: boolean;

    /** 追加クラス名 */
    className?: string;
};

/**
 * 共通 Tabs コンポーネント
 * - ボタン型のタブUI
 * - active / disabled 状態を制御
 * - シンプルで汎用的なデザイン
 */
export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onChange,
    disabled = false,
    className = "",
}) => {
    /** クラス構築 */
    const containerClass = ["tabs-container", className].filter(Boolean).join(" ");

    return (
        <div className={containerClass} role="tablist">
            {tabs.map((tab) => {
                const isActive = tab.value === activeTab;
                const tabClass = [
                    "tab-item",
                    isActive && "active",
                    disabled && "disabled",
                ]
                    .filter(Boolean)
                    .join(" ");

                return (
                    <button
                        key={tab.value}
                        className={tabClass}
                        onClick={() => !disabled && onChange(tab.value)}
                        disabled={disabled}
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};
