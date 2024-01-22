const express = require('express');
const router = express.Router();
let { check, query } = require('express-validator');
const { fetchEmployees, registerFaceData, markAttendance, fetchAttendance } = require('../Controller/attendanceController');

router.get('/faces', fetchEmployees);

router.post('/faces', [
    check('data').isArray({ min: 1, max: 20 }).withMessage('Invalid request body'),
    check('data.*.emp_id').trim().notEmpty().withMessage('employee id is mandatory').isInt().withMessage('invalid employee id'),
    check('data.*.faceData').isArray({ min: 1, max: 130 }).withMessage('Invalid face data'),
], registerFaceData);

router.post('/attendance', [
    check('data').isArray({ min: 1, max: 20 }).withMessage('Invalid request body'),
    check('data.*.emp_id').trim().notEmpty().withMessage('employee id is mandatory').isInt().withMessage('invalid employee id'),
    check('data.*.dateTime').trim().notEmpty().withMessage('timestamp is mandatory').isISO8601().toDate().withMessage('invalid timestamp'),
], markAttendance);

router.get('/attendance', [
    query('date').trim().notEmpty().withMessage('date is mandatory')
], fetchAttendance);

module.exports = router;
