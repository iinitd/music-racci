var express = require('express');
var router = express.Router();
var express = require("express");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var showdown = require('showdown');
var session = require('express-session');
var fs = require("fs");
var _ = require('underscore');
var mango = require('mango')
var systemdb = require('./systemdb')

//mongoose.connect('mongodb://m:m@ds127928.mlab.com:27928/mustaxu');
mongoose.connect('mongodb://127.0.0.1/test');

// var parser = mango.Parser.init("full",docs,"doc_id",["lyrics","singer","composer",'songwritter','album'],[1,20,3,2,1])

// var idx_singer = mango.Parser.field_idx("singer",docs,"doc_id",["singer"],"commit_count")

// var idx_composer = mango.Parser.field_idx("composer",docs,"doc_id",["composer"],"commit_count")

// var idx_writer = mango.Parser.field_idx("writer",docs,"doc_id",["songwritter"],"commit_count")

// console.log(mango.db.get("full_idx"))

var search = new mango.Search()


router.use(bodyParser.json());
router.use(bodyParser.urlencoded());

router.use(session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: {
        maxAge: 60 * 1000 * 1000
    }
}));

router.use(function(req, res, next) {
    res.locals.user = req.session.user; // 从session 获取 user对象
    var err = req.session.error; //获取错误信息
    delete req.session.error;
    res.locals.message = ""; // 展示的信息 message
    if (err) {
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">' + err + '</div>';
    }
    next(); //中间件传递
});


/* GET home page. */

router.get('/', function(req, res, next) {

    //res.send("hh")
    article = search.offline.query("流星雨", "large")
    if (req.session.user) {
        res.render('index', {
            title: 'Seagull',
            username: req.session.user.username,
            article: article.slice(0, 40),
            login: true

        })
    } else {
        console.log('not login')
        res.render('index', {
            title: 'Seagull',
            username: '游客',
            article: article.slice(0, 40)
        })
    }

});



router.get('/song/:id', function(req, res) {

    var id = req.params.id;
    var from = req.query.from

    if (req.session.user) {
        if (req.session.user.favorite[id]) req.session.user.favorite[id]++
            else req.session.user.favorite[id] = 1
        if (from) req.session.user.history[from] = id
        systemdb.set(req.session.user.username, req.session.user)
        console.log(req.session.user)
        console.log("this", systemdb.get(req.session.user.username))
    }

    var article = mango.db.get("large_docs")[id]

    res.render('song', {
        user: req.session.user,
        title: article.title,
        article: article,
        lyrics: article.lyrics.replace(/ /g, '<br/>')
    })

});

router.get('/404/', function(req, res) {

    var query = req.query.text || "流星雨";

    res.render('404')



});

module.exports = router;