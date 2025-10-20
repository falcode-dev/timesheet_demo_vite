import React, { useState, useEffect, useCallback } from "react";
import * as FaIcons from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { BaseModal } from "../BaseModal";
import { Button } from "../../../component/button/Button";
import { Select } from "../../../component/select/Select";
import { Input } from "../../../component/input/Input";
import "./FavoriteTaskModal.css";
import { useTranslation } from "react-i18next";

/* ======================================================
   BaseModalProps
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
    const { t } = useTranslation();

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
       ▼ ダミーデータ（Dataverse移行予定）
    ======================================================= */
    const categories = [
        t("favoriteTask.categories.improvement"),
        t("favoriteTask.categories.quality"),
        t("favoriteTask.categories.education"),
    ];
    const tasks = [
        t("favoriteTask.tasks.document"),
        t("favoriteTask.tasks.meeting"),
        t("favoriteTask.tasks.testPlan"),
        t("favoriteTask.tasks.review"),
        t("favoriteTask.tasks.weekly"),
    ];

    /* ======================================================
       ▼ 初期化
    ======================================================= */
    useEffect(() => {
        setSearchResults(tasks);
    }, [t]);

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
            title={t("favoriteTask.title")}
            description={t("favoriteTask.description")}
            size="large"
            footerButtons={[
                <Button
                    key="cancel"
                    label={t("favoriteTask.cancel")}
                    color="secondary"
                    onClick={onClose}
                />,
                <Button
                    key="save"
                    label={t("favoriteTask.save")}
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
                    <div className="grid-left">
                        <label className="modal-label">{t("favoriteTask.subCategory")}</label>
                        <Select
                            options={categories.map((c) => ({ value: c, label: c }))}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder={t("favoriteTask.selectSubCategory")}
                            className="favorite-task-select"
                        />
                        <div className="right-align">
                            <Button
                                label={t("favoriteTask.clear")}
                                color="secondary"
                                onClick={() => setSelectedCategory("")}
                            />
                        </div>
                    </div>

                    <div className="grid-right">
                        <label className="modal-label">{t("favoriteTask.taskName")}</label>
                        <Input
                            value={taskName}
                            onChange={setTaskName}
                            placeholder={t("favoriteTask.enterTaskName")}
                            width="100%"
                            type="text"
                        />
                        <div className="left-align">
                            <Button label={t("favoriteTask.search")} color="primary" onClick={handleSearch} />
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                <p className="list-description">{t("favoriteTask.instructions")}</p>

                {/* -------------------------------
            タスクリスト
        ------------------------------- */}
                <div className="task-grid">
                    {/* ---------- 左：検索結果 ---------- */}
                    <div className="task-list">
                        <div className="list-header">
                            <span className="modal-label">{t("favoriteTask.searchResults")}</span>
                            <span className="count">{searchResults.length}{t("favoriteTask.items")}</span>
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
                                <span className="label-text">{t("favoriteTask.subCategory")}</span>
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
                                                {selectedCategory || t("favoriteTask.categories.improvement")}
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
                            title={t("favoriteTask.moveRight")}
                        >
                            <IoIosArrowForward />
                        </button>
                    </div>

                    {/* ---------- 右：お気に入り ---------- */}
                    <div className="task-list">
                        <div className="list-header">
                            <span className="modal-label">{t("favoriteTask.favoriteList")}</span>
                            <span className="count">{favoriteTasks.length}{t("favoriteTask.items")}</span>
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
                                <span className="label-text">{t("favoriteTask.subCategory")}</span>
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
                                                {selectedCategory || t("favoriteTask.categories.improvement")}
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
