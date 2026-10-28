import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
   const { name, email, password } = req.body;

   // Validate input
   if (!name || !email || !password) {
      return res.status(400).json({
         message: "Name, email and password are required",
      });
   }

   try {
      // Check if email already exist
      const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

      if (existingUser.rows.length > 0) {
         return res.status(400).json({
            message: "Email already registered",
         });
      }

      //Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      //Insert new user
      const result = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email", [
         name,
         email,
         hashedPassword,
      ]);

      const newUser = result.rows[0];

      res.status(201).json({
         message: "User registered successfully",
         user: newUser,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
   }
};

export const login = async (req, res) => {
   const { email, password } = req.body;

   //Validate input

   if (!email || !password) {
      return res.status(400).json({
         message: "Email and password are required",
      });
   }

   try {
      //Check if users exists
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

      if (result.rows.length === 0) {
         return res.status(401).json({
            message: "Invalid email or password",
         });
      }

      const user = result.rows[0];

      // Compare password
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
         return res.status(401).json({
            message: "Invalid email or password",
         });
      }

      //Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.json({
         message: "Login successful",
         token,
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
         },
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
   }
};

export const updateProfile = async (req, res) => {
   const { name } = req.body;
   const userId = req.user.id;

   if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
   }

   try {
      const result = await pool.query("UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email", [name.trim(), userId]);

      res.json({
         message: "Profile updated successfully",
         user: result.rows[0],
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
   }
};

export const changePassword = async (req, res) => {
   const { currentPassword, newPassword } = req.body;
   const userId = req.user.id;

   if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
   }

   if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
   }

   try {
      const result = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);

      const validPassword = await bcrypt.compare(currentPassword, result.rows[0].password);

      if (!validPassword) {
         return res.status(400).json({ message: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);

      res.json({ message: "Password changed successfully" });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
   }
};
