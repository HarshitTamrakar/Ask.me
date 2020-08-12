let express = require('express');
let bodyParser = require('body-parser');
let db = require("./modules/database");

let app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));

const port = process.env.PORT || 3000;
const sample_image = "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg";

app.get("/home", function(req, res){
  db.getAllQuestions(function(err, questionList){
    if(err){
      console.log(err);
    }else{
      questionList.forEach(function(question){
        if(!question.questionImageURL){
          question.questionImageURL = sample_image;
          question.save();
        }
      });
      res.render("pages/home", {
        questionList: questionList
      });
    }
  })
});

app.get("/", function(req, res){
  res.redirect("/home");
});

app.get("/add-question", function(req, res){
  res.render("pages/add-question");
});

app.post("/add-question", function(req, res){
  let questionBody = req.body;
  let questionTitle = questionBody.questionTitle;
  let questionDescription = questionBody.questionDescription;
  let questionURL = questionBody.questionImageURL;
  console.log(questionBody);
  if(questionURL == ""){
    questionURL = sample_image;
  }
  let question = {
    title: questionTitle,
    description: questionDescription,
    imageURL: questionURL
  };
  db.insertQuestion(question);
  res.redirect("/home");
});

app.get("/add-answer/:id", function(req, res){
  let id = req.params.id;
  db.getQuestion(id, function(err, question){
    if(err){
      console.log(err);
    }else{
      res.render("pages/add-answer", {
        question: question
      })
    }
  })
});

app.post("/add-answer/", function(req, res){
  let body = req.body;
  let id = body.submit;
  let answerText = body.answer;
  let answerImageURL = body.answerImageURL;
  console.log(answerImageURL);
  if(!answerImageURL){
    answerImageURL = sample_image;
  }
  db.insertAnswer(id, answerText, answerImageURL);
  res.redirect("/view/" + id);
});

app.post("/upvote/:questionID/:answerID", function(req, res){
  let questionId = req.params.questionID;
  let answerId = req.params.answerID;
  db.updateUpvotes(questionId, answerId);
  res.redirect("/view/" + questionId);
});

app.post("/downvote/:questionID/:answerID", function(req, res){
  let questionId = req.params.questionID;
  let answerId = req.params.answerID;
  db.updateDownvotes(questionId, answerId);
  res.redirect("/view/" + questionId);
});

app.get("/remove/question/:id", function(req, res){
  db.deleteQuestion(req.params.id);
  res.redirect("/home");
});

app.get("/view/:questionID", function(req, res){
  db.getQuestion(req.params.questionID, function(err, question){
    if(err){
      console.log(err);
    }else{
      res.render("pages/view-question", {
        question: question
      })
    }
  })
})

let server = app.listen(port, function(req, res){
  console.log("Server started on port " + port);
});
