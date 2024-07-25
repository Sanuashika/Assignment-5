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

function getStudentByNum(id) {
    return new Promise((resolve, reject) => {
        var course = null;
        for(let i = 0; i < dataCollection.students.length ; i++ ){
            if (dataCollection.students[i].studentNum == id) {
                course = dataCollection.students[i];
                break;
            }
            
        }
        if (!course) {
            reject("no results returned");
        } else {
            resolve(course);
        }
    });
}

function getCourseById(id) {
    return new Promise((resolve, reject) => {
        var course = null;
        for(let i = 0; i < dataCollection.courses.length ; i++ ){
            if (dataCollection.courses[i].courseId == id) {
                course = dataCollection.courses[i];
                break;
            }
            
        }
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

// function getStudentByNum(num) {
//     return new Promise((resolve, reject) => {
//         const student = dataCollection.students.find(student => student.studentNum === num);
//         if (!student) {
//             reject("no results returned");
//         } else {
//             resolve(student);
//         }
//     });
// }

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

function updateStudent(student) {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("data not initialized");
            return;
        }

        // Add the new student to the students array
        dataCollection.students[student.studentNum] = student;
        resolve();
        // Save the updated students array back to the students.json file
    });
}
module.exports = {updateStudent,  initialize, getAllStudents, getTAs, getCourses, getCourseById, getStudentsByCourse, getStudentByNum, addStudent };