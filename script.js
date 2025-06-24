// Smooth scroll para navegação
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

// Navegação mobile (hamburger menu)
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");

    // Adicionar/remover classe do body para controlar overflow e background
    document.body.classList.toggle("menu-active");
  });
}

// Fechar menu mobile ao clicar em um link
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.classList.remove("menu-active");
  })
);

// Sistema de abas da agenda
document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active de todos os botões e painéis
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Adiciona active ao botão clicado
      button.classList.add("active");

      // Mostra o painel correspondente
      const targetTab = button.getAttribute("data-tab");
      const targetPane = document.getElementById(targetTab);
      if (targetPane) {
        targetPane.classList.add("active");
      }
    });
  });
});

// Animação dos números das estatísticas
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px 0px -100px 0px",
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const statNumber = entry.target.querySelector(".stat-number");
      if (statNumber && !statNumber.classList.contains("animated")) {
        animateNumber(statNumber);
        statNumber.classList.add("animated");
      }
    }
  });
}, observerOptions);

// Observar todos os elementos de estatística
document.querySelectorAll(".stat").forEach((stat) => {
  statsObserver.observe(stat);
});

// Função para animar números
function animateNumber(element) {
  const finalNumber = element.textContent;
  const number = parseInt(finalNumber.replace(/\D/g, ""));
  const suffix = finalNumber.replace(/[\d]/g, "");
  let current = 0;
  const increment = number / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= number) {
      current = number;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + suffix;
  }, 40);
}

// Header com cor fixa - removido efeito de mudança no scroll

// Animação de entrada para elementos
const fadeInObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
);

// Aplicar animação de fade-in a elementos relevantes
document.addEventListener("DOMContentLoaded", function () {
  // Elementos que devem ter animação de entrada
  const elementsToAnimate = [
    ".speaker-card",
    ".organizer-card",
    ".exhibitor-card",
    ".agenda-item",
    ".about-features li",
  ];

  elementsToAnimate.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      fadeInObserver.observe(el);
    });
  });
});

// Parallax sutil para elementos flutuantes
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const rate = scrolled * -0.5;

  document
    .querySelectorAll(".floating-elements .element")
    .forEach((element, index) => {
      const speed = 0.3 + index * 0.1;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Adicionar efeito de hover nos cards
document
  .querySelectorAll(".organizer-card, .exhibitor-card")
  .forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

// Efeitos especiais para cards de palestrantes
document.querySelectorAll(".speaker-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    // Animação de brilho dourado
    this.style.boxShadow =
      "0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 215, 0, 0.5), 0 0 50px rgba(255, 215, 0, 0.2)";
  });
});

// Animação extra para o DNA de fundo
function addExtraDNAElements() {
  const dnaBackground = document.querySelector(".dna-background");

  // Adicionar mais elementos de DNA
  for (let i = 0; i < 3; i++) {
    const dnaStrand = document.createElement("div");
    dnaStrand.classList.add("dna-strand");
    dnaStrand.style.left = `${20 + i * 30}%`;
    dnaStrand.style.animationDelay = `${i * 5}s`;
    dnaStrand.style.opacity = "0.3";
    dnaBackground.appendChild(dnaStrand);
  }
}

// Inicializar animações extras
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(addExtraDNAElements, 1000);
});

// Loading smooth para links externos
document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    // Adicionar indicador de loading se necessário
    const icon = this.querySelector("i");
    if (icon) {
      const originalClass = icon.className;
      icon.className = "fas fa-spinner fa-spin";
      setTimeout(() => {
        icon.className = originalClass;
      }, 1000);
    }
  });
});

// Adicionar efeitos visuais aos botões
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    // Efeito de ripple
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
const style = document.createElement("style");
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Estilos adicionais para menu mobile */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: rgba(255, 255, 255, 0.98);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            backdrop-filter: blur(15px);
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(style);
