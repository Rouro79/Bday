/* =========================================
   CONFIG
========================================= */

const CONFIG = {

  name: "Hi Chibii",

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

  /*
    Tombol Open
  */

  openButton.addEventListener(
    "click",
    handleOpenLetter
  );


  /*
    Klik amplop
  */

  envelope.addEventListener(
    "click",
    handleOpenLetter
  );


  /*
    Keyboard accessibility
  */

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


  /*
    Replay
  */

  replayButton.addEventListener(
    "click",
    replayExperience
  );

}



/* =========================================
   HANDLE OPEN LETTER
========================================= */

function handleOpenLetter() {

  if (hasOpened) {
    return;
  }


  /*
    PENTING UNTUK CHROME MOBILE

    Musik HARUS dipanggil langsung
    dari event click/tap user.

    Jangan menunggu animasi.
    Jangan menunggu await.
  */

  startMusicFromUserGesture();


  /*
    Setelah play dipanggil,
    jalankan animasi surat.
  */

  openLetter();

}



/* =========================================
   START MUSIC FROM USER GESTURE
========================================= */

function startMusicFromUserGesture() {

  /*
    Mulai dari awal.
  */

  birthdayMusic.currentTime = 0;

  birthdayMusic.volume = 0.45;


  /*
    play() dipanggil langsung
    ketika user melakukan tap.
  */

  const playPromise =
    birthdayMusic.play();


  /*
    play() modern browser
    mengembalikan Promise.
  */

  if (
    playPromise !== undefined
  ) {

    playPromise
      .then(() => {

        /*
          Musik berhasil berjalan.
        */

        musicPlaying = true;


        musicButton.textContent =
          "❚❚";


        musicButton.classList.add(
          "playing"
        );


        musicTitle.textContent =
          "Now playing ♡";

      })


      .catch(error => {

        /*
          Musik diblokir browser.
        */

        console.error(
          "Music gagal diputar:",
          error
        );


        musicPlaying = false;


        musicButton.textContent =
          "▶";


        musicButton.classList.remove(
          "playing"
        );


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

  openButton.style.opacity =
    "0";

  openButton.style.pointerEvents =
    "none";



  /* =====================================
     ENVELOPE PRESS
  ====================================== */

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

      easing:
        "cubic-bezier(.34,1.56,.64,1)"

    }
  );



  await wait(250);



  /* =====================================
     OPEN FLAP
  ====================================== */

  const flap =
    document.querySelector(
      ".envelope-flap"
    );


  flap.style.transform =
    "rotateX(-170deg)";



  await wait(550);



  /* =====================================
     LETTER RISES
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

      fill: "forwards"

    }
  );



  await wait(650);



  /* =====================================
     SWITCH TO LETTER
  ====================================== */

  letterScene.classList.add(
    "hidden"
  );


  letterView.classList.add(
    "visible"
  );



  await wait(900);



  /* =====================================
     TYPE GREETING
  ====================================== */

  await typeGreeting();



  await wait(250);



  /* =====================================
     TYPE BODY
  ====================================== */

  await typeBody();



  await wait(500);



  /* =====================================
     TYPE ENDING
  ====================================== */

  await typeEnding();



  await wait(1300);



  /* =====================================
     HEART BURST
  ====================================== */

  createHeartBurst();



  await wait(1800);



  /* =====================================
     BIRTHDAY
  ====================================== */

  await transitionToBirthday();

}



/* =========================================
   TYPE GREETING
========================================= */

async function typeGreeting() {

  letterGreeting.textContent =
    "";


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

  letterBody.innerHTML =
    "";


  for (
    const paragraph
    of CONFIG.paragraphs
  ) {

    if (typingCancelled) {
      return;
    }


    const p =
      document.createElement("p");


    letterBody.appendChild(
      p
    );


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

  letterEnding.textContent =
    "";


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
    Temporary DOM digunakan supaya
    tag seperti:

    <span class="glowing-word">

    tetap berfungsi.
  */

  const temp =
    document.createElement(
      "div"
    );


  temp.innerHTML =
    html;



  async function processNode(
    node,
    parent
  ) {

    if (typingCancelled) {
      return;
    }


    /*
      TEXT NODE
    */

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



    /*
      ELEMENT NODE
    */

    if (
      node.nodeType ===
      Node.ELEMENT_NODE
    ) {

      const clone =
        node.cloneNode(false);


      parent.appendChild(
        clone
      );


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

  /*
    Pause setelah titik.
  */

  if (
    character === "." ||
    character === "!" ||
    character === "?"
  ) {

    return base * 7;

  }


  /*
    Pause setelah koma.
  */

  if (
    character === ","
  ) {

    return base * 3;

  }


  /*
    Spasi lebih cepat.
  */

  if (
    character === " "
  ) {

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
      setTimeout(
        resolve,
        ms
      )
  );

}



/* =========================================
   HEART PARTICLES
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
   CREATE FLOATING HEART
========================================= */

function createFloatingHeart() {

  const heart =
    document.createElement(
      "div"
    );


  heart.className =
    "floating-heart";


  heart.textContent =
    Math.random() > 0.5
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
    (Math.random() - 0.5) *
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

  birthdayMusic.volume =
    0.45;



  /*
    Tombol play/pause
  */

  musicButton.addEventListener(
    "click",
    toggleMusic
  );



  /*
    Jika audio selesai.
    Biasanya tidak terpanggil karena
    audio menggunakan loop, tetapi
    tetap kita siapkan.
  */

  birthdayMusic.addEventListener(
    "ended",
    () => {

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
  );



  /*
    Jika browser berhasil memutar audio
    secara langsung.
  */

  birthdayMusic.addEventListener(
    "play",
    () => {

      musicPlaying =
        true;


      musicButton.textContent =
        "❚❚";


      musicButton.classList.add(
        "playing"
      );


      musicTitle.textContent =
        "Now playing ♡";

    }
  );



  /*
    Jika audio dipause.
  */

  birthdayMusic.addEventListener(
    "pause",
    () => {

      /*
        Jangan ubah UI saat audio
        belum pernah dimainkan.
      */

      if (
        birthdayMusic.currentTime === 0
      ) {

        return;

      }


      musicPlaying =
        false;


      musicButton.textContent =
        "▶";


      musicButton.classList.remove(
        "playing"
      );

    }
  );

}



/* =========================================
   TOGGLE MUSIC
========================================= */

async function toggleMusic() {

  /*
    PLAY
  */

  if (
    birthdayMusic.paused
  ) {

    try {

      const playPromise =
        birthdayMusic.play();


      if (
        playPromise !== undefined
      ) {

        await playPromise;

      }


      musicPlaying =
        true;


      musicButton.textContent =
        "❚❚";


      musicButton.classList.add(
        "playing"
      );


      musicTitle.textContent =
        "Now playing ♡";

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


  /*
    PAUSE
  */

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
    Sembunyikan surat.
  */

  letterView.classList.remove(
    "visible"
  );


  await wait(500);


  /*
    Tampilkan birthday page.
  */

  birthdayScene.classList.add(
    "visible"
  );


  await wait(800);


  /*
    Heart burst.
  */

  createHeartBurst();


  /*
    TIDAK ADA play() DI SINI.

    Musik sudah dimulai ketika user
    pertama kali menekan Open the letter.
  */

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
            "visible"
          );

        }
      );

    }
  );



  /*
    Close lightbox
  */

  function closePhoto() {

    photoLightbox.classList.remove(
      "visible"
    );

  }



  closeLightbox.addEventListener(
    "click",
    closePhoto
  );



  /*
    Klik background untuk close.
  */

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



  /*
    ESC untuk desktop.
  */

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
    0.45;


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
   REPLAY EXPERIENCE
========================================= */

function replayExperience() {

  /*
    Batalkan typing yang sedang berlangsung.
  */

  typingCancelled =
    true;


  /*
    Izinkan surat dibuka kembali.
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
    Reset visibility.
  */

  birthdayScene.classList.remove(
    "visible"
  );


  letterView.classList.remove(
    "visible"
  );


  letterScene.classList.remove(
    "hidden"
  );



  /*
    Reset Open button.
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
