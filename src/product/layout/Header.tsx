import "./Header.css";
import { Button } from "../../component/button/Button";
import { Select } from "../../component/select/Select";
import * as FaIcons from "react-icons/fa";

export type WorkOrder = {
    id: string;
    name: string;
};

export type HeaderProps = {
    workOrders?: WorkOrder[];
    selectedWO: string;
    setSelectedWO: (id: string) => void;
};

/**
 * アプリ上部ヘッダー
 * - アプリタイトル表示
 * - WorkOrder選択
 * - アップロードボタン
 */
export const Header: React.FC<HeaderProps> = ({
    workOrders = [],
    selectedWO,
    setSelectedWO,
}) => {
    const woOptions = [
        { value: "all", label: "すべて" },
        ...workOrders.map((wo) => ({
            value: wo.id,
            label: wo.name || "(名称未設定)",
        })),
    ];

    return (
        <header className="app-header">
            <div className="header-left">
                <h1 className="header-title">Time Sheet</h1>
            </div>

            <div className="header-right">
                <span className="header-label">対象WO</span>

                {/* ✅ idを削除してOK */}
                <Select
                    options={woOptions}
                    value={selectedWO}
                    onChange={setSelectedWO}
                    placeholder="対象WOを選択"
                />

                <Button
                    label="アップロード"
                    color="secondary"
                    icon={<FaIcons.FaUpload />}
                    className="upload-button"
                    onClick={() => console.log("アップロード処理")}
                />
            </div>
        </header>
    );
};
