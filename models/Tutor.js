const sql = require('mssql');
const connectDB = require('../config/db'); // Assuming db.js is where connectDB is defined

class Tutor {
  constructor({ userID, tutorID, degrees, identityCard, workplace, description}) {
    this.userID = userID;
    this.tutorID = tutorID;

    this.degrees = degrees;
    this.identityCard = identityCard;   
    this.workplace = workplace;
    this.description = description;
   
  }
  static async createTutorID() {
    await connectDB();
    const result = await sql.query`SELECT tutorID FROM Tutors ORDER BY tutorID DESC`;
    if (!result.recordset[0]) {
      let id = "T1";
      return id;
    } else {
      let id = result.recordset[result.recordset.length - 1].classID;
      const alphabet = id.match(/[A-Za-z]+/)[0];
      const number = parseInt(id.match(/\d+/)[0]) + 1;
      id = alphabet + number;
      return id;
    }
  }

  static async createTutor(userId, tutorData) {
    try {
      await connectDB(); // Ensure database connection
      const tutorID = await this.createTutorID();
      await sql.query`
        INSERT INTO Tutors (userID, tutorID, degrees, identityCard, workplace, description)
        VALUES (${userId}, ${tutorID}, ${tutorData.degrees}, ${tutorData.identityCard}, 
                ${tutorData.workplace}, ${tutorData.description});
      `;
      return new Tutor({
        ...tutorData,
        
      });
    } catch (error) {
      console.error('Error creating tutor:', error);
      throw error;
    }
  }
}

module.exports = Tutor;
