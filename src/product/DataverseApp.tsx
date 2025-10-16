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
        handleEventClick, // ✅ ← 追加
        handlePrev,
        handleNext,
        handleToday,
    } = useAppController();

    // ✅ mainTabを追加（ユーザー／間接タスク）
    const [mainTab, setMainTab] = useState<"user" | "indirect">("user");

    // ✅ モーダル開閉状態を追加
    const [isFavoriteTaskModalOpen, setIsFavoriteTaskModalOpen] = useState(false);
    const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);

    // ✅ 保存ハンドラを追加
    const handleSaveFavoriteTasks = (tasks: string[]) => {
        console.log("✅ 保存されたお気に入りタスク:", tasks);
        setIsFavoriteTaskModalOpen(false);
    };

    const handleSaveUserList = (users: string[]) => {
        console.log("✅ 保存されたユーザー一覧:", users);
        setIsUserListModalOpen(false);
    };

    // ✅ 日付フォーマット（例：2025/10/14）
    const formattedToday = new Date().toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return (
        <div className="app-container">
            {/* =============================
                ヘッダー
            ============================= */}
            <Header
                workOrders={workOrders}
                selectedWO={selectedWO}
                setSelectedWO={setSelectedWO}
            />

            {/* =============================
                コンテンツ
            ============================= */}
            <section className="content-card">
                {/* 上部タブ＆日付ナビ */}
                <ContentHeader
                    mainTab={mainTab}
                    setMainTab={setMainTab}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    formattedToday={formattedToday}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onToday={handleToday}
                    onCreateNew={() => {
                        setSelectedDateTime({
                            start: new Date(),
                            end: new Date(new Date().getTime() + 60 * 60 * 1000),
                        });
                        setSelectedEvent(null);
                        setIsTimeEntryModalOpen(true);
                    }}
                />

                {/* 中央エリア：サイドバー＋カレンダー */}
                <div className="content-middle">
                    <Sidebar mainTab={mainTab} />

                    <div className="content-main">
                        <CalendarView
                            viewMode={viewMode}
                            currentDate={currentDate}
                            onDateChange={setCurrentDate}
                            onDateClick={(range) => {
                                // ✅ 新規作成モード
                                setSelectedDateTime(range);
                                setSelectedEvent(null);
                                setIsTimeEntryModalOpen(true);
                            }}
                            // ✅ 修正：クリック時は詳細取得ハンドラを呼び出す
                            onEventClick={handleEventClick}
                            events={events}
                        />
                    </div>
                </div>

                {/* 下部フッター */}
                <Footer
                    onOpenUserList={() => setIsUserListModalOpen(true)}
                    onOpenFavoriteTask={() => setIsFavoriteTaskModalOpen(true)}
                />
            </section>

            {/* =============================
                モーダル群
            ============================= */}
            <TimeEntryModal
                isOpen={isTimeEntryModalOpen}
                onClose={() => setIsTimeEntryModalOpen(false)}
                onSubmit={handleTimeEntrySubmit}
                selectedDateTime={selectedDateTime}
                selectedEvent={selectedEvent}
                woOptions={workOrders.map((w) => ({ value: w.id, label: w.name }))}
                maincategoryOptions={optionSets?.maincategory ?? []}
                timecategoryOptions={optionSets?.timecategory ?? []}
                paymenttypeOptions={optionSets?.paymenttype ?? []}
                locationOptions={optionSets?.timezone ?? []}
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
    );
};
