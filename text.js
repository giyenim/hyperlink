// 본문을 text.json에서 읽어 페이지에 채워 넣는다.
// 모임 서버 주소가 localStorage에 저장돼 있으면 그쪽에서 받아오고,
// 없거나 서버가 꺼져 있으면 깃헙에 올라간 정적 text.json을 쓴다.

const 서버키 = "하이퍼링크:서버";

const 표지 = document.querySelector(".표1") ? "표1" : "표4";
const 이름 = document.querySelector(".지금 text").textContent;

// 모임 서버에 실제로 연결된 경우에만 주소가 들어간다. 편집 기능의 스위치 역할
let 모임서버 = null;

function 저장된서버() {
    try {
        return localStorage.getItem(서버키);
    } catch {
        return null;
    }
}

// 서버가 응답하지 않으면 주소를 지워서 다음부터는 곧바로 정적 모드로 돌아가게 한다
function 서버끊기() {
    try {
        localStorage.removeItem(서버키);
    } catch { }
    모임서버 = null;
}

async function 본문가져오기() {
    const 주소 = 저장된서버();

    if (주소) {
        try {
            const 응답 = await fetch(`${주소}/text.json`, {
                cache: "no-store",
                signal: AbortSignal.timeout(3000),
            });
            if (응답.ok) {
                모임서버 = 주소;
                return await 응답.json();
            }
            서버끊기();
        } catch {
            서버끊기();
        }
    }

    const 응답 = await fetch("../../text.json", { cache: "no-store" });
    return 응답.json();
}

// 제목과 문단을 .공백 앞에 그린다. 다시 불러도 되도록 이전 것을 먼저 지운다
function 본문그리기(데이터) {
    const 내용 = 데이터?.[표지]?.[이름];
    const 공백 = document.querySelector(".페이지 .공백");
    if (!내용 || !공백) return;

    document.querySelectorAll(".페이지 > .본문").forEach((낡은것) => 낡은것.remove());

    const 조각 = document.createDocumentFragment();

    if (내용.제목) {
        const 제목 = document.createElement("h1");
        제목.className = "본문";
        제목.textContent = 내용.제목;
        조각.append(제목);
    }

    (내용.문단 ?? []).forEach((글, 번호) => {
        const 문단 = document.createElement("p");
        문단.className = "본문";
        문단.dataset.문단 = 번호;
        문단.textContent = 글;
        조각.append(문단);
    });

    공백.before(조각);
}

본문가져오기()
    .then((데이터) => {
        본문그리기(데이터);

        // 본문이 늦게 들어와 스크롤 높이가 바뀌었으니 공 위치를 다시 계산한다.
        // ResizeObserver는 .표1 / .표4 컨테이너만 보고 있어서 이 변화를 잡지 못한다
        if (typeof 공굴러가요 === "function") 공굴러가요();

        // 모임 서버에 연결됐을 때만 편집 기능을 켠다
        if (모임서버 && typeof startEditing === "function") startEditing();
    })
    .catch(() => { });
