import { useState } from "react";
import { useWorkOrders } from "./useWorkOrders";
import { useOptionSets } from "./useOptionSets";
import { useEvents } from "./useEvents";
import { useCalendarController } from "./useCalendarController";
import { getUrlParams } from "../utils/url";
import { getXrm } from "../utils/xrmUtils"; // ✅ Dataverse接続確認
import { timeEntryClient } from "../api/dataverseClient/timeEntryClient"; // ✅ 削除API呼び出し

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

    /** 🗑 イベント削除処理 */
    const handleDeleteTimeEntry = async (id: string) => {
        const xrm = getXrm();

        try {
            if (!xrm) {
                // ✅ ローカルモード（mockEvents）
                const mockEvents = JSON.parse(localStorage.getItem("mockEvents") || "[]");
                const updated = mockEvents.filter((ev: any) => ev.id !== id);
                localStorage.setItem("mockEvents", JSON.stringify(updated));
                await refetchEvents();
                console.log(`ローカルイベント削除完了: ${id}`);
                return;
            }

            // ✅ Dataverse 環境：API経由で削除
            await timeEntryClient.deleteTimeEntry(id);
            await refetchEvents();
            console.log(`Dataverse イベント削除完了: ${id}`);
        } catch (error) {
            console.error("イベント削除中にエラーが発生しました:", error);
            alert("削除に失敗しました。");
        } finally {
            // ✅ 状態リセット
            setIsTimeEntryModalOpen(false);
            setSelectedEvent(null);
            setSelectedDateTime(null);
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
        handleDeleteTimeEntry, // ✅ ← 追加
        handlePrev,
        handleNext,
        handleToday,

        // 手動再取得
        refetchEvents,

        // ローディング状態
        isLoading,
    };
};
