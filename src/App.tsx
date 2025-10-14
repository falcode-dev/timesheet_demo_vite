import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "./component/button/Button";
import { Tabs } from "./component/tab/Tabs";
import type { TabOption } from "./component/tab/Tabs";
import { Select } from "./component/select/Select";
import { Input } from "./component/input/Input";
import { CalendarView } from "./product/calendar/CalendarView";
import * as FaIcons from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./App.css";
import { TimeEntryModal } from "./product/modal/timeentrymodal/TimeEntryModal";
import { useDataverse } from "./hooks/useDataverse";

const queryClient = new QueryClient();

function DataverseApp() {
  // =============================
  // Dataverse データ取得
  // =============================
  const { user, workOrderList, timeEntryList, optionSets } = useDataverse();

  // =============================
  // ローカルUIステート
  // =============================
  const [selectedWO, setSelectedWO] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [mainTab, setMainTab] = useState("user");
  const [viewTab, setViewTab] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const mainTabOptions: TabOption[] = [
    { value: "user", label: "ユーザー" },
    { value: "indirect", label: "間接タスク" },
  ];

  // =============================
  // イベント初期化（WO選択時）
  // =============================
  // =============================
  // イベント初期化（WO選択時）
  // =============================
  useEffect(() => {
    if (!timeEntryList?.length) return;

    // 🔹 useMemo化に近い動き：内部処理を最小化
    setEvents(() => {
      const source =
        !selectedWO || selectedWO === "all"
          ? timeEntryList
          : timeEntryList.filter((e: any) => e.workOrderId === selectedWO);

      return source.map((t: any) => ({
        id: t.id,
        title: t.name,
        start: t.start,
        end: t.end,
      }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWO, timeEntryList?.length]);



  // =============================
  // カレンダー操作
  // =============================
  const handlePrev = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => setCurrentDate(new Date());
  const formatDate = (d: Date) =>
    `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

  // =============================
  // モーダル関連
  // =============================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const openNewModal = () => {
    setSelectedDateTime({
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
    });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleDateClick = (range: { start: Date; end: Date }) => {
    setSelectedDateTime(range);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (eventData: any) => {
    setSelectedEvent(eventData);
    setSelectedDateTime(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log("📝 保存データ:", data);
    if (data.id) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === data.id
            ? { ...ev, title: data.task || "無題", start: data.start, end: data.end }
            : ev
        )
      );
    } else {
      const newEvent = {
        id: String(Date.now()),
        title: data.task || "新しいイベント",
        start: data.start,
        end: data.end,
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    setIsModalOpen(false);
  };

  // =============================
  // JSX
  // =============================
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
          {/* WorkOrderListをSelectOption形式に変換 */}
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
            <Tabs
              tabs={mainTabOptions}
              activeTab={mainTab}
              onChange={setMainTab}
              className="main-tabs"
            />
            <Button
              label="新しいタイムエントリを作成"
              color="primary"
              icon={<FaIcons.FaPlus />}
              className="add-entry-button new-create-button"
              onClick={openNewModal}
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
              {formatDate(currentDate)}
              <FaIcons.FaRegCalendarAlt className="date-icon" />
            </div>
            <div className="view-tabs">
              <button
                className={`view-tab ${viewTab === "day" ? "active" : ""}`}
                onClick={() => setViewTab("day")}
              >
                1日
              </button>
              <button
                className={`view-tab ${viewTab === "3days" ? "active" : ""}`}
                onClick={() => setViewTab("3days")}
              >
                3日
              </button>
              <button
                className={`view-tab ${viewTab === "week" ? "active" : ""}`}
                onClick={() => setViewTab("week")}
              >
                週
              </button>
            </div>
          </div>
        </div>

        <div className="content-middle">
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

          <div className="content-main">
            <CalendarView
              viewMode={viewTab === "day" ? "1日" : viewTab === "3days" ? "3日" : "週"}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              events={events}
            />
          </div>
        </div>

        <div className="content-bottom">
          <div className="content-bottom-left">
            <Button label="ユーザー 一覧設定" color="secondary" icon={<FaIcons.FaUser />} />
            <Button label="お気に入り間接タスク設定" color="secondary" icon={<FaIcons.FaStar />} />
          </div>
          <div className="content-bottom-right">
            <button className="menu-button" title="その他">
              <FaIcons.FaEllipsisV />
            </button>
          </div>
        </div>
      </section>

      {/* ✅ useDataverseのoptionSetsを安全に渡す */}
      <TimeEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedDateTime={selectedDateTime}
        selectedEvent={selectedEvent}
        woOptions={workOrderList.map((w: any) => ({ value: w.id, label: w.name }))}

        // ✅ Dataverseの構造に合わせてキー名修正
        maincategoryOptions={optionSets?.category ?? []}
        paymenttypeOptions={optionSets?.status ?? []}
        timecategoryOptions={[]}
        locationOptions={optionSets?.timezone ?? []} // ← 現時点でlocationがないため空配列
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
