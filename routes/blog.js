var express = require('express');
var router = express.Router();
const { validationResult, check } = require('express-validator');
const { response } = require('../app');
const db = require('monk')('localhost:27017/TutorialDB')
// const url = 'localhost:27017/TutorialDB';
/* GET users listing. */
router.get('/', function (req, res, next) {
  req.flash("success", "ยินดีต้อนรับ");
  res.render('blog');//view
});
router.get('/add', function (req, res, next) {
  res.render('addBlog');//view
});
router.post('/add',[
  check("name", "กรุณาใส่ชื่อบทความ").not().isEmpty(),// ต้องไม่เป็นค่าว่าง
  check("description", "กรุณาใส่ชื่อเนื้อหา").not().isEmpty(),
  check("author", "กรุณาใส่ชื่อผู้แต่ง").not().isEmpty()
], function (req, res, next) {
  const result = validationResult(req);
  var errors = result.errors;
  if (!result.isEmpty()) {
    res.render('addBlog',{errors: errors});
  }else{
    //insert to db
    var ct = db.get('blogs');
    ct.insert({
      name:req.body.name,
      description:req.body.description,
      author:req.body.author
    },function(err,blog){ //ได้ err หรือ blog กลับมาจะให้ทำอะไร
      if(err){
        res.send(err);
      }else{
        req.flash("success", "บันทึกบทความสำเร็จ");
        res.location('/blog/add');
        res.redirect('/blog/add');
      }
    })
  }
});

module.exports = router;