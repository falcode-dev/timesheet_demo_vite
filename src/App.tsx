import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "./component/button/Button";
import { Tabs } from "./component/tab/Tabs";
import type { TabOption } from "./component/tab/Tabs";
import { Select } from "./component/select/Select";
import type { SelectOption } from "./component/select/Select";
import { Input } from "./component/input/Input";
import { Textarea } from "./component/textarea/Textarea";
import { CalendarView } from "./product/calendar/CalendarView";
import * as FaIcons from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./App.css";

const queryClient = new QueryClient();

function DataverseApp() {
  // =============================
  // ステート管理
  // =============================
  const [selectedWO, setSelectedWO] = useState("");
  const workOrders: SelectOption[] = [
    { value: "all", label: "すべて" },
    { value: "1", label: "案件A" },
    { value: "2", label: "案件B" },
    { value: "3", label: "案件C" },
  ];

  const [mainTab, setMainTab] = useState("user");
  const mainTabOptions: TabOption[] = [
    { value: "user", label: "ユーザー" },
    { value: "indirect", label: "間接タスク" },
  ];

  const [viewTab, setViewTab] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const events = [
    { title: "会議", start: "2025-10-12T10:00:00", end: "2025-10-12T11:00:00" },
    { title: "作業A", start: "2025-10-12T13:00:00", end: "2025-10-12T15:00:00" },
  ];

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

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
          <Select
            options={workOrders}
            value={selectedWO}
            onChange={setSelectedWO}
            placeholder="対象WOを選択"
            className="wo-select"
          />
          <Button
            label="アップロード"
            color="primary"
            icon={<FaIcons.FaUpload />}
          />
        </div>
      </header>

      {/* =============================
          カードコンテンツ全体
      ============================= */}
      <section className="content-card">
        {/* ✅ コンテンツ上部 */}
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

        {/* ✅ コンテンツ中部 */}
        <div className="content-middle">
          {/* === サイドバー === */}
          <aside className="sidebar-container">
            <h2 className="sidebar-title">検索</h2>

            <div className="sidebar-radios">
              <label>
                <input
                  type="radio"
                  name="searchType"
                  value="name"
                  defaultChecked
                />
                ユーザー名
              </label>
              <label>
                <input type="radio" name="searchType" value="number" />
                社員番号
              </label>
            </div>

            <Input placeholder="ユーザー名を入力" className="sidebar-input" />

            <div className="sidebar-self">
              <div className="sidebar-self-top">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="sidebar-self-checkbox"
                />
                <div className="sidebar-self-text">
                  <span className="sidebar-self-number">社員番号（自分）</span>
                  <span className="sidebar-self-roman">TARO TANAKA</span>
                </div>
              </div>

              <div className="sidebar-self-divider">
                <FaIcons.FaChevronDown className="sidebar-self-icon" />
                <span className="sidebar-self-label">ユーザー名</span>
                <FaIcons.FaTasks className="sidebar-self-icon" />
              </div>
            </div>
          </aside>

          {/* === カレンダーエリア === */}
          <div className="content-main">
            <CalendarView
              viewMode={
                viewTab === "day" ? "1日" : viewTab === "3days" ? "3日" : "週"
              }
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              events={events}
            />
          </div>
        </div>

        {/* ✅ コンテンツ下部 */}
        <div className="content-bottom">
          <div className="content-bottom-left">
            <Button
              label="ユーザー 一覧設定"
              color="secondary"
              icon={<FaIcons.FaUser />}
            />
            <Button
              label="お気に入り間接タスク設定"
              color="secondary"
              icon={<FaIcons.FaStar />}
            />
          </div>

          <div className="content-bottom-right">
            <button className="menu-button" title="その他">
              <FaIcons.FaEllipsisV />
            </button>
          </div>
        </div>
      </section>
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
