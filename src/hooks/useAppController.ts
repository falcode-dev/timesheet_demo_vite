// src/hooks/useAppController.ts
import { useState } from "react";
import { useWorkOrders } from "./useWorkOrders";
import { useOptionSets } from "./useOptionSets";
import { useEvents } from "./useEvents";
import { useCalendarController } from "./useCalendarController";
import { getUrlParams } from "../utils/url";

/**
 * DataverseApp 全体を統括するHook
 * - WorkOrder / OptionSet / Eventデータの取得と管理
 * - カレンダー操作（前・次・今日）
 * - モーダル状態制御
 * - イベントクリック時の詳細取得
 */
export const useAppController = () => {
    // -----------------------------
    // URLパラメータから recordid を取得
    // -----------------------------
    const { recordid } = getUrlParams();

    // -----------------------------
    // データ取得Hooks
    // -----------------------------
    const { workOrders, isLoading: woLoading } = useWorkOrders();
    const { optionSets, isLoading: osLoading } = useOptionSets();

    // -----------------------------
    // UIステート管理
    // -----------------------------
    const [selectedWO, setSelectedWO] = useState<string>(recordid || "all");
    const [viewMode, setViewMode] = useState<"1日" | "3日" | "週">("週"); // カレンダー表示モード
    const [currentDate, setCurrentDate] = useState(new Date()); // 現在表示中の日付
    const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState<{ start: Date; end: Date } | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    // -----------------------------
    // イベント関連Hooks
    // -----------------------------
    const {
        events,
        createOrUpdateEvent,
        refetchEvents,
        fetchEventDetail, // ✅ 追加：詳細取得関数
        isLoading: evLoading,
    } = useEvents(selectedWO);

    // -----------------------------
    // カレンダー操作
    // -----------------------------
    const { handlePrev, handleNext, handleToday } = useCalendarController(viewMode, setCurrentDate);

    // -----------------------------
    // TimeEntry登録・更新時の送信ハンドラ
    // -----------------------------
    const handleTimeEntrySubmit = async (data: any) => {
        await createOrUpdateEvent(data);
        await refetchEvents();
        setIsTimeEntryModalOpen(false);
        setSelectedEvent(null);
        setSelectedDateTime(null);
    };

    // -----------------------------
    // ✅ イベントクリック時の詳細取得処理
    // -----------------------------
    const handleEventClick = async (event: any) => {
        try {
            const detail = await fetchEventDetail(event.id);
            if (detail) {
                setSelectedEvent(detail);
                setSelectedDateTime({
                    start: new Date(detail.start),
                    end: new Date(detail.end),
                });
                setIsTimeEntryModalOpen(true);
            } else {
                console.warn("⚠️ 該当イベントが見つかりません:", event.id);
            }
        } catch (error) {
            console.error("❌ イベント詳細取得失敗:", error);
            alert("イベントの詳細取得に失敗しました。");
        }
    };

    // -----------------------------
    // 全体ローディング状態
    // -----------------------------
    const isLoading = woLoading || osLoading || evLoading;

    // -----------------------------
    // 返却値（DataverseApp.tsxに渡される）
    // -----------------------------
    return {
        // データ
        workOrders,
        optionSets,
        events,

        // ステート
        selectedWO,
        setSelectedWO,
        viewMode,
        setViewMode,
        currentDate,
        setCurrentDate,
        isTimeEntryModalOpen,
        setIsTimeEntryModalOpen,
        selectedDateTime,
        setSelectedDateTime,
        selectedEvent,
        setSelectedEvent,

        // 操作
        handleTimeEntrySubmit,
        handleEventClick, // ✅ 追加：クリック時処理
        handlePrev,
        handleNext,
        handleToday,

        // 手動リフェッチ
        refetchEvents,

        // ローディング状態
        isLoading,
    };
};
