document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("signupId").value.trim();
    const pw = document.getElementById("signupPw").value.trim();
    const confirmPw = document.getElementById("confirmPw").value.trim();

    if (pw !== confirmPw) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const existingId = localStorage.getItem("username");
    if (existingId && existingId === id) {
      alert("이미 가입된 아이디입니다.");
      return;
    }

    localStorage.setItem("username", id);
    localStorage.setItem("password", pw);

    alert("회원가입이 완료되었습니다! 로그인 해주세요.");
    window.location.href = "login.html";
  });
});
