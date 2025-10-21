import React from "react";
import { BaseModal } from "../BaseModal";
import { Button } from "../../../component/button/Button";
import { useTranslation } from "react-i18next";
import "./ConfirmDeleteModal.css";

/* =========================================================
   型定義
========================================================= */
export interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

/* =========================================================
   コンポーネント本体
========================================================= */
export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    // title,
    message,
}) => {
    const { t } = useTranslation();

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            // title={title || t("timeEntryModal.confirmTitle") || "削除の確認"}
            description={message || t("timeEntryModal.confirmDelete") || "このイベントを削除しますか？"}
            size="small"
            footerButtons={[
                <Button
                    key="cancel"
                    label={t("timeEntryModal.cancel")}
                    color="secondary"
                    onClick={onClose}
                />,
                <Button
                    key="confirm"
                    label={t("timeEntryModal.delete")}
                    onClick={onConfirm}
                    className="delete-button"
                />,
            ]}
        >
            {/* <div className="confirm-delete-body">
                <p>{t("timeEntryModal.deleteMessage") || "この操作は元に戻せません。"}</p>
            </div> */}
        </BaseModal>
    );
};
