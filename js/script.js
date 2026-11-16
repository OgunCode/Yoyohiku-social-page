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
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const root = document.getElementById("backgroundEffects");
  for (let i = 0; i < 18; i++) {
    const token = document.createElement("span");
    token.className = "floating-token";
    token.style.setProperty("--token-position", `${(i * 37) % 100}%`);
    token.style.setProperty("--token-top", `${(i * 23) % 100}%`);
    token.style.setProperty("--token-size", `${16 + i % 4 * 10}px`);
    token.style.setProperty("--token-delay", `${-i}s`);
    root.append(token);
  }
}
