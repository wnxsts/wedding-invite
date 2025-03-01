document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // 🎨 Анимация главного контента
    gsap.fromTo(
        ".content",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5 }
    );
    
    // 🎭 Анимация блока расписания
    gsap.utils.toArray(".event").forEach((event) => {
        const direction = event.dataset.direction === "left" ? -100 : 100;

        gsap.fromTo(
            event,
            { opacity: 0, x: direction },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: event,
                    start: "top 80%",
                },
            }
        );
    });
    // Анимация секции приглашения
    gsap.fromTo(
        ".invitation-section", // Убедись, что этот класс есть в HTML
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 1.5,
            scrollTrigger: {
                trigger: ".invitation-section",
                start: "top 80%",
            },
        }
    );


    // ⏳ Таймер обратного отсчета
    const countdownDate = new Date("2025-04-26T13:00:00").getTime();
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            clearInterval(timer);
            return;
        }

        document.getElementById("days").textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
        document.getElementById("hours").textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById("minutes").textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById("seconds").textContent = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);

    // 🎵 Фоновая музыка
    const music = document.getElementById("background-music");
    const musicButton = document.querySelector(".music-button");

    music.play().then(() => {
        music.muted = false; 
        music.volume = 0.5; 
    }).catch(() => {
        console.log("Автовоспроизведение заблокировано браузером.");
    });

    musicButton.addEventListener("click", () => {
        if (music.paused) {
            music.play();
            musicButton.textContent = "🔊";
        } else {
            music.pause();
            musicButton.textContent = "🎵";
        }
    });

    // 📝 Форма RSVP
    const form = document.getElementById("rsvp-form");

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("guest-name").value.trim();
            const attending = document.querySelector('input[name="attendance"]:checked')?.value;

            if (!name || !attending) {
                alert("Барлық өрістерді толтырыңыз.");
                return;
            }

            try {
                const response = await fetch("http://localhost:4000/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, attending })
                });

                if (!response.ok) {
                    throw new Error("Ошибка отправки данных.");
                }

                const data = await response.json();
                alert(data.message);
                form.reset(); // Очистка формы после успешной отправки

            } catch (error) {
                console.error("Қате:", error);
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // 🎉 Анимация секции приветствия (Welcome Section)
    gsap.fromTo(
        ".welcome-content", 
        { opacity: 0, y: 50 }, 
        {
            opacity: 1,
            y: 0,
            duration: 1.5,
            scrollTrigger: {
                trigger: ".welcome",
                start: "top 80%",
                toggleActions: "play none none none",
            },
        }
    );
});
