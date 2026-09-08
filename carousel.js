/* Auto-scrolling rails you can also drag / scroll sideways. Content is duplicated once in the HTML, so we loop at the halfway point. */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll(".marquee").forEach(track => {
  const dir = Number(track.dataset.dir || 1);
  const speed = 0.5; // px per frame
  let paused = false, idle = 0, dragging = false, startX = 0, startLeft = 0, moved = false;
  const half = () => track.scrollWidth / 2;
  // keep scroll position inside (1, half-1) so the loop never sits on a boundary
  const wrap = x => { const h = half(); if (h <= 0) return x; while (x >= h - 1) x -= h; while (x < 1) x += h; return x; };
  let pos = dir < 0 ? half() - 2 : 1;
  track.scrollLeft = pos;
  function loop() {
    if (!paused && !dragging && !reduce) {
      pos = wrap(pos + speed * dir);
      track.scrollLeft = pos;
    } else if (paused && !dragging && Date.now() > idle) paused = false;
    requestAnimationFrame(loop);
  }
  const rest = ms => { paused = true; idle = Date.now() + ms; };
  track.addEventListener("mouseenter", () => rest(1e9));
  track.addEventListener("mouseleave", () => { paused = false; });
  track.addEventListener("wheel", e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) rest(2500); }, { passive: true });
  track.addEventListener("touchstart", () => rest(4000), { passive: true });
  track.addEventListener("scroll", () => { // manual scroll: re-sync and keep the loop seamless
    if (Math.abs(track.scrollLeft - pos) > 1) { pos = wrap(track.scrollLeft); if (Math.abs(track.scrollLeft - pos) > 1) track.scrollLeft = pos; }
  });
  track.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; dragging = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft; track.setPointerCapture(e.pointerId); });
  track.addEventListener("pointermove", e => { if (!dragging) return; const dx = e.clientX - startX; if (Math.abs(dx) > 4) { track.classList.add("dragging"); moved = true; } track.scrollLeft = startLeft - dx; });
  const end = () => {
    dragging = false;
    setTimeout(() => track.classList.remove("dragging"), 0);
    // Only swallow the click that follows a genuine drag (moved > 4px). A plain
    // click on a video card must still reach player.js and open the video.
    if (moved) {
      const suppress = ev => { ev.stopPropagation(); ev.preventDefault(); };
      track.addEventListener("click", suppress, { capture: true, once: true });
    }
    rest(2500);
  };
  track.addEventListener("pointerup", end); track.addEventListener("pointercancel", end);
  requestAnimationFrame(loop);
});
