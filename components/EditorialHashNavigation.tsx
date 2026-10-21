"use client";
import { useEffect } from "react";
export default function EditorialHashNavigation() {
  useEffect(() => {
    const ids = new Set([
      "source-differences",
      "editorial-boundaries",
      "source-list",
      "context-action",
      "context-structure",
      "context-learning",
      "context-work",
      "context-finance",
    ]);
    let pending: MutationObserver | undefined;
    let frame = 0;
    function reveal(hash = location.hash) {
      pending?.disconnect();
      cancelAnimationFrame(frame);
      const id = hash.slice(1);
      if (!ids.has(id)) return;
      const target = document.getElementById(id);
      if (!(target instanceof HTMLDetailsElement)) {
        // Next may stream the destination after this client effect is ready.
        pending = new MutationObserver(() => {
          if (location.hash === hash) reveal(hash);
          else pending?.disconnect();
        });
        pending.observe(document.body, { childList: true, subtree: true });
        return;
      }
      target.open = true;
      let parent = target.parentElement;
      while (parent) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
        parent = parent.parentElement;
      }
      frame = requestAnimationFrame(() => {
        target.querySelector("summary")?.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start", behavior: "instant" });
      });
    }
    const onHistory = () => reveal();
    const onClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor) return;
      const url = new URL(anchor.href, location.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search ||
        !ids.has(url.hash.slice(1))
      )
        return;
      event.preventDefault();
      if (url.hash !== location.hash) history.pushState(null, "", url.hash);
      reveal(url.hash);
    };
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHistory);
    window.addEventListener("popstate", onHistory);
    reveal();
    return () => {
      pending?.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHistory);
      window.removeEventListener("popstate", onHistory);
    };
  }, []);
  return null;
}
