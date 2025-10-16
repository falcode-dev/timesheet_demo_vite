import React, { useState, useMemo } from "react";
import "./Sidebar.css";
import * as FaIcons from "react-icons/fa";
import { Input } from "../../component/input/Input";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useResources } from "../../hooks/useResources";
import { useAllowedUsers } from "../../context/UserListContext";

interface IndirectTask {
    id: string;
    category: string;
    task: string;
}

interface SidebarProps {
    userName?: string;
    mainTab: "user" | "indirect";
}

export const Sidebar: React.FC<SidebarProps> = ({ mainTab }) => {
    const [searchType, setSearchType] = useState<"name" | "number">("name");
    const [keyword, setKeyword] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>(["self"]); // ✅ 初期状態で自分をON
    const [selectedTask, setSelectedTask] = useState<string>("");

    // ✅ ソート状態
    const [isUserSortOpen, setIsUserSortOpen] = useState(false);
    const [isTaskSortOpen, setIsTaskSortOpen] = useState(false);
    const [userSortOption, setUserSortOption] = useState<string>("numberAsc");
    const [taskSortOption, setTaskSortOption] = useState<string>("categoryAsc");

    // ✅ Dataverseからログイン中ユーザー取得
    const { currentUser, isLoading: isUserLoading } = useCurrentUser();

    // ✅ Dataverseからリソース全件取得
    const { resources, isLoading: isResourceLoading } = useResources();

    // ✅ Contextから登録済みユーザー一覧取得
    const { allowedUsers } = useAllowedUsers();

    // ✅ Dataverseユーザー情報整形
    const displaySelf = useMemo(() => {
        if (isUserLoading) {
            return { number: "取得中...", fullName: "ユーザー情報を取得中..." };
        }
        if (!currentUser) {
            return { number: "社員番号未取得", fullName: "ユーザー情報未取得" };
        }
        const number = currentUser.employeeid || "社員番号未登録";
        const fullName = `${currentUser.lastName || ""} ${currentUser.firstName || ""}`.trim();
        return { number, fullName };
    }, [currentUser, isUserLoading]);

    // ✅ 許可されたユーザーのみ表示
    const visibleUsers = useMemo(() => {
        if (isResourceLoading) return [];
        return resources.filter((r) => allowedUsers.includes(r.id));
    }, [resources, allowedUsers, isResourceLoading]);

    // ✅ 検索・ソート適用（安全版）
    const filteredUsers = useMemo(() => {
        let result =
            searchType === "name"
                ? visibleUsers.filter((u) => (u.name || "").includes(keyword))
                : visibleUsers.filter((u) => (u.number || "").includes(keyword));

        switch (userSortOption) {
            case "numberAsc":
                return result.sort((a, b) => (a.number || "").localeCompare(b.number || ""));
            case "numberDesc":
                return result.sort((a, b) => (b.number || "").localeCompare(a.number || ""));
            case "nameAsc":
                return result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
            case "nameDesc":
                return result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
            default:
                return result;
        }
    }, [keyword, searchType, visibleUsers, userSortOption]);

    // ✅ 仮タスク
    const indirectTasks: IndirectTask[] = [
        { id: "t1", category: "会議", task: "定例ミーティング" },
        { id: "t2", category: "教育", task: "新入社員研修資料作成" },
        { id: "t3", category: "資料作成", task: "週次報告書作成" },
        { id: "t4", category: "その他", task: "社内イベント準備" },
    ];

    // ✅ タスクソート
    const sortedTasks = useMemo(() => {
        const copy = [...indirectTasks];
        switch (taskSortOption) {
            case "categoryAsc":
                return copy.sort((a, b) => a.category.localeCompare(b.category));
            case "categoryDesc":
                return copy.sort((a, b) => b.category.localeCompare(a.category));
            case "taskAsc":
                return copy.sort((a, b) => a.task.localeCompare(b.task));
            case "taskDesc":
                return copy.sort((a, b) => b.task.localeCompare(a.task));
            default:
                return copy;
        }
    }, [taskSortOption]);

    // ✅ 選択トグル（自分も含め全体統一）
    const toggleSelect = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    // ✅ 並び替え候補
    const userSortOptions = [
        { value: "numberAsc", label: "▲ 社員番号昇順" },
        { value: "numberDesc", label: "▼ 社員番号降順" },
        { value: "nameAsc", label: "▲ ユーザー名昇順" },
        { value: "nameDesc", label: "▼ ユーザー名降順" },
    ];

    const taskSortOptions = [
        { value: "categoryAsc", label: "▲ サブカテゴリ昇順" },
        { value: "categoryDesc", label: "▼ サブカテゴリ降順" },
        { value: "taskAsc", label: "▲ タスク昇順" },
        { value: "taskDesc", label: "▼ タスク降順" },
    ];

    return (
        <aside className="sidebar-container">
            {/* =============================
                USERタブ
            ============================= */}
            {mainTab === "user" && (
                <>
                    <h2 className="sidebar-title">検索</h2>

                    {/* 検索タイプ切り替え */}
                    <div className="sidebar-radios">
                        <input
                            id="sidebar-radio-name"
                            type="radio"
                            name="sidebarSearchType"
                            value="name"
                            checked={searchType === "name"}
                            onChange={() => setSearchType("name")}
                        />
                        <label htmlFor="sidebar-radio-name">ユーザー名</label>

                        <input
                            id="sidebar-radio-number"
                            type="radio"
                            name="sidebarSearchType"
                            value="number"
                            checked={searchType === "number"}
                            onChange={() => setSearchType("number")}
                        />
                        <label htmlFor="sidebar-radio-number">社員番号</label>
                    </div>

                    <Input
                        placeholder={
                            searchType === "name"
                                ? "ユーザー名を入力"
                                : "社員番号を入力"
                        }
                        className="sidebar-input"
                        value={keyword}
                        onChange={setKeyword}
                    />

                    {/* ✅ 自分もON/OFFできる */}
                    <label
                        className="sidebar-self-item"
                        onClick={() => toggleSelect("self")}
                    >
                        <input
                            type="checkbox"
                            checked={selectedUsers.includes("self")}
                            onChange={() => toggleSelect("self")}
                            className="sidebar-checkbox"
                        />
                        <div className="sidebar-self-text">
                            <span className="sidebar-self-number">
                                {`${displaySelf.number}（自分）`}
                            </span>
                            <span className="sidebar-self-roman">
                                {displaySelf.fullName}
                            </span>
                        </div>
                    </label>

                    {/* ✅ 並び替えメニュー開閉 */}
                    <div
                        className="sidebar-self-divider clickable"
                        onClick={() => setIsUserSortOpen((p) => !p)}
                    >
                        <FaIcons.FaChevronDown
                            className={`sidebar-self-icon ${isUserSortOpen ? "rotated" : ""}`}
                        />
                        <span className="sidebar-self-label">ユーザー名</span>
                        <FaIcons.FaSortAmountDown className="sidebar-self-icon" />
                    </div>

                    {isUserSortOpen && (
                        <div className="sidebar-sort-dropdown">
                            {userSortOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={`sidebar-sort-option ${userSortOption === opt.value ? "active" : ""
                                        }`}
                                    onClick={() => {
                                        setUserSortOption(opt.value);
                                        setIsUserSortOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ✅ 検索結果（空なら非表示） */}
                    {!isResourceLoading && filteredUsers.length > 0 && (
                        <div className="sidebar-results">
                            {filteredUsers.map((user) => (
                                <label
                                    key={user.id}
                                    className="sidebar-result-item"
                                    onClick={() => toggleSelect(user.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleSelect(user.id)}
                                        className="sidebar-checkbox"
                                    />
                                    <span className="sidebar-result-text">
                                        {(user.number || "不明")} {(user.name || "名称未設定")}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* =============================
                INDIRECTタブ
            ============================= */}
            {mainTab === "indirect" && (
                <>
                    <div
                        className="sidebar-self-divider clickable"
                        onClick={() => setIsTaskSortOpen((p) => !p)}
                    >
                        <FaIcons.FaChevronDown
                            className={`sidebar-self-icon ${isTaskSortOpen ? "rotated" : ""}`}
                        />
                        <span className="sidebar-self-label">カテゴリ・タスク</span>
                        <FaIcons.FaSortAmountDown className="sidebar-self-icon" />
                    </div>

                    {isTaskSortOpen && (
                        <div className="sidebar-sort-dropdown">
                            {taskSortOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={`sidebar-sort-option ${taskSortOption === opt.value ? "active" : ""
                                        }`}
                                    onClick={() => {
                                        setTaskSortOption(opt.value);
                                        setIsTaskSortOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="sidebar-task-list">
                        {sortedTasks.map((task) => (
                            <label
                                key={task.id}
                                htmlFor={`sidebar-task-${task.id}`}
                                className="sidebar-task-radio"
                            >
                                <input
                                    id={`sidebar-task-${task.id}`}
                                    type="radio"
                                    name="sidebarTaskType"
                                    value={task.id}
                                    checked={selectedTask === task.id}
                                    onChange={() => setSelectedTask(task.id)}
                                />
                                <div className="sidebar-task-lines">
                                    <span className="sidebar-task-category">
                                        {task.category}
                                    </span>
                                    <span className="sidebar-task-name">
                                        {task.task}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </>
            )}
        </aside>
    );
};
