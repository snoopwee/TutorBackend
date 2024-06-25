const sql = require('mssql');
const dbConfig = require('./config/db'); // adjust path as needed

const findByEmail = async (email) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    return result.recordset[0]; // assuming one user per email
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error; // propagate the error to the caller
  }
};

module.exports = {
  findByEmail
  // other methods like create, comparePassword, etc.
};
