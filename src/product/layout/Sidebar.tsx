import React, { useState, useMemo } from "react";
import "./Sidebar.css";
import * as FaIcons from "react-icons/fa";
import { Input } from "../../component/input/Input";

interface User {
    id: string;
    number: string;
    name: string;
}

interface IndirectTask {
    id: string;
    category: string;
    task: string;
}

interface SidebarProps {
    userName?: string;
    mainTab: "user" | "indirect";
}

export const Sidebar: React.FC<SidebarProps> = ({ userName, mainTab }) => {
    // =============================
    // 状態管理
    // =============================
    const [searchType, setSearchType] = useState<"name" | "number">("name");
    const [keyword, setKeyword] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedTask, setSelectedTask] = useState<string>("");

    // 仮ユーザー
    const users: User[] = [
        { id: "1", number: "0001", name: "田中 太郎" },
        { id: "2", number: "0002", name: "佐藤 花子" },
        { id: "3", number: "0003", name: "鈴木 次郎" },
        { id: "4", number: "0004", name: "高橋 美咲" },
        { id: "5", number: "0005", name: "山本 健" },
    ];

    // 仮の間接タスク
    const indirectTasks: IndirectTask[] = [
        { id: "t1", category: "会議", task: "定例ミーティング" },
        { id: "t2", category: "教育", task: "新入社員研修資料作成" },
        { id: "t3", category: "資料作成", task: "週次報告書作成" },
        { id: "t4", category: "その他", task: "社内イベント準備" },
    ];

    // 検索結果
    const filteredUsers = useMemo(() => {
        if (!keyword.trim()) return [];
        return searchType === "name"
            ? users.filter((u) => u.name.includes(keyword))
            : users.filter((u) => u.number.includes(keyword));
    }, [keyword, searchType, users]);

    // チェック切替
    const toggleSelect = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <aside className="sidebar-container">
            {/* =============================
                USERタブ
            ============================= */}
            {mainTab === "user" && (
                <>
                    <h2 className="sidebar-title">検索</h2>

                    <div className="sidebar-radios">
                        <label>
                            <input
                                type="radio"
                                name="searchType"
                                value="name"
                                checked={searchType === "name"}
                                onChange={() => setSearchType("name")}
                            />{" "}
                            ユーザー名
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="searchType"
                                value="number"
                                checked={searchType === "number"}
                                onChange={() => setSearchType("number")}
                            />{" "}
                            社員番号
                        </label>
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

                    <div className="sidebar-self">
                        <div className="sidebar-self-top">
                            <input
                                type="checkbox"
                                checked
                                readOnly
                                className="sidebar-self-checkbox"
                            />
                            <div className="sidebar-self-text">
                                <span className="sidebar-self-number">社員番号（自分）</span>
                                <span className="sidebar-self-roman">
                                    {userName || "未取得"}
                                </span>
                            </div>
                        </div>

                        <div className="sidebar-self-divider">
                            <FaIcons.FaChevronDown className="sidebar-self-icon" />
                            <span className="sidebar-self-label">ユーザー名</span>
                            <FaIcons.FaTasks className="sidebar-self-icon" />
                        </div>
                    </div>

                    {filteredUsers.length > 0 && (
                        <div className="sidebar-results">
                            {filteredUsers.map((user) => (
                                <label key={user.id} className="sidebar-result-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleSelect(user.id)}
                                    />
                                    <span className="sidebar-result-text">
                                        {user.number}：{user.name}
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
                    <div className="sidebar-self-divider">
                        <FaIcons.FaChevronDown className="sidebar-self-icon" />
                        <span className="sidebar-self-label">カテゴリ・タスク</span>
                        <FaIcons.FaSortAmountDown className="sidebar-self-icon" />
                    </div>

                    {/* ✅ デザイン統一ラジオリスト */}
                    <div className="sidebar-task-list">
                        {indirectTasks.map((task) => (
                            <label key={task.id} className="sidebar-task-radio">
                                <input
                                    type="radio"
                                    name="indirectTask"
                                    value={task.id}
                                    checked={selectedTask === task.id}
                                    onChange={() => setSelectedTask(task.id)}
                                />{" "}
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
