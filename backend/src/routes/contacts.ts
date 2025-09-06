import { Router } from "express";

const router = Router();

// Example endpoint
router.get("/", (req, res) => {
  res.send("Contacts route working 🚀");
});

// ✅ Export default
export default router;
