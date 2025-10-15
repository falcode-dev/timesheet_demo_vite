import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import { BaseModal } from "../BaseModal";
import { Button } from "../../../component/button/Button";
import { Input } from "../../../component/input/Input";
import "./ResourceSelectModal.css";

interface ResourceSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
    onSave?: () => void;
}

export const ResourceSelectModal: React.FC<ResourceSelectModalProps> = ({
    isOpen,
    onClose,
    userName,
    onSave,
}) => {
    // =============================
    // ソート状態管理
    // =============================
    const [sortByNumberAsc, setSortByNumberAsc] = useState(true);
    const [sortByNameAsc, setSortByNameAsc] = useState(true);

    const toggleNumberSort = () => setSortByNumberAsc((prev) => !prev);
    const toggleNameSort = () => setSortByNameAsc((prev) => !prev);

    // =============================
    // 保存ボタン（仮動作）
    // =============================
    const handleSave = () => {
        console.log("✅ リソース設定を保存しました");
        onSave?.();
        onClose();
    };

    // =============================
    // JSX
    // =============================
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            description=""
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
                        <input type="radio" name="searchType" value="name" defaultChecked /> ユーザー名
                    </label>
                    <label>
                        <input type="radio" name="searchType" value="number" /> 社員番号
                    </label>
                </div>

                <Input placeholder="ユーザー名を入力" className="resource-input" />

                {/* ✅ ソートボタン群 */}
                <div className="resource-sort-row">
                    <button className="resource-sort-btn" onClick={toggleNumberSort}>
                        {sortByNumberAsc ? (
                            <FaIcons.FaSortAmountUp className="resource-sort-icon" />
                        ) : (
                            <FaIcons.FaSortAmountDown className="resource-sort-icon" />
                        )}
                        <span>社員番号</span>
                    </button>

                    <button className="resource-sort-btn" onClick={toggleNameSort}>
                        {sortByNameAsc ? (
                            <FaIcons.FaSortAlphaUp className="resource-sort-icon" />
                        ) : (
                            <FaIcons.FaSortAlphaDown className="resource-sort-icon" />
                        )}
                        <span>ユーザー名</span>
                    </button>
                </div>

                {/* 社員リスト（自分） */}
                <div className="resource-self">
                    <div className="resource-self-top">
                        <input type="checkbox" checked readOnly className="resource-self-checkbox" />
                        <div className="resource-self-text">
                            <span className="resource-self-number">社員番号（自分）</span>
                            <span className="resource-self-roman">{userName || "未取得"}</span>
                        </div>
                    </div>

                    <div className="resource-self-divider">
                        <FaIcons.FaChevronDown className="resource-self-icon" />
                        <span className="resource-self-label">ユーザー名</span>
                        <FaIcons.FaTasks className="resource-self-icon" />
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};
