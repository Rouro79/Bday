/* =========================================
   CONFIG
========================================= */

const CONFIG = {

  name: "Someone Special",

  date: "A little letter from my heart",

  greeting: "Dear Someone Special,",

  paragraphs: [

    `I don't really know where to begin, because somehow there are never enough words to describe what you mean to me.`,

    `You have a <span class="glowing-word">beautiful</span> way of making ordinary moments feel special. Your smile, your presence, and even the little things you probably don't notice can mean more than you know.`,

    `Today, I just want you to know that you are deeply appreciated, genuinely cherished, and incredibly <span class="glowing-word">special</span> to me.`,

    `I hope this new chapter of your life brings you beautiful memories, peaceful moments, and all the <span class="glowing-word">happiness</span> your heart deserves.`
  ],

  ending: "Happy Birthday. ♡",

  birthdayMessage:
    "May your days be filled with beautiful moments, genuine happiness, and people who love you just as much as you deserve."

};


/* =========================================
   ELEMENTS
========================================= */

const letterScene =
  document.getElementById("letterScene");

const envelope =
  document.getElementById("envelope");

const openButton =
  document.getElementById("openButton");

const letterView =
  document.getElementById("letterView");

const letterDate =
  document.getElementById("letterDate");

const letterGreeting =
  document.getElementById("letterGreeting");

const letterBody =
  document.getElementById("letterBody");

const letterEnding =
  document.getElementById("letterEnding");

const birthdayScene =
  document.getElementById("birthdayScene");

const birthdayMessage =
  document.getElementById("birthdayMessage");

const heartContainer =
  document.getElementById("heartContainer");

const replayButton =
  document.getElementById("replayButton");


/* =========================================
   MUSIC
========================================= */

const birthdayMusic =
  document.getElementById("birthdayMusic");

const musicButton =
  document.getElementById("musicButton");

const musicTitle =
  document.getElementById("musicTitle");

let musicPlaying = false;


/* =========================================
   STATE
========================================= */

let hasOpened = false;
let typingCancelled = false;

let ambientHeartInterval = null;


/* =========================================
   INITIALIZE
========================================= */

function initialize() {

  letterDate.textContent =
    CONFIG.date;

  birthdayMessage.textContent =
    CONFIG.birthdayMessage;

  setupInteractions();

  setupMusic();

  setupLightbox();

  startAmbientHearts();

}


/* =========================================
   INTERACTIONS
========================================= */

function setupInteractions() {

  openButton.addEventListener(
    "click",
    openLetter
  );

  envelope.addEventListener(
    "click",
    openLetter
  );


  envelope.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        openLetter();

      }

    }
  );


  replayButton.addEventListener(
    "click",
    replayExperience
  );

}


/* =========================================
   OPEN LETTER
========================================= */

async function openLetter() {

  if (hasOpened) {
    return;
  }

  hasOpened = true;

  typingCancelled = false;


  /* hide button */

  openButton.style.opacity = "0";
  openButton.style.pointerEvents = "none";


  /* envelope press */

  envelope.animate(
    [
      {
        transform: "scale(1)"
      },
      {
        transform: "scale(0.96)"
      },
      {
        transform: "scale(1.02)"
      },
      {
        transform: "scale(1)"
      }
    ],
    {
      duration: 350,
      easing: "cubic-bezier(.34,1.56,.64,1)"
    }
  );


  await wait(250);


  /* open flap */

  const flap =
    document.querySelector(".envelope-flap");

  flap.style.transform =
    "rotateX(-170deg)";


  await wait(550);


  /* letter rises */

  const preview =
    document.querySelector(".letter-preview");

  preview.animate(
    [
      {
        transform: "translateY(0)",
        opacity: 1
      },
      {
        transform: "translateY(-150px) scale(1.05)",
        opacity: 1
      }
    ],
    {
      duration: 900,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "forwards"
    }
  );


  await wait(650);


  /* switch scene */

  letterScene.classList.add("hidden");

  letterView.classList.add("visible");


  await wait(900);


  /* type letter */

  await typeGreeting();

  await wait(250);

  await typeBody();

  await wait(500);

  await typeEnding();


  await wait(1300);


  /* heart burst */

  createHeartBurst();


  await wait(1800);


  /* birthday */

  await transitionToBirthday();

}


/* =========================================
   TYPE GREETING
========================================= */

async function typeGreeting() {

  letterGreeting.textContent = "";

  await typeRichText(
    letterGreeting,
    CONFIG.greeting,
    50
  );

}


/* =========================================
   TYPE BODY
========================================= */

