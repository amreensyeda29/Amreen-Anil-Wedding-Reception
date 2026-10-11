/* ==========================================
   AMREEN & ANIL - WEDDING INVITATION JS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const waxSeal = document.getElementById("waxSeal");
    const envelopeScene = document.getElementById("envelopeScene");
    const invitation = document.getElementById("invitation");

    let autoScrollInterval = null;
    let isUserInteracting = false;
    const SCROLL_TIME = 5000; // 5 seconds per screen

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

            // Start smooth auto scroll
            setTimeout(() => {
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

        scrollToNextSection();
        autoScrollInterval = setInterval(scrollToNextSection, SCROLL_TIME);
    }

    /* PAUSE AUTO SCROLL IF USER TOUCHES SCREEN */
    const pauseScroll = () => {
        isUserInteracting = true;
        if (autoScrollInterval) clearInterval(autoScrollInterval);
    };

    window.addEventListener("touchstart", pauseScroll, { passive: true });
    window.addEventListener("wheel", pauseScroll, { passive: true });

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