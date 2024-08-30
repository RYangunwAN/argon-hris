const Attendance = require('../model/AttendanceModel.js');
const path = require('path');
const fs = require('fs');

const createAttendance = async (req, res) => {
    const { date, checkIn, checkOut, userId } = req.body;
    const photo = req.file ? req.file.buffer : null; 

    try {
        const newAttendance = await Attendance.create({ date, checkIn, checkOut, photo, userId });
        res.status(201).json(newAttendance);
    } catch (error) {
        console.error('Error creating attendance record:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const getAttendanceByUser = async (req, res) => {
    const { userId } = req.query;

    try {
        const attendanceRecords = await Attendance.findAll({ where: { userId } });

        const recordsWithBase64 = attendanceRecords.map(record => ({
            ...record.toJSON(),
            photo: record.photo ? `data:image/jpeg;base64,${record.photo.toString('base64')}` : null
        }));

        res.status(200).json(recordsWithBase64);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};


const updateAttendance = async (req, res) => {
    const { id } = req.params;
    const { date, checkIn, checkOut, photo } = req.body;

    try {
        const [updated] = await Attendance.update({ date, checkIn, checkOut, photo }, { where: { id } });
        if (updated) {
            res.status(200).json({ msg: 'Attendance record updated' });
        } else {
            res.status(404).json({ msg: 'Attendance record not found' });
        }
    } catch (error) {
        console.error('Error updating attendance record:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

const deleteAttendance = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Attendance.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ msg: 'Attendance record deleted' });
        } else {
            res.status(404).json({ msg: 'Attendance record not found' });
        }
    } catch (error) {
        console.error('Error deleting attendance record:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { createAttendance, getAttendanceByUser, updateAttendance, deleteAttendance };
