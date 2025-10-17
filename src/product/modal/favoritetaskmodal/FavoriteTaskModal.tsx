import React, { useState, useEffect, useCallback } from "react";
import * as FaIcons from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { BaseModal } from "../BaseModal";
import { Button } from "../../../component/button/Button";
import { Select } from "../../../component/select/Select";
import { Input } from "../../../component/input/Input";
import "./FavoriteTaskModal.css";

/* ======================================================
   BaseModalProps（types/Modal.ts から分離してここで定義）
====================================================== */
export interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: "small" | "medium" | "large";
    children?: React.ReactNode;
    footerButtons?: React.ReactNode[];
}

/* ======================================================
   FavoriteTaskModal Props
====================================================== */
interface FavoriteTaskModalProps
    extends Omit<BaseModalProps, "children" | "footerButtons"> {
    onSave: (selectedTasks: string[]) => void;
}

/* ======================================================
   FavoriteTaskModal 本体
====================================================== */
export const FavoriteTaskModal: React.FC<FavoriteTaskModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    /* ======================================================
       ▼ ステート管理
    ======================================================= */
    const [selectedCategory, setSelectedCategory] = useState("");
    const [taskName, setTaskName] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [favoriteTasks, setFavoriteTasks] = useState<string[]>([]);
    const [checkedResults, setCheckedResults] = useState<string[]>([]);
    const [checkedFavorites, setCheckedFavorites] = useState<string[]>([]);
    const [isLeftHeaderChecked, setIsLeftHeaderChecked] = useState(false);
    const [isRightHeaderChecked, setIsRightHeaderChecked] = useState(false);

    /* ======================================================
       ▼ ダミーデータ（後でDataverse化可能）
    ======================================================= */
    const categories = ["業務改善", "品質向上", "教育・育成"];
    const tasks = ["資料整理", "会議準備", "テスト計画", "レビュー対応", "定例会参加"];

    /* ======================================================
       ▼ 初期化
    ======================================================= */
    useEffect(() => {
        setSearchResults(tasks);
    }, []);

    /* ======================================================
       ▼ 個別チェック操作
    ======================================================= */
    const toggleCheck = useCallback((task: string) => {
        setCheckedResults((prev) =>
            prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
        );
    }, []);

    const toggleFavoriteCheck = useCallback((task: string) => {
        setCheckedFavorites((prev) =>
            prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
        );
    }, []);

    /* ======================================================
       ▼ ヘッダー全選択・全解除
    ======================================================= */
    const toggleLeftHeaderCheck = useCallback(() => {
        const newState = !isLeftHeaderChecked;
        setIsLeftHeaderChecked(newState);
        const available = searchResults.filter((t) => !favoriteTasks.includes(t));
        setCheckedResults(newState ? available : []);
    }, [isLeftHeaderChecked, searchResults, favoriteTasks]);

    const toggleRightHeaderCheck = useCallback(() => {
        const newState = checkedFavorites.length < favoriteTasks.length;
        setCheckedFavorites(newState ? [...favoriteTasks] : []);
    }, [checkedFavorites.length, favoriteTasks]);

    useEffect(() => {
        setIsRightHeaderChecked(checkedFavorites.length > 0);
    }, [checkedFavorites]);

    /* ======================================================
       ▼ 移動（右へ）
    ======================================================= */
    const moveToFavorite = useCallback(() => {
        const toAdd = checkedResults.filter((t) => !favoriteTasks.includes(t));
        setFavoriteTasks((prev) => [...prev, ...toAdd]);
        setCheckedFavorites((prev) => [...prev, ...toAdd]);
        setCheckedResults([]);
        setIsLeftHeaderChecked(false);
    }, [checkedResults, favoriteTasks]);

    /* ======================================================
       ▼ 削除操作
    ======================================================= */
    const removeSelectedFavorites = useCallback(() => {
        setFavoriteTasks((prev) => prev.filter((t) => !checkedFavorites.includes(t)));
        setCheckedFavorites([]);
    }, [checkedFavorites]);

    const removeFavorite = useCallback((task: string) => {
        setFavoriteTasks((prev) => prev.filter((t) => t !== task));
        setCheckedFavorites((prev) => prev.filter((t) => t !== task));
    }, []);

    /* ======================================================
       ▼ 検索処理
    ======================================================= */
    const handleSearch = useCallback(() => {
        const filtered = tasks.filter(
            (t) =>
                (!selectedCategory || t.includes(selectedCategory)) &&
                (!taskName || t.includes(taskName))
        );
        setSearchResults(filtered);
    }, [selectedCategory, taskName, tasks]);

    /* ======================================================
       ▼ JSX
    ======================================================= */
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="お気に入り間接タスク設定"
            description="間接タスクの絞り込み情報を設定して検索を押してください。"
            size="large"
            footerButtons={[
                <Button key="cancel" label="キャンセル" color="secondary" onClick={onClose} />,
                <Button
                    key="save"
                    label="保存"
                    color="primary"
                    onClick={() => onSave(favoriteTasks)}
                    className="favotitetask-create-button"
                />,
            ]}
        >
            <div className="modal-body">
                {/* -------------------------------
                    上部フィルタ
                ------------------------------- */}
                <div className="modal-grid">
                    {/* サブカテゴリ：Select */}
                    <div className="grid-left">
                        <label className="modal-label">サブカテゴリ</label>
                        <Select
                            options={categories.map((c) => ({ value: c, label: c }))}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder="サブカテゴリを選択"
                            className="favorite-task-select"
                        />
                        <div className="right-align">
                            <Button
                                label="クリア"
                                color="secondary"
                                onClick={() => setSelectedCategory("")}
                            />
                        </div>
                    </div>

                    {/* タスク名：Input */}
                    <div className="grid-right">
                        <label className="modal-label">タスク名</label>
                        <Input
                            value={taskName}
                            onChange={setTaskName}
                            placeholder="タスク名を入力"
                            width="100%"
                            type="text"
                        />
                        <div className="left-align">
                            <Button label="検索" color="primary" onClick={handleSearch} />
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                <p className="list-description">
                    検索結果の項目を選択して追加し保存を押してください。
                </p>

                {/* -------------------------------
                    タスクリスト
                ------------------------------- */}
                <div className="task-grid">
                    {/* ---------- 左：検索結果 ---------- */}
                    <div className="task-list">
                        <div className="list-header">
                            <span className="modal-label">検索結果</span>
                            <span className="count">{searchResults.length}件</span>
                        </div>

                        <div className="list-subheader">
                            <div className="list-subheader-left">
                                <input
                                    type="checkbox"
                                    checked={isLeftHeaderChecked}
                                    onChange={toggleLeftHeaderCheck}
                                    className="subheader-checkbox"
                                />
                                <FaIcons.FaChevronDown className="task-icon" />
                                <span className="label-text">サブカテゴリ</span>
                                <FaIcons.FaTasks className="task-icon" />
                            </div>
                        </div>

                        <div className="list-box">
                            {searchResults.map((task) => {
                                const isFavorited = favoriteTasks.includes(task);
                                return (
                                    <label
                                        key={task}
                                        className={`list-item-2line ${isFavorited ? "disabled-item" : ""}`}
                                    >
                                        <input
                                            type="checkbox"
                                            disabled={isFavorited}
                                            checked={checkedResults.includes(task)}
                                            onChange={() => toggleCheck(task)}
                                        />
                                        <div className="list-text">
                                            <div className="category-name">
                                                {selectedCategory || "業務改善"}
                                            </div>
                                            <div className="task-name">{task}</div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* ---------- 中央：移動ボタン ---------- */}
                    <div className="move-button-container">
                        <button
                            onClick={moveToFavorite}
                            className="move-button"
                            title="選択項目を右へ移動"
                        >
                            <IoIosArrowForward />
                        </button>
                    </div>

                    {/* ---------- 右：お気に入り ---------- */}
                    <div className="task-list">
                        <div className="list-header">
                            <span className="modal-label">お気に入り間接タスク項目</span>
                            <span className="count">{favoriteTasks.length}件</span>
                        </div>

                        <div className="list-subheader">
                            <div className="list-subheader-left">
                                <input
                                    type="checkbox"
                                    checked={isRightHeaderChecked}
                                    onChange={toggleRightHeaderCheck}
                                    className="subheader-checkbox"
                                />
                                <FaIcons.FaChevronDown className="task-icon" />
                                <span className="label-text">サブカテゴリ</span>
                                <FaIcons.FaTasks className="task-icon" />
                            </div>
                            {favoriteTasks.length > 0 && (
                                <Button
                                    label=""
                                    icon={<FaIcons.FaRegTrashAlt />}
                                    onClick={removeSelectedFavorites}
                                    className="trash-icon-button"
                                />
                            )}
                        </div>

                        <div className="list-box">
                            {favoriteTasks.map((task) => (
                                <div key={task} className="list-item-favorite">
                                    <div className="list-item-favorite-left">
                                        <input
                                            type="checkbox"
                                            checked={checkedFavorites.includes(task)}
                                            onChange={() => toggleFavoriteCheck(task)}
                                        />
                                        <div className="list-text">
                                            <div className="category-name">
                                                {selectedCategory || "業務改善"}
                                            </div>
                                            <div className="task-name">{task}</div>
                                        </div>
                                    </div>
                                    <div className="list-item-favorite-right">
                                        <Button
                                            label=""
                                            icon={<FaIcons.FaTimes />}
                                            onClick={() => removeFavorite(task)}
                                            className="delete-list-button"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};
