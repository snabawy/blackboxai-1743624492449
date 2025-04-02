const db = require('../db_sqlite');
const crypto = require('crypto-js');

class User {
  static create({ email, password, firstName, lastName, role }) {
    const hashedPassword = crypto.MD5(password).toString();
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (email, password, first_name, last_name, role) 
         VALUES (?, ?, ?, ?, ?)`,
        [email, hashedPassword, firstName, lastName, role],
        function(err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  static async verifyPassword(user, password) {
    const hashedPassword = crypto.MD5(password).toString();
    return user.password === hashedPassword;
  }
}

module.exports = User;