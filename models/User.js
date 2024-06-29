const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const connectDB = require('../config/db'); // Assuming db.js is where connectDB is defined

dotenv.config();

class User {
  constructor({ userId, userName, fullName, email, password, avatar, dateOfBirth, role, phone, address ,active}) {
    this.userId = userId;
    this.userName = userName;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.dateOfBirth = dateOfBirth;
    this.role = role;
    this.phone = phone;
    this.address = address;
    this.active = active;
  }

  static async findByEmail(email) {
    try {
      await connectDB(); // Ensure database connection
      const result = await sql.query`
        SELECT *
        FROM Users
        WHERE email = ${email}
      `;
      if (result.recordset.length > 0) {
        return new User(result.recordset[0]);
      }
      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    try {
      await connectDB(); // Ensure database connection
      const result = await sql.query`
        INSERT INTO Users (userName, fullName, email, password, avatar, dateOfBirth, role, phone, address,active)
        VALUES (${userData.userName}, ${userData.fullName}, ${userData.email}, ${hashedPassword}, 
                ${userData.avatar}, ${userData.dateOfBirth}, ${userData.role}, ${userData.phone}, ${userData.address},${1});
        SELECT SCOPE_IDENTITY() as userID;
      `;
      const userId = result.recordset[0].userID;
      return new User({
        ...userData,
        userId,
        password: hashedPassword
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static generateAuthToken(user) {
    return jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  static async comparePassword(inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
  }
}

module.exports = User;
