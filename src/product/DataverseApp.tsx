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
import { formatToday } from "../utils/dateFormatter";
import { convertWorkOrdersToOptions } from "../utils/modalHelpers";
// 型定義は各コンポーネントで個別にインポート
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
        mainTab,
        setMainTab,
        isTimeEntryModalOpen,
        setIsTimeEntryModalOpen,
        isFavoriteTaskModalOpen,
        setIsFavoriteTaskModalOpen,
        isUserListModalOpen,
        setIsUserListModalOpen,
        selectedDateTime,
        setSelectedDateTime,
        selectedEvent,
        setSelectedEvent,
        handleTimeEntrySubmit,
        handleEventClick,
        handleDeleteTimeEntry,
        handleDuplicate,
        openNewTimeEntry,
        handleSaveFavoriteTasks,
        handleSaveUserList,
        handlePrev,
        handleNext,
        handleToday,
    } = useAppController();

    /** 今日の日付フォーマット（例：2025/10/14） */
    const formattedToday = formatToday();

    return (
        // Contextで全体をラップ
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
                    onDelete={handleDeleteTimeEntry}
                    onDuplicate={handleDuplicate}
                    selectedDateTime={selectedDateTime}
                    selectedEvent={selectedEvent}
                    woOptions={convertWorkOrdersToOptions(workOrders)}
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
