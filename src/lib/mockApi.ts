export const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const waitRandom = (min = 320, max = 780) => {
  const duration = Math.floor(Math.random() * (max - min + 1)) + min;
  return wait(duration);
};
