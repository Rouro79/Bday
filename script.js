const CONFIG = {
  name: "Hi Chibii",
  date: "A little letter from my heart",
  greeting: "Hi Chibiii,",
  paragraphs: [
    `Hallooooow Sayang, BWAHAHAHAHAHAHHAHAHA.`,
    `Aku buatin nih buat kamu yang <span class="glowing-word">cantik lucu imut baik pinter dan chibii</span>, yang hari ini sedang berulangtahun ke 18.`,
    `Aku gabisa ngomong banyak karena yah ga jago ngomong, aku cuma mau bilang kalo aku itu makasi banget udah ditemenin sama kamu meski kamu nih sering <span class="glowing-word">ngeselin</span> ke aku.`,
    `Semoga kamu selalu diberikan berkah umur, dilancarkan rezekinya, dan segala keinginan kamu <span class="glowing-word">tercapai</span> ya sayangku.`,
    `Sekarang kamu udah ga kecil lagi sayang, sekarang udah gede, jadi jangan banyak nangis lagi yaa. Sekarang harus kuat dan buat bangga keluarga kamu, terutama buat <span class="glowing-word">almarhum ibu kamu.</span>`
  ],
  ending: "Happy Birthday Sayang LOVE UUUUUUUUUUUUUU. ♡",
  birthdayMessage: "Semoga kedepannya hidup kamu dipenuhi momen-momen indah, kebahagiaan berlimpah, dan orang-orang yang menyayangi kamu."
};

const $ = id => document.getElementById(id);

const letterScene = $("letterScene");
const envelope = $("envelope");
const openButton = $("openButton");
const letterView = $("letterView");
const letterDate = $("letterDate");
const letterGreeting = $("letterGreeting");
const letterBody = $("letterBody");
const letterEnding = $("letterEnding");
const birthdayScene = $("birthdayScene");
const birthdayMessage = $("birthdayMessage");
const heartContainer = $("heartContainer");
const replayButton = $("replayButton");
const birthdayMusic = $("birthdayMusic");
const musicButton = $("musicButton");
const musicTitle = $("musicTitle");

let hasOpened = false;
let typingCancelled = false;
let ambientHeartInterval = null;

function initialize(){
  letterDate.textContent = CONFIG.date;
  birthdayMessage.textContent = CONFIG.birthdayMessage;
  setupInteractions();
  setupMusic();
  setupLightbox();
  startAmbientHearts();
}

function setupInteractions(){
  openButton.addEventListener("click", handleOpenLetter);
  envelope.addEventListener("click", handleOpenLetter);
  envelope.addEventListener("keydown", e => {
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      handleOpenLetter();
    }
  });
  replayButton.addEventListener("click", replayExperience);
}

function handleOpenLetter(){
  if(hasOpened) return;
  startMusicFromUserGesture();
  openLetter();
}

function startMusicFromUserGesture(){
  birthdayMusic.currentTime = 0;
  birthdayMusic.volume = .45;

  const promise = birthdayMusic.play();

  if(promise){
    promise.then(() => {
      musicButton.textContent = "❚❚";
      musicButton.classList.add("playing");
      musicTitle.textContent = "Now playing ♡";
    }).catch(() => {
      musicButton.textContent = "▶";
      musicButton.classList.remove("playing");
      musicTitle.textContent = "Tap ▶ untuk memutar musik ♡";
    });
  }
}

async function openLetter(){
  if(hasOpened) return;

  hasOpened = true;
  typingCancelled = false;
  openButton.style.opacity = "0";
  openButton.style.pointerEvents = "none";

  envelope.animate(
    [
      {transform:"scale(1)"},
      {transform:"scale(.96)"},
      {transform:"scale(1.02)"},
      {transform:"scale(1)"}
    ],
    {duration:350,easing:"cubic-bezier(.34,1.56,.64,1)"}
  );

  await wait(250);

  const flap = document.querySelector(".envelope-flap");
  flap.style.transform = "rotateX(-170deg)";

  await wait(550);

  const preview = document.querySelector(".letter-preview");
  preview.animate(
    [
      {transform:"translateY(0) scale(1)",opacity:1},
      {transform:"translateY(-115px) scale(1.03)",opacity:1}
    ],
    {duration:800,easing:"cubic-bezier(.16,1,.3,1)",fill:"forwards"}
  );

  await wait(600);

  letterScene.classList.add("hidden");
  letterView.classList.add("visible");

  window.scrollTo({top:0,behavior:"instant"});
  await wait(550);

  await typeGreeting();
  await wait(220);
  await typeBody();
  await wait(400);
  await typeEnding();
  await wait(900);

  createHeartBurst();
  await wait(1200);
  await transitionToBirthday();
}

async function typeGreeting(){
  letterGreeting.textContent = "";
  await typeRichText(letterGreeting, CONFIG.greeting, 45);
}

async function typeBody(){
  letterBody.innerHTML = "";

  for(const paragraph of CONFIG.paragraphs){
    if(typingCancelled) return;
    const p = document.createElement("p");
    letterBody.appendChild(p);
    await typeRichText(p, paragraph, 12);
    await wait(170);
  }
}

