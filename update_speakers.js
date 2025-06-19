// Script temporário para atualizar estrutura dos speaker cards
document.addEventListener("DOMContentLoaded", function () {
  const speakerCards = document.querySelectorAll(".speaker-card");

  speakerCards.forEach((card) => {
    // Pega o conteúdo atual (exceto se já tiver speaker-card-content)
    if (!card.querySelector(".speaker-card-content")) {
      const currentContent = card.innerHTML;

      // Limpa o card e adiciona a nova estrutura
      card.innerHTML = `
                <div class="speaker-card-content">
                    ${currentContent}
                </div>
            `;
    }
  });

  console.log("Speaker cards structure updated!");
});
