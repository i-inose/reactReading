import { createPortal } from "react-dom";
import { useEffect, useCallback } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

// TODO(Q9): createPortal を使ってモーダルを document.body に描画してください
// 以下の手順で実装します:
//   1. useCallback で handleKeyDown を作る（ESC キーで onClose を呼ぶ）
//   2. useEffect で isOpen が true のとき document に keydown イベントを登録する
//      クリーンアップ関数でイベントを解除する
//   3. isOpen が false なら null を返す
//   4. createPortal(JSX, document.body) でモーダルを body 直下に描画する
//
// ヒント: createPortal(描画するJSX, マウント先のDOM要素) で、
//         React ツリーとは別の DOM 位置にレンダリングできる。
// 参考: 01-task-manager/src/components/Modal.tsx
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  // ここを createPortal(..., document.body) に書き換えてください
  // createPortal(
  //   <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
  //     <div className="modal" onClick={(e) => e.stopPropagation()}>
  //       <div className="modal__header">
  //         <h2 className="modal__title">{title}</h2>
  //         <button className="modal__close" onClick={onClose} aria-label="閉じる">&#10005;</button>
  //       </div>
  //       <div className="modal__body">{children}</div>
  //     </div>
  //   </div>,
  //   document.body
  // )
  void createPortal;
  void title;
  void children;
  return null as any; // ← createPortal(...) に置き換える
}
