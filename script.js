/* =========================================================
   BDAY WEBSITE — CLEAN / MOBILE SAFE VERSION
========================================================= */

const CONFIG = {
  name: "Hi Chibii",
  date: "A little letter from my heart",
  greeting: "Hi Chibiii,",

  paragraphs: [
    `Hallooooow Sayang, BWAHAHAHAHAHAHHAHAHA.`,

    `Aku buatin nih buat kamu yang <span class="glowing-word">cantik lucu imut baik pinter dan chibii</span>, yang hari ini sedang berulangtahun ke 18.`,

    `Aku gabisa ngomong banyak karena yah ga jago ngomong, aku cuma mau bilang kalo aku itu makasi banget udah ditemenin sama kamu meski kamu nih sering <span class="glowing-word">ngeselin</span> ke aku.`,

    `Semoga kamu selalu diberikan berkah umur, dilancarkan rezekinya, dan segala keinginan kamu <span class="glowing-word">tercapai</span> ya sayangku.`,

    `Sekarang kamu udah ga kecil lagi sayang sekarang udah gede, jadi jangan banyak nangis lagi yaa sekarang harus kuat dan buat bangga keluarga kamu terutama buat <span class="glowing-word">almarhum ibu kamu.</span>`
  ],

  ending: "Happy Birthday Sayang LOVE UUUUUUUUUUUUUU. ♡",

  birthdayMessage:
    "Semoga kedepannya hidup kamu dipenuhi momen momen indah, kebahagiaan berlimpah, dan orang orang yang menyayangi kamu."
};

/* ELEMENTS */
const letterScene = document.getElementById("letterScene");
const envelope = document.getElementById("envelope");
const openButton = document.getElementById("openButton");
const letterView = document.getElementById("letterView");
const letterDate = document.getElementById("letterDate");
const letterGreeting = document.getElementById("letterGreeting");
const letterBody = document.getElementById("letterBody");
const letterEnding = document.getElementById("letterEnding");
const birthdayScene = document.getElementById("birthdayScene");
const birthdayMessage = document.getElementById("birthdayMessage");
const heartContainer = document.getElementById("heartContainer");
const replayButton = document.getElementById("replayButton");
const birthdayMusic = document.getElementById("birthdayMusic");
const musicButton = document.getElementById("musicButton");
const musicTitle = document.getElementById("musicTitle");

let hasOpened = false;
let typingCancelled = false;
let ambientHeartInterval = null;

/* START */
function initialize() {
  letterDate.textContent = CONFIG.date;
  birthdayMessage.textContent = CONFIG.birthdayMessage;

  openButton.addEventListener("click", handleOpenLetter);
  envelope.addEventListener("click", handleOpenLetter);

  envelope.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenLetter();
    }
  });

  replayButton.addEventListener("click", replayExperience);
  musicButton.addEventListener("click", toggleMusic);

  setupLightbox();
  setupAudioUI();
  startAmbientHearts();
}

/* OPEN */
function handleOpenLetter() {
  if (hasOpened) return;

  hasOpened = true;
  typingCancelled = false;

  /* Audio is attempted directly from the user's tap. */
  startMusicFromUserGesture();

  openLetter();
}

function startMusicFromUserGesture() {
  birthdayMusic.volume = 0.45;

  const promise = birthdayMusic.play();

  if (promise && typeof promise.catch === "function") {
    promise.catch((error) => {
      console.log("Autoplay tidak tersedia:", error);
      musicButton.textContent = "▶";
      musicTitle.textContent = "Tap ▶ untuk memutar musik ♡";
    });
  }
}

/* LETTER ANIMATION */
async function openLetter() {
  openButton.disabled = true;
  openButton.style.opacity = "0";
  openButton.style.pointerEvents = "none";

  envelope.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(.97)" },
      { transform: "scale(1.02)" },
      { transform: "scale(1)" }
    ],
    {
      duration: 350,
      easing: "cubic-bezier(.34,1.56,.64,1)"
    }
  );

  await wait(300);

  const flap = document.querySelector(".envelope-flap");
  flap.style.transform = "rotateX(-170deg)";

  await wait(650);

  const preview = document.querySelector(".letter-preview");

  preview.animate(
    [
      { transform: "translateY(0) scale(1)", opacity: 1 },
      { transform: "translateY(-120px) scale(1.03)", opacity: 1 }
    ],
    {
      duration: 900,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "forwards"
    }
  );

  await wait(800);

  /*
    IMPORTANT:
    Do not use fixed positioning here.
    The letter scene is hidden and the letter view
    becomes a normal document section.
  */
  letterScene.classList.add("hidden");
  letterView.classList.add("visible");
  letterView.setAttribute("aria-hidden", "false");

  window.scrollTo({ top: 0, behavior: "instant" });

  await wait(500);

  await typeGreeting();
  await wait(350);
  await typeBody();
  await wait(500);
  await typeEnding();

  await wait(900);
  createHeartBurst();

  await wait(1500);
  await transitionToBirthday();
}

