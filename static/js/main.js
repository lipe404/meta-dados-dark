// Funcionalidades JavaScript para a aplicação
document.addEventListener("DOMContentLoaded", function () {
  // Manipulação do input de arquivo
  const fileInput = document.getElementById("file");
  const fileInfo = document.getElementById("fileInfo");
  const fileLabel = document.querySelector(".file-label span");

  if (fileInput) {
    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        // Mostrar informações do arquivo
        fileInfo.style.display = "block";
        fileInfo.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-file" style="color: var(--primary-color);"></i>
                        <div>
                            <strong>${file.name}</strong><br>
                            <small>${formatFileSize(file.size)} - ${
          file.type || "Tipo desconhecido"
        }</small>
                        </div>
                    </div>
                `;

        // Atualizar texto do label
        fileLabel.textContent = "Arquivo Selecionado";

        // Adicionar classe de sucesso
        document.querySelector(".file-label").style.borderColor =
          "var(--success-color)";
        document.querySelector(".file-label").style.background =
          "rgba(16, 185, 129, 0.1)";
      }
    });
  }

  // Função para formatar tamanho do arquivo
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Drag and Drop functionality
  const fileLabel = document.querySelector(".file-label");
  if (fileLabel) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      fileLabel.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach((eventName) => {
      fileLabel.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      fileLabel.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
      fileLabel.style.borderColor = "var(--primary-color)";
      fileLabel.style.background = "rgba(99, 102, 241, 0.2)";
      fileLabel.style.transform = "scale(1.02)";
    }

    function unhighlight(e) {
      fileLabel.style.borderColor = "var(--border-color)";
      fileLabel.style.background = "var(--glass-bg)";
      fileLabel.style.transform = "scale(1)";
    }

    fileLabel.addEventListener("drop", handleDrop, false);

    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;

      if (files.length > 0) {
        fileInput.files = files;
        fileInput.dispatchEvent(new Event("change"));
      }
    }
  }

  // Auto-hide messages after 5 seconds
  const messages = document.querySelectorAll(".message");
  messages.forEach((message) => {
    setTimeout(() => {
      message.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        message.remove();
      }, 300);
    }, 5000);
  });

  // Adicionar animação de slideOut
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
    `;
  document.head.appendChild(style);

  // Confirmação de exclusão mais elegante
  const deleteButtons = document.querySelectorAll(
    'form[action*="delete_file"] button'
  );
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const filename = this.closest("form").action.split("/").pop();

      if (
        confirm(
          `Tem certeza que deseja deletar o arquivo "${filename}"?\n\nEsta ação não pode ser desfeita.`
        )
      ) {
        this.closest("form").submit();
      }
    });
  });

  // Validação do formulário de upload
  const uploadForm = document.querySelector(".upload-form");
  if (uploadForm) {
    uploadForm.addEventListener("submit", function (e) {
      const fileInput = this.querySelector('input[type="file"]');
      if (!fileInput.files.length) {
        e.preventDefault();
        alert("Por favor, selecione um arquivo antes de fazer o upload.");
        return false;
      }

      // Mostrar loading
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitButton.disabled = true;

      // Se houver erro, restaurar o botão
      setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }, 10000);
    });
  }

  // Smooth scroll para links internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Adicionar efeito de ripple nos botões
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // CSS para o efeito ripple
  const rippleStyle = document.createElement("style");
  rippleStyle.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(rippleStyle);
});
