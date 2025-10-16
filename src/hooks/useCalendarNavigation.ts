// src/hooks/useCalendarNavigation.ts
import { useState } from "react";

/** カレンダーの日付ナビゲーション制御Hook */
export const useCalendarNavigation = (
    initialView: "1日" | "3日" | "週" = "週"
) => {
    const [viewMode, setViewMode] = useState<"1日" | "3日" | "週">(initialView);
    const [currentDate, setCurrentDate] = useState(new Date());

    const getShiftDays = () => {
        switch (viewMode) {
            case "1日":
                return 1;
            case "3日":
                return 3;
            default:
                return 7;
        }
    };

    const handlePrev = () =>
        setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - getShiftDays())));

    const handleNext = () =>
        setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + getShiftDays())));

    const handleToday = () => setCurrentDate(new Date());

    return {
        viewMode,
        setViewMode,
        currentDate,
        setCurrentDate,
        handlePrev,
        handleNext,
        handleToday,
    };
};
