/* ==========================================
   AMREEN & ANIL - WEDDING INVITATION JS
========================================== */
/* ==========================================
   AMREEN & ANIL - GLOBAL CONTROL VARIABLES
========================================== */
let autoScrollInterval = null;
let isUserInteracting = false;
let autoScrollStarted = false;
const SCROLL_TIME = 6000; // 6 seconds per screen
let savedScrollPosition = 0;

document.addEventListener("DOMContentLoaded", () => {

    const waxSeal = document.getElementById("waxSeal");
    const envelopeScene = document.getElementById("envelopeScene");
    const invitation = document.getElementById("invitation");
	
/* FORCE RESUME AUTO-SCROLL WHEN RETURNING TO THE INVITATION TAB */
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // Pause timer while you are away on the Google Form tab
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    } else {
        // When you come back, unlock interaction and resume scrolling forward from current card
        if (autoScrollStarted) {
            isUserInteracting = false; // Force-unlock so scrolling can continue
            if (autoScrollInterval) clearInterval(autoScrollInterval);
            
            let currentIndex = getActiveSectionIndex();
            
            autoScrollInterval = setInterval(() => {
                if (isUserInteracting) return;
                
                const sections = Array.from(document.querySelectorAll(".screen-section, .closing"));
                currentIndex++;
                
                if (currentIndex < sections.length) {
                    sections[currentIndex].scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                    clearInterval(autoScrollInterval);
                }
            }, SCROLL_TIME);
        }
    }
});

    if (waxSeal) {
        waxSeal.addEventListener("click", () => {
            waxSeal.disabled = true;
            envelopeScene.classList.add("open");

            // Play Music
            const music = document.getElementById("weddingMusic");
            const musicButton = document.getElementById("musicButton");
            if (music) {
                music.play().then(() => {
                    if (musicButton) musicButton.classList.add("playing");
                }).catch(() => console.log("Music awaiting interaction"));
            }

            // Reveal invitation content
            setTimeout(() => {
                if (invitation) invitation.classList.add("show");
            }, 2000);

            // Start smooth auto scroll after envelope opens
            setTimeout(() => {
                autoScrollStarted = true;
                startAutoScroll();
            }, SCROLL_TIME);
        });
    }

    function startAutoScroll() {
        const sections = Array.from(document.querySelectorAll(".screen-section, .closing"));
        let currentIndex = 0;

        function scrollToNextSection() {
            if (isUserInteracting) return;

            if (currentIndex < sections.length) {
                sections[currentIndex].scrollIntoView({ behavior: "smooth", block: "start" });
                currentIndex++;
            } else {
                clearInterval(autoScrollInterval);
            }
        }

        // Only scroll if user hasn't intervened
        if (!isUserInteracting) {
            scrollToNextSection();
            autoScrollInterval = setInterval(scrollToNextSection, SCROLL_TIME);
        }
    }

/* PAUSE AUTO SCROLL ONLY ON MANUAL SCROLL/TOUCH OR EXTERNAL LINKS */
const pauseScroll = (e) => {
    // If user clicks the RSVP form link or any external action button, stop auto-scroll completely
    if (e.target.closest('a') && e.target.closest('a').getAttribute('href')?.startsWith('http')) {
        isUserInteracting = true;
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
        return;
    }

    // Allow copy buttons and UI controls without killing scroll
    if (e.target.closest('.copy-btn') || e.target.closest('button')) {
        return;
    }

    // If user manually scrolls or touches the screen, stop auto-scroll
    if (autoScrollStarted && (e.type === 'wheel' || e.type === 'touchstart')) {
        isUserInteracting = true;
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }
};

window.addEventListener("click", pauseScroll, { passive: true });
window.addEventListener("touchstart", pauseScroll, { passive: true });
window.addEventListener("wheel", pauseScroll, { passive: true });

