/*
  VK Web Solutions — static-site interactions.

*/
const VK_WEB_CONFIG = {
  whatsappNumber: "94743102003"
};

const menuToggle = document.querySelector("#menu-toggle");
const siteNav = document.querySelector("#site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("open");
    }
  });
}

// Update the copyright year automatically.
const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

// Interactive cost estimate. This is illustrative pricing, not a quote contract.
const packageSelect = document.querySelector("#package-select");
const copywritingAddon = document.querySelector("#copywriting-addon");
const integrationAddon = document.querySelector("#extra-integration-addon");
const estimateTotal = document.querySelector("#estimate-total");
const estimateContact = document.querySelector("#estimate-contact");

function formatLkr(amount) {
  return `LKR ${Math.round(amount).toLocaleString("en-LK")}`;
}

function updateEstimate() {
  if (!packageSelect || !estimateTotal) return 0;
  const base = Number(packageSelect.value) || 0;
  const copywriting = copywritingAddon?.checked ? Number(copywritingAddon.value) : 0;
  const integration = integrationAddon?.checked ? Number(integrationAddon.value) : 0;
  const total = base + copywriting + integration;
  estimateTotal.textContent = formatLkr(total);

  if (estimateContact) {
    const packageLabel = packageSelect.options[packageSelect.selectedIndex]?.textContent.trim() || "Website project";
    const extras = [];
    if (copywriting) extras.push("content writing");
    if (integration) extras.push("additional integration");
    estimateContact.href = "#contact";
    estimateContact.dataset.estimate = formatLkr(total);
    estimateContact.dataset.packageLabel = packageLabel;
    estimateContact.dataset.extras = extras.length ? extras.join(", ") : "None selected";
  }
  return total;
}

[packageSelect, copywritingAddon, integrationAddon].forEach((element) => {
  element?.addEventListener("change", updateEstimate);
});
updateEstimate();

// Fill enquiry details from a selected package or estimate CTA.
document.querySelectorAll("[data-package]").forEach((link) => {
  link.addEventListener("click", () => {
    const service = document.querySelector("#service");
    const message = document.querySelector("#message");
    if (service) {
      const text = link.dataset.package || "";
      if (text.includes("Small Business")) service.value = "Business website";
      else if (text.includes("Landing")) service.value = "One-page landing page";
      else service.value = "Other / discuss first";
    }
    if (message && !message.value.trim()) {
      message.value = `I'm interested in the ${link.dataset.package} package. Please let me know the next steps.`;
    }
  });
});

if (estimateContact) {
  estimateContact.addEventListener("click", () => {
    const service = document.querySelector("#service");
    const message = document.querySelector("#message");
    const packageLabel = packageSelect?.options[packageSelect.selectedIndex]?.textContent.trim() || "Website project";
    const extras = [];
    if (copywritingAddon?.checked) extras.push("Content writing");
    if (integrationAddon?.checked) extras.push("Additional integration");
    if (service) service.value = packageLabel.includes("Small business") ? "Business website" : "One-page landing page";
    if (message) {
      message.value = `I'd like to discuss this estimate: ${packageLabel}. Estimated total: ${estimateTotal?.textContent || "to be confirmed"}. Optional extras: ${extras.join(", ") || "none selected"}. Please confirm the final scope and quotation.`;
    }
  });
}

// Keep a selected service visible if a visitor clicks a package CTA.
const contactForm = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");
const whatsappLink = document.querySelector("#direct-whatsapp");
const cleanNumber = String(VK_WEB_CONFIG.whatsappNumber || "").replace(/\D/g, "");

if (whatsappLink && cleanNumber) {
  whatsappLink.href = `https://wa.me/${cleanNumber}?text=${encodeURIComponent("Hello, I'd like to discuss a website project with VK Web Solutions.")}`;
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    if (!cleanNumber || cleanNumber.length < 8) {
      if (feedback) feedback.textContent = "The WhatsApp contact number has not been configured yet. Please contact the site owner.";
      return;
    }

    const formData = new FormData(contactForm);
    const details = [
      "Hello VK Web Solutions, I'd like to discuss a website project.",
      "",
      `Name / business: ${formData.get("name")}`,
      `Email or phone: ${formData.get("contact-details")}`,
      `Service: ${formData.get("service")}`,
      `Budget: ${formData.get("budget") || "Not specified"}`,
      "",
      `Project details: ${formData.get("message")}`
    ].join("\n");

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(details)}`;
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    if (feedback) {
      feedback.textContent = opened
        ? "WhatsApp opened with your message prepared. Review it and press Send in WhatsApp."
        : "Your browser blocked the new tab. Use the WhatsApp link above or allow pop-ups for this site.";
    }
  });
}
