const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistdb",{useNewUrlParser: true});
const itemSchema = {
  name: String
};
const Item = mongoose.model("Item",itemSchema);
const first = new Item({name: "Go For a Walk"});
const second = new Item({name: "Buy Groceries"});
const third = new Item({name: "Study Economics"});
const defaultlist = [first,second,third];

const listSchema = {
  name:String,
  listitem:[itemSchema]
};
const List = mongoose.model("List",listSchema);


app.get("/",function(req,res){
  Item.find({},function(err,result){
    if(result.length === 0){
      Item.insertMany(defaultlist,function(err){});
    }
    res.render("list",{din:"Today", newTask:result});
  });
});

app.get("/:customurl",function(req,res){
  const custompage = _.capitalize(req.params.customurl);
  List.findOne({name:custompage},function(err,results){
    if(!err){
      if(!results){
        const list = new List({
          name: custompage,
          listitem: defaultlist
        });
        list.save();
        res.redirect("/"+custompage);
      }
      else{
        res.render("list",{din:results.name, newTask:results.listitem});
      }
    }
  });
})

app.post("/",function(req,res){
  const kaam = req.body.task;
  const mylist = req.body.listname;
  const item = new Item({name: kaam});

  if(mylist === "Today"){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:mylist},function(err,foundlist){
      foundlist.listitem.push(item);
      foundlist.save();
      res.redirect("/"+mylist);
    });
  }
});

app.post("/delete",function(req,res){
    const old=req.body.oldtask;
    const listname=req.body.listname;
    if(listname==="Today"){
      Item.findByIdAndRemove(old,function(err){
        if(!err){
          res.redirect("/");
        }
      });
    }
    else{
      List.findOneAndUpdate({name:listname},{$pull :{listitem:{_id:old}}},function(err,foundlist){
        if(!err){
          res.redirect("/"+listname);
        }
      });
    }
});

app.listen(3000,function(){
  console.log("server started");
});
