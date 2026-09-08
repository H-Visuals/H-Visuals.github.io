/* In-page video player: any .clip with data-video opens in a lightbox instead of leaving the site. */
const modal = document.createElement("div");
modal.className = "player";
modal.innerHTML = '<div class="player-box"><button class="player-close" aria-label="Close">×</button><div class="player-frame"></div></div>';
document.body.appendChild(modal);
const frame = modal.querySelector(".player-frame");

function openVideo(id) {
  frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeVideo() {
  modal.classList.remove("open");
  frame.innerHTML = "";
  document.body.style.overflow = "";
}
document.addEventListener("click", e => {
  const a = e.target.closest("a[data-video]");
  if (a) { e.preventDefault(); openVideo(a.dataset.video); return; }
  if (e.target === modal || e.target.closest(".player-close")) closeVideo();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeVideo(); });

/* Hover preview: after a short pause over a card, play the video muted inside the card; click still opens the full player. */
if (matchMedia("(hover: hover)").matches) {
  let timer;
  document.addEventListener("mouseover", e => {
    const a = e.target.closest("a.clip[data-video]");
    if (!a || a.querySelector(".preview")) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!a.matches(":hover")) return;
      const f = document.createElement("iframe");
      f.className = "preview";
      f.src = `https://www.youtube-nocookie.com/embed/${a.dataset.video}?autoplay=1&controls=0&rel=0&playsinline=1&modestbranding=1&start=0`;
      f.allow = "autoplay; encrypted-media";
      f.tabIndex = -1;
      a.appendChild(f);
      requestAnimationFrame(() => a.classList.add("previewing"));
    }, 350);
  });
  document.addEventListener("mouseout", e => {
    const a = e.target.closest("a.clip[data-video]");
    if (!a || a.contains(e.relatedTarget)) return;
    clearTimeout(timer);
    a.classList.remove("previewing");
    a.querySelectorAll(".preview").forEach(f => f.remove());
  });
}
