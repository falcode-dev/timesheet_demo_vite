import React, { useEffect, useState } from "react";
import "./BaseModal.css";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    footerButtons?: React.ReactNode;
    size?: "small" | "medium" | "large";
    className?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    footerButtons,
    size = "medium",
    className = "",
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            // ✅ マウント後に遅延して可視化
            const t = setTimeout(() => setIsVisible(true), 50);
            return () => clearTimeout(t);
        } else {
            setIsVisible(false);
            // ✅ フェードアウト完了後にアンマウント
            const t = setTimeout(() => setIsMounted(false), 300);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    // ✅ 背景クリックで閉じる
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isMounted) return null;

    return (
        <div
            className={`modal-overlay ${isVisible ? "fade-in" : ""}`}
            onClick={handleOverlayClick}
        >
            <div
                className={`modal-content ${size} ${isVisible ? "fade-in" : "fade-out"} ${className}`}
            >
                {title && (
                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                    </div>
                )}
                {description && <p className="modal-description">{description}</p>}
                <div className="modal-body">{children}</div>
                {footerButtons && <div className="modal-footer">{footerButtons}</div>}
            </div>
        </div>
    );
};
