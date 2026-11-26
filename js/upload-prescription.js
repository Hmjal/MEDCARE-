// MedCare+ Dynamic Prescription Uploader (Multer + Progress Bar)
document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("rxDropzone");
  const fileInput = document.getElementById("rxFileInput");
  const previewContainer = document.getElementById("rxPreviewContainer");
  const previewThumb = document.getElementById("rxPreviewThumb");
  const previewFileName = document.getElementById("rxPreviewFileName");
  const previewFileMeta = document.getElementById("rxPreviewFileMeta");
  const removeFileBtn = document.getElementById("rxRemoveFileBtn");
  const progressWrap = document.getElementById("rxUploadProgressWrap");
  const progressBar = document.getElementById("rxUploadProgressBar");
  const progressText = document.getElementById("rxUploadProgressText");
  const form = document.getElementById("rxPipelineForm");
  const submitBtn = document.getElementById("rxSubmitBtn");
  const successBox = document.getElementById("rxUploadSuccessBox");
  const createdRefEl = document.getElementById("rxCreatedRef");
  const authWarning = document.getElementById("rxAuthWarning");

  const token = localStorage.getItem("medcare_token");
  const user = JSON.parse(localStorage.getItem("medcare_user") || "null");

  if (!token && authWarning) {
    authWarning.style.removeProperty("display");
  }
  if (user) {
    const nameEl = document.getElementById("patientNameInput");
    const phoneEl = document.getElementById("patientPhoneInput");
    if (nameEl && !nameEl.value && user.name) nameEl.value = user.name;
    if (phoneEl && !phoneEl.value && user.phone) phoneEl.value = user.phone;

    const greeting = document.getElementById("userGreeting");
    const loginBtn = document.getElementById("loginBtn");
    if (greeting) {
      greeting.innerHTML = `<a href="dashboard.html" class="user-profile-badge"><i class="fa-solid fa-circle-user text-primary"></i> <span>Hi, ${user.name}</span></a>`;
    }
    if (loginBtn) loginBtn.style.display = "none";
  }

  let selectedFile = null;

  function showToast(msg, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `medcare-toast toast-${type}`;
    toast.innerHTML = `<span class="toast-message">${msg}</span><button class="toast-close">&times;</button>`;
    container.appendChild(toast);
    toast.querySelector(".toast-close").addEventListener("click", () => toast.remove());
    setTimeout(() => toast.remove(), 4000);
  }

  function validateAndSetFile(file) {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      showToast("Only .jpg, .png, and .pdf files are allowed.", "danger");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("File exceeds 10MB maximum limit.", "danger");
      return;
    }

    selectedFile = file;
    previewFileName.textContent = file.name;
    previewFileMeta.textContent = `${(file.size / 1024).toFixed(1)} KB • ${file.type}`;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewThumb.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
      };
      reader.readAsDataURL(file);
    } else {
      previewThumb.innerHTML = `<i class="fa-solid fa-file-pdf text-danger fs-2"></i>`;
    }

    previewContainer.classList.add("show");
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());
    dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
      }
    });
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("drag-over");
    });
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag-over"));
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("drag-over");
      if (e.dataTransfer.files.length) validateAndSetFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length) validateAndSetFile(fileInput.files[0]);
    });
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener("click", () => {
      selectedFile = null;
      if (fileInput) fileInput.value = "";
      previewContainer.classList.remove("show");
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const activeToken = localStorage.getItem("medcare_token");
      if (!activeToken) {
        showToast("Please log in first to upload your prescription.", "warning");
        return;
      }
      if (!selectedFile) {
        showToast("Please select a .jpg, .png, or .pdf prescription file.", "warning");
        return;
      }

      const patientName = document.getElementById("patientNameInput").value.trim();
      const patientPhone = document.getElementById("patientPhoneInput").value.trim();
      const notes = document.getElementById("patientNotesInput").value.trim();

      if (!patientName || !patientPhone) {
        showToast("Please enter patient name and phone number.", "warning");
        return;
      }

      const formData = new FormData();
      formData.append("prescriptionFile", selectedFile);
      formData.append("patient_name", patientName);
      formData.append("patient_phone", patientPhone);
      formData.append("notes_by_patient", notes);

      submitBtn.disabled = true;
      progressWrap.classList.add("show");
      progressBar.style.width = "0%";
      progressText.textContent = "0%";

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/prescriptions/upload", true);
      xhr.setRequestHeader("Authorization", `Bearer ${activeToken}`);

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const pct = Math.round((ev.loaded / ev.total) * 100);
          progressBar.style.width = `${pct}%`;
          progressText.textContent = `${pct}%`;
        }
      };

      xhr.onload = () => {
        submitBtn.disabled = false;
        let data = {};
        try { data = JSON.parse(xhr.responseText); } catch (err) {}

        if (xhr.status >= 200 && xhr.status < 300) {
          progressBar.style.width = "100%";
          progressText.textContent = "100%";
          if (createdRefEl && data.prescription) {
            createdRefEl.textContent = data.prescription.rxId || data.prescription._id;
          }
          if (successBox) successBox.style.display = "block";
          form.reset();
          selectedFile = null;
          previewContainer.classList.remove("show");
          showToast("Prescription uploaded & queued for pharmacist verification!", "success");
        } else {
          progressWrap.classList.remove("show");
          showToast(data.error || "Upload failed. Please try again.", "danger");
        }
      };

      xhr.onerror = () => {
        submitBtn.disabled = false;
        progressWrap.classList.remove("show");
        showToast("Network error while uploading prescription.", "danger");
      };

      xhr.send(formData);
    });
  }
});
