/* ==========================================
   AMREEN & ANIL - WEDDING INVITATION JS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const waxSeal = document.getElementById("waxSeal");
    const envelopeScene = document.getElementById("envelopeScene");
    const invitation = document.getElementById("invitation");

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
        });
    }

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
    
    const textToCopy = el.innerText || el.textContent;

    function showSuccess() {
        const originalText = buttonElement.innerText;
        buttonElement.innerText = "Copied!";
        buttonElement.style.backgroundColor = "#2e7d32";
        
        setTimeout(() => {
            buttonElement.innerText = originalText;
            buttonElement.style.backgroundColor = "";
        }, 2000);
    }

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
        textarea.setSelectionRange(0, 99999);

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
   LIGHTBOX PREVIEW MODAL
   ======================================================= */
document.addEventListener("click", function (event) {
    if (event.target.tagName === "IMG" && (event.target.closest('.gallery-two-pack') || event.target.closest('.gallery-grid') || event.target.closest('.photo-container') || event.target.closest('.screen-section'))) {
        
        if (event.target.classList.contains('logo-watermark') || event.target.alt === "Watermark") return;

        const lightbox = document.getElementById('photoLightbox');
        const lightboxImg = document.getElementById('lightboxImg');

        if (lightbox && lightboxImg) {
            lightboxImg.src = event.target.src;
            lightbox.style.display = 'flex';
        }
    }
});

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

    lightbox.addEventListener('click', function (e) {
        if (e.target.id === 'photoLightbox') {
            closeLightbox();
        }
    });
});

function closeLightbox() {
    const lightbox = document.getElementById('photoLightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
    }
}