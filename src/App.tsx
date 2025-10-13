import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "./component/button/Button";
import { Tabs } from "./component/tab/Tabs";
import type { TabOption } from "./component/tab/Tabs";
import { Select } from "./component/select/Select";
import type { SelectOption } from "./component/select/Select";
import { Input } from "./component/input/Input";
import { Textarea } from "./component/textarea/Textarea";
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
  const viewTabOptions: TabOption[] = [
    { value: "day", label: "1日" },
    { value: "3days", label: "3日" },
    { value: "week", label: "週" },
  ];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  // =============================
  // 日付操作
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
  // JSX
  // =============================
  return (
    <div className="app-container">
      {/* =============================
          ヘッダー（Time Sheet + WO選択 + Upload）
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
          {/* 左：Tabs + 新規作成 */}
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

          {/* ===========================
              右エリア：日付ナビゲーション + ビュー切替
          =========================== */}
          <div className="tab-header-right">
            {/* 今日ボタン */}
            <button className="today-button" onClick={handleToday}>
              <FaIcons.FaCalendarDay className="icon" /> 今日
            </button>

            {/* 前／次ナビゲーション */}
            <button className="arrow-button" onClick={handlePrev}>
              <IoIosArrowBack />
            </button>
            <button className="arrow-button" onClick={handleNext}>
              <IoIosArrowForward />
            </button>

            {/* 日付表示 */}
            <div className="date-display">
              {formatDate(currentDate)}
              <FaIcons.FaRegCalendarAlt className="date-icon" />
            </div>

            {/* ビュー切り替えタブ */}
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
          <Input
            label="氏名"
            value={name}
            onChange={setName}
            placeholder="山田 太郎"
          />
          <Textarea
            label="備考"
            value={notes}
            onChange={setNotes}
            placeholder="作業内容や注意事項などを入力してください"
            rows={4}
            showCount={true}
            maxLength={2000}
          />
        </div>

        {/* ✅ コンテンツ下部 */}
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
