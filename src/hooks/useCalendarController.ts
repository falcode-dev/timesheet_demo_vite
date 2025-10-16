// src/hooks/useCalendarController.ts
import type { Dispatch, SetStateAction } from "react";

/**
 * カレンダー操作ロジックを分離
 * @param viewMode 現在の表示モード ("1日" | "3日" | "週")
 * @param setCurrentDate 現在日付を更新するステートセッター
 */
export const useCalendarController = (
    viewMode: "1日" | "3日" | "週",
    setCurrentDate: Dispatch<SetStateAction<Date>>
) => {
    /** シフトする日数をモードに応じて取得 */
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

    /** 前の期間へ移動 */
    const handlePrev = () => {
        const days = getShiftDays();
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - days);
            return newDate;
        });
    };

    /** 次の期間へ移動 */
    const handleNext = () => {
        const days = getShiftDays();
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + days);
            return newDate;
        });
    };

    /** 今日に戻る */
    const handleToday = () => setCurrentDate(new Date());

    return { handlePrev, handleNext, handleToday };
};
