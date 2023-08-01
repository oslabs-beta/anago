import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, './src')));
app.use(express.json());

app.get('/fast', (req, res) => {
  console.log('Fast query');
  res.status(200).json('Fast response!');
});

app.get('/mid', async (req, res) => {
  console.log('Mid query');
  let yodaRaw = await fetch('https://swapi.dev/api/people/20');
  let yodaParsed = await yodaRaw.json();
  res.status(200).json(yodaParsed);
});

app.get('/slow', async (req, res) => {
  console.log('Slow query');
  const primes = generatePrimes();
  res.status(200).json({ primes: primes });
});

const generatePrimes = () => {
  const primeList = [];
  while (primeList.length < 10000) {
    primeList.push(newPrime());
  }
  return primeList;
};

const newPrime = () => {
  let primeCand = Math.floor(Math.random() * 49490000) * 2 + 1000001;
  while (primeCand < 100000000) {
    let soFarPrime = true;
    let primeTestLimit = Math.ceil(Math.sqrt(primeCand) + 1);
    for (let i = 3; i < primeTestLimit; i++) {
      if (primeCand % i == 0) {
        soFarPrime = false;
        break;
      }
    }
    if (soFarPrime) return primeCand;
    primeCand += 2;
  }
};

app.use((req, res) => {
  return res.status(400).send('Sorry, an error occured');
});

app.listen(PORT, () => {
  console.log(`Server now listening on port ${PORT}.`);
});
