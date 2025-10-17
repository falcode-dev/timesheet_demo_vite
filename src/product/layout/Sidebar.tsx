import React, { useState, useMemo } from "react";
import "./Sidebar.css";
import * as FaIcons from "react-icons/fa";
import { Input } from "../../component/input/Input";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useResources } from "../../hooks/useResources";
import { useAllowedUsers } from "../../context/UserListContext";

/** 間接タスク型 */
type IndirectTask = {
    id: string;
    category: string;
    task: string;
};

/** 並び替えオプションの型 */
type UserSortKey = "numberAsc" | "numberDesc" | "nameAsc" | "nameDesc";
type TaskSortKey = "categoryAsc" | "categoryDesc" | "taskAsc" | "taskDesc";

/** Sidebar プロパティ */
type SidebarProps = {
    userName?: string;
    mainTab: "user" | "indirect";
};

/**
 * Sidebar コンポーネント
 */
export const Sidebar: React.FC<SidebarProps> = ({ mainTab }) => {
    /** 検索・選択状態 */
    const [searchType, setSearchType] = useState<"name" | "number">("name");
    const [keyword, setKeyword] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>(["self"]);
    const [selectedTask, setSelectedTask] = useState<string>("");

    /** 並び替え設定 */
    const [isUserSortOpen, setIsUserSortOpen] = useState(false);
    const [isTaskSortOpen, setIsTaskSortOpen] = useState(false);
    const [userSortOption, setUserSortOption] = useState<UserSortKey>("numberAsc");
    const [taskSortOption, setTaskSortOption] = useState<TaskSortKey>("categoryAsc");

    /** Dataverse: 現在ユーザー情報 */
    const { currentUser, isLoading: isUserLoading } = useCurrentUser();

    /** Dataverse: リソース一覧 */
    const { resources, isLoading: isResourceLoading } = useResources();

    /** コンテキスト: 許可ユーザー一覧 */
    const { allowedUsers } = useAllowedUsers();

    /** ログイン中ユーザー表示用 */
    const displaySelf = useMemo(() => {
        if (isUserLoading)
            return { number: "取得中...", fullName: "ユーザー情報を取得中..." };
        if (!currentUser)
            return { number: "社員番号未取得", fullName: "ユーザー情報未取得" };

        return {
            number: currentUser.employeeid || "社員番号未登録",
            fullName: `${currentUser.lastName || ""} ${currentUser.firstName || ""}`.trim(),
        };
    }, [currentUser, isUserLoading]);

    /** 表示対象ユーザー（許可済みのみ） */
    const visibleUsers = useMemo(() => {
        if (isResourceLoading) return [];
        return resources.filter((r) => allowedUsers.includes(r.id));
    }, [resources, allowedUsers, isResourceLoading]);

    /** 検索・ソート適用後のユーザー一覧 */
    const filteredUsers = useMemo(() => {
        const list =
            searchType === "name"
                ? visibleUsers.filter((u) => (u.name || "").includes(keyword))
                : visibleUsers.filter((u) => (u.number || "").includes(keyword));

        const sortBy: Record<UserSortKey, (a: any, b: any) => number> = {
            numberAsc: (a, b) => (a.number || "").localeCompare(b.number || ""),
            numberDesc: (a, b) => (b.number || "").localeCompare(a.number || ""),
            nameAsc: (a, b) => (a.name || "").localeCompare(b.name || ""),
            nameDesc: (a, b) => (b.name || "").localeCompare(a.name || ""),
        };

        return [...list].sort(sortBy[userSortOption]);
    }, [keyword, searchType, visibleUsers, userSortOption]);

    /** 仮タスク一覧 */
    const indirectTasks: IndirectTask[] = [
        { id: "t1", category: "会議", task: "定例ミーティング" },
        { id: "t2", category: "教育", task: "新入社員研修資料作成" },
        { id: "t3", category: "資料作成", task: "週次報告書作成" },
        { id: "t4", category: "その他", task: "社内イベント準備" },
    ];

    /** タスクソート結果 */
    const sortedTasks = useMemo(() => {
        const sortBy: Record<TaskSortKey, (a: IndirectTask, b: IndirectTask) => number> = {
            categoryAsc: (a, b) => a.category.localeCompare(b.category),
            categoryDesc: (a, b) => b.category.localeCompare(a.category),
            taskAsc: (a, b) => a.task.localeCompare(b.task),
            taskDesc: (a, b) => b.task.localeCompare(a.task),
        };
        return [...indirectTasks].sort(sortBy[taskSortOption]);
    }, [taskSortOption]);

    /** ユーザー選択トグル（自分含む） */
    const toggleSelect = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    /** 並び替え候補 */
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

    // ===================================================
    // Render
    // ===================================================
    return (
        <aside className="sidebar-container">
            {/* USERタブ */}
            {mainTab === "user" && (
                <>
                    <h2 className="sidebar-title">検索</h2>

                    {/* 検索タイプ切替 */}
                    <div className="sidebar-radios">
                        {["name", "number"].map((type) => (
                            <label key={type}>
                                <input
                                    type="radio"
                                    name="sidebarSearchType"
                                    value={type}
                                    checked={searchType === type}
                                    onChange={() => setSearchType(type as "name" | "number")}
                                />
                                {type === "name" ? "ユーザー名" : "社員番号"}
                            </label>
                        ))}
                    </div>

                    {/* 検索入力 */}
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

                    {/* 自分の表示 */}
                    <label className="sidebar-self-item clickable">
                        <input
                            type="checkbox"
                            className="sidebar-checkbox"
                            checked={selectedUsers.includes("self")}
                            onChange={() => toggleSelect("self")}
                        />
                        <div className="sidebar-self-text">
                            <span className="sidebar-self-number">
                                {`${displaySelf.number}（自分）`}
                            </span>
                            <span className="sidebar-self-roman">{displaySelf.fullName}</span>
                        </div>
                    </label>

                    {/* 並び替え */}
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
                                    className={`sidebar-sort-option ${userSortOption === opt.value ? "active" : ""}`}
                                    onClick={() => {
                                        setUserSortOption(opt.value as UserSortKey);
                                        setIsUserSortOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 検索結果 */}
                    {!isResourceLoading && filteredUsers.length > 0 && (
                        <div className="sidebar-results">
                            {filteredUsers.map((user) => (
                                <label
                                    key={user.id}
                                    className="sidebar-result-item clickable"
                                >
                                    <input
                                        type="checkbox"
                                        className="sidebar-checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleSelect(user.id)}
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

            {/* INDIRECTタブ */}
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
                                    className={`sidebar-sort-option ${taskSortOption === opt.value ? "active" : ""}`}
                                    onClick={() => {
                                        setTaskSortOption(opt.value as TaskSortKey);
                                        setIsTaskSortOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* タスクリスト */}
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
                                    <span className="sidebar-task-category">{task.category}</span>
                                    <span className="sidebar-task-name">{task.task}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </>
            )}
        </aside>
    );
};
