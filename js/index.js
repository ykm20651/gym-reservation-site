document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".main-nav ul");
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (loggedInUser) {
    nav.innerHTML = `
      <li><a href="mypage.html">${loggedInUser}님</a></li>
      <li><a href="#" id="logoutBtn">로그아웃</a></li>
      <li><a href="reservation.html">시설 예약</a></li>
    `;

    // 로그아웃 버튼 이벤트
    document.getElementById("logoutBtn").addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      alert("로그아웃 되었습니다.");
      location.reload();
    });
  } else {
    nav.innerHTML = `
      <li><a href="login.html">로그인</a></li>
      <li><a href="signup.html">회원가입</a></li>
      <li><a href="reservation.html">시설 예약</a></li>
    `;
  }
});
