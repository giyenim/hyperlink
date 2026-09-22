const 다음페이지로이동할까요 = document.querySelector(".다음페이지로이동할까요");
const 표4 = document.querySelector(".표4");
const 지금 = document.querySelector(".지금");
const 칸수 = document.querySelectorAll(".다음페이지로이동할까요 .공").length;

//공 구르기
function 공굴러가요() {
    const 지름 = 지금.clientWidth;
    const 칸너비 = 다음페이지로이동할까요.clientWidth / 칸수;
    const 이동범위 = Math.max(0, 칸너비 - 지름);
    const 스크롤범위 = 표4.scrollHeight - 표4.clientHeight;
    const 진행률 = 스크롤범위 > 0 ? Math.max(0, Math.min(표4.scrollTop / 스크롤범위, 1)) : 0;
    const 이동거리 = 진행률 * 이동범위;

    if (진행률 >= 0.999) visitedUpdate();

    const 회전각도 = 이동거리 / (Math.PI * 지름) * 360;

    지금.style.transform = `translateX(${이동거리}px) rotate(${회전각도}deg)`;
}

표4.addEventListener("scroll", 공굴러가요);
const resizeObserver = new ResizeObserver(공굴러가요);
resizeObserver.observe(표4);
