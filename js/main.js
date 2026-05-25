const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("site-nav--open");

    menuToggle.classList.toggle("menu-toggle--open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );
  });
}

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

const form = document.querySelector(".club-form");

if (form) {
  const fields = form.querySelectorAll("input, select, textarea");
  const alertBox = document.getElementById("form-alert");
  const textarea = document.getElementById("indicaciones");

  const storageKey = "nikaFormData";

  const showMessage = (field, message, isValid) => {
    const fieldContainer = field.closest(".club-form__field");
    const messageElement = fieldContainer.querySelector(".club-form__message");

    fieldContainer.classList.remove("is-valid", "is-invalid");

    if (messageElement && !messageElement.classList.contains("club-form__message--counter")) {
      messageElement.textContent = message;
    }

    fieldContainer.classList.add(isValid ? "is-valid" : "is-invalid");
  };

  const validateField = (field) => {
    const value = field.value.trim();

    if (!field.checkValidity()) {
      showMessage(
        field,
        field.dataset.error || "Campo inválido.",
        false
      );

      return false;
    }

    if (field.type === "tel" && !/^[0-9]{10}$/.test(value)) {
      showMessage(
        field,
        "El teléfono debe tener exactamente 10 números.",
        false
      );

      return false;
    }

    showMessage(field, "Campo válido.", true);

    return true;
  };

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      validateField(field);
      saveFormData();
    });

    field.addEventListener("blur", () => {
      validateField(field);
    });
  });

  const updateCounter = () => {
    if (!textarea) return;

    const counter = textarea
      .closest(".club-form__field")
      .querySelector(".club-form__message--counter");

    counter.textContent = `${textarea.value.length} / 180 caracteres`;
  };

  const saveFormData = () => {
    const data = {};

    fields.forEach((field) => {
      data[field.name] = field.value;
    });

    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const loadFormData = () => {
    const savedData = localStorage.getItem(storageKey);

    if (!savedData) return;

    const parsedData = JSON.parse(savedData);

    fields.forEach((field) => {
      if (parsedData[field.name]) {
        field.value = parsedData[field.name];
      }
    });

    updateCounter();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isFormValid = true;

    fields.forEach((field) => {
      const valid = validateField(field);

      if (!valid) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      alertBox.textContent =
        "Por favor corrige los campos marcados antes de enviar.";

      alertBox.className = "form-alert form-alert--error";

      return;
    }

    alertBox.textContent =
      "Tu solicitud fue enviada correctamente.";

    alertBox.className = "form-alert form-alert--success";

    localStorage.removeItem(storageKey);

    form.reset();

    document
      .querySelectorAll(".club-form__field")
      .forEach((field) => {
        field.classList.remove("is-valid", "is-invalid");
      });

    document
      .querySelectorAll(".club-form__message")
      .forEach((message) => {
        if (!message.classList.contains("club-form__message--counter")) {
          message.textContent = "";
        }
      });

    updateCounter();
  });

  form.addEventListener("reset", () => {
    localStorage.removeItem(storageKey);

    setTimeout(() => {
      document
        .querySelectorAll(".club-form__field")
        .forEach((field) => {
          field.classList.remove("is-valid", "is-invalid");
        });

      document
        .querySelectorAll(".club-form__message")
        .forEach((message) => {
          if (!message.classList.contains("club-form__message--counter")) {
            message.textContent = "";
          }
        });

      alertBox.className = "form-alert";
      alertBox.textContent = "";

      updateCounter();
    }, 0);
  });

  if (textarea) {
    textarea.addEventListener("input", updateCounter);
    updateCounter();
  }

  loadFormData();
}

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-item__button");

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((faq) => {
      faq.classList.remove("is-open");

      const faqButton = faq.querySelector(".faq-item__button");

      faqButton.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

const modal = document.getElementById("membership-modal");

if (modal) {
  const modalTitle = document.getElementById("modal-title");
  const modalPrice = document.getElementById("modal-price");
  const modalDescription = document.getElementById("modal-description");
  const modalBenefits = document.getElementById("modal-benefits");
  const modalSchedule = document.getElementById("modal-schedule");

  const detailButtons = document.querySelectorAll(".membership-detail-btn");
  const closeButtons = document.querySelectorAll("[data-close-modal]");

  const openModal = (button) => {
    const title = button.dataset.title;
    const price = button.dataset.price;
    const description = button.dataset.description;
    const benefits = button.dataset.benefits.split("|");
    const schedule = button.dataset.schedule.split("|");

    modalTitle.textContent = title;
    modalPrice.textContent = price;
    modalDescription.textContent = description;

    modalBenefits.innerHTML = "";
    modalSchedule.innerHTML = "";

    benefits.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      modalBenefits.appendChild(li);
    });

    schedule.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      modalSchedule.appendChild(li);
    });

    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
  };

  detailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-active")) {
      closeModal();
    }
  });
}

const sliderTrack = document.querySelector(".testimonial-slider__track");

if (sliderTrack) {
  const slides = document.querySelectorAll(".testimonial-card");

  const prevButton = document.querySelector(
    ".testimonial-slider__control--prev"
  );

  const nextButton = document.querySelector(
    ".testimonial-slider__control--next"
  );

  const dots = document.querySelectorAll(".testimonial-slider__dot");

  let currentIndex = 0;
  let autoPlay;

  const updateSlider = () => {
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  };

  const prevSlide = () => {
    currentIndex =
      (currentIndex - 1 + slides.length) % slides.length;

    updateSlider();
  };

  const startAutoPlay = () => {
    autoPlay = setInterval(nextSlide, 5000);
  };

  const stopAutoPlay = () => {
    clearInterval(autoPlay);
  };

  nextButton.addEventListener("click", () => {
    nextSlide();

    stopAutoPlay();
    startAutoPlay();
  });

  prevButton.addEventListener("click", () => {
    prevSlide();

    stopAutoPlay();
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;

      updateSlider();

      stopAutoPlay();
      startAutoPlay();
    });
  });

  sliderTrack.addEventListener("mouseenter", stopAutoPlay);

  sliderTrack.addEventListener("mouseleave", startAutoPlay);

  updateSlider();
  startAutoPlay();
}

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-toggle__icon");
const themeKey = "nikaTheme";

const applyTheme = (theme) => {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark-theme", isDark);

  if (themeToggle && themeIcon) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
    );

    themeIcon.textContent = isDark ? "☀" : "☾";
  }
};

if (themeToggle) {
  const savedTheme = localStorage.getItem(themeKey) || "light";

  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    const newTheme = isDark ? "light" : "dark";

    localStorage.setItem(themeKey, newTheme);
    applyTheme(newTheme);
  });
}