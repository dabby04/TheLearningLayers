const mongoose=require('mongoose'); //use to import MongoDB methods

//creating the schema for our model
const grades = new mongoose.Schema({
    studentNum: { type: Number },
    course:{type: String},
    assignmentGrades: [{
        assignmentName: String,
        grade: Number
    }],
    quizGrades:[{
        quizName: String,
        grade:Number
    }]
}, { collection: 'grades' });

const Grades = mongoose.model('Grades', grades); //creating that model in our database

module.exports=Grades; //exporting it so it can be used in any other class