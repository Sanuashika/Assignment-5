const fs = require('fs');
const path = require('path');

// Class to manage the data
class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../data/students.json'), 'utf8', (err, studentData) => {
            if (err) {
                reject("unable to read students.json");
                return;
            }
            let students = JSON.parse(studentData);

            fs.readFile(path.join(__dirname, '../data/courses.json'), 'utf8', (err, courseData) => {
                if (err) {
                    reject("unable to read courses.json");
                    return;
                }
                let courses = JSON.parse(courseData);
                dataCollection = new Data(students, courses);
                resolve();
            });
        });
    });
}

function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length === 0) {
            reject("no results returned");
        } else {
            resolve(dataCollection.students);
        }
    });
}

function getTAs() {
    return new Promise((resolve, reject) => {
        const tas = dataCollection.students.filter(student => student.TA === true);
        if (tas.length === 0) {
            reject("no results returned");
        } else {
            resolve(tas);
        }
    });
}

function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length === 0) {
            reject("no results returned");
        } else {
            resolve(dataCollection.courses);
        }
    });
}

function getStudentById(id) {
    return new Promise((resolve, reject) => {
        const student = dataCollection.students.find(student => student.studentId === id);
        if (!student) {
            reject("no results returned");
        } else {
            resolve(student);
        }
    });
}

function getCourseById(id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find(course => course.courseId === id);
        if (!course) {
            reject("no results returned");
        } else {
            resolve(course);
        }
    });
}

function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        const studentsByCourse = dataCollection.students.filter(student => student.course === course);
        if (studentsByCourse.length === 0) {
            reject("no results returned");
        } else {
            resolve(studentsByCourse);
        }
    });
}

function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        const student = dataCollection.students.find(student => student.studentNum === num);
        if (!student) {
            reject("no results returned");
        } else {
            resolve(student);
        }
    });
}

function addStudent(studentInfo){
    return new Promise ((resolve, reject) => {
        if (studentInfo.TA == undefined){
            studentInfo.TA = false;
        }

        studentInfo.studentNum  = dataCollection.students.length + 1
        dataCollection.students.push(studentInfo);

        resolve();
        return;
    });
}

module.exports = { initialize, getAllStudents, getTAs, getCourses, getStudentById, getCourseById, getStudentsByCourse, getStudentByNum, addStudent };