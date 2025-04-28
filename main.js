// 전역 데이터 (초기값 세팅)
let data = [
  { id: 0, value: 75 },
  { id: 1, value: 20 },
  { id: 2, value: 80 },
  { id: 3, value: 100 },
  { id: 4, value: 70 },
];

// 주요 컴포넌트 업데이트
function updateAll() {
  drawChart(); // 차트 다시 그리기
  drawTable(); // 테이블 다시 그리기
  updateJson(); // JSON 텍스트 영역 업데이트
}

// 그래프 그리기
function drawChart() {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 기존 그래프 초기화

  const maxVal = Math.max(...data.map((d) => d.value)) || 1; // value 중 최대값 계산 (0 방지용 || 1)
  const barWidth = 50; // 막대 너비
  const gap = 30; // 막대 간격

  data.forEach((d, i) => {
    const height = (d.value / maxVal) * 200; // 최대 200px 기준 비율 계산
    const x = i * (barWidth + gap) + 50; // 막대 x 위치 계산
    const y = canvas.height - height - 20; // 막대 y 위치 계산 (아래 기준)

    ctx.fillStyle = "#ccc"; // 막대 색상
    ctx.fillRect(x, y, barWidth, height); // 막대 그리기

    ctx.fillStyle = "#000"; // 글자 색상
    ctx.fillText(d.id, x + barWidth / 2 - 5, canvas.height - 5); // ID 텍스트 표시
  });
}

// 테이블 그리기
function drawTable() {
  const table = document.getElementById("table");

  // 테이블 HTML 구조 재구성
  table.innerHTML = `
      <tr><th>ID</th><th>VALUE</th><th>삭제</th></tr>
      ${data
        .map(
          (d, idx) => `
        <tr>
          <td>${d.id}</td>
          <td><input type="number" value="${d.value}" onchange="edit(${idx}, this.value)" /></td>
          <td><button onclick="del(${idx})">삭제</button></td>
        </tr>
      `
        )
        .join("")}
    `;
}

// JSON 영역 업데이트
function updateJson() {
  document.getElementById("json-area").value = JSON.stringify(data, null, 2);
}

// 값 추가
function add() {
  const id = Number(document.getElementById("add-id").value);
  const value = Number(document.getElementById("add-value").value);

  // 입력값 검증: 숫자 체크
  if (isNaN(id) || isNaN(value)) {
    alert("숫자만 입력 가능합니다.");
    return;
  }

  // ID 중복 체크
  if (data.some((d) => d.id === id)) {
    alert("ID는 중복될 수 없습니다.");
    return;
  }

  // 데이터 추가 및 입력창 초기화
  data.push({ id, value });
  document.getElementById("add-id").value = "";
  document.getElementById("add-value").value = "";

  updateAll(); // 화면 갱신
}

// 값 수정
function edit(index, newValue) {
  const value = Number(newValue);

  // 입력값 검증: 숫자 체크
  if (isNaN(value)) {
    alert("숫자만 입력 가능합니다.");
    return;
  }
  data[index].value = value; // 값 업데이트 (화면 갱신은 별도로 apply 호출 필요)
}

// 값 삭제
function del(index) {
  data.splice(index, 1);
  updateAll();
}

// 테이블 Apply 버튼
function apply() {
  updateAll();
}

// JSON 직접 편집 후 Apply
function applyJson() {
  try {
    const parsed = JSON.parse(document.getElementById("json-area").value);

    // JSON 유효성 검사: 배열 형태인지 확인
    if (!Array.isArray(parsed)) throw new Error();

    // 필요한 필드만 추출하여 새로운 데이터 배열 생성
    data = parsed.map((d) => ({ id: d.id, value: d.value }));

    updateAll(); // 화면 갱신
  } catch {
    alert("유효한 JSON 형식으로 작성해주세요.");
  }
}

// 최초 화면 그리기
updateAll();
