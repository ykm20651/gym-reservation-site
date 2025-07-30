document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".write-section form");
  const container = document.getElementById("card-container");
  const loggedInUsername = localStorage.getItem("username");

  if (!loggedInUsername) {
    alert("로그인이 필요합니다.");
    return;
  }

  // 모집글 렌더링 함수
  function renderPost(post) {
    const { id, place, time, capacity, desc } = post;

    const card = document.createElement("div");
    card.className = "guest-card";
    card.innerHTML = `
      <div class="meta">📍 장소: ${place} | 🕒 시간: ${time}</div>
      <div class="description">
        ${desc}<br/>
        현재 0/${capacity}명 참여중입니다.
      </div>
      <div class="actions">
        <button>참여 신청</button>
      </div>
    `;

    const joinBtn = card.querySelector("button");
    const descriptionBox = card.querySelector(".description");

    // 참여자 불러오기
    const data = JSON.parse(localStorage.getItem("guest_participation")) || {};
    const participants = data[id] || [];
    const joined = participants.length;

    // 참여자 수 표시 초기화
    descriptionBox.innerHTML = `
      ${desc}<br/>
      현재 ${joined}/${capacity}명 참여중입니다.
    `;
    if (joined >= capacity) {
      joinBtn.disabled = true;
      joinBtn.textContent = "마감됨";
    }

    joinBtn.addEventListener("click", () => {
      const data = JSON.parse(localStorage.getItem("guest_participation")) || {};
      const list = data[id] || [];

      if (list.includes(loggedInUsername)) {
        alert("이미 신청한 사용자입니다.");
        return;
      }

      list.push(loggedInUsername);
      data[id] = list;
      localStorage.setItem("guest_participation", JSON.stringify(data));

      const updatedJoined = list.length;
      descriptionBox.innerHTML = `
        ${desc}<br/>
        현재 ${updatedJoined}/${capacity}명 참여중입니다.
      `;

      if (updatedJoined >= capacity) {
        joinBtn.disabled = true;
        joinBtn.textContent = "마감됨";
      }
    });

    container.prepend(card);
  }

  // 페이지 로딩 시 저장된 모집글 불러오기
  const storedPosts = JSON.parse(localStorage.getItem("guest_posts")) || [];
  storedPosts.forEach(post => renderPost(post));

  // 모집글 작성 시 처리
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = form.querySelectorAll("input, textarea");
    const place = inputs[0].value.trim();
    const time = inputs[1].value.trim();
    const capacity = parseInt(inputs[2].value.trim());
    const desc = inputs[3].value.trim();

    if (!place || !time || !capacity || !desc) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const reservationId = `${time}_${place}`.replace(/\s+/g, ""); // 공백 제거
    const newPost = { id: reservationId, place, time, capacity, desc };

    // localStorage 저장
    const posts = JSON.parse(localStorage.getItem("guest_posts")) || [];
    posts.unshift(newPost);
    localStorage.setItem("guest_posts", JSON.stringify(posts));

    renderPost(newPost);
    inputs.forEach(i => i.value = "");
  });
});