async function typeEnding(){
  letterEnding.textContent = "";
  await typeRichText(letterEnding, CONFIG.ending, 35);
}

async function typeRichText(element, html, delay=25){
  const temp = document.createElement("div");
  temp.innerHTML = html;

  async function processNode(node,parent){
    if(typingCancelled) return;

    if(node.nodeType === Node.TEXT_NODE){
      for(const character of node.textContent){
        if(typingCancelled) return;
        parent.appendChild(document.createTextNode(character));
        await wait(getTypingDelay(character,delay));
      }
      return;
    }

    if(node.nodeType === Node.ELEMENT_NODE){
      const clone = node.cloneNode(false);
      parent.appendChild(clone);
      for(const child of node.childNodes){
        await processNode(child,clone);
      }
    }
  }

  for(const child of temp.childNodes){
    await processNode(child,element);
  }
}

function getTypingDelay(character,base){
  if(".!?".includes(character)) return base * 5;
  if(character === ",") return base * 2.4;
  if(character === " ") return base * .35;
  return base;
}

const wait = ms => new Promise(resolve => setTimeout(resolve,ms));

function startAmbientHearts(){
  clearInterval(ambientHeartInterval);
  ambientHeartInterval = setInterval(createFloatingHeart,2600);
}

function createFloatingHeart(){
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent = Math.random() > .5 ? "♡" : "♥";
  heart.style.left = `${Math.random()*100}%`;
  heart.style.fontSize = `${10+Math.random()*13}px`;
  const duration = 7+Math.random()*7;
  heart.style.animationDuration = `${duration}s`;
  heart.style.setProperty("--drift",`${(Math.random()-.5)*160}px`);
  heartContainer.appendChild(heart);
  setTimeout(()=>heart.remove(),duration*1000);
}

function createHeartBurst(){
  const x = innerWidth/2;
  const y = innerHeight/2;

  for(let i=0;i<28;i++){
    const heart = document.createElement("div");
    heart.className = "burst-heart";
    heart.textContent = Math.random()>.4 ? "♥" : "♡";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    const angle = Math.random()*Math.PI*2;
    const distance = 100+Math.random()*250;
    heart.style.setProperty("--x",`${Math.cos(angle)*distance}px`);
    heart.style.setProperty("--y",`${Math.sin(angle)*distance}px`);

    heartContainer.appendChild(heart);
    setTimeout(()=>heart.remove(),1600);
  }
}

function setupMusic(){
  birthdayMusic.volume = .45;

  musicButton.addEventListener("click",toggleMusic);

  birthdayMusic.addEventListener("play",()=>{
    musicButton.textContent = "❚❚";
    musicButton.classList.add("playing");
    musicTitle.textContent = "Now playing ♡";
  });

  birthdayMusic.addEventListener("pause",()=>{
    if(birthdayMusic.currentTime > 0){
      musicButton.textContent = "▶";
      musicButton.classList.remove("playing");
    }
  });
}

async function toggleMusic(){
  if(birthdayMusic.paused){
    try{
      await birthdayMusic.play();
    }catch{
      musicTitle.textContent = "Tap play to start ♡";
    }
  }else{
    birthdayMusic.pause();
    musicTitle.textContent = "Paused";
  }
}

async function transitionToBirthday(){
  letterView.classList.remove("visible");
  await wait(350);
  birthdayScene.classList.add("visible");
  await wait(500);
  createHeartBurst();
}

function setupLightbox(){
  const lightbox = $("photoLightbox");
  const image = $("lightboxImage");
  const caption = $("lightboxCaption");

  document.querySelectorAll(".polaroid").forEach(card=>{
    card.addEventListener("click",()=>{
      image.src = card.dataset.image;
      caption.textContent = card.dataset.caption || "";
      lightbox.classList.add("visible");
      lightbox.setAttribute("aria-hidden","false");
    });
  });

  const close = ()=>{
    lightbox.classList.remove("visible");
    lightbox.setAttribute("aria-hidden","true");
  };

  $("closeLightbox").addEventListener("click",close);
  lightbox.addEventListener("click",e=>{
    if(e.target === lightbox) close();
  });
  document.addEventListener("keydown",e=>{
    if(e.key === "Escape") close();
  });
}

function resetMusic(){
  birthdayMusic.pause();
  birthdayMusic.currentTime = 0;
  birthdayMusic.volume = .45;
  musicButton.textContent = "▶";
  musicButton.classList.remove("playing");
  musicTitle.textContent = "Our Special Song";
}

function replayExperience(){
  typingCancelled = true;
  hasOpened = false;
  resetMusic();

  letterGreeting.textContent = "";
  letterBody.innerHTML = "";
  letterEnding.textContent = "";

  const flap = document.querySelector(".envelope-flap");
  const preview = document.querySelector(".letter-preview");

  flap.style.transform = "rotateX(0deg)";
  preview.style.transform = "translateY(0)";
  preview.style.opacity = "1";

  birthdayScene.classList.remove("visible");
  letterView.classList.remove("visible");
  letterScene.classList.remove("hidden");

  openButton.style.opacity = "1";
  openButton.style.pointerEvents = "auto";

  window.scrollTo({top:0,behavior:"smooth"});
}

initialize();
