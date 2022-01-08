require("dotenv").config();
import "reflect-metadata";
import auth from "./middleware/auth";
import { createConnection } from "typeorm";
import { User, Playlist, Song } from "./entities/index";

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

createConnection().then(async (connection) => {
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
        res.status(400).send("All input is required");
      }

      const oldUser = await connection.manager
        .getRepository(User)
        .findOne({ email });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await connection.manager.getRepository(User).create({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
      });

      // Create token
      const token = jwt.sign(
        { userId: user.id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );
      // save user token
      user.token = token;
      user.created = new Date();
      user.lastLogin = new Date();

      await connection.manager.getRepository(User).save(user);

      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      const user = await connection.manager
        .getRepository(User)
        .findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user.id, email },
          process.env.TOKEN_KEY,
          { expiresIn: "2h" }
        );

        // save user token
        user.token = token;

        // user
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
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
    res.status(200).json({ authenticated: true });
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

    res.json({ playlists: user.playlists });
  });

  app.listen(4000, () => {
    console.log("Running on port 4000");
  });
});