/* TYPING */
async function typeGreeting() {
  letterGreeting.textContent = "";
  await typeRichText(letterGreeting, CONFIG.greeting, 48);
}

async function typeBody() {
  letterBody.innerHTML = "";

  for (const paragraph of CONFIG.paragraphs) {
    if (typingCancelled) return;

    const p = document.createElement("p");
    letterBody.appendChild(p);

    await typeRichText(p, paragraph, 28);
    await wait(350);
  }
}

async function typeEnding() {
  letterEnding.textContent = "";
  await typeRichText(letterEnding, CONFIG.ending, 45);
}

async function typeRichText(element, html, delay = 30) {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  async function processNode(node, parent) {
    if (typingCancelled) return;

    if (node.nodeType === Node.TEXT_NODE) {
      for (const character of node.textContent) {
        if (typingCancelled) return;

        parent.appendChild(document.createTextNode(character));
        await wait(getTypingDelay(character, delay));
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false);
      parent.appendChild(clone);

      for (const child of node.childNodes) {
        await processNode(child, clone);
      }
    }
  }

  for (const child of temp.childNodes) {
    await processNode(child, element);
  }
}

function getTypingDelay(character, base) {
  if (".!?".includes(character)) return base * 5;
  if (character === ",") return base * 2.4;
  if (character === " ") return base * 0.35;
  return base;
}

/* BIRTHDAY */
async function transitionToBirthday() {
  letterView.classList.remove("visible");
  letterView.setAttribute("aria-hidden", "true");

  await wait(450);

  birthdayScene.classList.add("visible");
  birthdayScene.setAttribute("aria-hidden", "false");

  createHeartBurst();
}

/* HEARTS */
function startAmbientHearts() {
  clearInterval(ambientHeartInterval);
  ambientHeartInterval = setInterval(createFloatingHeart, 3000);
}

function createFloatingHeart() {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent = Math.random() > 0.5 ? "♡" : "♥";

  const size = 10 + Math.random() * 13;
  const duration = 7 + Math.random() * 7;
  const drift = (Math.random() - 0.5) * 160;

  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${duration}s`;
  heart.style.setProperty("--drift", `${drift}px`);

  heartContainer.appendChild(heart);

  setTimeout(() => heart.remove(), duration * 1000 + 100);
}

function createHeartBurst() {
  const centerX = window.innerWidth / 2;
  const centerY = Math.min(window.innerHeight / 2, 500);

  for (let i = 0; i < 24; i++) {
    const heart = document.createElement("div");
    heart.className = "burst-heart";
    heart.textContent = Math.random() > 0.4 ? "♥" : "♡";
    heart.style.left = `${centerX}px`;
    heart.style.top = `${centerY}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 220;

    heart.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 1700);
  }
}

/* AUDIO UI */
function setupAudioUI() {
  birthdayMusic.addEventListener("play", () => {
    musicButton.textContent = "❚❚";
    musicButton.classList.add("playing");
    musicTitle.textContent = "Now playing ♡";
  });

  birthdayMusic.addEventListener("pause", () => {
    if (birthdayMusic.currentTime > 0) {
      musicButton.textContent = "▶";
      musicButton.classList.remove("playing");
      musicTitle.textContent = "Paused";
    }
  });
}

async function toggleMusic() {
  if (birthdayMusic.paused) {
    try {
      await birthdayMusic.play();
    } catch (error) {
      console.log("Music gagal diputar:", error);
      musicTitle.textContent = "Tap ▶ untuk memutar musik ♡";
    }
  } else {
    birthdayMusic.pause();
  }
}

/* LIGHTBOX */
function setupLightbox() {
  const lightbox = document.getElementById("photoLightbox");
  const image = document.getElementById("lightboxImage");
  const caption = document.getElementById("lightboxCaption");
  const close = document.getElementById("closeLightbox");

  document.querySelectorAll(".polaroid").forEach((polaroid) => {
    polaroid.addEventListener("click", () => {
      image.src = polaroid.dataset.image || "";
      caption.textContent = polaroid.dataset.caption || "";
      lightbox.classList.add("visible");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("visible");
    lightbox.setAttribute("aria-hidden", "true");
  }

  close.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

/* REPLAY */
function replayExperience() {
  typingCancelled = true;
  hasOpened = false;

  birthdayMusic.pause();
  birthdayMusic.currentTime = 0;

  letterGreeting.textContent = "";
  letterBody.innerHTML = "";
  letterEnding.textContent = "";

  const flap = document.querySelector(".envelope-flap");
  const preview = document.querySelector(".letter-preview");

  flap.style.transform = "rotateX(0deg)";
  preview.style.transform = "translateY(0)";
  preview.style.opacity = "1";

  birthdayScene.classList.remove("visible");
  birthdayScene.setAttribute("aria-hidden", "true");

  letterView.classList.remove("visible");
  letterView.setAttribute("aria-hidden", "true");

  letterScene.classList.remove("hidden");

  openButton.disabled = false;
  openButton.style.opacity = "1";
  openButton.style.pointerEvents = "auto";

  window.scrollTo({ top: 0, behavior: "instant" });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

initialize();
