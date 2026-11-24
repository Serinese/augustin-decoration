document.addEventListener("DOMContentLoaded", () => {
  // Menu mobile
  const navOverlay = document.getElementById("navOverlay");
  const navOpenBtn = document.getElementById("navOpenButton");
  const navCloseBtn = document.getElementById("navCloseButton");

  function closeMobileNav() {
    if (!navOverlay) return;
    navOverlay.classList.add("hidden");
    navOverlay.classList.remove("flex");
  }

  navOpenBtn?.addEventListener("click", () => {
    navOverlay.classList.remove("hidden");
    navOverlay.classList.add("flex");
  });
  navCloseBtn?.addEventListener("click", closeMobileNav);
  document.querySelectorAll(".nav-close-link").forEach((el) => el.addEventListener("click", closeMobileNav));

  // Données JSON des prestations
  const sources = {};
  document.querySelectorAll("script[data-prestation-source]").forEach((el) => {
    sources[el.getAttribute("data-prestation-source")] = JSON.parse(el.textContent);
  });

  // Modale 3 étapes
  const modal = document.getElementById("prestationModal");
  const modalGroup = document.getElementById("modalGroup");
  const modalTitle = document.getElementById("modalTitle");
  const modalModelsGrid = document.getElementById("modalModelsGrid");
  const modalSelectedModel = document.getElementById("modalSelectedModel");
  const modalAiInput = document.getElementById("modalAiInput");
  const modalAiResult = document.getElementById("modalAiResult");
  const modalOrderConfirm = document.getElementById("modalOrderConfirm");

  let currentModelName = "";
  let currentAdaptation = "";

  document.querySelectorAll("[data-preview-source]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const list = sources[btn.getAttribute("data-preview-source")];
      const item = list?.[Number(btn.getAttribute("data-preview-index"))];
      if (!item) return;

      modalGroup.textContent = item.group;
      modalTitle.textContent = item.title;
      modalAiResult.textContent = "";
      modalOrderConfirm.textContent = "";
      currentModelName = item.models[0]?.name || item.title;
      modalSelectedModel.textContent = currentModelName;

      modalModelsGrid.innerHTML = item.models
        .map(
          (m, idx) => `
          <button type="button" data-model-name="${m.name.replace(/"/g, "&quot;")}"
            class="model-pick text-left rounded-2xl border ${idx === 0 ? "border-[var(--rose-dark)] bg-[var(--surface-color)]" : "border-[var(--border-color)] bg-white"} p-3">
            <img src="${m.image}" alt="${m.name}" class="h-28 w-full rounded-xl object-cover" />
            <p class="mt-2 text-sm font-semibold">${m.name}</p>
            <p class="mt-1 text-xs text-[var(--text-muted)]">${m.desc}</p>
            <p class="mt-2 text-[11px] font-bold uppercase text-[var(--rose-dark)]">${m.lead}</p>
          </button>`
        )
        .join("");

      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });
  });

  modalModelsGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".model-pick");
    if (!card) return;
    currentModelName = card.getAttribute("data-model-name");
    modalSelectedModel.textContent = currentModelName;
    modalModelsGrid.querySelectorAll(".model-pick").forEach((el) => {
      el.classList.remove("border-[var(--rose-dark)]", "bg-[var(--surface-color)]");
      el.classList.add("border-[var(--border-color)]", "bg-white");
    });
    card.classList.add("border-[var(--rose-dark)]", "bg-[var(--surface-color)]");
  });

  document.getElementById("closeModalBtn")?.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  document.querySelectorAll("[data-select-item]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const active = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", String(!active));
      const label = btn.querySelector("[data-select-label]");
      const card = btn.closest("[data-select-card]");
      label.textContent = active ? "Choisir" : "Sélectionné";
      card?.classList.toggle("is-selected", !active);
    });
  });

  document.getElementById("modalAiSendBtn")?.addEventListener("click", () => {
    const val = modalAiInput.value.trim();
    if (!val) {
      modalAiResult.textContent = "Indiquez la modification souhaitée avant d'envoyer.";
      return;
    }
    currentAdaptation = val;
    modalAiResult.textContent = `Modèle « ${currentModelName} » ajusté : ${val} (palette blanc & rose poudré de l'atelier).`;
  });

  document.getElementById("modalOrderForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("orderName").value.trim();
    const email = document.getElementById("orderEmail").value.trim();
    modalOrderConfirm.textContent = `Merci ${name} ! Votre demande pour « ${currentModelName} »${currentAdaptation ? ` (${currentAdaptation})` : ""} est confirmée pour ${email}.`;
  });

  // Conseiller IA directement sur la page
  document.getElementById("inlineAdvisorForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const txt = document.getElementById("inlineAdvisorInput").value.trim();
    if (!txt) return;
    document.getElementById("inlineUserMsg").textContent = txt;
    document.getElementById("inlineBotMsg").textContent =
      `Pour « ${txt} », l'atelier recommande nos finitions blanc mat & rose poudré sur mesure. Disponibilité actuelle : 3 à 4 semaines.`;
  });

  // Formulaire de devis
  document.getElementById("contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    document.getElementById("contactConfirm").textContent =
      `Merci ${name}, votre demande de devis a bien été prise en compte.`;
  });
});
