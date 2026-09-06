import { ref } from 'vue';

export const isNavigating = ref(false);
export const navProgress = ref(0);

let progressInterval = null;

export function startNavLoading() {
  if (progressInterval) clearInterval(progressInterval);
  isNavigating.value = true;
  navProgress.value = 15;

  progressInterval = setInterval(() => {
    if (navProgress.value < 85) {
      navProgress.value += Math.floor(Math.random() * 15) + 5;
    }
  }, 120);
}

export function finishNavLoading() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  navProgress.value = 100;
  setTimeout(() => {
    isNavigating.value = false;
    setTimeout(() => {
      navProgress.value = 0;
    }, 200);
  }, 250);
}
