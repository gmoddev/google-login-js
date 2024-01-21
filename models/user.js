const bcrypt = require('bcrypt');
const connection = require('../config/mysql-config');

function getUserById(id, callback) {
  connection.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
    if (error) return callback(error, null);

    if (results.length === 0) {
      return callback(null, null);
    }

    const user = results[0];
    return callback(null, user);
  });
}

function getUserByUsername(username, callback) {
  connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) return callback(error, null);

    if (results.length === 0) {
      return callback(null, null);
    }

    const user = results[0];
    return callback(null, user);
  });
}

function createUser(username, password, callback) {
  bcrypt.hash(password, 10, (error, hashedPassword) => {
    if (error) return callback(error);

    const newUser = {
      username: username,
      password: hashedPassword,
    };

    connection.query('INSERT INTO users SET ?', newUser, (error, results) => {
      if (error) return callback(error);

      newUser.id = results.insertId;
      return callback(null, newUser);
    });
  });
}

module.exports = { getUserById, getUserByUsername, createUser };
