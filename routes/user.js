var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var showdown = require('showdown');
var _ = require('underscore');
var racci = require('racci')
var systemdb = require('./systemdb')


/* GET users listing. */
router.get('/', function(req, res, next) {

    if (req.session.user) {

        var docs = racci.db.get("_docs")

        var favorites = []

        for (i in req.session.user.favorite) {
            if (docs[i]) favorites.push(docs[i])
        }

        console.log(favorites)


        res.render('user', {
            title: 'Mustaxu',
            user: req.session.user,
            favorite: favorites,
            login: true

        })
    } else {
        console.log('not login')
        res.render('user', {
            title: 'Mustaxu',
            user: { username: "游客" },
        })
    }

});

router.post('/login', function(req, res, next) {

    var username = req.body.username,
        password = req.body.password;

    var user = systemdb.get(username)

    if (!user) {
        console.log('username not found');
        req.session.error = '用户名不存在';
        res.redirect("/login");
    } else if (user.password != password) {
        console.log('wrong password')
        req.session.error = "密码错误";
        res.redirect("/login");
    } else {
        console.log('success')
        req.session.user = user;
        console.log(user)
        res.redirect("/");
    }


});

router.get('/login', function(req, res, next) {

    res.render('login', {})

});


router.get('/reg', function(req, res, next) {

    res.render('reg', {
        title: 'Mustaxu',
        user: req.session.user

    })

});

router.get("/logout", function(req, res) { // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    var user = req.session.user
    systemdb.set(user.username, user)
    console.log(systemdb.get(user.username))
    req.session.user = null;
    req.session.error = null;
    res.redirect("/");
});


router.post('/reg', function(req, res) {
    var username = req.body.username;
    var password = req.body.password
    systemdb.init(username, {
        username: username,
        password: password,
        favorite: { "init": 1 },
        history: { "init": 1 }
    })
    req.session.user = systemdb.get(username)
    res.redirect('/')

})



module.exports = router;