import React, { useState, useRef, useEffect, useMemo } from "react";
import * as FaIcons from "react-icons/fa";
import { BaseModal } from "../BaseModal";
import { Select } from "../../../component/select/Select";
import type { SelectOption } from "../../../component/select/Select";
import { Button } from "../../../component/button/Button";
import { Input } from "../../../component/input/Input";
import { Textarea } from "../../../component/textarea/Textarea";
import { ResourceSelectModal } from "../resourceselectmodal/ResourceSelectModal";
import "./TimeEntryModal.css";

interface TimeEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    selectedDateTime?: { start: Date; end: Date } | null;
    selectedEvent?: any | null;
    woOptions: SelectOption[];
    maincategoryOptions: SelectOption[];
    paymenttypeOptions: SelectOption[];
    timecategoryOptions: SelectOption[];
    locationOptions: SelectOption[]; // ✅ DataverseのLocation
}

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    selectedDateTime,
    selectedEvent,
    woOptions,
    maincategoryOptions,
    paymenttypeOptions,
    timecategoryOptions,
    locationOptions,
}) => {
    // =============================
    // 状態管理
    // =============================
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [comment, setComment] = useState("");
    const [wo, setWo] = useState("");
    const [endUser, setEndUser] = useState("");
    const [location, setLocation] = useState("");
    const [timeCategory, setTimeCategory] = useState("");
    const [mainCategory, setMainCategory] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [task, setTask] = useState("");
    const [resource, setResource] = useState(""); // ✅ 選択したリソース名

    const [startDate, setStartDate] = useState("");
    const [startHour, setStartHour] = useState("");
    const [startMinute, setStartMinute] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endHour, setEndHour] = useState("");
    const [endMinute, setEndMinute] = useState("");

    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    // ✅ リソース選択モーダルの状態
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const openResourceModal = () => setIsResourceModalOpen(true);
    const closeResourceModal = () => setIsResourceModalOpen(false);

    // ✅ モーダルの保存時にリソース名を受け取る（今は仮で固定）
    const handleResourceSave = () => {
        setResource("山田 太郎（自分）");
        closeResourceModal();
    };

    // =============================
    // 選択肢
    // =============================
    const filteredWoOptions = useMemo(
        () => woOptions.filter((opt) => opt.value !== "all"),
        [woOptions]
    );

    const hours: SelectOption[] = Array.from({ length: 24 }, (_, i) => ({
        value: String(i).padStart(2, "0"),
        label: `${String(i).padStart(2, "0")}時`,
    }));

    const minutes: SelectOption[] = Array.from({ length: 60 }, (_, i) => ({
        value: String(i).padStart(2, "0"),
        label: `${String(i).padStart(2, "0")}分`,
    }));

    const endUserOptions: SelectOption[] = [
        { value: "abc", label: "株式会社ABC" },
        { value: "xyz", label: "株式会社XYZ" },
        { value: "sample", label: "サンプル商事" },
    ];

    const taskOptions: SelectOption[] = [
        { value: "doc", label: "資料作成" },
        { value: "code", label: "プログラミング" },
        { value: "test", label: "テスト" },
    ];

    // =============================
    // 日付フォーマット関数
    // =============================
    const formatLocalDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    // =============================
    // 初期化処理（Dataverseの詳細反映）
    // =============================
    useEffect(() => {
        if (!isOpen) return;

        if (selectedEvent) {
            setMode("edit");

            // 日時を分解してセット
            const start = new Date(selectedEvent.start);
            const end = new Date(selectedEvent.end);
            setStartDate(formatLocalDate(start));
            setStartHour(start.getHours().toString().padStart(2, "0"));
            setStartMinute(start.getMinutes().toString().padStart(2, "0"));
            setEndDate(formatLocalDate(end));
            setEndHour(end.getHours().toString().padStart(2, "0"));
            setEndMinute(end.getMinutes().toString().padStart(2, "0"));

            // ✅ Dataverseから取得したフィールドを反映
            setWo(selectedEvent.workOrder || "");
            setMainCategory(String(selectedEvent.maincategory || ""));
            setTimeCategory(String(selectedEvent.timecategory || ""));
            setPaymentType(String(selectedEvent.paymenttype || ""));
            setComment(selectedEvent.comment || "");
            setEndUser(selectedEvent.endUser || "");
            setTask(selectedEvent.task || "");
            setLocation(selectedEvent.location || "");
            setResource(selectedEvent.resource || "");
        } else if (selectedDateTime) {
            setMode("create");
            const { start, end } = selectedDateTime;
            setStartDate(formatLocalDate(start));
            setStartHour(start.getHours().toString().padStart(2, "0"));
            setStartMinute(start.getMinutes().toString().padStart(2, "0"));
            setEndDate(formatLocalDate(end));
            setEndHour(end.getHours().toString().padStart(2, "0"));
            setEndMinute(end.getMinutes().toString().padStart(2, "0"));

            // クリア
            setWo("");
            setEndUser("");
            setLocation("");
            setTimeCategory("");
            setMainCategory("");
            setPaymentType("");
            setTask("");
            setComment("");
            setResource("");
        }
    }, [isOpen, selectedEvent, selectedDateTime]);

    // =============================
    // 保存処理
    // =============================
    const handleSave = () => {
        const start = new Date(`${startDate}T${startHour}:${startMinute}`);
        const end = new Date(`${endDate}T${endHour}:${endMinute}`);

        const data = {
            id: selectedEvent?.id || "",
            wo,
            start,
            end,
            endUser,
            location,
            resource,
            timeCategory,
            mainCategory,
            paymentType,
            task,
            comment,
        };
        onSubmit(data);
        onClose();
    };

    // =============================
    // JSX
    // =============================
    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title={mode === "edit" ? "タイムエントリを編集" : "新しいタイムエントリを作成"}
                description={
                    mode === "edit"
                        ? "内容を修正して「更新」を押してください。"
                        : "必要な情報を入力して「作成」を押してください。"
                }
                footerButtons={[
                    <Button key="cancel" label="キャンセル" color="secondary" onClick={onClose} />,
                    <Button
                        key="save"
                        label={mode === "edit" ? "更新" : "作成"}
                        color="primary"
                        onClick={handleSave}
                        className="timeentry-create-button"
                    />,
                ]}
                size="large"
            >
                <div className="timeentry-modal-body">
                    <label className="modal-label">WO番号</label>
                    <Select
                        options={filteredWoOptions}
                        value={wo}
                        onChange={setWo}
                        placeholder="WOを選択"
                    />

                    <div className="modal-grid">
                        {/* 左列 */}
                        <div>
                            <label className="modal-label">スケジュール開始日</label>
                            <div className="datetime-row">
                                <Input
                                    ref={startDateRef}
                                    type="date"
                                    value={startDate}
                                    className="datetime-row-input"
                                    onChange={setStartDate}
                                    suffix={
                                        <FaIcons.FaRegCalendarAlt
                                            className="icon"
                                            onClick={() => startDateRef.current?.showPicker?.()}
                                        />
                                    }
                                />
                                <Select options={hours} value={startHour} onChange={setStartHour} />
                                <Select options={minutes} value={startMinute} onChange={setStartMinute} />
                            </div>

                            <label className="modal-label">スケジュール終了日</label>
                            <div className="datetime-row">
                                <Input
                                    ref={endDateRef}
                                    type="date"
                                    value={endDate}
                                    className="datetime-row-input"
                                    onChange={setEndDate}
                                    suffix={
                                        <FaIcons.FaRegCalendarAlt
                                            className="icon"
                                            onClick={() => endDateRef.current?.showPicker?.()}
                                        />
                                    }
                                />
                                <Select options={hours} value={endHour} onChange={setEndHour} />
                                <Select options={minutes} value={endMinute} onChange={setEndMinute} />
                            </div>

                            <label className="modal-label">EndUser</label>
                            <Select options={endUserOptions} value={endUser} onChange={setEndUser} />

                            <label className="modal-label">Location</label>
                            <Select options={locationOptions} value={location} onChange={setLocation} />

                            <div className="resource-header">
                                <label className="modal-label">リソース</label>
                                <a href="#" className="resource-link" onClick={openResourceModal}>
                                    リソース選択
                                </a>
                            </div>
                            <Textarea
                                placeholder="リソースの詳細を入力"
                                value={resource}
                                onChange={setResource}
                                rows={4}
                                onClick={openResourceModal}
                            />
                        </div>

                        {/* 右列 */}
                        <div>
                            <label className="modal-label">タイムカテゴリ</label>
                            <Select options={timecategoryOptions} value={timeCategory} onChange={setTimeCategory} />

                            <label className="modal-label">カテゴリ</label>
                            <Select options={maincategoryOptions} value={mainCategory} onChange={setMainCategory} />

                            <label className="modal-label">ペイメントタイプ</label>
                            <Select options={paymenttypeOptions} value={paymentType} onChange={setPaymentType} />

                            <label className="modal-label">サブカテゴリ</label>
                            <Input value="自動設定" disabled />

                            <label className="modal-label">タスク</label>
                            <Select options={taskOptions} value={task} onChange={setTask} />

                            <Textarea
                                label="コメント"
                                value={comment}
                                onChange={setComment}
                                placeholder="コメントを入力"
                                rows={4}
                                showCount={true}
                                maxLength={2000}
                            />
                        </div>
                    </div>
                </div>
            </BaseModal>

            {/* ✅ リソース選択モーダル */}
            <ResourceSelectModal
                isOpen={isResourceModalOpen}
                onClose={closeResourceModal}
                onSave={handleResourceSave}
            // userName="山田 太郎"
            />
        </>
    );
};
