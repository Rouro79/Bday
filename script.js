/* =========================================
   CONFIG
========================================= */

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

  ending:
    "Happy Birthday Sayang LOVE UUUUUUUUUUUUUU. ♡",

  birthdayMessage:
    "Semoga kedepannya hidup kamu dipenuhi momen momen indah, kebahagiaan berlimpah, dan orang orang yang menyayangi kamu."

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

const birthdayMusic =
  document.getElementById("birthdayMusic");

const musicButton =
  document.getElementById("musicButton");

const musicTitle =
  document.getElementById("musicTitle");



/* =========================================
   STATE
========================================= */

let hasOpened = false;

let typingCancelled = false;

let ambientHeartInterval = null;

let musicPlaying = false;



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


  /* OPEN BUTTON */

  openButton.addEventListener(
    "click",
    handleOpenLetter
  );


  /* ENVELOPE */

  envelope.addEventListener(
    "click",
    handleOpenLetter
  );


  /* KEYBOARD */

  envelope.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        handleOpenLetter();

      }

    }
  );


  /* REPLAY */

  replayButton.addEventListener(
    "click",
    replayExperience
  );

}



/* =========================================
   HANDLE OPEN
========================================= */

function handleOpenLetter() {

  if (hasOpened) {

    return;

  }


  /*
    Musik dipanggil langsung
    dari tap user.
  */

  startMusicFromUserGesture();


  /*
    Jalankan animasi.
  */

  openLetter();

}



/* =========================================
   START MUSIC
========================================= */

function startMusicFromUserGesture() {

  birthdayMusic.currentTime = 0;

  birthdayMusic.volume = 0.45;


  const promise =
    birthdayMusic.play();


  if (
    promise !== undefined
  ) {

    promise
      .then(() => {

        musicPlaying = true;

        updateMusicUI();

      })


      .catch(error => {

        console.log(
          "Music autoplay blocked:",
          error
        );

        musicPlaying = false;

        musicTitle.textContent =
          "Tap ▶ untuk memutar musik ♡";

      });

  }

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



  /* =====================================
     HIDE BUTTON
  ====================================== */

  openButton.style.opacity = "0";

  openButton.style.pointerEvents =
    "none";



  /* =====================================
     ENVELOPE PRESS
  ====================================== */

  envelope.animate(

    [

      {
        transform:
          "scale(1)"
      },

      {
        transform:
          "scale(.96)"
      },

      {
        transform:
          "scale(1.02)"
      },

      {
        transform:
          "scale(1)"
      }

    ],

    {

      duration: 350,

      easing:
        "cubic-bezier(.34,1.56,.64,1)"

    }

  );



  await wait(300);



  /* =====================================
     FLAP
  ====================================== */

  const flap =
    document.querySelector(
      ".envelope-flap"
    );


  flap.style.transform =
    "rotateX(-170deg)";



  await wait(650);



  /* =====================================
     LETTER PREVIEW RISE
  ====================================== */

  const preview =
    document.querySelector(
      ".letter-preview"
    );


  preview.animate(

    [

      {

        transform:
          "translateY(0)",

        opacity: 1

      },

      {

        transform:
          "translateY(-150px) scale(1.05)",

        opacity: 1

      }

    ],

    {

      duration: 900,

      easing:
        "cubic-bezier(.16,1,.3,1)",

      fill:
        "forwards"

    }

  );



  await wait(800);



  /* =====================================
     SWITCH TO LETTER
  ====================================== */

  letterScene.classList.remove(
    "active"
  );


  letterView.classList.add(
    "active"
  );



  await wait(700);



  /* =====================================
     GREETING
  ====================================== */

  await typeGreeting();



  await wait(600);



  /* =====================================
     BODY
  ====================================== */

  await typeBody();



  await wait(800);



  /* =====================================
     ENDING
  ====================================== */

  await typeEnding();



  await wait(1800);



  /* =====================================
     HEART BURST
  ====================================== */

  createHeartBurst();



  await wait(1700);



  /* =====================================
     BIRTHDAY
  ====================================== */

  await transitionToBirthday();

}



/* =========================================
   GREETING
========================================= */

async function typeGreeting() {

  letterGreeting.textContent = "";


  await typeRichText(

    letterGreeting,

    CONFIG.greeting,

    75

  );

}



/* =========================================
   BODY
========================================= */

async function typeBody() {

  letterBody.innerHTML = "";


  for (
    const paragraph
    of CONFIG.paragraphs
  ) {

    if (typingCancelled) {

      return;

    }


    const p =
      document.createElement("p");


    letterBody.appendChild(p);


    /*
      45ms per karakter.
      Lebih pelan agar nyaman dibaca.
    */

    await typeRichText(

      p,

      paragraph,

      45

    );


    /*
      Jeda antar paragraf.
    */

    await wait(700);

  }

}



/* =========================================
   ENDING
========================================= */

async function typeEnding() {

  letterEnding.textContent = "";


  await typeRichText(

    letterEnding,

    CONFIG.ending,

    70

  );

}



/* =========================================
   RICH TEXT TYPING
========================================= */

