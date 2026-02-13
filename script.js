/* ================================ */
/* CONFIG — EDIT THESE!             */
/* ================================ */

// Bear images from open source / placeholder
// EDIT: Ganti dengan URL gambar bear/karakter lucu yang kamu mau
const BEAR_IMAGES = {
  peek:     'https://media1.tenor.com/m/oz8BihIx54YAAAAC/bubu-surprise-cute.gif',
  sad:      'https://media1.tenor.com/m/BOLqQTbf9QgAAAAC/dudu-sad.gif',
  please:   'https://media1.tenor.com/m/6iYbSNGPmvwAAAAC/bubu-crying-bubu-dudu.gif',
  flowers:  'https://media1.tenor.com/m/0cNM_9li440AAAAC/dudu-giving-flowers-bubu-flowers.gif',
  happy:    'https://media1.tenor.com/m/m_PmpJJSs84AAAAC/bubu-cute-dancing.gif',
  love:     'https://media1.tenor.com/m/1iQ0Bqc02KsAAAAC/bubu-dudu-love.gif',
  curious:  'https://media1.tenor.com/m/-HF7-xdOAAwAAAAC/bubu-dudu-bubu-dudu-shy.gif',
  kiss:     'https://media1.tenor.com/m/ZlndAzfwx80AAAAC/kiss-bubu-dudu.gif',
};

// Texts that appear on the "No" button as user keeps clicking
const NO_BUTTON_TEXTS = [
  'No',
  'Are you sure? 😢',
  'Really sure? 🥺',
  'Pretty please? 😭',
  'Think again! 💔',
  "But we'd be so cute! 💕",
  "Don't do this to me 😿",
  'I\'ll be sad... 🐻',
  'You\'re breaking my heart 💔',
  'Last chance... 🥹',
  'Plis deh... 🥺',
  'Aku sedih nih 😢',
  'Yakin gamau? 😭',
  'Pikirin lagi dong 💭',
  'Nanti nyesel loh 😤',
  'Aku tunggu kamu pencet Yes 🫶',
  'Please please please 🙏',
  'Kamu jahat... 😿',
  'Aku nangis nih beneran 😭',
  'Satu kesempatan lagi? 🌸',
  'Kamu ga kasian? 🥺',
  'Oke aku minta maaf deh 😞',
  'Tapi aku sayang kamu... 💕',
  'Cobain pencet Yes deh 👉',
  'Yes-nya di sebelah sana 👀',
  'Kamu serius? FOR REAL? 😱',
  'Aku ga akan menyerah! 💪',
  'Tombol Yes rindu kamu 🥹',
  'Aku masih di sini loh 🐻',
  'Kamu beneran mau tolak aku? 😢',
  'Just kidding, pick Yes! 🤭',
];

// Bear image per stage of "No" clicking
const BEAR_STAGES = [
  'peek',     // initial
  'sad',      // 1st no
  'please',   // 2nd no
  'flowers',  // 3rd no
  'sad',      // 4th no
  'please',   // 5th no
  'flowers',  // 6th no
  'sad',      // 7th no
  'please',   // 8th no
  'flowers',  // 9th no
  'sad',      // 10th no
  'please',   // 11th no
  'flowers',  // 12th no
  'sad',      // 13th no
  'please',   // 14th no
  'flowers',  // 15th no
  'sad',      // 16th no
  'please',   // 17th no
  'flowers',  // 18th no
  'sad',      // 19th no
  'please',   // 20th no
  'flowers',  // 21st no
];

/* ================================ */
/* STATE                            */
/* ================================ */
let noClickCount = 0;
let currentSlide = 0;
let musicPlaying = false;
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let yesCatchable = false;

