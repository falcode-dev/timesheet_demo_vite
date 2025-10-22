import { useState } from "react";
import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";
import { Footer } from "./layout/Footer";
import { ContentHeader } from "./layout/ContentHeader";
import { CalendarView } from "./calendar/CalendarView";
import { TimeEntryModal } from "./modal/timeentrymodal/TimeEntryModal";
import { FavoriteTaskModal } from "./modal/favoritetaskmodal/FavoriteTaskModal";
import { UserListModal } from "./modal/userlistmodal/UserListModal";
import { useAppController } from "../hooks/useAppController";
import { FavoriteTaskProvider } from "../context/FavoriteTaskContext";
import "./DataverseApp.css";

export const DataverseApp = () => {
    const {
        workOrders,
        optionSets,
        events,
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
        handleTimeEntrySubmit,
        handleEventClick,
        handlePrev,
        handleNext,
        handleToday,
        handleDeleteTimeEntry, // ✅ useAppController に削除処理を実装済みと想定
    } = useAppController();

    /** 現在のタブ状態（ユーザー／間接タスク） */
    const [mainTab, setMainTab] = useState<"user" | "indirect">("user");

    /** モーダル開閉状態 */
    const [isFavoriteTaskModalOpen, setIsFavoriteTaskModalOpen] = useState(false);
    const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);

    /** お気に入りタスク保存 */
    const handleSaveFavoriteTasks = (tasks: string[]) => {
        console.log("保存されたお気に入りタスク:", tasks);
        setIsFavoriteTaskModalOpen(false);
    };

    /** ユーザーリスト保存 */
    const handleSaveUserList = (users: string[]) => {
        console.log("保存されたユーザー一覧:", users);
        setIsUserListModalOpen(false);
    };

    /** 今日の日付フォーマット（例：2025/10/14） */
    const formattedToday = new Date().toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    /** 新規タイムエントリ作成時の共通処理 */
    const openNewTimeEntry = () => {
        const start = new Date();
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        setSelectedDateTime({ start, end });
        setSelectedEvent(null);
        setIsTimeEntryModalOpen(true);
    };

    /** 複製処理 */
    const handleDuplicate = (duplicateData: any) => {
        // 現在のモーダルを閉じる
        setIsTimeEntryModalOpen(false);

        // 少し遅延させてから複製モーダルを開く
        setTimeout(() => {
            // 複製データから日時を構築
            const start = new Date(`${duplicateData.startDate}T${duplicateData.startHour}:${duplicateData.startMinute}`);
            const end = new Date(`${duplicateData.endDate}T${duplicateData.endHour}:${duplicateData.endMinute}`);

            // 複製データをselectedEventとして設定（複製モードで開く）
            setSelectedEvent({
                start,
                end,
                workOrder: duplicateData.wo,
                endUser: duplicateData.endUser,
                timezone: duplicateData.timezone,
                resource: duplicateData.resource,
                timecategory: duplicateData.timeCategory,
                maincategory: duplicateData.mainCategory,
                paymenttype: duplicateData.paymentType,
                task: duplicateData.task,
                comment: duplicateData.comment,
                isDuplicate: true, // 複製フラグを追加
            });

            // selectedDateTimeをnullに設定して複製モードで開く
            setSelectedDateTime(null);

            // 複製モードでモーダルを開く
            setIsTimeEntryModalOpen(true);
        }, 100);
    };

    /** 🗑 削除処理 */
    const handleDeleteEvent = (id: string) => {
        console.log("削除対象イベントID:", id);
        if (handleDeleteTimeEntry) {
            handleDeleteTimeEntry(id);
        }
    };

    return (
        // ✅ Contextで全体をラップ
        <FavoriteTaskProvider>
            <div className="app-container">
                {/* ヘッダー */}
                <Header
                    workOrders={workOrders}
                    selectedWO={selectedWO}
                    setSelectedWO={setSelectedWO}
                />

                {/* メインコンテンツ */}
                <section className="content-card">
                    {/* 上部ナビゲーション */}
                    <ContentHeader
                        mainTab={mainTab}
                        setMainTab={setMainTab}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        formattedToday={formattedToday}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        onToday={handleToday}
                        onCreateNew={openNewTimeEntry}
                    />

                    {/* 中央：サイドバー＋カレンダー */}
                    <div className="content-middle">
                        {/* ✅ Sidebar が Context からお気に入りタスクを取得 */}
                        <Sidebar mainTab={mainTab} />

                        <div className="content-main">
                            <CalendarView
                                viewMode={viewMode}
                                currentDate={currentDate}
                                onDateChange={setCurrentDate}
                                onDateClick={(range) => {
                                    setSelectedDateTime(range);
                                    setSelectedEvent(null);
                                    setIsTimeEntryModalOpen(true);
                                }}
                                onEventClick={handleEventClick}
                                events={events}
                            />
                        </div>
                    </div>

                    {/* フッター */}
                    <Footer
                        onOpenUserList={() => setIsUserListModalOpen(true)}
                        onOpenFavoriteTask={() => setIsFavoriteTaskModalOpen(true)}
                    />
                </section>

                {/* モーダル群 */}
                <TimeEntryModal
                    isOpen={isTimeEntryModalOpen}
                    onClose={() => setIsTimeEntryModalOpen(false)}
                    onSubmit={handleTimeEntrySubmit}
                    onDelete={handleDeleteEvent} // ✅ 削除処理を追加
                    onDuplicate={handleDuplicate} // ✅ 複製処理を追加
                    selectedDateTime={selectedDateTime}
                    selectedEvent={selectedEvent}
                    woOptions={workOrders.map((w) => ({ value: w.id, label: w.name }))}
                    maincategoryOptions={optionSets?.maincategory ?? []}
                    timecategoryOptions={optionSets?.timecategory ?? []}
                    paymenttypeOptions={optionSets?.paymenttype ?? []}
                    timezoneOptions={optionSets?.timezone ?? []}
                />

                <FavoriteTaskModal
                    isOpen={isFavoriteTaskModalOpen}
                    onClose={() => setIsFavoriteTaskModalOpen(false)}
                    onSave={handleSaveFavoriteTasks}
                />

                <UserListModal
                    isOpen={isUserListModalOpen}
                    onClose={() => setIsUserListModalOpen(false)}
                    onSave={handleSaveUserList}
                />
            </div>
        </FavoriteTaskProvider>
    );
};
