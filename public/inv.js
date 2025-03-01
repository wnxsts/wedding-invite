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

    // // 🎵 Фоновая музыка
    // const music = document.getElementById("background-music");
    // const musicButton = document.querySelector(".music-button");

    // music.play().then(() => {
    //     music.muted = false; 
    //     music.volume = 0.5; 
    // }).catch(() => {
    //     console.log("Автовоспроизведение заблокировано браузером.");
    // });

    // musicButton.addEventListener("click", () => {
    //     if (music.paused) {
    //         music.play();
    //         musicButton.textContent = "🔊";
    //     } else {
    //         music.pause();
    //         musicButton.textContent = "🎵";
    //     }
    // });

    const audio = document.getElementById("background-music");
const playButton = document.getElementById("play-button");

function toggleMusic() {
    if (audio.paused) {
        audio.play();
        playButton.textContent = "⏸️"; // Меняем иконку на паузу
    } else {
        audio.pause();
        playButton.textContent = "▶️"; // Возвращаем иконку "Play"
    }
}

    // 📝 Форма RSVP
    const form = document.getElementById("rsvp-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Остановить стандартную отправку формы

        const name = document.getElementById("guest-name").value;
        const attendance = document.querySelector('input[name="attendance"]:checked')?.value;

        if (!name || !attendance) {
            alert("Барлық өрістерді толтырыңыз!"); // Предупреждение
            return;
        }

        // Отправка данных на сервер
        try {
            const response = await fetch("/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, attending: attendance }),
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Ошибка отправки:", error);
            alert("Қате орын алды, кейінірек көріңіз.");
        }
    });
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
