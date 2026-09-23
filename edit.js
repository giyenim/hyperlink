// 수정('<예원>새 본문입니다.</예원>')
// 수정('<충근 제목="새 제목">새 본문입니다.</충근>')

const 이름표 = {
    충근: "충", 예원: "예", 계영: "계", 효경: "효", 선미: "선",
    정아: "정", 정빈: "빈", 지은: "지", 상국: "상",
};

let server = null;
let lastSeen = null;

const pattern = /<([^\s>/]+)((?:\s[^>]*)?)>([\s\S]*?)(?:<\/\1>|<\1\s*\/>)/g;

function parse(input) {
    return [...input.matchAll(pattern)].map(([, name, attrs, body]) => ({
        name,
        제목: attrs.match(/제목\s*=\s*"([^"]*)"/)?.[1],
        문단: [body.trim().replace(/\s+/g, " ")],
    }));
}

async function load() {
    const 응답 = await fetch(`${server}/text.json`, { cache: "no-store" });
    return 응답.json();
}

function refresh(데이터) {
    const 지금것 = JSON.stringify(데이터?.[표지]?.[이름]);
    if (지금것 === lastSeen) return;
    lastSeen = 지금것;

    본문그리기(데이터);
    공굴러가요();
}

async function 수정(입력) {
    if (!server) return alert("서버 오프!");

    const pages = parse(입력);
    if (!pages.length) return alert("입력 확인!");

    const { name, 제목, 문단 } = pages[0];
    const 쪽 = 이름표[name];
    if (!쪽) return alert("이름 확인!");

    try {
        const 응답 = await fetch(`${server}/text/${쪽}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 제목, 문단 }),
        });
        if (!응답.ok) throw new Error((await 응답.text()) || 응답.status);
    } catch (오류) {
        return alert(`실패 → ${name}: ${오류.message}`);
    }

    try {
        refresh(await load());
    } catch { }

    alert("수정 완료!");
}

function startEditing() {
    server = 모임서버;
    lastSeen = null;

    setInterval(async () => {
        try {
            refresh(await load());
        } catch { }
    }, 2000);

    if (!sessionStorage.getItem("하이퍼링크:알림")) {
        sessionStorage.setItem("하이퍼링크:알림", "1");
        alert("서버 온!");
    }
}
