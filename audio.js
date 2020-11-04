//        AUDIO       //
const amount = 200, fData = new Uint8Array(amount);
let analyser, audioSrc, audioElement = new Audio();
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
audioElement.src = '../media/maribou.mp3';
audioSrc = audioCtx.createMediaElementSource(audioElement);
analyser = audioCtx.createAnalyser();
audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);

const trigger = document.querySelector(".container");
const playBtn = document.querySelector(".play-btn");

function startTheShow() {
  audioCtx.resume().then(() => {
    if (audioElement.paused) {
      playTrack();
    } else {
      pauseTrack();
    }
  });
}

function playTrack() {
  audioElement.play();
  if (document.body.contains(playBtn)) {
    document.body.removeChild(playBtn);
  }
}

function pauseTrack() {
  audioElement.pause();
}

function toStart() {
  audioElement.currentTime = 0;
  const children = group.children;
  for (let i = 0; i < amount; i++) {
    const child = children[i];
    child.material.color = new THREE.Color(Math.random() * 0xcccccc);
  }
}

trigger.addEventListener("click", startTheShow.bind(this));
playBtn.addEventListener("click", startTheShow.bind(this));
audioElement.addEventListener("ended", toStart.bind(this));
