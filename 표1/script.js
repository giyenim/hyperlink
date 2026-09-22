const 다음페이지로이동할까요 = document.querySelector(".다음페이지로이동할까요");
const 다음 = document.querySelector(".다음");
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

//공 끌기
if (다음) {
    다음.addEventListener("pointerdown", (e) => {
        if (e.button !== 0 || isDragging) return;

        const rect = 다음.getBoundingClientRect();
        다음.classList.add("툭");
        다음.style.left = `${rect.left}px`;
        다음.style.top = `${rect.top}px`;
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        isDragging = true;
        다음.setPointerCapture(e.pointerId);
        다음페이지로이동할까요.classList.add("다음페이지로이동힌트");
    });

    다음.addEventListener("pointermove", (e) => {
        if (!isDragging || !다음.hasPointerCapture(e.pointerId)) return;

        const maxX = Math.max(0, document.documentElement.clientWidth - 다음.clientWidth);
        const maxY = Math.max(0, document.documentElement.clientHeight - 다음.clientHeight);
        다음.style.left = `${Math.max(0, Math.min(e.clientX - offsetX, maxX))}px`;
        다음.style.top = `${Math.max(0, Math.min(e.clientY - offsetY, maxY))}px`;
        const rect = 다음.getBoundingClientRect();
        const link = 다음페이지로이동할까요.getBoundingClientRect();
        다음.classList.toggle("다음힌트",
            rect.right >= link.left && rect.left <= link.right &&
            rect.bottom >= link.top && rect.top <= link.bottom
        );
    });

    function 놓기() {
        isDragging = false;
        다음.classList.remove("다음힌트");
        다음페이지로이동할까요.classList.remove("다음페이지로이동힌트");
    }

    다음.addEventListener("pointerup", (e) => {
        if (!isDragging || !다음.hasPointerCapture(e.pointerId)) return;
        놓기();

        const rect = 다음.getBoundingClientRect();
        const link = 다음페이지로이동할까요.getBoundingClientRect();
        if (
            rect.right >= link.left && rect.left <= link.right &&
            rect.bottom >= link.top && rect.top <= link.bottom
        ) {
            window.location.href = 다음.dataset.href;
        }
    });

    다음.addEventListener("pointercancel", 놓기);
    다음.addEventListener("lostpointercapture", 놓기);
}

//공 구르기
const 표1 = document.querySelector(".표1");
const 지금 = document.querySelector(".지금");
const 이전 = document.querySelectorAll(".이전")
const 순서 = Number(지금.dataset.order);
const 지름 = 지금.clientWidth;

이전.forEach((공, i) => {
    const 이동범위 = Math.max(0, 다음페이지로이동할까요.clientWidth - 지름 - i * 지름 / 2);
    const 회전각도 = 이동범위 / (Math.PI * 지름) * 360;
    공.style.transform = `rotate(${회전각도}deg)`;
});

function 공굴러가요() {
    const 스크롤범위 = 표1.scrollHeight - 표1.clientHeight;
    const 진행률 = 스크롤범위 > 0 ? Math.max(0, Math.min(표1.scrollTop / 스크롤범위, 1)) : 0;
    const 이동범위 = Math.max(0, 다음페이지로이동할까요.clientWidth - 지름 - (순서 - 1) * 지름 / 2);

    if (진행률 >= 0.999) visitedUpdate();

    const 이동거리 = 진행률 * 이동범위;
    const 회전각도 = 이동거리 / (Math.PI * 지름) * 360;

    지금.style.left = `${이동거리}px`;
    지금.style.transform = `rotate(${회전각도}deg)`;

    이전.forEach((공, i) => {
        const 이동범위 = Math.max(0, 다음페이지로이동할까요.clientWidth - 지름 - i * 지름 / 2);
        const 회전각도 = 이동범위 / (Math.PI * 지름) * 360;
        공.style.transform = `rotate(${회전각도}deg)`;
    });
}

표1.addEventListener("scroll", 공굴러가요);
const resizeObserver = new ResizeObserver(공굴러가요);
resizeObserver.observe(표1);
