// ============================================================
// Modal.tsx ― モーダルダイアログコンポーネント
//
// 【このファイルで学べること】
// - createPortal: DOM ツリーの外にレンダリングする機能
// - useEffect でイベントリスナーを登録・クリーンアップする
// - コールバック Props のパターン
// ============================================================

// ReactDOM の createPortal をインポートする
// createPortal: 親コンポーネントの DOM ツリーとは別の場所にレンダリングする
import { createPortal } from "react-dom";

// React のフックをインポートする
import { useEffect, useCallback } from "react";

// 型だけのインポート
import type { ReactNode } from "react";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface ModalProps {
  isOpen: boolean;            // モーダルの開閉状態
  onClose: () => void;        // 閉じるときのコールバック
  title: string;              // モーダルのタイトル
  children: ReactNode;        // モーダルの中身
}

// --------------------------------------------------
// Modal コンポーネント
// --------------------------------------------------
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // --------------------------------------------------
  // ESC キーでモーダルを閉じるイベントリスナー
  // --------------------------------------------------
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Escape キーが押されたら閉じる
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose] // onClose が変わったときだけ関数を再生成する
  );

  // --------------------------------------------------
  // useEffect でキーボードイベントを登録する
  //
  // 【useEffect のクリーンアップとは？】
  // useEffect の中で return した関数は「クリーンアップ関数」と呼ばれ、
  // コンポーネントがアンマウントされるとき、または依存が変わる前に実行される。
  // イベントリスナーの解除、タイマーのクリア、購読の解除などに使う。
  // メモリリークを防ぐために重要。
  // --------------------------------------------------
  useEffect(() => {
    // モーダルが開いているときだけイベントリスナーを登録する
    if (isOpen) {
      // document にキーダウンイベントを登録する
      document.addEventListener("keydown", handleKeyDown);
    }

    // クリーンアップ関数: コンポーネントの再レンダリング前やアンマウント時に実行
    return () => {
      // イベントリスナーを解除する（メモリリーク防止）
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]); // isOpen か handleKeyDown が変わったときに再実行

  // --------------------------------------------------
  // モーダルが閉じているときは何も描画しない
  // --------------------------------------------------
  if (!isOpen) {
    return null; // null を返すと何も描画されない
  }

  // --------------------------------------------------
  // createPortal でモーダルを描画する
  //
  // 【なぜ createPortal を使うのか？】
  // モーダルは画面全体を覆うオーバーレイなので、
  // 親コンポーネントの CSS（overflow: hidden 等）の影響を受けたくない。
  // createPortal を使うと、React のコンポーネントツリーでは
  // 親子関係を保ちつつ、DOM 上では body 直下にレンダリングできる。
  //
  // 使い方: createPortal(描画するJSX, マウント先のDOM要素)
  // --------------------------------------------------
  return createPortal(
    // オーバーレイ（背景の半透明部分）
    <div
      className="modal-overlay"
      // オーバーレイクリックで閉じる
      onClick={onClose}
      // role と aria: アクセシビリティ属性
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* モーダル本体 */}
      <div
        className="modal"
        // stopPropagation: イベントの伝播を止める
        // モーダル本体をクリックしてもオーバーレイの onClick が発火しないようにする
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* コンテンツ */}
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>,
    // マウント先: document.body の直下にレンダリングする
    document.body
  );
}
