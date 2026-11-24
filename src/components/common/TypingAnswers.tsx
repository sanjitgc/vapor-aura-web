"use client";

import { useEffect } from "react";

// Opening a question (<details data-typing>) shows a short "typing…" bubble, then the answer
// types itself out, like a reply in a chat. The real answer stays in the page the whole time
// (search engines, screen readers and no-JS visitors get it as-is): it is only made see-through
// while a copy laid exactly on top of it types out, and the copy is removed once it is done.

const DOTS_MS = 380;
const MIN_MS = 450;
const MAX_MS = 1000;
const PER_CHAR_MS = 7;
const CARET_MS = 650;

type Run = { cancel: () => void };
const runs = new WeakMap<HTMLDetailsElement, Run>();

function play(details: HTMLDetailsElement) {
    const text = details.querySelector<HTMLElement>(":scope > p, :scope > div > p");
    if (!text?.offsetParent) return; // hidden
    const content = text.textContent ?? "";
    if (!content.trim()) return;

    // A copy of the paragraph, one span per character, laid over the original
    const copy = text.cloneNode(false) as HTMLElement;
    copy.removeAttribute("id");
    copy.setAttribute("aria-hidden", "true");
    copy.dataset.typingCopy = "";
    // Exact (sub-pixel) position inside the positioned <details>, so every line lands on the original
    const box = text.getBoundingClientRect();
    const base = details.getBoundingClientRect();
    copy.style.top = `${box.top - base.top - details.clientTop}px`;
    copy.style.left = `${box.left - base.left - details.clientLeft}px`;
    copy.style.width = `${box.width}px`;

    const dots = document.createElement("span");
    dots.dataset.typingDots = "";
    dots.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
    copy.append(dots);

    const chars: HTMLSpanElement[] = [];
    for (const ch of content) {
        const span = document.createElement("span");
        span.textContent = ch;
        copy.append(span);
        chars.push(span);
    }

    // When each character appears: a steady pace with short pauses after punctuation,
    // stretched or squeezed so long and short answers both finish quickly
    const weights = chars.map((s, i) => (i > 0 && /[.,:;!?]/.test(content[i - 1]) && s.textContent === " " ? 6 : 1));
    const total = weights.reduce((a, b) => a + b, 0);
    const duration = Math.min(MAX_MS, Math.max(MIN_MS, chars.length * PER_CHAR_MS));
    let acc = 0;
    const at = weights.map((w) => (acc += w) / total * duration);

    details.dataset.typing = "busy";
    text.after(copy);

    let frame = 0;
    let timer = 0;
    let shown = 0;
    const start = performance.now() + DOTS_MS;

    const finish = () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
        copy.remove();
        details.dataset.typing = "";
        runs.delete(details);
    };

    const tick = (now: number) => {
        const t = now - start;
        if (t >= 0) {
            dots.remove();
            let n = shown;
            while (n < chars.length && at[n] <= t) n++;
            if (n !== shown) {
                chars[shown - 1]?.removeAttribute("data-caret");
                for (let i = shown; i < n; i++) chars[i].dataset.on = "";
                chars[n - 1].dataset.caret = "";
                shown = n;
            }
        }
        if (shown < chars.length) {
            frame = requestAnimationFrame(tick);
        } else {
            // Let the cursor blink once, then hand back to the real paragraph
            details.dataset.typing = "done";
            timer = window.setTimeout(finish, CARET_MS);
        }
    };
    frame = requestAnimationFrame(tick);
    runs.set(details, { cancel: finish });
}

export default function TypingAnswers() {
    useEffect(() => {
        const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
        // "toggle" doesn't bubble, so listen while it travels down to the <details>
        const onToggle = (e: Event) => {
            const details = e.target;
            if (!(details instanceof HTMLDetailsElement) || !details.hasAttribute("data-typing")) return;
            runs.get(details)?.cancel();
            if (!details.open) return;
            // One answer open at a time. Browsers that know <details name> already do this; this
            // covers older ones.
            if (details.name) {
                for (const other of document.querySelectorAll<HTMLDetailsElement>("details[open]")) {
                    if (other !== details && other.name === details.name) other.open = false;
                }
            }
            if (motion.matches) play(details);
        };
        document.addEventListener("toggle", onToggle, true);
        return () => document.removeEventListener("toggle", onToggle, true);
    }, []);
    return null;
}
