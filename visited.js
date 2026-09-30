const 키 = "하이퍼링크:방문";

const 페이지 = {
    잠: false, 재: false, 웹: false, 사: false, 이: false, 트: false,
    작: false, 업: false, 실: false,
    손: false, 계: false, 영: false,
    OuWePo: false,
};
if (!localStorage.getItem(키)) {
    localStorage.setItem(키, JSON.stringify(페이지));
}

const 표1페이지 = ["잠", "재", "웹", "사", "이", "트", "작", "업", "실"];
const 표4페이지 = ["손", "계", "영"];

const 지금페이지 = document.querySelector(".지금 text").textContent;

let 기록 = false;

function visitedUpdate() {
    if (기록) return;

    const 방문록 = JSON.parse(localStorage.getItem(키));
    기록 = true;
    if (방문록[지금페이지]) return;

    방문록[지금페이지] = true;
    localStorage.setItem(키, JSON.stringify(방문록));
    visitedCheck();
}

function visitedCheck() {
    const 방문록 = JSON.parse(localStorage.getItem(키));

    document.querySelectorAll(".공").forEach((공) => {
        if (방문록[공.querySelector("text").textContent]) {
            공.classList.add("visited-공");
        }
    });

    const 표지 = 표1페이지.includes(지금페이지) ? 표1페이지 : 표4페이지;

    if (표지.every((이름) => 방문록[이름])) {
        document.querySelector(".다음페이지로이동할까요").classList.add("visited-다음페이지로이동할까요");
    }

    const 반대표지 = 표지 === 표1페이지 ? 표4페이지 : 표1페이지;

    if (반대표지.some((이름) => 방문록[이름])) {
        document.querySelector(".표1로, .표4로").classList.add("visited-표지로");
    }

    if (방문록["OuWePo"]) {
        document.querySelector(".잠재웹사이트작업실").classList.add("visited-잠재웹사이트작업실");
    }

    if (표1페이지.concat(표4페이지).every((이름) => 방문록[이름])) {
        document.querySelector(".독서감상웹사이트").classList.add("visited-독서감상웹사이트");
    }
}

document.querySelector(".잠재웹사이트작업실").addEventListener("click", () => {
    const 방문록 = JSON.parse(localStorage.getItem(키));
    방문록["OuWePo"] = true;
    localStorage.setItem(키, JSON.stringify(방문록));
});

visitedCheck();
