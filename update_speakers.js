document.addEventListener("DOMContentLoaded", function () {
  const speakerCards = document.querySelectorAll(".speaker-card");

  speakerCards.forEach((card) => {
    if (!card.querySelector(".speaker-card-content")) {
      const currentContent = card.innerHTML;

      card.innerHTML = `
                <div class="speaker-card-content">
                    ${currentContent}
                </div>
            `;
    }
  });

});
