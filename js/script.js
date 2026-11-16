// Current Cabinet is intentionally separate from the recurring stream schedule.
const cabinetData = {
  game: "AION2",
  description: "A brand-new MMO cabinet has activated. Enter the Arcade and experience the story with me.",
  link: "https://www.twitch.tv/yoyohiku"
};
document.getElementById("cabinetTitle").textContent = cabinetData.game;
document.getElementById("cabinetDescription").textContent = cabinetData.description;
document.getElementById("cabinetButton").href = cabinetData.link;
document.getElementById("currentYear").textContent = new Date().getFullYear();
// One update per animation frame keeps scrolling smooth.
const scrollCoin = document.getElementById("scrollCoin");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let coinFrame = 0;

function updateScrollCoin() {
  coinFrame = 0;
  if (!scrollCoin || reducedMotion.matches) return;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0;
  const travel = Math.max(0, scrollCoin.parentElement.clientWidth - scrollCoin.clientWidth);
  scrollCoin.style.setProperty("--coin-x", `${progress * travel}px`);
}

function queueCoinUpdate() {
  if (!coinFrame) coinFrame = requestAnimationFrame(updateScrollCoin);
}

window.addEventListener("scroll", queueCoinUpdate, { passive: true });
window.addEventListener("resize", queueCoinUpdate);
window.addEventListener("load", queueCoinUpdate);
reducedMotion.addEventListener("change", queueCoinUpdate);
if (typeof ResizeObserver !== "undefined") {
  new ResizeObserver(queueCoinUpdate).observe(document.body);
}
queueCoinUpdate();
