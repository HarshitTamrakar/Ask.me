let mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/quoraDB");
// mongoose.connect("mongodb+srv://admin-harshit:Test123@cluster0.ybqjn.mongodb.net/quoraDB");

const answerSchema = mongoose.Schema({
  answer: String,
  url: String,
  upvotes: Number,
  downvotes: Number
});

const questionSchema = mongoose.Schema({
  title: String,
  description: String,
  imageURL: String,
  answers: [answerSchema]
});

const Question = new mongoose.model("Question", questionSchema);

exports.insertQuestion = function(object){
  let question = new Question(object);
  question.save();
}

exports.getAllQuestions = function(callback) {
  Question.find(function(err, questions) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, questions);
    }
  });
}

exports.getQuestion = function(id, callback){
  Question.findById(id, function(err, question) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, question);
    }
  });
}

exports.insertAnswer = function(id, answerText, answerImageURL){
  let answer = {
    answer: answerText,
    url: answerImageURL,
    upvotes: 0,
    downvotes: 0
  }
  Question.findOne({_id: id}, function(err, result){
    if(err){
      console.log(err);
    }else{
      result.answers.push(answer);
      result.save();
    }
  });
}

exports.updateUpvotes = function(questionId, answerId){
  Question.findOne({_id: questionId}, function(err, result){
    if(err){
      console.log(err);
    }else{
      result.answers.forEach(function(answer){
        if(String(answer._id) === String(answerId)){
          answer.upvotes += 1;
        }
      });
      result.save();
    }
  })
}

exports.updateDownvotes = function(questionId, answerId){
  Question.findOne({_id: questionId}, function(err, result){
    if(err){
      console.log(err);
    }else{
      result.answers.forEach(function(answer){
        if(String(answer._id) === String(answerId)){
          answer.downvotes += 1;
        }
      });
      result.save();
    }
  })
}

exports.deleteQuestion = function(questionId){
  Question.findByIdAndDelete(questionId, function(err){
    console.log(err);
  });
}
