var express = require('express');
var router = express.Router();
var express = require("express");
var bodyParser = require('body-parser');
var showdown = require('showdown');
var session = require('express-session');
var fs = require("fs");
var _ = require('underscore');
var racci = require('racci')
var systemdb = require('./systemdb')


var docs = JSON.parse(fs.readFileSync("./docs/docs.json"))

racci.Parser.import(docs)

racci.Parser.init("full", ["lyrics", "singer", "composer", 'songwritter', 'album'], [1, 20, 3, 2, 1])

racci.Parser.init("singer", "singer", "commit_count")

racci.Parser.init("composer", "composer", "commit_count")

racci.Parser.init("writer", "songwritter", "commit_count")



var search = new racci.Search()


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
    article = racci.Search.search("full", "流星雨", 1, 0)
    if (req.session.user) {
        res.render('index', {
            title: 'Miqi',
            username: req.session.user.username,
            article: article.slice(0, 40),
            login: true

        })
    } else {
        console.log('not login')
        res.render('index', {
            title: 'Miqi',
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

    var article = racci.db.get("_docs")[id]

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