import "./Header.css";
import { Button } from "../../component/button/Button";
import { Select } from "../../component/select/Select";
import * as FaIcons from "react-icons/fa";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    const woOptions = [
        { value: "all", label: t("header.all") },
        ...workOrders.map((wo) => ({
            value: wo.id,
            label: wo.name || t("header.noName"),
        })),
    ];

    return (
        <header className="app-header">
            <div className="header-left">
                <h1 className="header-title">{t("header.title")}</h1>
            </div>

            <div className="header-right">
                <span className="header-label">{t("header.targetWO")}</span>

                <Select
                    options={woOptions}
                    value={selectedWO}
                    onChange={setSelectedWO}
                    placeholder={t("header.selectWO")}
                />

                <Button
                    label={t("header.upload")}
                    color="secondary"
                    icon={<FaIcons.FaUpload />}
                    className="upload-button"
                    onClick={() => console.log("アップロード処理")}
                />
            </div>
        </header>
    );
};
