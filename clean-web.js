// 無註解的網頁滾動效果程式
import { gsap } from "gsap";
const sections = document.querySelectorAll("section");
const images = document.querySelectorAll(".bg");
const outerWrappers = gsap.utils.toArray(".outer");
const innerWrappers = gsap.utils.toArray(".inner");

document.addEventListener("wheel", handleWheel);

let listening = false,
  direction = "down",
  current,
  next = 0;

const tlDefaults = {
  ease: "slow.inOut",
  duration: 1.25
};

gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });

function slideIn() {
  if (current !== undefined) gsap.set(sections[current], { zIndex: 0 });

  gsap.set(sections[next], { autoAlpha: 1, zIndex: 1 });
  gsap.set(images[next], { yPercent: 0 });

  const tl = gsap
    .timeline({
      paused: true,
      defaults: tlDefaults,
      onComplete: () => {
        listening = true;
        current = next;
      }
    })
    .to([outerWrappers[next], innerWrappers[next]], { yPercent: 0 }, 0)
    .from(images[next], { yPercent: 15 }, 0)

  if (current !== undefined) {
    tl.add(
      gsap.to(images[current], {
        yPercent: -15,
        ...tlDefaults
      }),
      0
    ).add(
      gsap
        .timeline()
        .set(outerWrappers[current], { yPercent: 100 })
        .set(innerWrappers[current], { yPercent: -100 })
        .set(images[current], { yPercent: 0 })
        .set(sections[current], { autoAlpha: 0 })
    );
  }

  tl.play(0);
}

function slideOut() {
  gsap.set(sections[current], { zIndex: 1 });
  gsap.set(sections[next], { autoAlpha: 1, zIndex: 0 });
  gsap.set([outerWrappers[next], innerWrappers[next]], { yPercent: 0 });
  gsap.set(images[next], { yPercent: 0 });

  gsap
    .timeline({
      defaults: tlDefaults,
      onComplete: () => {
        listening = true;
        current = next;
      }
    })
    .to(outerWrappers[current], { yPercent: 100 }, 0)
    .to(innerWrappers[current], { yPercent: -100 }, 0)
    .to(images[current], { yPercent: 15 }, 0)
    .from(images[next], { yPercent: -15 }, 0)
    .set(images[current], { yPercent: 0 });
}

// 處理滑動方向
function handleDirection() {
  listening = false;

  if (direction === "down") {
    next = current + 1;
    if (next >= sections.length) next = 0;
    slideIn(); 
  }

  if (direction === "up") {
    next = current - 1;
    if (next < 0) next = sections.length - 1;
    slideOut();
  }
}

function handleWheel(e) {
  if (!listening) return;
  direction = e.wheelDeltaY < 0 ? "down" : "up";
  handleDirection();
}

slideIn();