async function typeBody() {

  letterBody.innerHTML = "";

  for (
    const paragraph of CONFIG.paragraphs
  ) {

    if (typingCancelled) {
      return;
    }


    const p =
      document.createElement("p");

    letterBody.appendChild(p);


    await typeRichText(
      p,
      paragraph,
      17
    );


    await wait(250);

  }

}


/* =========================================
   TYPE ENDING
========================================= */

async function typeEnding() {

  letterEnding.textContent = "";

  await typeRichText(
    letterEnding,
    CONFIG.ending,
    55
  );

}


/* =========================================
   TYPE RICH TEXT
========================================= */

async function typeRichText(
  element,
  html,
  delay = 30
) {

  /*
    Kita membuat temporary DOM supaya
    tag <span class="glowing-word"> tetap
    bisa digunakan.
  */

  const temp =
    document.createElement("div");

  temp.innerHTML = html;


  async function processNode(
    node,
    parent
  ) {

    if (typingCancelled) {
      return;
    }


    if (node.nodeType === Node.TEXT_NODE) {

      for (
        const character
        of node.textContent
      ) {

        if (typingCancelled) {
          return;
        }

        parent.appendChild(
          document.createTextNode(character)
        );

        await wait(
          getTypingDelay(
            character,
            delay
          )
        );

      }

      return;
    }


    if (node.nodeType === Node.ELEMENT_NODE) {

      const clone =
        node.cloneNode(false);

      parent.appendChild(clone);


      for (
        const child
        of node.childNodes
      ) {

        await processNode(
          child,
          clone
        );

      }

    }

  }


  for (
    const child
    of temp.childNodes
  ) {

    await processNode(
      child,
      element
    );

  }

}


/* =========================================
   TYPING DELAY
========================================= */

function getTypingDelay(
  character,
  base
) {

  if (
    character === "." ||
    character === "!" ||
    character === "?"
  ) {

    return base * 7;

  }

  if (character === ",") {
    return base * 3;
  }

  if (character === " ") {
    return base * 0.45;
  }

  return base;

}


/* =========================================
   WAIT
========================================= */

function wait(ms) {

  return new Promise(
    resolve =>
      setTimeout(resolve, ms)
  );

}


/* =========================================
   HEART PARTICLES
========================================= */

function startAmbientHearts() {

  if (ambientHeartInterval) {
    clearInterval(
      ambientHeartInterval
    );
  }


  ambientHeartInterval =
    setInterval(
      createFloatingHeart,
      2600
    );

}


function createFloatingHeart() {

  const heart =
    document.createElement("div");

  heart.className =
    "floating-heart";

  heart.textContent =
    Math.random() > 0.5
      ? "♡"
      : "♥";


  const left =
    Math.random() * 100;

  const size =
    10 + Math.random() * 13;

  const duration =
    7 + Math.random() * 7;

  const drift =
    (Math.random() - 0.5) * 160;


  heart.style.left =
    `${left}%`;

  heart.style.fontSize =
    `${size}px`;

  heart.style.animationDuration =
    `${duration}s`;

  heart.style.setProperty(
    "--drift",
    `${drift}px`
  );


  heartContainer.appendChild(
    heart
  );


  setTimeout(
    () => heart.remove(),
    duration * 1000
  );

}


/* =========================================
   HEART BURST
========================================= */

function createHeartBurst() {

  const centerX =
    window.innerWidth / 2;

  const centerY =
    window.innerHeight / 2;


  for (
    let i = 0;
    i < 28;
    i++
  ) {

    const heart =
      document.createElement("div");

    heart.className =
      "burst-heart";

    heart.textContent =
      Math.random() > 0.4
        ? "♥"
        : "♡";


    heart.style.left =
      `${centerX}px`;

    heart.style.top =
      `${centerY}px`;


    const angle =
      Math.random() *
      Math.PI *
      2;

    const distance =
      100 +
      Math.random() * 250;


    const x =
      Math.cos(angle) *
      distance;

    const y =
      Math.sin(angle) *
      distance;


    heart.style.setProperty(
      "--x",
      `${x}px`
    );

    heart.style.setProperty(
      "--y",
      `${y}px`
    );


    heartContainer.appendChild(
      heart
    );


    setTimeout(
      () => heart.remove(),
      1600
    );

  }

}


/* =========================================
   MUSIC SETUP
========================================= */

function setupMusic() {

  birthdayMusic.volume = 0.45;


  musicButton.addEventListener(
    "click",
    toggleMusic
  );


  birthdayMusic.addEventListener(
    "ended",
    () => {

      musicPlaying = false;

      musicButton.textContent =
        "▶";

      musicButton.classList.remove(
        "playing"
      );

      musicTitle.textContent =
        "Our Special Song";

    }
  );

}


/* =========================================
   TOGGLE MUSIC
========================================= */

