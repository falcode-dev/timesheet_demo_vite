import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "./component/button/Button";
import { Select } from "./component/select/Select";
import type { SelectOption } from "./component/select/Select";
import { Tabs } from "./component/tab/Tabs";
import type { TabOption } from "./component/tab/Tabs";
import { Input } from "./component/input/Input";
import { Textarea } from "./component/textarea/Textarea";
import * as FaIcons from "react-icons/fa";
import "./App.css"; // ✅ ここにheader用CSSを入れる

const queryClient = new QueryClient();

function DataverseApp() {
  // const { user, workOrderList } = useDataverse();

  // ✅ 対象WOリスト（仮）
  const [selectedWO, setSelectedWO] = useState("");
  const workOrders: SelectOption[] = [
    { value: "all", label: "すべて" },
    { value: "1", label: "案件A" },
    { value: "2", label: "案件B" },
    { value: "3", label: "案件C" },
  ];

  const [active, setActive] = useState("week");
  const tabOptions: TabOption[] = [
    { value: "day", label: "1日" },
    { value: "3days", label: "3日" },
    { value: "week", label: "週" },
  ];

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

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
          以下コンテンツ部分
      ============================= */}
      <main className="main-content">
        <Tabs
          tabs={tabOptions}
          activeTab={active}
          onChange={setActive}
          className="custom-tab"
        />

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
      </main>
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
