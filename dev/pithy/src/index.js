let textBox;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#slow').addEventListener('click', slowClicked);
  document.querySelector('#mid').addEventListener('click', midClicked);
  document.querySelector('#fast').addEventListener('click', fastClicked);
  textBox = document.querySelector('.output');
});

const slowClicked = async () => {
  textBox.innerText = 'Slow GET...';
  const slowFetch = await fetch('/slow');
  const slowRes = await slowFetch.json();
  let maxPrime = 2;
  for (let i = 0; i < slowRes.primes.length; i++) {
    if (slowRes.primes[i] > maxPrime) maxPrime = slowRes.primes[i];
  }
  textBox.innerText = `Slow Primes Max: ${maxPrime}`;
};

const midClicked = async () => {
  textBox.innerText = 'Mid GET...';
  const midFetch = await fetch('/mid');
  const midRes = await midFetch.json();
  console.log(midRes);
  textBox.innerText = `Mid Result: ${midRes.name}`;
};

const fastClicked = async () => {
  textBox.innerText = 'Fast GET...';
  const fastFetch = await fetch('/fast');
  const fastRes = await fastFetch.json();
  console.log(fastRes);
  textBox.innerText = fastRes;
};
