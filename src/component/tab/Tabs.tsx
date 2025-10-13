import React from "react";
import "./Tabs.css";

export type TabOption = {
    value: string;
    label: string;
};

type TabsProps = {
    tabs: TabOption[];
    activeTab: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
};

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onChange,
    disabled = false,
    className = "",
}) => {
    return (
        <div className={`tabs-container ${className}`.trim()}>
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    className={`tab-item ${tab.value === activeTab ? "active" : ""
                        } ${disabled ? "disabled" : ""}`.trim()}
                    onClick={() => !disabled && onChange(tab.value)}
                    disabled={disabled}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
