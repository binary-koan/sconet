// ponytail: plain DOM pull-to-refresh, only in installed-app mode where the
// browser provides none. Pull past the threshold at the top → full reload.
export function initPullToRefresh() {
  if (!window.matchMedia("(display-mode: standalone)").matches) return;

  const THRESHOLD = 70;
  const indicator = document.createElement("div");
  indicator.textContent = "↓";
  indicator.style.cssText =
    "position:fixed;top:0;left:50%;z-index:9999;width:36px;height:36px;margin-left:-18px;" +
    "display:flex;align-items:center;justify-content:center;border-radius:50%;" +
    "background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.3);font-size:20px;" +
    "transform:translateY(-40px);transition:none;";
  document.body.appendChild(indicator);

  let startY = 0;
  let pulling = false;

  const scrolledAncestor = (el: Element | null): boolean => {
    for (; el && el !== document.body; el = el.parentElement) {
      if (el.scrollTop > 0) return true;
    }
    return false;
  };

  document.addEventListener("touchstart", (e) => {
    pulling = window.scrollY === 0 && !scrolledAncestor(e.target as Element);
    startY = e.touches[0].clientY;
  });

  document.addEventListener("touchmove", (e) => {
    if (!pulling) return;
    const delta = e.touches[0].clientY - startY;
    if (delta <= 0) return;
    const pull = Math.min(delta / 2, THRESHOLD);
    indicator.style.transform = `translateY(${pull - 40}px) rotate(${pull * 3}deg)`;
    indicator.textContent = pull >= THRESHOLD ? "↻" : "↓";
  });

  document.addEventListener("touchend", (e) => {
    if (!pulling) return;
    pulling = false;
    const delta = e.changedTouches[0].clientY - startY;
    if (delta / 2 >= THRESHOLD) {
      indicator.textContent = "↻";
      window.location.reload();
    } else {
      indicator.style.transition = "transform .2s";
      indicator.style.transform = "translateY(-40px)";
      setTimeout(() => (indicator.style.transition = "none"), 200);
    }
  });
}
