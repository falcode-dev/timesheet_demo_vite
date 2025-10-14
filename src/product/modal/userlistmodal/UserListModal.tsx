import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { BaseModal } from '../BaseModal';
import { Button } from "../../../component/button/Button";
import { Input } from "../../../component/input/Input";
import './UserListModal.css';

/** ✅ BaseModalProps（ファイル分割せずここに定義） */
export interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: 'small' | 'medium' | 'large';
    children?: React.ReactNode;
    footerButtons?: React.ReactNode[];
}

interface UserListModalProps
    extends Omit<BaseModalProps, 'children' | 'footerButtons'> {
    onSave: (selectedUsers: string[]) => void;
}

export const UserListModal: React.FC<UserListModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    // ========================
    // ▼ ステート管理
    // ========================
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [userName, setUserName] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [checkedResults, setCheckedResults] = useState<string[]>([]);
    const [checkedSelected, setCheckedSelected] = useState<string[]>([]);

    // ✅ サブヘッダー用チェックボックス状態
    const [isLeftHeaderChecked, setIsLeftHeaderChecked] = useState(false);
    const [isRightHeaderChecked, setIsRightHeaderChecked] = useState(false);

    const users = ['田中 太郎', '佐藤 花子', '鈴木 次郎', '高橋 美咲', '山本 健'];

    // ========================
    // ▼ 初期化
    // ========================
    useEffect(() => setSearchResults(users), []);

    // ========================
    // ▼ 個別チェック
    // ========================
    const toggleCheck = (user: string) => {
        setCheckedResults((prev) =>
            prev.includes(user)
                ? prev.filter((u) => u !== user)
                : [...prev, user]
        );
    };

    const toggleSelectedCheck = (user: string) => {
        setCheckedSelected((prev) =>
            prev.includes(user)
                ? prev.filter((u) => u !== user)
                : [...prev, user]
        );
    };

    // ========================
    // ▼ 上部チェック（全選択／全解除）
    // ========================
    const toggleLeftHeaderCheck = () => {
        const newState = !isLeftHeaderChecked;
        setIsLeftHeaderChecked(newState);
        const availableUsers = searchResults.filter((u) => !selectedUsers.includes(u));
        setCheckedResults(newState ? availableUsers : []);
    };

    const toggleRightHeaderCheck = () => {
        const newState = checkedSelected.length < selectedUsers.length;
        setCheckedSelected(newState ? [...selectedUsers] : []);
    };

    // ========================
    // ▼ 右リストにチェックがあるか監視してヘッダー更新
    // ========================
    useEffect(() => {
        setIsRightHeaderChecked(checkedSelected.length > 0);
    }, [checkedSelected]);

    // ========================
    // ▼ 移動（右へ）
    // ========================
    const moveToSelected = () => {
        const newSelected = [...selectedUsers];
        const newCheckedSelected = [...checkedSelected];

        checkedResults.forEach((user) => {
            if (!newSelected.includes(user)) {
                newSelected.push(user);
                newCheckedSelected.push(user);
            }
        });

        setSelectedUsers(newSelected);
        setCheckedSelected(newCheckedSelected);
        setCheckedResults([]);
        setIsLeftHeaderChecked(false);
    };

    // ========================
    // ▼ 削除
    // ========================
    const removeCheckedSelected = () => {
        setSelectedUsers((prev) => prev.filter((u) => !checkedSelected.includes(u)));
        setCheckedSelected([]);
    };

    const removeUser = (user: string) => {
        setSelectedUsers((prev) => prev.filter((u) => u !== user));
        setCheckedSelected((prev) => prev.filter((u) => u !== user));
    };

    // ========================
    // ▼ 検索処理
    // ========================
    const handleSearch = () => {
        const filtered = users.filter(
            (u) =>
                (!employeeNumber || u.includes(employeeNumber)) &&
                (!userName || u.includes(userName))
        );
        setSearchResults(filtered);
    };

    // ========================
    // ▼ JSX
    // ========================
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="ユーザー一覧設定"
            description="追加したいユーザーを検索してください。"
            size="large"
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
                    onClick={() => onSave(selectedUsers)}
                    className="userlist-create-button"
                />,
            ]}
        >
            <div className="modal-body">
                {/* 上部検索フォーム */}
                <div className="modal-grid">
                    {/* 左：社員番号（Input） */}
                    <div className="grid-left">
                        <label className="modal-label">社員番号</label>
                        <Input
                            // label="社員番号"
                            value={employeeNumber}
                            onChange={setEmployeeNumber}
                            placeholder="社員番号を入力"
                            width="100%"
                            type="text"
                        />
                        <div className="right-align">
                            <Button
                                label="クリア"
                                color="secondary"
                                onClick={() => setEmployeeNumber('')}
                            />
                        </div>
                    </div>

                    {/* 右：ユーザー名（Input） */}
                    <div className="grid-right">
                        <label className="modal-label">ユーザー名</label>
                        <Input
                            // label="ユーザー名"
                            value={userName}
                            onChange={setUserName}
                            placeholder="ユーザー名を入力"
                            width="100%"
                            type="text"
                        />
                        <div className="left-align">
                            <Button
                                label="検索"
                                color="primary"
                                onClick={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                <p className="list-description">
                    検索結果の項目を選択して追加し保存を押してください。
                </p>

                <div className="task-grid">
                    {/* 左：検索結果 */}
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
                                <span className="label-text">ユーザー名</span>
                                <FaIcons.FaTasks className="task-icon" />
                            </div>
                        </div>

                        <div className="list-box">
                            {searchResults.map((user) => {
                                const isSelected = selectedUsers.includes(user);
                                return (
                                    <label
                                        key={user}
                                        className={`list-item-2line ${isSelected ? 'disabled-item' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            disabled={isSelected}
                                            checked={checkedResults.includes(user)}
                                            onChange={() => toggleCheck(user)}
                                        />
                                        <div className="list-text">
                                            <div className="category-name">社員</div>
                                            <div className="task-name">{user}</div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* 中央：移動ボタン */}
                    <div className="move-button-container">
                        <button
                            onClick={moveToSelected}
                            className="move-button"
                            title="選択したユーザーを右へ移動"
                        >
                            <IoIosArrowForward />
                        </button>
                    </div>

                    {/* 右：選択済みユーザー */}
                    <div className="task-list">
                        <div className="list-header">
                            <span className="modal-label">設定済ユーザー</span>
                            <span className="count">{selectedUsers.length}件</span>
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
                                <span className="label-text">ユーザー名</span>
                                <FaIcons.FaTasks className="task-icon" />
                            </div>
                            {selectedUsers.length > 0 && (
                                <Button
                                    label=""
                                    icon={<FaIcons.FaRegTrashAlt />}
                                    onClick={removeCheckedSelected}
                                    className="trash-icon-button"
                                />
                            )}
                        </div>

                        <div className="list-box">
                            {selectedUsers.map((user) => (
                                <div key={user} className="list-item-favorite">
                                    <div className="list-item-favorite-left">
                                        <input
                                            type="checkbox"
                                            checked={checkedSelected.includes(user)}
                                            onChange={() => toggleSelectedCheck(user)}
                                        />
                                        <div className="list-text">
                                            <div className="category-name">社員</div>
                                            <div className="task-name">{user}</div>
                                        </div>
                                    </div>
                                    <div className="list-item-favorite-right">
                                        <Button
                                            label=""
                                            icon={<FaIcons.FaTimes />}
                                            onClick={() => removeUser(user)}
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
