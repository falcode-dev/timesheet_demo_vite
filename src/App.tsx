import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useDataverse } from "./hooks/useDataverse";
import { Button } from "./component/button/Button";
import { Select } from "./component/select/Select";
import type { SelectOption } from "./component/select/Select";
import * as FaIcons from "react-icons/fa";

const queryClient = new QueryClient();

function DataverseApp() {
  // const { user, workOrderList, timeEntryList, optionSets } = useDataverse();

  const [selected, setSelected] = useState("");
  const options: SelectOption[] = [
    { value: "1", label: "案件A" },
    { value: "2", label: "案件B" },
    { value: "3", label: "案件C" },
  ];

  return (
    <div>

      <Button
        label="保存"
        color="primary"
        icon={<FaIcons.FaSave />}
      // disabled={true}
      />
      <Button
        label="保存"
        color="secondary"
      />
      <Select
        options={options}
        value={selected}
        onChange={setSelected}
        placeholder="対象WOを選択"
      />

      {/* <h1>Dataverse データ取得デモ</h1>

      {user ? (
        <>
          <p>👤 {user.userName}</p>
          <p>組織: {user.organizationName}</p>
        </>
      ) : (
        <p>🌐 ローカル環境です</p>
      )}

      <h3>WorkOrder</h3>
      <ul>
        {workOrderList.map((a) => (
          <li key={a.id}>{a.name}</li>
        ))}
      </ul>

      <h3>TimeEntry</h3>
      <ul>
        {timeEntryList.map((b) => (
          <li key={b.id}>
            {b.name}（{b.start} - {b.end}）
          </li>
        ))}
      </ul>

      <h3>OptionSets</h3>
      <pre>{JSON.stringify(optionSets, null, 2)}</pre> */}
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
