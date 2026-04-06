const { Router } = require('express');
const { body } = require('express-validator');
const { getUser, updateUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = Router();

// Validation for updateUser — all fields optional
const updateValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('year')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Year must be between 1 and 5'),
  body('Department')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Department too long'),
  body('Age')
    .optional()
    .isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
];

// @GET /api/user/getuser  — Protected
router.get('/getuser', verifyToken, getUser);

// @PATCH /api/user/updateuser — Protected
router.patch('/updateuser', verifyToken, updateValidation, updateUser);

module.exports = router;
