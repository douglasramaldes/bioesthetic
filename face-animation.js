// Face Animation using GSAP
let distance = 169.87;
let colors = ["#09d9d2", "#05a8a1"];
let numFaces = 2;

function createFaces() {
  const svg = document.querySelector("#face-svg");
  if (!svg) return;

  for (let i = 1; i < numFaces + 1; i++) {
    let pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");

    pathEl.setAttribute("id", "face_" + i);
    pathEl.setAttribute(
      "d",
      "M" +
        distance +
        " 26.318006 c 29.3,24.77 29.07,40.97 19.24,85.749994 -0.53,10.83 14.07,-3.14 18.13,7.25 10.24,9.01 4.88,9.33 5,16.38 5.9,9.29 -5.01,16.41 -1.87,20.75 -0.93,13.28 -8.42,20.29 -19.5,33 -8.41,14.51 -38.2,-1.28 -38.38,-1.25 -2.68,1.13 9.3,18.36 21.62,28.88 20.4,13.44 39.98,56.17 48.13,79.37 0,0 -221.25000843,-0.37 -221.25000843,-0.87 17.12000043,-31.59 35.20000043,-79.82 75.00000043,-69.63 2.4,-24.69 0.51,-35.26 -26.62,-60 -5.88,-3.37 -18,-5.75 -29.13,-5.75 -31.090001,-3.55 -8.73,-21.27 -15.2500004,-29.25 -2,-5.25 -0.88,-8.25 3,-8.25 3.7500004,0 3.8800004,-1.5 0.25,-3.13 -8.98000023,-4.56 0.76,-11.59 2.0000004,-14.87 0,-0.62 -2.7500004,-2.38 -5.5000004,-5.499996 -16.9500006,-22.589998 21.9600004,-9.39 25.8700004,-39.999998 0.63,-6.13 2,-9 9.88,-20.88 38.52,-64.8 117.690008,-22.07 129.380008,-12" +
        "z"
    );
    pathEl.style.fill = "none";
    pathEl.style.stroke = colors[i - 1];
    pathEl.style.strokeWidth = "1.5";
    pathEl.style.opacity = i <= 3 ? 0.8 : 0.2;

    // Preparar para animação de desenho
    const pathLength = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = pathLength;
    pathEl.style.strokeDashoffset = pathLength; // Começar invisível
    svg.appendChild(pathEl);
    distance += 20;
  }
}

function outlinesTimeline() {
  let outlinesTL = gsap.timeline();

  for (let i = 1; i < numFaces + 1; i++) {
    outlinesTL.from(
      "#face_" + i,
      {
        duration: 0.3,
        opacity: 0,
        ease: "power0.inOut",
      },
      "-=0.2"
    );
  }

  return outlinesTL;
}

function fillColorTimeline() {
  let fillTL = gsap.timeline();

  for (let i = 9; i > 0; i--) {
    fillTL
      .fromTo(
        "#face_" + i,
        {
          fill: "none",
        },
        {
          duration: 0.07,
          fill: colors[i - 1],
          ease: "power1.inOut",
        }
      )
      .fromTo(
        "#face_" + i,
        {
          opacity: 0.3,
        },
        {
          duration: 0.07,
          opacity: 0.5,
          ease: "power0.inOut",
        },
        "-=0.02"
      );
  }

  return fillTL;
}

function squeezeTimeline() {
  let squeezeTL = gsap.timeline();

  for (let i = 8; i > 0; i--) {
    squeezeTL.fromTo(
      "#face_" + i,
      {
        opacity: 1,
      },
      {
        duration: 0.4,
        opacity: 0,
        ease: "power1.inOut",
      },
      "-=0.2"
    );
  }

  squeezeTL
    .fromTo(
      "#face_9",
      {
        x: 0,
      },
      {
        duration: 1,
        x: -150,
        ease: "power1.inOut",
      },
      "-=0.2"
    )
    .fromTo(
      "#face_9",
      {
        opacity: 0.5,
      },
      {
        duration: 1,
        opacity: 1,
        ease: "power1.inOut",
      },
      "-=1"
    );

  return squeezeTL;
}

function animateFaces() {
  let masterTL = gsap.timeline({
    repeat: -1, // Loop infinito
    repeatDelay: 2, // Pausa de 2 segundos entre loops
    yoyo: false,
  });

  masterTL
    .add(outlinesTimeline())
    .add(fillColorTimeline())
    .add(squeezeTimeline());
}

function animateDrawing() {
  const masterTL = gsap.timeline({
    repeat: -1,
    repeatDelay: 3,
  });

  // Fase 1: Desenhar os contornos sequencialmente
  for (let i = 1; i <= 3; i++) {
    // Apenas as 3 primeiras faces principais
    masterTL.to(
      `#face_${i}`,
      {
        duration: 2.5,
        strokeDashoffset: 0,
        ease: "power2.inOut",
      },
      i === 1 ? 0 : "-=2"
    ); // Sobrepor as animações
  }

  // Fase 2: Aguardar um pouco
  masterTL.to({}, { duration: 1.5 });

  // Fase 3: Crescer e desaparecer
  masterTL.to("#face-svg", {
    duration: 2,
    scale: 1.5,
    opacity: 0,
    transformOrigin: "center",
    ease: "power2.inOut",
  });

  // Fase 4: Reset para próximo ciclo
  masterTL.set(["#face_1", "#face_2", "#face_3"], {
    strokeDashoffset: (index, target) => target.getTotalLength(),
  });

  masterTL.set("#face-svg", {
    scale: 1,
    opacity: 1,
  });

  return masterTL;
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", function () {
  // Aguardar um pouco para garantir que o SVG está renderizado
  setTimeout(() => {
    createFaces();
    animateDrawing(); // Nova animação de desenho
  }, 500);
});

// Restart animation when section comes into view (optional)
if (typeof IntersectionObserver !== "undefined") {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Reiniciar animação quando a seção hero entra em vista
        setTimeout(() => {
          gsap.killTweensOf("#face_*");
          gsap.killTweensOf("#face-svg");
          createFaces();
          animateDrawing();
        }, 100);
      }
    });
  });

  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    observer.observe(heroSection);
  }
}
