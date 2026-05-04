"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { ChecklistData } from "@/lib/text";

const STORAGE_PREFIX = "verdens-rejsen:checklist:";
const STORAGE_EVENT = "verdens-rejsen:checklist-change";

function readRaw(storageKey: string): string {
  if (typeof window === "undefined") return "{}";
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + storageKey) ?? "{}";
  } catch {
    return "{}";
  }
}

function writeRaw(storageKey: string, value: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_PREFIX + storageKey,
      JSON.stringify(value),
    );
    window.dispatchEvent(
      new CustomEvent(STORAGE_EVENT, { detail: storageKey }),
    );
  } catch {
    // ignore quota / disabled
  }
}

function parseChecked(raw: string): Record<string, boolean> {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, boolean>;
    }
  } catch {
    // fall through
  }
  return {};
}

export function ChecklistCard({
  index,
  detailsName,
  storageKey,
  headingHtml,
  data,
}: {
  index: number;
  detailsName: string;
  storageKey: string;
  headingHtml: string;
  data: ChecklistData;
}) {
  const { prefaceHtml, items, afterHtml } = data;

  const subscribe = useCallback(
    (callback: () => void) => {
      const fullKey = STORAGE_PREFIX + storageKey;
      const handler = (e: Event) => {
        if (e instanceof StorageEvent && e.key !== null && e.key !== fullKey) {
          return;
        }
        if (e instanceof CustomEvent && e.detail !== storageKey) return;
        callback();
      };
      window.addEventListener(STORAGE_EVENT, handler);
      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener(STORAGE_EVENT, handler);
        window.removeEventListener("storage", handler);
      };
    },
    [storageKey],
  );

  const getSnapshot = useCallback(() => readRaw(storageKey), [storageKey]);
  const getServerSnapshot = useCallback(() => "{}", []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const checked = useMemo(() => parseChecked(raw), [raw]);

  const total = items.length;
  const done = items.reduce((acc, it) => acc + (checked[it.id] ? 1 : 0), 0);
  const allDone = total > 0 && done === total;

  function toggle(id: string) {
    const next = { ...checked };
    if (checked[id]) delete next[id];
    else next[id] = true;
    writeRaw(storageKey, next);
  }

  function reset() {
    writeRaw(storageKey, {});
  }

  return (
    <details
      name={detailsName}
      className={`tab-acc tab-acc--checklist${allDone ? " tab-acc--complete" : ""}`}
    >
      <summary className="tab-acc__summary">
        <span className="tab-acc__num">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="tab-acc__title">
          <span dangerouslySetInnerHTML={{ __html: headingHtml }} />
          {allDone ? (
            <span className="tab-acc__badge tab-acc__badge--done">
              ✓ Alle tjekket
            </span>
          ) : (
            <span className="tab-acc__badge">
              {done} / {total}
            </span>
          )}
        </span>
        <span aria-hidden className="tab-acc__icon shrink-0" />
      </summary>
      <div className="tab-acc__body prose-rejse">
        {prefaceHtml ? (
          <div dangerouslySetInnerHTML={{ __html: prefaceHtml }} />
        ) : null}
        <ul className="checklist">
          {items.map((item) => {
            const isChecked = !!checked[item.id];
            const cbId = `cb-${storageKey}-${item.id}`;
            return (
              <li
                key={item.id}
                className={`checklist__item${isChecked ? " is-checked" : ""}`}
              >
                <label htmlFor={cbId} className="checklist__label">
                  <input
                    id={cbId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(item.id)}
                    className="checklist__input"
                  />
                  <span
                    className="checklist__text"
                    dangerouslySetInnerHTML={{ __html: item.html }}
                  />
                </label>
              </li>
            );
          })}
        </ul>
        {afterHtml ? (
          <div dangerouslySetInnerHTML={{ __html: afterHtml }} />
        ) : null}
        {done > 0 ? (
          <div className="checklist__footer">
            <button type="button" onClick={reset} className="checklist__reset">
              Nulstil tjekliste
            </button>
          </div>
        ) : null}
      </div>
    </details>
  );
}
