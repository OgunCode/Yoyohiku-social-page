const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const socialPage = document.getElementById("socialPage");

const cabinetData = {
  game: "Tera",

  description:
    "A old ARMMORPG cabinet has activated. Enter the Arcade and experience the story with me.",

  link: "https://www.twitch.tv/yoyohiku",

  isLive: false,
};

const cabinetStatus = document.getElementById("cabinetStatus");

const cabinetStatusText = document.getElementById(
  "cabinetStatusText"
);

const cabinetTitle = document.getElementById("cabinetTitle");

const cabinetDescription = document.getElementById(
  "cabinetDescription"
);

const cabinetButton = document.getElementById("cabinetButton");

const currentYear = document.getElementById("currentYear");


function updateCurrentCabinet() {
  if (
    !cabinetStatus ||
    !cabinetStatusText ||
    !cabinetTitle ||
    !cabinetDescription ||
    !cabinetButton
  ) {
    return;
  }

  cabinetTitle.textContent = cabinetData.game;

  cabinetDescription.textContent =
    cabinetData.description;

  cabinetButton.href = cabinetData.link;

  if (cabinetData.isLive) {
    cabinetStatus.classList.add("is-online");
    cabinetStatus.classList.remove("is-offline");

    cabinetStatusText.textContent = "Arcade Hours Open";

    cabinetButton.innerHTML = `
      Watch Live
      <span aria-hidden="true">→</span>
    `;
  } else {
    cabinetStatus.classList.add("is-offline");
    cabinetStatus.classList.remove("is-online");

    cabinetStatusText.textContent = "Current Cabinet";

    cabinetButton.innerHTML = `
      Visit the Arcade
      <span aria-hidden="true">→</span>
    `;
  }
}

updateCurrentCabinet();



function enterArcade() {
  if (!startScreen || !startButton || !socialPage) {
    return;
  }

  startButton.disabled = true;
  startButton.innerHTML = "<span aria-hidden='true'>🪙</span> LOADING...";

  setTimeout(() => {
    startScreen.classList.add("is-hidden");
    socialPage.classList.add("arcade-ready");
    document.body.classList.remove("arcade-locked");

    startScreen.addEventListener(
      "transitionend",
      () => {
        startScreen.remove();
      },
      { once: true }
    );
  }, 500);
}

if (startButton) {
  startButton.addEventListener("click", enterArcade);
}



if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const backgroundEffects = document.getElementById("backgroundEffects");

function createFloatingTokens() {
  if (!backgroundEffects) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  const tokenAmount = 12;

  for (let i = 0; i < tokenAmount; i++) {
    const token = document.createElement("span");

    const tokenSize = Math.floor(Math.random() * 24) + 38;
    const tokenDuration = Math.floor(Math.random() * 10) + 14;
    const tokenPosition = Math.floor(Math.random() * 96);
    const tokenDelay = Math.floor(Math.random() * tokenDuration) * -1;

    token.classList.add("floating-token");
    token.textContent = "YH";

    token.style.setProperty(
      "--token-size",
      `${tokenSize}px`
    );

    token.style.setProperty(
      "--token-duration",
      `${tokenDuration}s`
    );

    token.style.setProperty(
      "--token-position",
      `${tokenPosition}%`
    );

    token.style.setProperty(
      "--token-delay",
      `${tokenDelay}s`
    );

    backgroundEffects.appendChild(token);
  }
}

createFloatingTokens();