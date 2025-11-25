const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express()
app.use(cors());

function loadJokes() {
  const raw = fs.readFileSync('./jokes.json', 'utf8');
  return JSON.parse(raw);
}

function saveJokes(data) {
  fs.writeFileSync('./jokes.json', JSON.stringify(data, null, 2));
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

// 4. POST /jokebook/joke/:category
app.post('/jokebook/joke/:category', (req, res) => {
  const data = loadJokes();
  const category = req.params.category;

  if (!data[category]) {
    return res.json({ error: `no jokes for category ${category}` });
  }

  const { joke, response } = req.body;

  if (!joke || !response) {
    return res.json({ error: "missing 'joke' or 'response' field" });
  }

  const newJoke = { joke, response };
  data[category].push(newJoke);

  saveJokes(data);

  res.json({
    status: "success",
    added: newJoke,
    category
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});