/* STOP AUTO-SCROLL SAFELY WHEN SWITCHING TABS */
document.addEventListener("visibilitychange", () => {
    if (document.hidden && autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
});

    /* MUSIC CONTROLLER */
    const music = document.getElementById("weddingMusic");
    const musicButton = document.getElementById("musicButton");

    if (musicButton && music) {
        musicButton.addEventListener("click", () => {
            if (music.paused) {
                music.play().then(() => musicButton.classList.add("playing"));
            } else {
                music.pause();
                musicButton.classList.remove("playing");
            }
        });
    }

    /* COUNTDOWN TIMER */
    const weddingDate = new Date("January 31 2027 11:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance <= 0) return;

        const dEl = document.getElementById("days");
        const hEl = document.getElementById("hours");
        const mEl = document.getElementById("minutes");
        const sEl = document.getElementById("seconds");

        if (dEl) dEl.textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0");
        if (hEl) hEl.textContent = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
        if (mEl) mEl.textContent = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
        if (sEl) sEl.textContent = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* ADD TO CALENDAR */
    const calendarButton = document.getElementById("calendarButton");
    if (calendarButton) {
        calendarButton.addEventListener("click", () => {
            const calendar = 
`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Wedding Reception - Amreen & Anil
DESCRIPTION:Celebrating Amreen & Anil #AA♾️♥️
LOCATION:Goldfinch Retreat, Bengaluru
DTSTART:20270131T110000
DTEND:20270131T160000
END:VEVENT
END:VCALENDAR`;

            const file = new Blob([calendar], { type: "text/calendar" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(file);
            link.download = "Amreen-Anil-Wedding.ics";
            link.click();
        });
    }
});

/* GLOBAL COPY FUNCTION (Works locally and on live servers) */
window.copyUPI = function(elementId, buttonElement) {
    const el = document.getElementById(elementId);
    if (!el) {
        console.error("Element not found: " + elementId);
        return;
    }
    
    // Get text content cleanly
    const textToCopy = el.innerText || el.textContent;

    // Helper for visual feedback
    function showSuccess() {
        const originalText = buttonElement.innerText;
        buttonElement.innerText = "Copied!";
        buttonElement.style.backgroundColor = "#2e7d32"; // Success green indicator
        
        setTimeout(() => {
            buttonElement.innerText = originalText;
            buttonElement.style.backgroundColor = "";
        }, 2000);
    }

    // Try modern Clipboard API first
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy)
            .then(showSuccess)
            .catch(() => fallbackCopy(textToCopy));
    } else {
        fallbackCopy(textToCopy);
    }

    function fallbackCopy(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) showSuccess();
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }

        document.body.removeChild(textarea);
    }
};

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".copy-btn").forEach(button => {
        button.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;

            // Extracts ONLY the raw number text (e.g., "7406032020")
            const textToCopy = targetEl.textContent.trim();

            const showFeedback = () => {
                const originalText = this.innerText;
                this.innerText = "Copied!";
                this.style.backgroundColor = "#2e7d32";
                
                setTimeout(() => {
                    this.innerText = originalText;
                    this.style.backgroundColor = "";
                }, 2000);
            };

            // Modern Clipboard API with reliable hidden textarea fallback for iOS Safari/HTTP
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy)
                    .then(showFeedback)
                    .catch(() => fallbackCopy(textToCopy, showFeedback));
            } else {
                fallbackCopy(textToCopy, showFeedback);
            }
        });
    });

    function fallbackCopy(text, callback) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);
        
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, 99999); /* Fix for iOS devices */

        try {
            if (document.execCommand("copy")) {
                callback();
            }
        } catch (err) {
            console.error("Copy failed", err);
        }

        document.body.removeChild(textarea);
    }
});

/* =======================================================
   UNIVERSAL AUTO-SCROLL FUNCTION FOR ALL DEVICES
   ======================================================= */
function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // Method 1: Modern smooth scroll (Chrome, Firefox, Safari, Edge, Samsung Internet)
    try {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    } catch (e) {
        // Method 2: Legacy fallback for older devices / restricted webviews
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/* AUTOMATICALLY ADVANCE TO NEXT CARD */
function autoScrollToNext() {
    const sections = Array.from(document.querySelectorAll('.screen-section'));
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Find the next card section on screen
    for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i].offsetTop;
        if (sectionTop > currentScroll + 20) {
            scrollToSection(sections[i].id);
            break;
        }
    }
}

/* =======================================================
   PRECISE VIEWPORT-BASED LIGHTBOX & AUTO-SCROLL
   ======================================================= */

let currentViewingIndex = 0;

// Helper function to find the exact card currently visible on screen
function getActiveSectionIndex() {
    const sections = Array.from(document.querySelectorAll(".screen-section, .closing"));
    let activeIndex = 0;
    let minDistance = Infinity;
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top); // Distance from the top of the visible screen
        if (distance < minDistance) {
            minDistance = distance;
            activeIndex = index;
        }
    });
    return activeIndex;
}

// 1. Open Lightbox and get the exact active card index
document.addEventListener("click", function (event) {
    if (event.target.tagName === "IMG" && (event.target.closest('.gallery-two-pack') || event.target.closest('.gallery-grid') || event.target.closest('.photo-container') || event.target.closest('.screen-section'))) {
        
        if (event.target.classList.contains('logo-watermark') || event.target.alt === "Watermark") return;

        // Find the precise card currently on screen right now
        currentViewingIndex = getActiveSectionIndex();

        const lightbox = document.getElementById('photoLightbox');
        const lightboxImg = document.getElementById('lightboxImg');

        if (lightbox && lightboxImg) {
            lightboxImg.src = event.target.src;
            lightbox.style.display = 'flex';
            
            // Pause auto-scroll
            isUserInteracting = true;
            if (autoScrollInterval) clearInterval(autoScrollInterval);
        }
    }
});

// 2. Block backdrop scrolling on the overlay
document.addEventListener("DOMContentLoaded", function () {
    const lightbox = document.getElementById('photoLightbox');
    if (!lightbox) return;

    lightbox.addEventListener('touchmove', function (e) {
        if (!e.target.closest('#lightboxImg')) {
            e.preventDefault();
        }
    }, { passive: false });

    lightbox.addEventListener('wheel', function (e) {
        if (!e.target.closest('#lightboxImg')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Close on backdrop tap
    lightbox.addEventListener('click', function (e) {
        if (e.target.id === 'photoLightbox') {
            closeLightbox();
        }
    });
});

/* 3. CLOSE LIGHTBOX & RESUME FORWARD SMOOTHLY */
function closeLightbox() {
    const lightbox = document.getElementById('photoLightbox');
    if (!lightbox) return;

    lightbox.style.display = 'none';

    // Resume auto-scroll forward from the card *after* the one we were viewing
    if (autoScrollStarted) {
        isUserInteracting = false;
        
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }

        let nextIndex = currentViewingIndex + 1;

        autoScrollInterval = setInterval(() => {
            if (isUserInteracting) return;
            
            const sections = Array.from(document.querySelectorAll(".screen-section, .closing"));
            if (nextIndex < sections.length) {
                sections[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });
                nextIndex++;
            } else {
                clearInterval(autoScrollInterval);
            }
        }, SCROLL_TIME);
    }
}