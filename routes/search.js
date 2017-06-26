var express = require('express');
var router = express.Router();
var express = require("express");
var bodyParser = require('body-parser');
var showdown = require('showdown');
var session = require('express-session');
var fs = require("fs");
var _ = require('underscore');
var racci = require('racci')

//mongoose.connect('mongodb://m:m@ds127928.mlab.com:27928/mustaxu');

// var parser = racci.Parser.init("full",docs,"doc_id",["lyrics","singer","composer",'songwritter','album'],[1,20,3,2,1])

// var idx_singer = racci.Parser.field_idx("singer",docs,"doc_id",["singer"],"commit_count")

// var idx_composer = racci.Parser.field_idx("composer",docs,"doc_id",["composer"],"commit_count")

// var idx_writer = racci.Parser.field_idx("writer",docs,"doc_id",["songwritter"],"commit_count")

// console.log(racci.db.get("full_idx"))

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


router.get('/', function(req, res) {

    var query = req.query.text || "流星雨";

    article = racci.Search.search("full", query, 1, 0)

    if (!article || !article[0]) res.redirect('/404')

    if (req.session.user) {
        var history = req.session.user.history
        var sorted = []
        if (history[query]) {
            var target = {}
            sorted = article.filter((o) => {
                if (o.doc_id == history[query]) return !(target = o)
                else return o.doc_id !== history[query]
            })
            sorted.unshift(target)
        }

        res.render('search_list', {
            title: query + " - 自由搜 - Miqi",
            username: req.session.user.username,
            article: sorted.length > 0 ? sorted : article,
            length: article.length,
            login: true,
            query: query

        })
    } else {
        console.log('not login')
        res.render('search_list', {
            title: query + " - 自由搜 - Miqi",
            username: '游客',
            article: article,
            length: article.length,
            query: query
        })
    }



});

router.get('/404/', function(req, res) {

    var query = req.query.text || "流星雨";

    res.render('404')



});

router.get('/singer/', function(req, res) {

    var query = req.query.text || "HUSH";

    article = racci.Search.search("singer", query, 1, 0)

    if (!article[0]) res.redirect('/404')


    if (req.session.user) {
        res.render('search_singer', {
            title: query + " - 搜歌手 - Miqi",
            username: req.session.user.username,
            article: article.sort(function(a, b) {
                var sa = req.session.user.favorite[a.doc_id] || 0
                var sb = req.session.user.favorite[b.doc_id] || 0
                return sb - sa
            }),
            login: true,
            length: article.length,
            query: query

        })
    } else {
        console.log('not login')
        res.render('search_singer', {
            title: query + " - 搜歌手 - Miqi",
            username: '游客',
            article: article,
            length: article.length,
            query: query
        })
    }



});

router.get('/writer/', function(req, res) {

    var query = req.query.text || "方文山";

    article = racci.Search.search("writer", query, 1, 0)

    if (!article[0]) res.redirect('/404')


    if (req.session.user) {
        res.render('search_writer', {
            title: query + " - 搜作词 - Miqi",
            username: req.session.user.username,
            article: article.sort(function(a, b) {
                var sa = req.session.user.favorite[a.doc_id] || 0
                var sb = req.session.user.favorite[b.doc_id] || 0
                return sb - sa
            }),
            login: true,
            length: article.length,
            query: query

        })
    } else {
        console.log('not login')
        res.render('search_writer', {
            title: query + " - 搜作词 - Miqi",
            username: '游客',
            article: article,
            length: article.length,
            query: query
        })
    }



});

router.get('/composer/', function(req, res) {

    var query = req.query.text || "周杰伦";

    article = racci.Search.search("composer", query, 1, 0)

    if (!article[0]) res.redirect('/404')


    if (req.session.user) {
        res.render('search_composer', {
            title: query + " - 搜作曲 - Miqi",
            username: req.session.user.username,
            article: article.sort(function(a, b) {
                var sa = req.session.user.favorite[a.doc_id] || 0
                var sb = req.session.user.favorite[b.doc_id] || 0
                return sb - sa
            }),
            login: true,
            length: article.length,
            query: query

        })
    } else {
        console.log('not login')
        res.render('search_composer', {
            title: query + " - 搜作曲 - Miqi",
            username: '游客',
            article: article,
            length: article.length,
            query: query
        })
    }



});

module.exports = router;