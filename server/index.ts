require("dotenv").config();
import "reflect-metadata";
import auth from "./middleware/auth";
import { createConnection } from "typeorm";
import { User, Playlist, Song, Chart, SongListened } from "./entities/index";
import getAllCharts from "./scripts/helpers/dateHelpers";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "diplomna_db",
  synchronize: true,
  logging: false,
  entities: [
    __dirname + "/entities/**.*"
  ],
  migrations: [
    "migration/**/*.ts"
  ],
  subscribers: [
    "subscriber/**/*.ts"
  ],
  cli: {
    entitiesDir: "entities",
    migrationsDir: "migration",
    subscribersDir: "subscriber"
  }
}).then(async (connection) => {
  // const song1 = new Song();
  // song1.name = "animals";
  // song1.artist = 'art';
  // song1.created = new Date();
  // await connection.manager.save(song1);

  // const song2 = new Song();
  // song2.name = "zoo";
  // song2.artist = 'art';
  // song2.created = new Date();
  // await connection.manager.save(song2);

  // const playlist = new Playlist();
  // playlist.created = new Date();
  // playlist.user = 'asd';
  // playlist.name = 'asd';
  // playlist.modified = new Date();
  // playlist.songs = [song1, song2];
  // await connection.manager.save(playlist);

  /****************************************************
   *  Spotify API Routes
   ***************************************************/

  app.post("/spotifyapi/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken,
    });

    spotifyApi
      .refreshAccessToken()
      .then((data) => {
        res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn,
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  });

  app.post("/spotifyapi/login", (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    spotifyApi
      .authorizationCodeGrant(code)
      .then((data) => {
        res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in,
          success: true,
        });
      })
      .catch((err) => {
        res.sendStatus(400);
      });
  });

  /****************************************************
   *  User Authentication routes
   ***************************************************/

  app.post("/register", async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!(email && password && firstName && lastName)) {
        return res.json({ error: true, message: "All input is required"});
      }

      const oldUser = await connection.manager
        .getRepository(User)
        .findOne({ email });

      if (oldUser) {
        return res.json({ error: true, message: "User Already Exist. Please Login"});
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await connection.manager.getRepository(User).create({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
      });

      const token = jwt.sign(
        { userId: user.id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );
      user.token = token;
      user.created = new Date();
      user.lastLogin = new Date();

      await connection.manager.getRepository(User).save(user);

      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!(email && password)) {
        return res.json({ error: true, message: "All input is required"});
      }
      const user = await connection.manager
        .getRepository(User)
        .findOne({ email }) as User & Record<string, any>;

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user.id, email },
          process.env.TOKEN_KEY,
          { expiresIn: "2h" }
        );

        // save user token
        user.token = token;
        user.success = true;

        // user
        res.status(200).json(user);
        return;
      }
      res.json({ error: true, message: "Invalid Credentials"});
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/refresh", auth, function (req, res) {
    const token = jwt.sign(
      { userId: req.user.id || req.user.user_id, email: req.user.email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    res.status(201).json({ token });
  });

  app.post("/session-alive", auth, (_, res) => {
    res.status(200).json({ authenticated: true, success: true });
  });

  /****************************************************
   *  Playlist Routes
   ***************************************************/

  app.get("/playlist/create", auth, async (req, res) => {
    const { name } = req.query;
    try {
      const user = await connection.manager.findOne(User, {
        where: { id: req.user.user_id },
      });  
  
      const playlist = new Playlist();
      playlist.user = user;
      playlist.name = name;
      playlist.created = new Date();
      playlist.modified = new Date();
      await connection.manager.save(playlist);
  
      res.json({ playlist, success: true, message: `Playlist with name ${name} was created successfully` });
    } catch (err) {
      res.json({ success: false, message: `Couldn\'t create a new playlist with name ${name}` });
    }
  });

  app.get("/playlist/current-user", auth, async (req, res) => {
    const user = await connection.manager.findOne(User, {
      where: { id: req.user.user_id },
      relations: ['playlists']
    });  

    res.json({ playlists: user.playlists, success: true });
  });

  app.get("/playlist/:id", auth, async (req, res) => {
    const playlist = await connection.manager.findOne(Playlist, {
      where: { id: req.params.id },
      relations: ['songs']
    });  

    res.json({ songs: playlist ? playlist.songs : [], success: true });
  });

  app.post("/playlist/add-song", auth, async (req, res) => {
    const playlist = await connection.manager.findOne(Playlist, {
      where: { id: req.body.playlistId },
      relations: ['songs']
    });

    let song = await connection.manager.findOne(Song, {
      where: { id: req.body.track.uri },
    });

    if (!song) {
      const { track } = req.body;
      song = new Song();
      song.artist = track.artist;
      song.id = track.uri;
      song.title = track.title;
      song.albumUrl = track.albumUrl;
      song.created = new Date();
      await connection.manager.save(song);
    }

    playlist.songs.push(song);
    await connection.manager.save(playlist);

    res.json({ success: true, message: 'Song added to playlist' });
  });

  app.post("/playlist/remove-song/:id", auth, async (req, res) => {
    const playlist = await connection.manager.findOne(Playlist, {
      where: { id: req.body.playlistId },
      relations: ['songs']
    });

    playlist.songs = playlist.songs.filter((song) => song.id !== req.body.track.uri);
    await connection.manager.save(playlist);

    res.json({ success: true, message: 'Song added to playlist' });
  });

  app.get("/playlist/delete/:id", auth, async (req, res) => {
    const playlist = await connection.manager.findOne(Playlist, {
      where: { id: req.params.id },
      relations: ['user'],
    });  

    if (req.user.user_id === playlist.user.id) {
      await connection.manager.remove(Playlist, playlist);
      res.json({ success: true, message: `Playlist ${playlist.name} deleted successfully` });
      return;
    };

    res.json({ success: false, message: `You don't own ${playlist.name} Playlist` });
  });

  /****************************************************
   *  Song Routes
   ***************************************************/

   app.get("/playlist/delete/:id", auth, async (req, res) => {
    const playlist = await connection.manager.findOne(Playlist, {
      where: { id: req.params.id },
      relations: ['user'],
    });  

    if (req.user.user_id === playlist.user.id) {
      await connection.manager.remove(Playlist, playlist);
      res.json({ success: true, message: `Playlist ${playlist.name} deleted successfully` });
      return;
    };

    res.json({ success: false, message: `You don't own ${playlist.name} Playlist` });
  });


  /****************************************************
   *  Chart Routes
   ***************************************************/

  app.post('/chart/user-plays/', auth, async (req, res) => {
    let song = await connection.manager.findOne(Song, {
      where: { id: req.body.uri },
    });

    if (!song) {
      const track = req.body;
      song = new Song();
      song.artist = track.artists;
      song.id = track.uri;
      song.title = track.title || track.name;
      song.albumUrl = track.image;
      song.created = new Date();
      await connection.manager.save(song);
    }
    
    getAllCharts().forEach(async ({ id, from, to, name }) => {
      let chart = await connection.manager.findOne(Chart, {
        where: { id },
        relations: ['songs'],
      });

      console.log(chart);
      

      if (!chart) {
        chart = new Chart();
        chart.name = name;
        chart.id = id;
        chart.from = from;
        chart.to = to;
        chart.songs = [song];
      } else if (chart.songs.indexOf(song) === -1) {
        chart.songs.push(song);
      }

      try {
        let saved = await connection.manager.save(Chart, chart);
        let c = '1';
      } catch (e) {
        let a = e;
        let b = '';
      }

      let songListened = await connection.manager.findOne(SongListened, {
        where: { chartId: chart.id, songId: song.id },
      });

      if (!songListened) {
        songListened = new SongListened();
        songListened.chartId = chart.id;
        songListened.songId = song.id;
        songListened.listened = 0;
      }

      songListened.listened += 1;

      try {
        let h = await connection.manager.save(SongListened, songListened);
        let fg = '';
      } catch (e) {
        let asd = e;
        let asdasd = '1';
      }
    });

    res.json({ success: true });
  });

  app.listen(4000, () => {
    console.log("Running on port 4000");
  });
});
