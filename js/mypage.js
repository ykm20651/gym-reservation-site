
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("loggedInUser");
  if (!user) {
    alert("로그인 후 이용해주세요.");
    return (window.location.href = "login.html");
  }
  document.getElementById("greeting").textContent = `👤 ${user}님의 마이페이지`;

  // ───── 프로필 처리 ─────
  const profileKey = `profile_${user}`;
  const saved = JSON.parse(localStorage.getItem(profileKey) || "null");
  if (saved) {
    document.getElementById("savedProfile").textContent =
      `닉네임: ${saved.nickname}\n키: ${saved.height}cm\n포지션: ${saved.position}`;
  }
  document.getElementById("profileForm").addEventListener("submit", e => {
    e.preventDefault();
    const nick = e.target.nickname.value;
    const ht = e.target.height.value;
    const pos = e.target.position.value;
    localStorage.setItem(profileKey, JSON.stringify({ nickname: nick, height: ht, position: pos }));
    document.getElementById("savedProfile").textContent =
      `닉네임: ${nick}\n키: ${ht}cm\n포지션: ${pos}`;
    alert("프로필이 저장되었습니다.");
  });

  // ───── 로그아웃 / 탈퇴 ─────
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    location.href = "index.html";
  });

  document.getElementById("passwordChangeForm").addEventListener("submit", e => {
    e.preventDefault();
    const cur = e.target.currentPw.value;
    const nw = e.target.newPw.value;
    const stored = localStorage.getItem("password");
    if (cur === stored) {
      localStorage.setItem("password", nw);
      alert("비밀번호가 변경되었습니다.");
    } else {
      alert("현재 비밀번호가 일치하지 않습니다.");
    }
  });

  document.getElementById("deleteAccount").addEventListener("click", () => {
    if (!confirm("정말 탈퇴하시겠습니까?")) return;
    ["username", "password", profileKey, "loggedInUser"].forEach(k => localStorage.removeItem(k));
    alert("회원 탈퇴가 완료되었습니다.");
    location.href = "index.html";
  });

  // ───── 예약 내역 처리 ─────
  const reservationList = document.getElementById("reservationList");
  const filter = document.getElementById("reservationFilter");

  function renderReservations(status) {
    const key = `reservations_${user}`;
    const all = JSON.parse(localStorage.getItem(key) || "[]");
    reservationList.innerHTML = "";

    const filtered = all.filter(r => status === "all" || r.status === status);
    if (filtered.length === 0) {
      return reservationList.innerHTML = "<p>예약 내역이 없습니다.</p>";
    }

    filtered.forEach((r, idx) => {
      const card = document.createElement("div");
      card.className = "reservation-card";

      const h4 = document.createElement("h4");
      h4.textContent = r.name;
      card.appendChild(h4);

      const det = document.createElement("div");
      det.className = "reservation-details";
      [["날짜:", r.date], ["시간:", r.time], ["주소:", r.address], ["상태:", r.status]].forEach(([label, value]) => {
        const l = document.createElement("label");
        l.textContent = label;
        const s = document.createElement("span");
        s.textContent = value;
        det.append(l, s);
      });
      card.appendChild(det);

      const actions = document.createElement("div");
      actions.className = "action-buttons";
      [["완료 처리", "btn-complete", () => updateReservation(idx, "completed")],
       ["취소", "btn-cancel", () => updateReservation(idx, "cancelled")],
       ["삭제", "btn-delete", () => deleteReservation(idx)],
       ["게스트 모집글 보기", "btn-guest", () => location.href = `guest_list.html?from=${encodeURIComponent(r.name)}`]
      ].forEach(([text, cls, fn]) => {
        const b = document.createElement("button");
        b.textContent = text;
        b.className = cls;
        b.addEventListener("click", fn);
        actions.appendChild(b);
      });
      card.appendChild(actions);
      reservationList.appendChild(card);
    });
  }

  function updateReservation(idx, status) {
    const key = `reservations_${user}`;
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr[idx].status = status;
    localStorage.setItem(key, JSON.stringify(arr));
    renderReservations(filter.value);
  }

  function deleteReservation(idx) {
    if (!confirm("이 예약을 삭제하시겠습니까?")) return;
    const key = `reservations_${user}`;
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.splice(idx, 1);
    localStorage.setItem(key, JSON.stringify(arr));
    renderReservations(filter.value);
  }

  filter.addEventListener("change", e => renderReservations(e.target.value));
  renderReservations("all");

  // ───── 게스트 신청 내역 카드로 렌더링 ─────
  function renderGuest() {
    const part = JSON.parse(localStorage.getItem("guest_participation") || "{}");
    const posts = JSON.parse(localStorage.getItem("guest_posts") || "[]");
    const guestList = document.getElementById("guestList");
    guestList.innerHTML = "";

    const joinedPosts = posts.filter(p => {
      const list = part[p.id] || [];
      return list.includes(user);
    });

    if (joinedPosts.length === 0) {
      guestList.innerHTML = "<p>참여한 게스트 게임이 없습니다.</p>";
      return;
    }

    joinedPosts.forEach(p => {
      const card = document.createElement("div");
      card.className = "guest-card";

      const h4 = document.createElement("h4");
      h4.textContent = `${p.time} - ${p.place}`;
      h4.style.marginBottom = "0.5rem";

      const details = document.createElement("div");
      details.className = "guest-details";
      [["🗓️ 날짜", p.time], ["📍 장소", p.place], ["🧑‍🤝‍🧑 인원", `${(part[p.id] || []).length}/${p.capacity}`], ["📝 설명", p.desc]]
        .forEach(([label, val]) => {
          const row = document.createElement("div");
          row.innerHTML = `<strong>${label}:</strong> ${val}`;
          details.appendChild(row);
        });

      card.appendChild(h4);
      card.appendChild(details);
      guestList.appendChild(card);
    });
  }

  renderGuest();
});