/* ================================ */
/* INIT                             */
/* ================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Set initial bear
  setBearImage('bear-img', 'peek');

  // Preload other bear images
  Object.values(BEAR_IMAGES).forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Make Yes button dodge on hover/touch before it's catchable
  const btnYes = document.getElementById('btn-yes');

  // Desktop: dodge on mouse enter
  btnYes.addEventListener('mouseenter', () => {
    if (!yesCatchable) dodgeYesButton();
  });

  // Mobile: dodge on touchstart (before click fires)
  btnYes.addEventListener('touchstart', (e) => {
    if (!yesCatchable) {
      e.preventDefault();
      dodgeYesButton();
    }
  }, { passive: false });
});

function dodgeYesButton() {
  const btnYes = document.getElementById('btn-yes');
  const container = document.querySelector('.question-container');
  const containerRect = container.getBoundingClientRect();

  // Random position within the container bounds
  const maxX = containerRect.width / 2 - 60;
  const maxY = containerRect.height / 2 - 30;

  const randomX = (Math.random() - 0.5) * 2 * maxX;
  const randomY = (Math.random() - 0.5) * 2 * maxY;

  btnYes.classList.add('dodging');
  btnYes.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

/* ================================ */
/* PAGE 1: QUESTION LOGIC           */
/* ================================ */
function handleNo() {
  noClickCount++;

  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const bearImg = document.getElementById('bear-img');

  // After 3 No clicks, make Yes button catchable (stop dodging)
  if (noClickCount >= 3 && !yesCatchable) {
    yesCatchable = true;
    btnYes.classList.remove('dodging');
    btnYes.classList.add('catchable');
    btnYes.style.transform = 'translate(0, 0)';
  }

  // Grow Yes button
  const yesPadV = 0.9 + (noClickCount * 0.15);
  const yesPadH = 2.2 + (noClickCount * 0.4);
  const yesFontSize = 1.1 + (noClickCount * 0.18);
  btnYes.style.fontSize = `${yesFontSize}rem`;
  btnYes.style.padding = `${yesPadV}rem ${yesPadH}rem`;

  // Shrink No button (but keep readable)
  const noFontSize = Math.max(1 - (noClickCount * 0.04), 0.65);
  const noPadV = Math.max(0.8 - (noClickCount * 0.03), 0.4);
  const noPadH = Math.max(1.8 - (noClickCount * 0.08), 0.8);
  btnNo.style.fontSize = `${noFontSize}rem`;
  btnNo.style.padding = `${noPadV}rem ${noPadH}rem`;

  // Change No button text
  const textIndex = Math.min(noClickCount, NO_BUTTON_TEXTS.length - 1);
  btnNo.textContent = NO_BUTTON_TEXTS[textIndex];

  // Change bear image
  const bearIndex = Math.min(noClickCount, BEAR_STAGES.length - 1);
  setBearImage('bear-img', BEAR_STAGES[bearIndex]);

  // Wiggle animation
  bearImg.classList.remove('wiggle');
  void bearImg.offsetWidth; // reflow
  bearImg.classList.add('wiggle');
}

function handleYes() {
  // Block if not catchable yet
  if (!yesCatchable) return;

  // Transition to celebration page
  const pageQuestion = document.getElementById('page-question');
  const pageCelebrate = document.getElementById('page-celebrate');

  // Fade out question
  pageQuestion.style.transition = 'opacity 0.5s ease';
  pageQuestion.style.opacity = '0';

  setTimeout(() => {
    pageQuestion.classList.remove('active');
    pageCelebrate.classList.add('active');

    // Set celebration bear images
    setBearImage('hero-bear-img', 'happy');
    setBearImage('letter-bear-img', 'love');
    setBearImage('form-bear-img', 'curious');
    setBearImage('final-bear-img', 'kiss');

    // Start floating decorations
    startFloatingDeco();

    // Init carousel
    initCarousel();

    // Init scroll animations
    initScrollAnimations();

    // Init video autoplay on scroll
    initVideoAutoplay();

    // Try to play music
    startMusic();

    // Show music toggle
    document.getElementById('musicToggle').style.display = 'flex';

    // Trigger confetti!
    launchConfetti();

    // Scroll to top
    window.scrollTo(0, 0);
  }, 500);
}

/* ================================ */
/* BEAR IMAGE HELPER                */
/* ================================ */
function setBearImage(elementId, stage) {
  const el = document.getElementById(elementId);
  if (el && BEAR_IMAGES[stage]) {
    el.src = BEAR_IMAGES[stage];
  }
}

/* ================================ */
/* CAROUSEL                         */
/* ================================ */
function initCarousel() {
  const carousel = document.getElementById('carousel');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dotsContainer = document.getElementById('carouselDots');

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });

  // Touch/swipe events
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    isDragging = true;
    carousel.classList.add('grabbing');
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    touchEndX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    carousel.classList.remove('grabbing');

    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
  });

  // Auto-slide every 5s (slower for more photos)
  setInterval(() => {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }, 5000);
}

