import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as FaIcons from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./App.css";

import { Button } from "./component/button/Button";
import { Tabs } from "./component/tab/Tabs";
import type { TabOption } from "./component/tab/Tabs";
import { Select } from "./component/select/Select";
import { Input } from "./component/input/Input";
import { CalendarView } from "./product/calendar/CalendarView";
import { TimeEntryModal } from "./product/modal/timeentrymodal/TimeEntryModal";
import { FavoriteTaskModal } from "./product/modal/favoritetaskmodal/FavoriteTaskModal"; // ✅ 追加

import { useDataverse } from "./hooks/useDataverse";
import { dataverseClient } from "./api/dataverseClient";

/* =============================
   ユーティリティ
============================= */

/** ✅ URLパラメータ取得 */
const getUrlParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const obj: Record<string, string> = {};
  params.forEach((value, key) => {
    obj[key.toLowerCase()] = value;
  });
  return obj;
};

/* =============================
   メインアプリ本体
============================= */
const queryClient = new QueryClient();

function DataverseApp() {
  const { recordid } = getUrlParams();
  const { user, workOrderList, timeEntryList, optionSets } = useDataverse();

  // ----------------------------
  // 状態管理
  // ----------------------------
  const [selectedWO, setSelectedWO] = useState<string>(recordid || "all");
  const [viewMode, setViewMode] = useState<"1日" | "3日" | "週">("週");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTimeEntryModalOpen, setIsTimeEntryModalOpen] = useState(false);
  const [isFavoriteTaskModalOpen, setIsFavoriteTaskModalOpen] = useState(false); // ✅ 追加
  const [selectedDateTime, setSelectedDateTime] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  // ----------------------------
  // ✅ TimeEntry → FullCalendar イベント変換
  // ----------------------------
  useEffect(() => {
    if (!timeEntryList?.length) return;

    const filtered =
      !selectedWO || selectedWO === "all"
        ? timeEntryList
        : timeEntryList.filter((e: any) => e.workOrderId === selectedWO);

    const formatted = filtered.map((t: any) => ({
      id: t.id,
      title: t.name,
      start: t.start,
      end: t.end,
      workOrderId: t.workOrderId,
      extendedProps: t,
    }));

    setEvents(formatted);
  }, [selectedWO, timeEntryList]);

  // ----------------------------
  // TimeEntry 登録・更新
  // ----------------------------
  const handleTimeEntrySubmit = async (data: any) => {
    try {
      const isUpdate = data.id && events.some((ev) => ev.id === data.id);
      let result: any;

      if (isUpdate) {
        result = await dataverseClient.updateTimeEntry(data.id, data);
      } else {
        result = await dataverseClient.createTimeEntry(data);
      }

      console.log("✅ 登録・更新完了:", result);
      setIsTimeEntryModalOpen(false);
    } catch (err) {
      console.error("❌ 登録・更新失敗:", err);
      alert("保存に失敗しました。");
    }
  };

  // ----------------------------
  // ✅ お気に入りタスク保存処理
  // ----------------------------
  const handleSaveFavoriteTasks = (tasks: string[]) => {
    console.log("✅ 保存されたお気に入りタスク:", tasks);
    setIsFavoriteTaskModalOpen(false);
  };

  // ----------------------------
  // カレンダー操作
  // ----------------------------
  const getShiftDays = () => (viewMode === "1日" ? 1 : viewMode === "3日" ? 3 : 7);

  const handlePrev = () => {
    const days = getShiftDays();
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - days);
      return newDate;
    });
  };

  const handleNext = () => {
    const days = getShiftDays();
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };

  const handleToday = () => setCurrentDate(new Date());

  // ----------------------------
  // イベントクリック
  // ----------------------------
  const handleEventClick = (eventData: any) => {
    console.log("🟢 イベントクリック:", eventData);
    setSelectedEvent({
      id: eventData.id,
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      extendedProps: eventData.extendedProps,
    });
    setSelectedDateTime(null);
    setIsTimeEntryModalOpen(true);
  };

  // ----------------------------
  // 今日の日付固定表示
  // ----------------------------
  const today = new Date();
  const formattedToday = `${today.getFullYear()}年${String(today.getMonth() + 1).padStart(2, "0")}月${String(
    today.getDate()
  ).padStart(2, "0")}日`;

  // ----------------------------
  // タブ設定
  // ----------------------------
  const mainTabOptions: TabOption[] = [
    { value: "user", label: "ユーザー" },
    { value: "indirect", label: "間接タスク" },
  ];
  const [mainTab, setMainTab] = useState("user");

  // ----------------------------
  // JSX
  // ----------------------------
  return (
    <div className="app-container">
      {/* =============================
          ヘッダー
      ============================= */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="header-title">Time Sheet</h1>
        </div>

        <div className="header-right">
          <span className="header-label">対象WO</span>
          <Select
            options={[
              { value: "all", label: "すべて" },
              ...workOrderList.map((w: any) => ({
                value: w.id,
                label: w.name,
              })),
            ]}
            value={selectedWO}
            onChange={setSelectedWO}
            placeholder="対象WOを選択"
            className="wo-select"
          />
          <Button label="アップロード" color="primary" icon={<FaIcons.FaUpload />} />
        </div>
      </header>

      {/* =============================
          カードコンテンツ
      ============================= */}
      <section className="content-card">
        <div className="tab-header">
          <div className="tab-header-left">
            <Tabs tabs={mainTabOptions} activeTab={mainTab} onChange={setMainTab} className="main-tabs" />
            <Button
              label="新しいタイムエントリを作成"
              color="primary"
              icon={<FaIcons.FaPlus />}
              className="add-entry-button new-create-button"
              onClick={() => {
                setSelectedDateTime({
                  start: new Date(),
                  end: new Date(new Date().getTime() + 60 * 60 * 1000),
                });
                setSelectedEvent(null);
                setIsTimeEntryModalOpen(true);
              }}
            />
          </div>

          <div className="tab-header-right">
            <button className="today-button" onClick={handleToday}>
              <FaIcons.FaCalendarDay className="icon" /> 今日
            </button>
            <button className="arrow-button" onClick={handlePrev}>
              <IoIosArrowBack />
            </button>
            <button className="arrow-button" onClick={handleNext}>
              <IoIosArrowForward />
            </button>

            <div className="date-display">
              {formattedToday}
              <FaIcons.FaRegCalendarAlt className="date-icon" />
            </div>

            <div className="view-tabs">
              <button className={`view-tab ${viewMode === "1日" ? "active" : ""}`} onClick={() => setViewMode("1日")}>
                1日
              </button>
              <button className={`view-tab ${viewMode === "3日" ? "active" : ""}`} onClick={() => setViewMode("3日")}>
                3日
              </button>
              <button className={`view-tab ${viewMode === "週" ? "active" : ""}`} onClick={() => setViewMode("週")}>
                週
              </button>
            </div>
          </div>
        </div>

        {/* =============================
            中央コンテンツ
        ============================= */}
        <div className="content-middle">
          {/* サイドバー */}
          <aside className="sidebar-container">
            <h2 className="sidebar-title">検索</h2>
            <div className="sidebar-radios">
              <label>
                <input type="radio" name="searchType" value="name" defaultChecked /> ユーザー名
              </label>
              <label>
                <input type="radio" name="searchType" value="number" /> 社員番号
              </label>
            </div>
            <Input placeholder="ユーザー名を入力" className="sidebar-input" />
            <div className="sidebar-self">
              <div className="sidebar-self-top">
                <input type="checkbox" checked readOnly className="sidebar-self-checkbox" />
                <div className="sidebar-self-text">
                  <span className="sidebar-self-number">社員番号（自分）</span>
                  <span className="sidebar-self-roman">{user?.userName || "未取得"}</span>
                </div>
              </div>
              <div className="sidebar-self-divider">
                <FaIcons.FaChevronDown className="sidebar-self-icon" />
                <span className="sidebar-self-label">ユーザー名</span>
                <FaIcons.FaTasks className="sidebar-self-icon" />
              </div>
            </div>
          </aside>

          {/* カレンダー */}
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

        {/* =============================
            フッター操作群
        ============================= */}
        <div className="content-bottom">
          <div className="content-bottom-left">
            <Button label="ユーザー 一覧設定" color="secondary" icon={<FaIcons.FaUser />} />
            <Button
              label="お気に入り間接タスク設定"
              color="secondary"
              icon={<FaIcons.FaStar />}
              onClick={() => setIsFavoriteTaskModalOpen(true)} // ✅ モーダル開く
            />
          </div>
          <div className="content-bottom-right">
            <button className="menu-button" title="その他">
              <FaIcons.FaEllipsisV />
            </button>
          </div>
        </div>
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
        woOptions={workOrderList.map((w: any) => ({ value: w.id, label: w.name }))}
        maincategoryOptions={optionSets?.category ?? []}
        paymenttypeOptions={optionSets?.status ?? []}
        timecategoryOptions={[]}
        locationOptions={optionSets?.timezone ?? []}
      />

      <FavoriteTaskModal
        isOpen={isFavoriteTaskModalOpen}
        onClose={() => setIsFavoriteTaskModalOpen(false)}
        onSave={handleSaveFavoriteTasks}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataverseApp />
    </QueryClientProvider>
  );
}
