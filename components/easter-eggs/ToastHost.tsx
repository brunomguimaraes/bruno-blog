"use client";

import { useEffect, useState } from "react";

export type ToastItem = {
  id: number;
  head: string;
  msg: string;
  sub?: string;
  at: string;
};

function Toast({ t }: { t: ToastItem }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className={"toast" + (shown ? " show" : "")}>
      <div className="head">
        <span>{t.head}</span>
        <span className="c">{t.at}</span>
      </div>
      <div className="msg">{t.msg}</div>
      {t.sub ? <div className="sub">{t.sub}</div> : null}
    </div>
  );
}

export default function ToastHost({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toasts.map((t) => (
        <Toast key={t.id} t={t} />
      ))}
    </div>
  );
}
