document.documentElement.classList.add("js");

const revealItems = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (reducedMotion.matches) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealItems.forEach((item) => observer.observe(item));
}

const phoneScreens = [...document.querySelectorAll("[data-phone-screen]")];
const phoneDots = [...document.querySelectorAll("[data-phone-dot]")];
let activePhoneScreen = 0;
let phoneTimer;

function showPhoneScreen(nextScreen) {
  if (nextScreen === activePhoneScreen || phoneScreens.length < 2) return;

  const outgoing = phoneScreens[activePhoneScreen];
  const incoming = phoneScreens[nextScreen];

  outgoing.classList.remove("is-active");
  outgoing.classList.add("is-exiting");
  incoming.classList.remove("is-exiting");
  incoming.classList.add("is-active");

  phoneDots[activePhoneScreen]?.classList.remove("is-active");
  phoneDots[nextScreen]?.classList.add("is-active");
  activePhoneScreen = nextScreen;

  window.setTimeout(() => outgoing.classList.remove("is-exiting"), 700);
}

function startPhoneStory() {
  if (reducedMotion.matches || phoneScreens.length < 2 || phoneTimer) return;
  phoneTimer = window.setInterval(() => {
    showPhoneScreen((activePhoneScreen + 1) % phoneScreens.length);
  }, 3800);
}

function stopPhoneStory() {
  window.clearInterval(phoneTimer);
  phoneTimer = undefined;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopPhoneStory();
  else startPhoneStory();
});

reducedMotion.addEventListener("change", (event) => {
  if (event.matches) stopPhoneStory();
  else startPhoneStory();
});

startPhoneStory();
