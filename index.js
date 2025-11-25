const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express()
app.use(cors());

function loadJokes() {
  const raw = fs.readFileSync('./jokes.json', 'utf8');
  return JSON.parse(raw);
}

// 1. GET /jokebook/categories
app.get('/jokebook/categories', (req, res) => {
  const data = loadJokes();
  res.json(data.categories);
})

// 2. GET /jokebook/joke/:category
app.get('/jokebook/joke/:category', (req, res) => {
  const data = loadJokes();
  const category = req.params.category;

  if (!data[category])
  {
    return res.json({error: `no jokes for category ${category}`});
  }

  const jokeList = data[category];
  const randomJoke = jokeList[Math.floor(Math.random() * jokeList.length)];
  
  res.json(randomJoke);
})

// 3. GET /jokebook/jokes/:category
app.get('/jokebook/jokes/:category', (req, res) => {
  const data = loadJokes();
  const category = req.params.category;

  if (!data[category]) {
    return res.json({ error: `no jokes for category ${category}` });
  }

  res.json(data[category]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});