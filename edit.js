// 모임 서버에 연결됐을 때만 켜지는 편집 기능.
// 콘솔이나 북마클릿에서 쓰기("<계>새 본문</계>") 형태로 본문을 고친다.
// text.js가 서버 연결에 성공하면 편집시작()을 불러준다.

let 편집서버 = null;
let 마지막본문 = null;

// 어느 표지에 속한 이름인지 찾는다. visited.js가 이미 갖고 있는 목록을 쓴다
function 표지찾기(이름) {
    if (표1페이지.includes(이름)) return "표1";
    if (표4페이지.includes(이름)) return "표4";
    return null;
}

// <계>...</계> 또는 <계 제목="...">...</계> 를 찾아낸다.
// 빈 줄로 문단을 나누고, 문단 안의 줄바꿈은 공백으로 합친다
function 해석(입력) {
    const 이름들 = 표1페이지.concat(표4페이지).join("|");
    const 정규식 = new RegExp(`<(${이름들})((?:\\s[^>]*)?)>([\\s\\S]*?)</\\1>`, "g");

    return [...String(입력).matchAll(정규식)].map(([, 이름, 속성, 몸통]) => ({
        이름,
        제목: 속성.match(/제목\s*=\s*"([^"]*)"/)?.[1],
        문단: 몸통
            .trim()
            .split(/\n\s*\n/)
            .map((글) => 글.replace(/\s+/g, " ").trim())
            .filter(Boolean),
    }));
}

async function 서버본문() {
    const 응답 = await fetch(`${편집서버}/text.json`, { cache: "no-store" });
    if (!응답.ok) throw new Error(응답.status);
    return 응답.json();
}

// 지금 보고 있는 페이지의 내용이 바뀌었을 때만 다시 그린다
function 갱신(데이터) {
    const 지금것 = JSON.stringify(데이터?.[표지]?.[이름]);
    if (지금것 === 마지막본문) return;
    마지막본문 = 지금것;

    본문그리기(데이터);
    if (typeof 공굴러가요 === "function") 공굴러가요();
}

// 본문을 고친다. 여러 태그를 한 번에 넣어도 된다
async function 쓰기(입력) {
    if (!편집서버) return 안내("모임 서버에 연결돼 있지 않습니다.");

    const 조각들 = 해석(입력);
    if (!조각들.length) {
        return 안내(`고칠 내용을 못 찾았습니다.\n예) <계>새 본문입니다.</계>`);
    }

    const 성공 = [];
    const 실패 = [];

    for (const 조각 of 조각들) {
        const 표지이름 = 표지찾기(조각.이름);
        if (!조각.문단.length) {
            실패.push(`${조각.이름}: 내용이 비었습니다`);
            continue;
        }
        try {
            const 응답 = await fetch(`${편집서버}/text/${표지이름}/${조각.이름}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 제목: 조각.제목, 문단: 조각.문단 }),
            });
            if (!응답.ok) throw new Error(await 응답.text() || 응답.status);
            성공.push(`${조각.이름} (문단 ${조각.문단.length}개)`);
        } catch (오류) {
            실패.push(`${조각.이름}: ${오류.message}`);
        }
    }

    try {
        갱신(await 서버본문());
    } catch { }

    return 안내([
        성공.length ? `고쳤습니다 → ${성공.join(", ")}` : "",
        실패.length ? `실패 → ${실패.join(" / ")}` : "",
    ].filter(Boolean).join("\n"));
}

// 지금 본문을 태그 형태로 돌려준다. 복사해서 고친 뒤 쓰기()에 넣으면 된다
async function 읽기(대상) {
    if (!편집서버) return 안내("모임 서버에 연결돼 있지 않습니다.");

    const 데이터 = await 서버본문();
    const 목록 = 대상 ? [대상] : [이름];

    const 글 = 목록.map((하나) => {
        const 내용 = 데이터?.[표지찾기(하나)]?.[하나];
        if (!내용) return `<!-- ${하나} 라는 페이지가 없습니다 -->`;
        const 머리 = 내용.제목 ? `<${하나} 제목="${내용.제목}">` : `<${하나}>`;
        return `${머리}\n${내용.문단.join("\n\n")}\n</${하나}>`;
    }).join("\n\n");

    return 안내(글);
}

function 안내(글) {
    console.log(글);
    return 글;
}

// 2초마다 서버를 확인해 다른 사람의 수정을 반영한다.
// 탭이 가려져 있으면 쉰다
function 감시시작() {
    setInterval(async () => {
        if (document.hidden) return;
        try {
            갱신(await 서버본문());
        } catch { }
    }, 2000);
}

function 편집시작() {
    편집서버 = 모임서버;
    마지막본문 = null;
    감시시작();

    console.log(
        `%c하이퍼링크 편집 모드%c\n` +
        `서버: ${편집서버}\n\n` +
        `  쓰기('<계>새 본문입니다.</계>')   본문 고치기\n` +
        `  읽기()                            이 페이지 본문 보기\n` +
        `  읽기('계')                        다른 페이지 본문 보기\n\n` +
        `빈 줄로 문단을 나눕니다. 제목은 <충 제목="새 제목">…</충>`,
        "font-weight:bold;color:#551a8b", "",
    );
}
