import React, { useState, useMemo } from "react";
import * as FaIcons from "react-icons/fa";
import { BaseModal } from "../BaseModal";
import { Button } from "../../../component/button/Button";
import { Input } from "../../../component/input/Input";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useResources } from "../../../hooks/useResources";
import { useAllowedUsers } from "../../../context/UserListContext";
import "./ResourceSelectModal.css";

interface Resource {
    id: string;
    number: string;
    name: string;
}

interface ResourceSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (selectedIds: string[]) => void;
}

export const ResourceSelectModal: React.FC<ResourceSelectModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    /* ========================
       ▼ Dataverseのログインユーザー情報
    ======================== */
    const { currentUser, isLoading: isUserLoading } = useCurrentUser();

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

    /* ========================
       ▼ Dataverseのリソース一覧
    ======================== */
    const { resources, isLoading: isResourcesLoading } = useResources();
    const { allowedUsers } = useAllowedUsers();

    // ✅ 許可されたユーザーのみ抽出
    const visibleResources = useMemo(() => {
        if (isResourcesLoading) return [];
        return resources.filter((r) => allowedUsers.includes(r.id));
    }, [resources, allowedUsers, isResourcesLoading]);

    /* ========================
       ▼ 検索・ソート
    ======================== */
    const [searchType, setSearchType] = useState<"name" | "number">("name");
    const [keyword, setKeyword] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>(["self"]); // ✅ 自分を初期ON
    const [sortByNumberAsc, setSortByNumberAsc] = useState(true);
    const [sortByNameAsc, setSortByNameAsc] = useState(true);

    // ✅ 検索＋ソート結果（安全版）
    const filteredUsers = useMemo(() => {
        let filtered =
            searchType === "name"
                ? visibleResources.filter((u) => (u.name || "").includes(keyword))
                : visibleResources.filter((u) => (u.number || "").includes(keyword));

        const sorted = [...filtered]
            .sort((a, b) =>
                sortByNumberAsc
                    ? (a.number || "").localeCompare(b.number || "")
                    : (b.number || "").localeCompare(a.number || "")
            )
            .sort((a, b) =>
                sortByNameAsc
                    ? (a.name || "").localeCompare(b.name || "")
                    : (b.name || "").localeCompare(a.name || "")
            );

        return sorted;
    }, [keyword, searchType, sortByNumberAsc, sortByNameAsc, visibleResources]);

    /* ========================
       ▼ 表示用配列（常に自分を先頭に表示）
    ======================== */
    const displayUsers: Resource[] = [
        {
            id: "self",
            number: `${displaySelf.number}(自分)`,
            name: displaySelf.fullName,
        },
        ...filteredUsers,
    ];

    /* ========================
       ▼ チェック操作
    ======================== */
    const toggleSelect = (id: string) =>
        setSelectedUsers((prev) =>
            prev.includes(id)
                ? prev.filter((v) => v !== id)
                : [...prev, id]
        );

    /* ========================
       ▼ 保存処理
    ======================== */
    const handleSave = () => {
        console.log("✅ 選択されたユーザー:", selectedUsers);
        onSave?.(selectedUsers);
        onClose();
    };

    /* ========================
       ▼ JSX
    ======================== */
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
                    <input
                        id="radio-name"
                        type="radio"
                        name="searchTypeResource"
                        value="name"
                        checked={searchType === "name"}
                        onChange={() => setSearchType("name")}
                    />
                    <label htmlFor="radio-name">ユーザー名</label>

                    <input
                        id="radio-number"
                        type="radio"
                        name="searchTypeResource"
                        value="number"
                        checked={searchType === "number"}
                        onChange={() => setSearchType("number")}
                    />
                    <label htmlFor="radio-number">社員番号</label>
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

                {/* ✅ リスト */}
                <div className="resource-list">
                    {displayUsers.map((u) => (
                        <label key={u.id} className="resource-item">
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(u.id)}
                                onChange={() => toggleSelect(u.id)}
                                className="resource-checkbox"
                            />
                            <div className="resource-text">
                                <span className="resource-number">
                                    {u.number || "社員番号不明"}
                                </span>
                                <span className="resource-name">
                                    {u.name || "名称未設定"}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </BaseModal>
    );
};
