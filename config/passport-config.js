
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const { getUserById, getUserByUsername, createUser } = require('../models/user');
const connection = require('./mysql-config');
require('dotenv').config();

function initPassport(passport, connection) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      connection.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
          return done(null, false, { message: 'Username not found' });
        }

        const user = results[0];

        try {
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password' });
          }
        } catch (error) {
          return done(error);
        }
      });
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const googleId = profile.id;

        connection.query('SELECT * FROM users WHERE google_id = ?', [googleId], (error, results) => {
          if (error) throw error;

          if (results.length === 0) {
            const newUser = {
              google_id: googleId,
            };

            connection.query('INSERT INTO users SET ?', newUser, (error, insertResults) => {
              if (error) throw error;

              newUser.id = insertResults.insertId;
              return done(null, newUser);
            });
          } else {
            const user = results[0];
            return done(null, user);
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    getUserById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = { initPassport };