async function toggleMusic() {

  if (birthdayMusic.paused) {

    try {

      await birthdayMusic.play();

      musicPlaying = true;

      musicButton.textContent =
        "❚❚";

      musicButton.classList.add(
        "playing"
      );

      musicTitle.textContent =
        "Now playing ♡";

    }

    catch (error) {

      console.log(
        "Music could not start:",
        error
      );

      musicTitle.textContent =
        "Tap play to start ♡";

    }

  }

  else {

    birthdayMusic.pause();

    musicPlaying = false;

    musicButton.textContent =
      "▶";

    musicButton.classList.remove(
      "playing"
    );

    musicTitle.textContent =
      "Paused";

  }

}


/* =========================================
   START MUSIC WITH FADE IN
========================================= */

async function startMusicWithFade() {

  try {

    birthdayMusic.volume = 0;

    await birthdayMusic.play();

    musicPlaying = true;

    musicButton.textContent =
      "❚❚";

    musicButton.classList.add(
      "playing"
    );

    musicTitle.textContent =
      "Now playing ♡";


    let volume = 0;


    const fadeIn =
      setInterval(
        () => {

          volume += 0.025;

          birthdayMusic.volume =
            Math.min(
              volume,
              0.45
            );


          if (
            volume >= 0.45
          ) {

            clearInterval(
              fadeIn
            );

          }

        },
        100
      );

  }

  catch (error) {

    /*
      Browser bisa memblokir autoplay.
      User tetap bisa menekan tombol play.
    */

    console.log(
      "Autoplay blocked:",
      error
    );

    birthdayMusic.volume = 0.45;

  }

}


/* =========================================
   BIRTHDAY TRANSITION
========================================= */

async function transitionToBirthday() {

  letterView.classList.remove(
    "visible"
  );


  await wait(500);


  birthdayScene.classList.add(
    "visible"
  );


  await wait(800);


  createHeartBurst();


  /*
    Coba mulai musik otomatis.
    Kalau browser memblokir autoplay,
    tombol musik tetap bisa digunakan.
  */

  await startMusicWithFade();

}


/* =========================================
   LIGHTBOX
========================================= */

function setupLightbox() {

  const photoLightbox =
    document.getElementById(
      "photoLightbox"
    );

  const lightboxImage =
    document.getElementById(
      "lightboxImage"
    );

  const lightboxCaption =
    document.getElementById(
      "lightboxCaption"
    );

  const closeLightbox =
    document.getElementById(
      "closeLightbox"
    );


  const polaroids =
    document.querySelectorAll(
      ".polaroid"
    );


  polaroids.forEach(
    polaroid => {

      polaroid.addEventListener(
        "click",
        () => {

          const image =
            polaroid.dataset.image;

          const caption =
            polaroid.dataset.caption;


          lightboxImage.src =
            image;

          lightboxCaption.textContent =
            caption;


          photoLightbox.classList.add(
            "visible"
          );

        }
      );

    }
  );


  function closePhoto() {

    photoLightbox.classList.remove(
      "visible"
    );

  }


  closeLightbox.addEventListener(
    "click",
    closePhoto
  );


  photoLightbox.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        photoLightbox
      ) {

        closePhoto();

      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closePhoto();

      }

    }
  );

}


/* =========================================
   RESET MUSIC
========================================= */

function resetMusic() {

  birthdayMusic.pause();

  birthdayMusic.currentTime = 0;

  birthdayMusic.volume = 0.45;

  musicPlaying = false;

  musicButton.textContent =
    "▶";

  musicButton.classList.remove(
    "playing"
  );

  musicTitle.textContent =
    "Our Special Song";

}


/* =========================================
   REPLAY EXPERIENCE
========================================= */

function replayExperience() {

  typingCancelled = true;

  hasOpened = false;


  /* reset music */

  resetMusic();


  /* reset letter */

  letterGreeting.textContent =
    "";

  letterBody.innerHTML =
    "";

  letterEnding.textContent =
    "";


  /* reset envelope */

  const flap =
    document.querySelector(
      ".envelope-flap"
    );

  const preview =
    document.querySelector(
      ".letter-preview"
    );


  flap.style.transform =
    "rotateX(0deg)";


  preview.style.transform =
    "translateY(0)";

  preview.style.opacity =
    "1";


  /* reset visibility */

  birthdayScene.classList.remove(
    "visible"
  );

  letterView.classList.remove(
    "visible"
  );

  letterScene.classList.remove(
    "hidden"
  );


  openButton.style.opacity =
    "1";

  openButton.style.pointerEvents =
    "auto";


  /* scroll to top */

  birthdayScene.scrollTop = 0;

}


/* =========================================
   START
========================================= */

initialize();