const express = require("express");
const bodyparser = require("body-parser");
const app = express();
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
let items = ["10 DSA Questions","Make a WEBD Project","Buy Groceries"];
app.get("/",function(req,res){
  let today =new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleDateString("en-US",options);
  res.render("list",{din:day, newTask:items});
});

app.post("/",function(req,res){
  let kaam = req.body.task;
  items.push(kaam);
  res.redirect("/");
});

app.listen(3000,function(){
  console.log("server started");
});
