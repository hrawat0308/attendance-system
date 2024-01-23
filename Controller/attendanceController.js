const model = require('../models/index');
const { Op, fn, col } = require("sequelize");
const { validationResult, matchedData } = require('express-validator');
const moment = require('moment');

// fetch all employees
const fetchEmployees = async (req, res, next) => {
    try {
        const employees = await model.Employees.findAll({ raw: true });
        const faceData = await model.FaceData.findAll({ raw: true });
        const data = employees.map((emp) => {
            emp.faceData = [];
            for (let face of faceData) {
                if (face.emp_id == emp.emp_id) {
                    emp.faceData.push(face.faceData);
                }
            }
            emp.faceData = emp.faceData.length === 0 ? null : emp.faceData;
            return emp;
        });
        res.json({ status: 1, data });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, message: ["server error"], tech_message: [error.toString()] });
    }
}

//register face data
const registerFaceData = async (req, res, next) => {
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            return res.status(422).json({ status: 0, message: [errors.errors[0].msg], tech_message: [errors.errors[0].msg] });
        }
        const { data } = matchedData(req);
        await model.FaceData.bulkCreate(data);
        res.json({ status: 1, data, message: ["face data registered"], tech_message: ["face data registered"] });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, message: ["server error"], tech_message: [error.toString()] });
    }
}

const markAttendance = async (req, res, next) => {
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            return res.status(422).json({ status: 0, message: [errors.errors[0].msg], tech_message: [errors.errors[0].msg] });
        }
        let { data } = matchedData(req);
        data = data.map((value) => {
            console.log(value.dateTime);
            return {
                emp_id: value.emp_id,
                dateTime: new Date(value.dateTime).valueOf(),
            }
        });
        await model.Attendance.bulkCreate(data);
        res.json({ status: 1, data, message: ["user data logged"], tech_message: ["user data logged"] });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, message: ["server error"], tech_message: [error.toString()] });
    }
}

const fetchAttendance = async (req, res, next) => {
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            return res.status(422).json({ status: 0, message: [errors.errors[0].msg], tech_message: [errors.errors[0].msg] });
        }
        let { date } = req.query;
        const attendance = await model.Attendance.findAll({
            attributes: [
                'emp_id',
                [fn('min', col('dateTime')), 'checkedIn'],
                [fn('max', col('dateTime')), 'checkedOut'],
            ],
            include: { model: model.Employees, require: true, attributes: ['name', 'email'] },
            where: {
                dateTime: {
                    [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
                },
            },
            group: ['emp_id'],
        });
        res.json({ status: 1, attendance, message: ["attendance fetched"] });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, message: ["server error"], tech_message: [error.toString()] });
    }
}

module.exports = {
    fetchEmployees,
    registerFaceData,
    fetchAttendance,
    markAttendance,
}