import "./ContentHeader.css";
import * as FaIcons from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Tabs } from "../../component/tab/Tabs";
import { Button } from "../../component/button/Button";
import type { TabOption } from "../../component/tab/Tabs";

type MainTab = "user" | "indirect";

interface ContentHeaderProps {
    mainTab: string;
    setMainTab: (tab: MainTab) => void;
    viewMode: "1日" | "3日" | "週";
    setViewMode: (mode: "1日" | "3日" | "週") => void;
    formattedToday: string;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    onCreateNew: () => void;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
    mainTab,
    setMainTab,
    viewMode,
    setViewMode,
    formattedToday,
    onPrev,
    onNext,
    onToday,
    onCreateNew,
}) => {
    const mainTabOptions: TabOption[] = [
        { value: "user", label: "ユーザー" },
        { value: "indirect", label: "間接タスク" },
    ];

    return (
        <div className="tab-header">
            <div className="tab-header-left">
                <Tabs tabs={mainTabOptions} activeTab={mainTab} onChange={(v) => setMainTab(v as MainTab)} className="main-tabs" />
                <Button
                    label="新しいタイムエントリを作成"
                    color="primary"
                    icon={<FaIcons.FaPlus />}
                    className="add-entry-button new-create-button"
                    onClick={onCreateNew}
                />
            </div>

            <div className="tab-header-right">
                <button className="today-button" onClick={onToday}>
                    <FaIcons.FaCalendarDay className="icon" /> 今日
                </button>
                <button className="arrow-button" onClick={onPrev}>
                    <IoIosArrowBack />
                </button>
                <button className="arrow-button" onClick={onNext}>
                    <IoIosArrowForward />
                </button>

                <div className="date-display">
                    {formattedToday}
                    <FaIcons.FaRegCalendarAlt className="date-icon" />
                </div>

                <div className="view-tabs">
                    {["1日", "3日", "週"].map((mode) => (
                        <button key={mode} className={`view-tab ${viewMode === mode ? "active" : ""}`} onClick={() => setViewMode(mode as any)}>
                            {mode}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
