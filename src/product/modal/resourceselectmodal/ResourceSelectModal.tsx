// src/layout/modal/resourceselectmodal/ResourceSelectModal.tsx
import React, { useState, useMemo } from "react";
import * as FaIcons from "react-icons/fa";
import { BaseModal } from "../BaseModal";
import { Button } from "../../../component/button/Button";
import { Input } from "../../../component/input/Input";
import { useCurrentUser } from "../../../hooks/useCurrentUser"; // ✅ 追加
import "./ResourceSelectModal.css";

interface User {
    id: string;
    number: string;
    name: string;
}

interface ResourceSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
    onSave?: () => void;
}

export const ResourceSelectModal: React.FC<ResourceSelectModalProps> = ({
    isOpen,
    onClose,
    // userName,
    onSave,
}) => {
    // ✅ Dataverseのログインユーザー情報取得
    const { currentUser, isLoading } = useCurrentUser();

    // ✅ ログインユーザー情報を整形
    const displaySelf = useMemo(() => {
        if (isLoading) {
            return { number: "取得中...", fullName: "ユーザー情報を取得中..." };
        }
        if (!currentUser) {
            return { number: "社員番号未取得", fullName: "ユーザー情報未取得" };
        }
        const number = currentUser.employeeid || "社員番号未登録";
        const fullName = `${currentUser.lastName || ""} ${currentUser.firstName || ""}`.trim();
        return { number, fullName };
    }, [currentUser, isLoading]);

    // 仮ユーザー一覧
    const users: User[] = [
        { id: "1", number: "0001", name: "田中 太郎" },
        { id: "2", number: "0002", name: "佐藤 花子" },
        { id: "3", number: "0003", name: "鈴木 次郎" },
        { id: "4", number: "0004", name: "高橋 美咲" },
        { id: "5", number: "0005", name: "山本 健" },
    ];

    const [searchType, setSearchType] = useState<"name" | "number">("name");
    const [keyword, setKeyword] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [sortByNumberAsc, setSortByNumberAsc] = useState(true);
    const [sortByNameAsc, setSortByNameAsc] = useState(true);

    // ✅ 検索・ソート済みデータ
    const filteredUsers = useMemo(() => {
        const filtered = users.filter((u) =>
            searchType === "name"
                ? u.name.includes(keyword)
                : u.number.includes(keyword)
        );

        const sorted = [...filtered]
            .sort((a, b) =>
                sortByNumberAsc
                    ? a.number.localeCompare(b.number)
                    : b.number.localeCompare(a.number)
            )
            .sort((a, b) =>
                sortByNameAsc
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            );

        return sorted;
    }, [keyword, searchType, sortByNumberAsc, sortByNameAsc]);

    // ✅ 自分のデータを先頭に追加
    const displayUsers: User[] = [
        {
            id: "self",
            number: `${displaySelf.number}(自分)`,
            name: displaySelf.fullName,
        },
        ...filteredUsers,
    ];

    // ✅ チェック状態
    const toggleSelect = (id: string) =>
        setSelectedUsers((prev) =>
            prev.includes(id)
                ? prev.filter((v) => v !== id)
                : [...prev, id]
        );

    const handleSave = () => {
        console.log("✅ 選択されたユーザー:", selectedUsers);
        onSave?.();
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            size="medium"
            footerButtons={[
                <Button
                    key="cancel"
                    label="キャンセル"
                    color="secondary"
                    onClick={onClose}
                />,
                <Button
                    key="save"
                    label="保存"
                    color="primary"
                    onClick={handleSave}
                    className="resource-modal-button"
                />,
            ]}
        >
            <div className="resource-modal-body">
                {/* 検索条件 */}
                <div className="resource-radios">
                    <label>
                        <input
                            type="radio"
                            name="searchType"
                            value="name"
                            checked={searchType === "name"}
                            onChange={() => setSearchType("name")}
                        />
                        ユーザー名
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="searchType"
                            value="number"
                            checked={searchType === "number"}
                            onChange={() => setSearchType("number")}
                        />
                        社員番号
                    </label>
                </div>

                <Input
                    placeholder={
                        searchType === "name"
                            ? "ユーザー名を入力"
                            : "社員番号を入力"
                    }
                    className="resource-input"
                    value={keyword}
                    onChange={setKeyword}
                />

                {/* ソート */}
                <div className="resource-sort-row">
                    <button
                        className="resource-sort-btn"
                        onClick={() => setSortByNumberAsc((p) => !p)}
                    >
                        {sortByNumberAsc ? (
                            <FaIcons.FaSortAmountUp className="resource-sort-icon" />
                        ) : (
                            <FaIcons.FaSortAmountDown className="resource-sort-icon" />
                        )}
                        社員番号
                    </button>

                    <button
                        className="resource-sort-btn"
                        onClick={() => setSortByNameAsc((p) => !p)}
                    >
                        {sortByNameAsc ? (
                            <FaIcons.FaSortAlphaUp className="resource-sort-icon" />
                        ) : (
                            <FaIcons.FaSortAlphaDown className="resource-sort-icon" />
                        )}
                        ユーザー名
                    </button>
                </div>

                {/* ✅ 一覧（自分 + 検索結果） */}
                <div className="resource-list">
                    {displayUsers.map((u) => (
                        <label key={u.id} className="resource-item">
                            <input
                                type="checkbox"
                                checked={
                                    u.id === "self"
                                        ? true
                                        : selectedUsers.includes(u.id)
                                }
                                readOnly={u.id === "self"}
                                onChange={() =>
                                    u.id !== "self" && toggleSelect(u.id)
                                }
                                className="resource-checkbox"
                            />
                            <div className="resource-text">
                                <span className="resource-number">{u.number}_</span>
                                <span className="resource-name">{u.name}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </BaseModal>
    );
};
