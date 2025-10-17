import { useState } from "react";
import { useWorkOrders } from "./useWorkOrders";
import { useOptionSets } from "./useOptionSets";
import { useEvents } from "./useEvents";
import { useCalendarController } from "./useCalendarController";
import { getUrlParams } from "../utils/url";

/**
 * DataverseApp 全体の状態とロジックを統括するカスタムフック
 * - WorkOrder / OptionSet / Event の取得と管理
 * - カレンダー操作（日付遷移など）
 * - モーダルや選択状態の制御
 */
export const useAppController = () => {
    /** URLパラメータから recordid を取得 */
    const { recordid } = getUrlParams();

    /** データ取得フック */
    const { workOrders, isLoading: woLoading } = useWorkOrders();
    const { optionSets, isLoading: osLoading } = useOptionSets();

    /** 画面状態管理 */
    const [selectedWO, setSelectedWO] = useState<string>(recordid || "all");
    const [viewMode, setViewMode] = useState<"1日" | "3日" | "週">("週");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState<{ start: Date; end: Date } | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    /** イベント関連フック */
    const {
        events,
        createOrUpdateEvent,
        refetchEvents,
        fetchEventDetail,
        isLoading: evLoading,
    } = useEvents(selectedWO);

    /** カレンダー操作ハンドラ（前・次・今日） */
    const { handlePrev, handleNext, handleToday } = useCalendarController(viewMode, setCurrentDate);

    /** タイムエントリ登録・更新処理 */
    const handleTimeEntrySubmit = async (data: any) => {
        await createOrUpdateEvent(data);
        await refetchEvents();
        setIsTimeEntryModalOpen(false);
        setSelectedEvent(null);
        setSelectedDateTime(null);
    };

    /** イベントクリック時の詳細取得処理 */
    const handleEventClick = async (event: any) => {
        try {
            const detail = await fetchEventDetail(event.id);
            if (!detail) {
                console.warn("イベントが見つかりません:", event.id);
                return;
            }

            setSelectedEvent(detail);
            setSelectedDateTime({
                start: new Date(detail.start),
                end: new Date(detail.end),
            });
            setIsTimeEntryModalOpen(true);
        } catch (error) {
            console.error("イベント詳細取得エラー:", error);
            alert("イベントの詳細取得に失敗しました。");
        }
    };

    /** 全体のローディング状態 */
    const isLoading = woLoading || osLoading || evLoading;

    /** 外部へ公開する値・関数群 */
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

        // 操作ハンドラ
        handleTimeEntrySubmit,
        handleEventClick,
        handlePrev,
        handleNext,
        handleToday,

        // 手動再取得
        refetchEvents,

        // ローディング状態
        isLoading,
    };
};
