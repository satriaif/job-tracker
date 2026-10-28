import pool from "../config/db.js";

const VALID_STATUSES = ["Wishlist", "Applied", "HR Review", "Interview", "Offer", "Accepted", "Rejected", "Withdrawn"];

const VALID_CONTRACT_TYPES = ["Full Time", "Part Time", "Internship", "Freelance"];

// GET all applications
export const getApplications = async (req, res) => {
   try {
      const result = await pool.query("SELECT * FROM job_applications WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id]);

      res.json(result.rows);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
   }
};

// GET single application
export const getApplication = async (req, res) => {
   try {
      const result = await pool.query("SELECT * FROM job_applications WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);

      if (result.rows.length === 0) {
         return res.status(404).json({ message: "Application not found" });
      }

      res.json(result.rows[0]);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
   }
};

// POST create application
export const createApplication = async (req, res) => {
   const { company_name, position, location, contract_type, salary, status, date_applied, close_date, job_source, notes } = req.body;

   if (!company_name || !position) {
      return res.status(400).json({
         message: "Company name and position are required",
      });
   }

   if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
         message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
   }

   if (contract_type && !VALID_CONTRACT_TYPES.includes(contract_type)) {
      return res.status(400).json({
         message: `Invalid contract type. Must be one of: ${VALID_CONTRACT_TYPES.join(", ")}`,
      });
   }

   try {
      const result = await pool.query(
         `INSERT INTO job_applications
            (user_id, company_name, position, location, contract_type, salary, status, date_applied, close_date, job_source, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
         [req.user.id, company_name, position, location, contract_type, salary, status || "Wishlist", date_applied, close_date, job_source, notes],
      );

      res.status(201).json(result.rows[0]);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
   }
};

// PUT update application
export const updateApplication = async (req, res) => {
   const { company_name, position, location, contract_type, salary, status, date_applied, close_date, job_source, notes } = req.body;

   if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
         message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
   }

   try {
      const existing = await pool.query("SELECT * FROM job_applications WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);

      if (existing.rows.length === 0) {
         return res.status(404).json({ message: "Application not found" });
      }

      const current = existing.rows[0];

      const result = await pool.query(
         `UPDATE job_applications SET
                company_name = $1, position = $2, location = $3,
                contract_type = $4, salary = $5, status = $6,
                date_applied = $7, close_date = $8, job_source = $9,
                notes = $10, updated_at = CURRENT_TIMESTAMP
            WHERE id = $11 AND user_id = $12
            RETURNING *`,
         [
            company_name || current.company_name,
            position || current.position,
            location || current.location,
            contract_type || current.contract_type,
            salary || current.salary,
            status || current.status,
            date_applied || current.date_applied,
            close_date || current.close_date,
            job_source || current.job_source,
            notes || current.notes,
            req.params.id,
            req.user.id,
         ],
      );

      res.json(result.rows[0]);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
   }
};

// DELETE application
export const deleteApplication = async (req, res) => {
   try {
      const result = await pool.query("DELETE FROM job_applications WHERE id = $1 AND user_id = $2 RETURNING *", [req.params.id, req.user.id]);

      if (result.rows.length === 0) {
         return res.status(404).json({ message: "Application not found" });
      }

      res.json({ message: "Application deleted successfully" });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
   }
};
