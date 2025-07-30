document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  let base64Image = "";

  // 미리보기 이미지 요소
  const preview = document.createElement("img");
  preview.id = "previewImage";
  preview.style.width = "100%";
  preview.style.maxHeight = "200px";
  preview.style.objectFit = "cover";
  preview.style.marginTop = "0.5rem";
  preview.style.borderRadius = "8px";
  preview.className = "image-preview";

  const imageLabel = document.createElement("label");
  imageLabel.textContent = "이미지 업로드";
  imageLabel.htmlFor = "imageUpload";
  imageLabel.className = "form-label";

  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.id = "imageUpload";
  imageInput.accept = "image/*";
  imageInput.required = true;
  imageInput.className = "form-input";

  const formElement = document.getElementById("time").parentNode;
  formElement.appendChild(imageLabel);
  formElement.appendChild(imageInput);
  formElement.appendChild(preview);

  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      base64Image = event.target.result;
      preview.src = base64Image;
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!base64Image) {
      alert("이미지를 업로드해주세요.");
      return;
    }

    const gym = {
      name: document.getElementById("name").value,
      address: document.getElementById("address").value,
      price: document.getElementById("price").value,
      time: document.getElementById("time").value,
      lat: 37.5665, // 예시용 좌표, 향후 주소 기반 변환 추가 가능
      lon: 126.9780,
      image: base64Image,
    };

    const gyms = JSON.parse(localStorage.getItem("customGyms") || "[]");
    gyms.push(gym);
    localStorage.setItem("customGyms", JSON.stringify(gyms));

    alert("체육관이 등록되었습니다!");
    window.location.href = "reservation.html";
  });
});
