// 【このファイルで学べること】
// - createPortal: DOM ツリーの外（body 直下）にレンダリングする
// - useEffect でイベントリスナーを登録し、クリーンアップで解除する

import { createPortal } from "react-dom";
import { useEffect, useCallback } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  // ESC キーでモーダルを閉じる
  // クリーンアップ関数でイベントリスナーを解除する（メモリリーク防止）
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // createPortal: 親の CSS (overflow:hidden 等) の影響を受けずに描画できる
  return createPortal(
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="閉じる">
            ✕
          </button>
        </div>
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
