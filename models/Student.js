const sql = require('mssql');
const connectDB = require('../config/db'); // Assuming db.js is where connectDB is defined

class Student {
  constructor({ userID, studentID, grade, school }) {
    this.userID = userID;
    this.studentID = studentID;
    this.grade = grade;
    this.school = school;
  }

  static async createStudentID() {
    await connectDB();
    const result = await sql.query`SELECT studentID FROM Students ORDER BY studentID DESC`;
    if (!result.recordset[0]) {
      let id = "S1";
      return id;
    } else {
      let id = result.recordset[result.recordset.length - 1].classID;
      const alphabet = id.match(/[A-Za-z]+/)[0];
      const number = parseInt(id.match(/\d+/)[0]) + 1;
      id = alphabet + number;
      return id;
    }
  }

  static async createStudent(userId, studentData) {
    try {
      await connectDB(); // Ensure database connection
      const studentID = await this.createStudentID();
      await sql.query`
        INSERT INTO Students (userID, studentID, grade, school)
        VALUES (${userId}, ${studentID}, ${studentData.grade}, ${studentData.school});
      `;
      return new Student({
        ...studentData,
        
      });
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }
}

module.exports = Student;


