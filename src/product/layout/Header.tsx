import "./Header.css";
import { Button } from "../../component/button/Button";
import { Select } from "../../component/select/Select";
import * as FaIcons from "react-icons/fa";

interface HeaderProps {
    workOrders?: { id: string; name: string }[]; // ← 型を統一（optionalに）
    selectedWO: string;
    setSelectedWO: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
    workOrders = [], // ← デフォルト空配列を設定
    selectedWO,
    setSelectedWO,
}) => (
    <header className="app-header">
        <div className="header-left">
            <h1 className="header-title">Time Sheet</h1>
        </div>

        <div className="header-right">
            <span className="header-label">対象WO</span>
            <Select
                options={[
                    { value: "all", label: "すべて" },
                    ...workOrders.map((w) => ({ value: w.id, label: w.name })),
                ]}
                value={selectedWO}
                onChange={setSelectedWO}
                placeholder="対象WOを選択"
            />
            <Button
                label="アップロード"
                color="secondary"
                icon={<FaIcons.FaUpload />}
            />
        </div>
    </header>
);
