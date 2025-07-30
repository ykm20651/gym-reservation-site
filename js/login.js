
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputId = document.getElementById("loginId").value.trim();
    const inputPw = document.getElementById("loginPw").value.trim();

    const savedId = localStorage.getItem("username");
    const savedPw = localStorage.getItem("password");

    if (inputId === savedId && inputPw === savedPw) {
      alert(`${inputId}님, 환영합니다!`);
      localStorage.setItem("loggedInUser", inputId); 
      window.location.href = "index.html";
    } else {
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  });
});
