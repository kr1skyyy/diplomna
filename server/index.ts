require("dotenv").config();
import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from './entities/User';
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

createConnection().then(async (connection) => {
  app.post("/spotifyapi/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken,
    });

    spotifyApi
      .refreshAccessToken()
      .then(data => {
        res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn,
        });
      })
      .catch(err => {
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
      .then(data => {
        res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in,
        });
      })
      .catch(err => {
        res.sendStatus(400);
      });
  });

  app.post("/register", async (req, res) => {   
    try {
      const { firstName, lastName, email, password } = req.body;

      if (!(email && password && firstName && lastName)) {
        res.status(400).send("All input is required");
      }

      const oldUser = await connection.manager.getRepository(User).findOne({ email });

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
      const user = await connection.manager.getRepository(User).findOne({ email });

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

  app.post('/refresh', auth, function (req, res) {
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    res.status(201).json({ token });
  });

  app.post('/session-alive', auth, (_, res) => {
    res.status(200).json({ authenticated: true });
  });

  // app.get('/playlist', auth, (req, res) => {

  // });

  app.listen(4000, () => {
    console.log('Running on port 4000');
  });
});