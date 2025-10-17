import "./ContentHeader.css";
import * as FaIcons from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Tabs } from "../../component/tab/Tabs";
import { Button } from "../../component/button/Button";
import type { TabOption } from "../../component/tab/Tabs";

/** メインタブ種別 */
export type MainTab = "user" | "indirect";

/** 表示モード種別 */
export type ViewMode = "1日" | "3日" | "週";

/** ContentHeader Props定義 */
export type ContentHeaderProps = {
    /** メインタブ選択値 */
    mainTab: MainTab;
    /** メインタブ更新関数 */
    setMainTab: (tab: MainTab) => void;

    /** カレンダーの表示モード */
    viewMode: ViewMode;
    /** 表示モード更新関数 */
    setViewMode: (mode: ViewMode) => void;

    /** 現在の日付（フォーマット済み） */
    formattedToday: string;

    /** ナビゲーション操作 */
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;

    /** 新規作成ボタン */
    onCreateNew: () => void;
};

/**
 * タイムシート上部の操作ヘッダー
 * - タブ切替（ユーザー／間接タスク）
 * - カレンダー移動（前・次・今日）
 * - 表示モード切替（1日／3日／週）
 * - 新規登録ボタン
 */
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
    /** メインタブ設定 */
    const mainTabOptions: TabOption[] = [
        { value: "user", label: "ユーザー" },
        { value: "indirect", label: "間接タスク" },
    ];

    /** 表示モードボタン */
    const viewModes: ViewMode[] = ["1日", "3日", "週"];

    return (
        <header className="tab-header">
            {/* =============================
                左側：タブ + 新規ボタン
            ============================= */}
            <div className="tab-header-left">
                <Tabs
                    tabs={mainTabOptions}
                    activeTab={mainTab}
                    onChange={(v) => setMainTab(v as MainTab)}
                    className="main-tabs"
                />

                <Button
                    label="新しいタイムエントリを作成"
                    color="primary"
                    icon={<FaIcons.FaPlus />}
                    className="add-entry-button new-create-button"
                    onClick={onCreateNew}
                />
            </div>

            {/* =============================
                右側：カレンダー操作群
            ============================= */}
            <div className="tab-header-right">
                {/* 今日ボタン */}
                <button className="today-button" onClick={onToday}>
                    <FaIcons.FaCalendarDay className="icon" /> 今日
                </button>

                {/* 前後ナビゲーション */}
                <button className="arrow-button" onClick={onPrev}>
                    <IoIosArrowBack />
                </button>
                <button className="arrow-button" onClick={onNext}>
                    <IoIosArrowForward />
                </button>

                {/* 現在表示日 */}
                <div className="date-display">
                    {formattedToday}
                    <FaIcons.FaRegCalendarAlt className="date-icon" />
                </div>

                {/* 表示モード切替 */}
                <div className="view-tabs">
                    {viewModes.map((mode) => (
                        <button
                            key={mode}
                            className={`view-tab ${viewMode === mode ? "active" : ""}`}
                            onClick={() => setViewMode(mode)}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};