async function typeRichText(
  element,
  html,
  delay = 45
) {


  const temp =
    document.createElement("div");


  temp.innerHTML =
    html;



  async function processNode(
    node,
    parent
  ) {


    if (typingCancelled) {

      return;

    }


    /* =====================================
       TEXT
    ====================================== */

    if (
      node.nodeType ===
      Node.TEXT_NODE
    ) {


      for (
        const character
        of node.textContent
      ) {


        if (typingCancelled) {

          return;

        }


        parent.appendChild(

          document.createTextNode(
            character
          )

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



    /* =====================================
       ELEMENT
    ====================================== */

    if (
      node.nodeType ===
      Node.ELEMENT_NODE
    ) {


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


  /* TITIK */

  if (
    character === "." ||
    character === "!" ||
    character === "?"
  ) {

    return base * 8;

  }


  /* KOMA */

  if (
    character === ","
  ) {

    return base * 4;

  }


  /* COLON / SEMICOLON */

  if (
    character === ":" ||
    character === ";"
  ) {

    return base * 3;

  }


  /* SPACE */

  if (
    character === " "
  ) {

    return base * .5;

  }


  return base;

}



/* =========================================
   WAIT
========================================= */

function wait(ms) {

  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );

}



/* =========================================
   AMBIENT HEARTS
========================================= */

function startAmbientHearts() {


  if (
    ambientHeartInterval
  ) {

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



/* =========================================
   FLOATING HEART
========================================= */

function createFloatingHeart() {


  const heart =
    document.createElement(
      "div"
    );


  heart.className =
    "heart-particle";


  heart.textContent =
    Math.random() > .5
      ? "♡"
      : "♥";


  const left =
    Math.random() * 100;


  const size =
    10 +
    Math.random() * 13;


  const duration =
    7 +
    Math.random() * 7;


  const drift =
    (Math.random() - .5) *
    160;


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
      document.createElement(
        "div"
      );


    heart.className =
      "burst-heart";


    heart.textContent =
      Math.random() > .4
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
      Math.random() *
      250;


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


  birthdayMusic.volume =
    .45;


  musicButton.addEventListener(
    "click",
    toggleMusic
  );


  birthdayMusic.addEventListener(
    "play",
    () => {

      musicPlaying = true;

      updateMusicUI();

    }
  );


  birthdayMusic.addEventListener(
    "pause",
    () => {

      if (
        birthdayMusic.currentTime === 0
      ) {

        return;

      }


      musicPlaying = false;

      musicButton.textContent =
        "▶";

      musicButton.classList.remove(
        "playing"
      );

    }
  );

}



/* =========================================
   MUSIC UI
========================================= */

function updateMusicUI() {


  if (musicPlaying) {


    musicButton.textContent =
      "❚❚";


    musicButton.classList.add(
      "playing"
    );


    musicTitle.textContent =
      "Now playing ♡";


  }

  else {


    musicButton.textContent =
      "▶";


    musicButton.classList.remove(
      "playing"
    );


    musicTitle.textContent =
      "Our Special Song";

  }

}



/* =========================================
   TOGGLE MUSIC
========================================= */

async function toggleMusic() {


  if (
    birthdayMusic.paused
  ) {


    try {


      await birthdayMusic.play();


      musicPlaying =
        true;


      updateMusicUI();


    }


    catch (error) {


      console.error(
        "Music could not start:",
        error
      );


      musicTitle.textContent =
        "Tap play to start ♡";

    }


  }


  else {


    birthdayMusic.pause();


    musicPlaying =
      false;


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
   BIRTHDAY TRANSITION
========================================= */

async function transitionToBirthday() {


  /*
    Hilangkan letter.
  */

  letterView.classList.remove(
    "active"
  );


  await wait(600);


  /*
    Tampilkan birthday.
  */

  birthdayScene.classList.add(
    "active"
  );


  await wait(900);


  createHeartBurst();

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
            polaroid.dataset.caption ||
            "";


          lightboxImage.src =
            image;


          lightboxCaption.textContent =
            caption;


          photoLightbox.classList.add(
            "active"
          );

        }
      );

    }
  );



  /* CLOSE */

  function closePhoto() {

    photoLightbox.classList.remove(
      "active"
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


  birthdayMusic.currentTime =
    0;


  birthdayMusic.volume =
    .45;


  musicPlaying =
    false;


  musicButton.textContent =
    "▶";


  musicButton.classList.remove(
    "playing"
  );


  musicTitle.textContent =
    "Our Special Song";

}



/* =========================================
   REPLAY
========================================= */

function replayExperience() {


  /*
    Batalkan typing.
  */

  typingCancelled =
    true;


  /*
    Reset state.
  */

  hasOpened =
    false;


  /*
    Reset music.
  */

  resetMusic();


  /*
    Reset letter.
  */

  letterGreeting.textContent =
    "";


  letterBody.innerHTML =
    "";


  letterEnding.textContent =
    "";



  /*
    Reset envelope.
  */

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



  /*
    Reset scenes.
  */

  birthdayScene.classList.remove(
    "active"
  );


  letterView.classList.remove(
    "active"
  );


  letterScene.classList.add(
    "active"
  );



  /*
    Reset button.
  */

  openButton.style.opacity =
    "1";


  openButton.style.pointerEvents =
    "auto";



  /*
    Reset scroll.
  */

  window.scrollTo(
    0,
    0
  );

}



/* =========================================
   START
========================================= */

initialize();