function goToSlide(index) {
  const carousel = document.getElementById('carousel');
  const dots = document.querySelectorAll('.carousel-dot');

  currentSlide = index;
  carousel.style.transform = `translateX(-${index * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

/* ================================ */
/* SCROLL ANIMATIONS                */
/* ================================ */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe message card
  document.querySelectorAll('.message-card').forEach(el => {
    observer.observe(el);
  });

  // Observe letter blocks
  document.querySelectorAll('.letter-block, .letter-divider').forEach(el => {
    observer.observe(el);
  });

  // Observe fun cards
  document.querySelectorAll('.fun-card[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

/* ================================ */
/* FLOATING DECORATIONS             */
/* ================================ */
function startFloatingDeco() {
  const container = document.getElementById('floatingDeco');
  const items = ['🩷', '🤍', '✨', '🌸', '💕', '🐻', '♡', '⭐'];

  function createItem() {
    const el = document.createElement('span');
    el.className = 'float-item';
    el.textContent = items[Math.floor(Math.random() * items.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (12 + Math.random() * 16) + 'px';
    el.style.animationDuration = (10 + Math.random() * 15) + 's';
    el.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 27000);
  }

  // Initial batch
  for (let i = 0; i < 10; i++) {
    setTimeout(createItem, i * 400);
  }

  // Continuous
  setInterval(createItem, 2000);
}

/* ================================ */
/* CONFETTI                         */
/* ================================ */
function launchConfetti() {
  const colors = ['#f48fb1', '#ff80ab', '#fce4ec', '#fff9c4', '#b2dfdb', '#e1bee7', '#ffccbc'];

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.width = (6 + Math.random() * 8) + 'px';
      confetti.style.height = (6 + Math.random() * 8) + 'px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confetti.style.animationDuration = (2 + Math.random() * 3) + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }, i * 40);
  }
}

/* ================================ */
/* MUSIC (background soundtrack)    */
/* ================================ */
function startMusic() {
  const audio = document.getElementById('bgMusic');
  audio.volume = 0.5;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      musicPlaying = true;
      updateMusicIcon();
    }).catch(() => {
      musicPlaying = false;
      updateMusicIcon();
    });
  }
}

function toggleMusic() {
  const audio = document.getElementById('bgMusic');

  if (musicPlaying) {
    audio.pause();
    musicPlaying = false;
    updateMusicIcon();
  } else {
    audio.play().then(() => {
      musicPlaying = true;
      updateMusicIcon();
    }).catch(() => {});
  }
}

function updateMusicIcon() {
  const icon = document.getElementById('musicIcon');
  icon.textContent = musicPlaying ? '🔊' : '🔇';
}

/* ================================ */
/* VIDEO AUTOPLAY ON SCROLL         */
/* ================================ */
function initVideoAutoplay() {
  const video = document.querySelector('.video-player');
  if (!video) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, { threshold: 0.5 });

  observer.observe(video);
}

/* ================================ */
/* FORM SUBMISSION                  */
/* ================================ */
function handleFormSubmit(event) {
  event.preventDefault();

  const nameYou = document.getElementById('nameYou').value.trim();
  const dobMe = document.getElementById('dobMe').value;

  // Validate nama kamu — must be "Gatra" (case insensitive)
  const nameYouHint = document.getElementById('nameYouHint');
  if (nameYou.toLowerCase() !== 'gatra' && nameYou.toLowerCase() !== 'gatraaa' && nameYou.toLowerCase() !== 'gathra') {
    nameYouHint.style.display = 'block';
    document.getElementById('nameYou').focus();
    return;
  }
  nameYouHint.style.display = 'none';

  // Validate tanggal lahir Ipang — must be 1997-06-12
  const dobMeHint = document.getElementById('dobMeHint');
  if (dobMe !== '1997-06-12') {
    dobMeHint.textContent = 'Bukan itu tanggalnya~ coba inget lagi 🤔';
    dobMeHint.style.display = 'block';
    document.getElementById('dobMe').focus();
    return;
  }
  dobMeHint.style.display = 'none';

  // Collect all form data
  const favMemory = document.getElementById('favMemory').value.trim();
  const message = document.getElementById('message').value.trim();

  // Send to email via Web3Forms (silent, Gatra won't see)
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: '18280a8a-6481-4fee-a039-8989e63fe238',
      subject: 'Valentine Response from ' + nameYou,
      nama_kamu: nameYou,
      tanggal_lahir_ipang: dobMe,
      momen_favorit: favMemory || '-',
      pesan: message || '-',
    }),
  }).catch(() => {});

  // Show final section
  const formSection = document.querySelector('.form-section');
  const finalSection = document.getElementById('finalSection');

  // Set dynamic content
  document.getElementById('finalName').textContent = nameYou || 'sayang';

  // Hide form, show coupon + final
  formSection.style.display = 'none';
  document.getElementById('couponSection').style.display = 'flex';
  finalSection.style.display = 'flex';

  // Scroll to coupon section
  document.getElementById('couponSection').scrollIntoView({ behavior: 'smooth' });

  // More confetti!
  launchConfetti();
}

/* ================================ */
/* GIFT COUPONS                     */
/* ================================ */
function redeemCoupon(ticketEl) {
  if (ticketEl.classList.contains('redeemed')) return;

  const couponName = ticketEl.querySelector('.coupon-ticket-name').textContent;
  const couponEmoji = ticketEl.querySelector('.coupon-ticket-emoji').textContent.trim();
  const couponCode = ticketEl.querySelector('.coupon-ticket-code').textContent;

  ticketEl.classList.add('redeemed');

  const waMessage = encodeURIComponent(
    `💌 *Valentine Coupon Redeemed!*\n\n${couponEmoji} ${couponName}\nKode: ${couponCode}\n\nAku mau redeem kupon ini ya! 🥰`
  );
  window.open(`https://wa.me/6282121756880?text=${waMessage}`, '_blank');
}
