"use client";

import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal";
import Button from "@/components/Button";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  loading = false,
}: ConfirmModalProps) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onClose} title={title ?? t("common.confirm")}>
      {message && <p className="text-sm text-gray-600 mb-6">{message}</p>}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          {t("common.cancel")}
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading} className="flex-1">
          {confirmLabel ?? t("common.confirm")}
        </Button>
      </div>
    </Modal>
  );
}
