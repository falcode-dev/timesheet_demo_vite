import React, { useState, useRef, useEffect, useMemo } from "react";
import * as FaIcons from "react-icons/fa";
import { BaseModal } from "../BaseModal";
import { Select } from "../../../component/select/Select";
import type { SelectOption } from "../../../component/select/Select";
import { Button } from "../../../component/button/Button";
import { Input } from "../../../component/input/Input";
import { Textarea } from "../../../component/textarea/Textarea";
import { ResourceSelectModal } from "../resourceselectmodal/ResourceSelectModal";
import { ConfirmDeleteModal } from "../confirmdeletemodal/ConfirmDeleteModal"; // ✅ 切り出した削除確認モーダル
import "./TimeEntryModal.css";
import { useTranslation } from "react-i18next";

/* =========================================================
   型定義
========================================================= */
export interface TimeEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    onDelete?: (id: string) => void;
    selectedDateTime?: { start: Date; end: Date } | null;
    selectedEvent?: any | null;
    woOptions: SelectOption[];
    maincategoryOptions: SelectOption[];
    paymenttypeOptions: SelectOption[];
    timecategoryOptions: SelectOption[];
    timezoneOptions: SelectOption[];
}

/* =========================================================
   メインコンポーネント
========================================================= */
export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    onDelete,
    selectedDateTime,
    selectedEvent,
    woOptions,
    maincategoryOptions,
    paymenttypeOptions,
    timecategoryOptions,
    timezoneOptions,
}) => {
    const { t } = useTranslation();

    /* -------------------------------
       🧭 状態管理
    ------------------------------- */
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [wo, setWo] = useState("");
    const [endUser, setEndUser] = useState("");
    const [timezone, setTimezone] = useState("");
    const [timeCategory, setTimeCategory] = useState("");
    const [mainCategory, setMainCategory] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [task, setTask] = useState("");
    const [resource, setResource] = useState("");

    const [startDate, setStartDate] = useState("");
    const [startHour, setStartHour] = useState("");
    const [startMinute, setStartMinute] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endHour, setEndHour] = useState("");
    const [endMinute, setEndMinute] = useState("");

    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);

    /* -------------------------------
       🧩 リソースモーダル
    ------------------------------- */
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const openResourceModal = () => setIsResourceModalOpen(true);
    const closeResourceModal = () => setIsResourceModalOpen(false);

    const handleResourceSave = (selectedResources: { id: string; label: string }[]) => {
        setResource(selectedResources.map((r) => r.label).join("\n"));
        closeResourceModal();
    };

    /* -------------------------------
       ⏰ 選択肢（Select用）
    ------------------------------- */
    const filteredWoOptions = useMemo(
        () => woOptions.filter((opt) => opt.value !== "all"),
        [woOptions]
    );

    const hours = useMemo<SelectOption[]>(
        () =>
            Array.from({ length: 24 }, (_, i) => ({
                value: String(i).padStart(2, "0"),
                label: `${String(i).padStart(2, "0")}${t("timeEntryModal.hourSuffix")}`,
            })),
        [t]
    );

    const minutes = useMemo<SelectOption[]>(
        () =>
            Array.from({ length: 60 }, (_, i) => ({
                value: String(i).padStart(2, "0"),
                label: `${String(i).padStart(2, "0")}${t("timeEntryModal.minuteSuffix")}`,
            })),
        [t]
    );

    const endUserOptions: SelectOption[] = [
        { value: "abc", label: t("timeEntryModal.sampleEndUser1") },
        { value: "xyz", label: t("timeEntryModal.sampleEndUser2") },
        { value: "sample", label: t("timeEntryModal.sampleEndUser3") },
    ];

    const taskOptions: SelectOption[] = [
        { value: "doc", label: t("timeEntryModal.task_list.document") },
        { value: "code", label: t("timeEntryModal.task_list.coding") },
        { value: "test", label: t("timeEntryModal.task_list.test") },
    ];

    /* -------------------------------
       📅 日付フォーマット関数
    ------------------------------- */
    const formatLocalDate = (date: Date): string => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    /* -------------------------------
       🪄 初期化処理
    ------------------------------- */
    useEffect(() => {
        if (!isOpen) return;

        if (selectedEvent) {
            setMode("edit");
            const start = new Date(selectedEvent.start);
            const end = new Date(selectedEvent.end);

            setStartDate(formatLocalDate(start));
            setStartHour(String(start.getHours()).padStart(2, "0"));
            setStartMinute(String(start.getMinutes()).padStart(2, "0"));
            setEndDate(formatLocalDate(end));
            setEndHour(String(end.getHours()).padStart(2, "0"));
            setEndMinute(String(end.getMinutes()).padStart(2, "0"));

            setWo(selectedEvent.workOrder ?? "");
            setMainCategory(String(selectedEvent.maincategory ?? ""));
            setTimeCategory(String(selectedEvent.timecategory ?? ""));
            setPaymentType(String(selectedEvent.paymenttype ?? ""));
            setComment(selectedEvent.comment ?? "");
            setEndUser(selectedEvent.endUser ?? "");
            setTask(selectedEvent.task ?? "");
            setTimezone(String(selectedEvent.timezone ?? ""));
            setResource(selectedEvent.resource ?? "");
        } else if (selectedDateTime) {
            setMode("create");
            const { start, end } = selectedDateTime;

            setStartDate(formatLocalDate(start));
            setStartHour(String(start.getHours()).padStart(2, "0"));
            setStartMinute(String(start.getMinutes()).padStart(2, "0"));
            setEndDate(formatLocalDate(end));
            setEndHour(String(end.getHours()).padStart(2, "0"));
            setEndMinute(String(end.getMinutes()).padStart(2, "0"));

            setWo("");
            setEndUser("");
            setTimezone("");
            setTimeCategory("");
            setMainCategory("");
            setPaymentType("");
            setTask("");
            setComment("");
            setResource("");
        }
    }, [isOpen, selectedEvent, selectedDateTime]);

    /* -------------------------------
       💾 保存処理
    ------------------------------- */
    const handleSave = () => {
        const start = new Date(`${startDate}T${startHour}:${startMinute}`);
        const end = new Date(`${endDate}T${endHour}:${endMinute}`);

        onSubmit({
            id: selectedEvent?.id || "",
            wo,
            start,
            end,
            endUser,
            timezone,
            resource,
            timeCategory,
            mainCategory,
            paymentType,
            task,
            comment,
        });
        onClose();
    };

    /* -------------------------------
       🗑 削除処理
    ------------------------------- */
    const handleDelete = () => {
        if (!selectedEvent?.id) return;
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (onDelete && selectedEvent?.id) {
            onDelete(selectedEvent.id);
            setIsDeleteModalOpen(false);
            onClose();
        }
    };

    /* -------------------------------
       🎨 JSX
    ------------------------------- */
    return (
        <>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title={
                    mode === "edit"
                        ? t("timeEntryModal.titleEdit")
                        : t("timeEntryModal.titleCreate")
                }
                description={
                    mode === "edit"
                        ? t("timeEntryModal.descEdit")
                        : t("timeEntryModal.descCreate")
                }
                footerButtons={[
                    ...(mode === "edit"
                        ? [
                            <Button
                                key="delete"
                                label={t("timeEntryModal.delete") || "削除"}
                                onClick={handleDelete}
                            />,
                        ]
                        : []),
                    <Button
                        key="cancel"
                        label={t("timeEntryModal.cancel")}
                        color="secondary"
                        onClick={onClose}
                        className="timeentry-cancel-button"
                    />,
                    <Button
                        key="save"
                        label={
                            mode === "edit"
                                ? t("timeEntryModal.update")
                                : t("timeEntryModal.create")
                        }
                        color="primary"
                        onClick={handleSave}
                        className="timeentry-create-button"
                    />,
                ]}
                size="large"
            >
                <div className="timeentry-modal-body">
                    <label className="modal-label">{t("timeEntryModal.woNumber")}</label>
                    <Select
                        options={filteredWoOptions}
                        value={wo}
                        onChange={setWo}
                        placeholder={t("timeEntryModal.selectWO")}
                    />

                    <div className="modal-grid">
                        <div>
                            <label className="modal-label">{t("timeEntryModal.startDate")}</label>
                            <div className="datetime-row">
                                <Input
                                    ref={startDateRef}
                                    type="date"
                                    value={startDate}
                                    onChange={setStartDate}
                                    className="datetime-row-input"
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

                            <label className="modal-label">{t("timeEntryModal.endDate")}</label>
                            <div className="datetime-row">
                                <Input
                                    ref={endDateRef}
                                    type="date"
                                    value={endDate}
                                    onChange={setEndDate}
                                    className="datetime-row-input"
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

                            <label className="modal-label">{t("timeEntryModal.location")}</label>
                            <Select
                                options={timezoneOptions}
                                value={timezone}
                                onChange={setTimezone}
                            />

                            <div className="resource-header">
                                <label className="modal-label">{t("timeEntryModal.resource")}</label>
                                <a href="#" className="resource-link" onClick={openResourceModal}>
                                    {t("timeEntryModal.selectResource")}
                                </a>
                            </div>

                            <Textarea
                                placeholder={t("timeEntryModal.resourcePlaceholder")}
                                value={resource}
                                onChange={setResource}
                                rows={4}
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="modal-label">{t("timeEntryModal.timeCategory")}</label>
                            <Select
                                options={timecategoryOptions}
                                value={timeCategory}
                                onChange={setTimeCategory}
                            />

                            <label className="modal-label">{t("timeEntryModal.mainCategory")}</label>
                            <Select
                                options={maincategoryOptions}
                                value={mainCategory}
                                onChange={setMainCategory}
                            />

                            <label className="modal-label">{t("timeEntryModal.paymentType")}</label>
                            <Select
                                options={paymenttypeOptions}
                                value={paymentType}
                                onChange={setPaymentType}
                            />

                            <label className="modal-label">{t("timeEntryModal.subCategory")}</label>
                            <Input value={t("timeEntryModal.auto")} disabled />

                            <label className="modal-label">{t("timeEntryModal.task")}</label>
                            <Select options={taskOptions} value={task} onChange={setTask} />

                            <Textarea
                                label={t("timeEntryModal.comment")}
                                value={comment}
                                onChange={setComment}
                                placeholder={t("timeEntryModal.commentPlaceholder")}
                                rows={4}
                                showCount
                                maxLength={2000}
                            />
                        </div>
                    </div>
                </div>
            </BaseModal>

            {/* ✅ 削除確認モーダル */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />

            {/* ✅ リソース選択モーダル */}
            <ResourceSelectModal
                isOpen={isResourceModalOpen}
                onClose={closeResourceModal}
                onSave={handleResourceSave}
            />
        </>
    );
};
