require('dotenv').config();

// const cors = require('cors');
const express = require('express');
// const methodOverride = require('method-override');
const pg = require('pg');
const superagent = require('superagent');

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// let games = require('./Games');
let games = [];
superagent
  .get('https://api.twitch.tv/helix/games/top?first=100')
  .set('Client-ID', 'atvcz912gs1lphwey76fyzfb8wtnru8')
  .then(res => {
    json = JSON.parse(res.text);
    games = json.data;
  })
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(methodOverride(...));

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index', { games }));
app.get('/about', (req, res) => res.render('about'));
app.get('/tracked', (req, res) => {
  client
    .query('SELECT * FROM tracked_games ORDER BY name ASC')
    .then(result => res.render('tracked', { tracked: result.rows }))
    .catch(err => console.error(err));
});
app.get('api/tracked', (req, res) => {
  client
    .query('SELECT * FROM tracked_games ORDER BY name ASC')
    .then(result => res.json(result.rows))
    .catch(err => console.error(err));
});
app.get('/api/streams/:game_id', (req, res) => {
  const game_id = req.params.game_id;
  superagent
    .get(`https://api.twitch.tv/helix/streams?first=10&game_id=${game_id}`)
    .set('Client-ID', 'atvcz912gs1lphwey76fyzfb8wtnru8')
    .then(r => {
      json = JSON.parse(r.text);
      res.json(json.data);
    })
    .catch(err => console.error(err));
});
// TODO - route 404s

app.post('/addgames', (req, res) => {
  const ids = req.body.games.split('-');
  const toSave = games.filter(game => ids.includes(game.id));
  toSave.forEach(g => {
    const game = new Game(g.id, g.name, g.box_art_url);
    game.save();
  });
  res.redirect('/');
});

app.delete('/api/games/:game_id', (req, res) => {
  client
    .query(`DELETE FROM tracked_games WHERE game_id='${req.params.game_id}'`)
    .then(result => res.send(result.rows))
    .catch(err => console.error(err));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

class Game {
  constructor(game_id, name, box_art_url) {
    this.game_id = game_id;
    this.name = name;
    this.box_art_url = box_art_url;
  }

  getImageSrc(w = 150, h = 200) {
    return this.box_art_url.replace(/{width}/, w).replace(/{height}/, h);
  }

  save() {
    const SQL = `INSERT INTO tracked_games (game_id, name, box_art_url) VALUES ($1,$2,$3)
                 ON CONFLICT DO NOTHING RETURNING game_id`;
    const values = [this.game_id, this.name, this.box_art_url];
    client
      .query(SQL, values)
      .then(res => console.log(res.rows[0]))
      .catch(e => console.error(e.stack));
  }

  // TODO - Move all SQL queries in model object
}
