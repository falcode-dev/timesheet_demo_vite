import { useState } from "react";
import { getUrlParams } from "../utils/url";
import type { MainTab, ViewMode, DateTimeRange, Event } from "../types";

/**
 * アプリケーションの状態管理フック
 * 画面状態とモーダル状態を管理
 */
export const useAppState = () => {
    /** URLパラメータから recordid を取得 */
    const { recordid } = getUrlParams();

    /** 画面状態管理 */
    const [selectedWO, setSelectedWO] = useState<string>(recordid || "all");
    const [viewMode, setViewMode] = useState<ViewMode>("週");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mainTab, setMainTab] = useState<MainTab>("user");

    /** モーダル状態管理 */
    const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = useState(false);
    const [isFavoriteTaskModalOpen, setIsFavoriteTaskModalOpen] = useState(false);
    const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);

    /** 選択状態管理 */
    const [selectedDateTime, setSelectedDateTime] = useState<DateTimeRange | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    return {
        // WorkOrder関連
        selectedWO,
        setSelectedWO,

        // 表示設定
        viewMode,
        setViewMode,
        currentDate,
        setCurrentDate,
        mainTab,
        setMainTab,

        // モーダル状態
        isTimeEntryModalOpen,
        setIsTimeEntryModalOpen,
        isFavoriteTaskModalOpen,
        setIsFavoriteTaskModalOpen,
        isUserListModalOpen,
        setIsUserListModalOpen,

        // 選択状態
        selectedDateTime,
        setSelectedDateTime,
        selectedEvent,
        setSelectedEvent,
    };
};
