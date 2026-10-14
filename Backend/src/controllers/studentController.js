
const pool = require("../config/db");

async function getStudents(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, class_name, created_at
       FROM students
       ORDER BY id DESC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

async function createStudent(req, res, next) {
  try {
    const { full_name, email, class_name } = req.body;

    if (
      typeof full_name !== "string" || !full_name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof class_name !== "string" || !class_name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and class are required.",
      });
    }

    const result = await pool.query(
      `INSERT INTO students (full_name, email, class_name)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, class_name, created_at`,
      [full_name.trim(), email.trim(), class_name.trim()]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This email already exists.",
      });
    }

    next(error);
  }
}

module.exports = { getStudents, createStudent };
