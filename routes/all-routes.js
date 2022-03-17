const express = require('express'),
    router = express.Router(),
    request = require("request"); 
const req = require('express/lib/request');
const res = require('express/lib/response');
    const jwt = require('jsonwebtoken');
    
    
// home page route
router.get('/', (req , res) => {
    var currentUser;
    if(req.cookies.token == 'null') {
        currentUser = null;
    } else {
        currentUser = jwt.verify(req.cookies.token , process.env.TOKEN_SECRET);
    }
    res.render('home/index', {currentUser: currentUser})
})

// logout route
router.get('/logout', (req , res) => {
    res.cookie('token', 'null')
    res.redirect('/');
})
    
// login route
router.get('/login', (req , res) => {    
    if(req.cookies.token == 'null') {
        res.render("login/index" , {currentUser: null, CLARISA_AUTH_URL: process.env.CLARISA_AUTH_URL, CLIENT_ID: process.env.CLIENT_ID})
    } else {
       res.redirect('/');
    }
})

// redirect accept authentication from Clarisa
router.get('/accept-login', (req , res) => {
    if(req.query.code != undefined) {
        var clientServerOptions = {
            uri: process.env.CLARISA_AUTH_URL + '/api/oauth',
            body: JSON.stringify({
                "client_id": process.env.CLIENT_ID,
                "client_secret": process.env.CLIENT_SECRET,
                "code": req.query.code
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            } 
        } 
        request(clientServerOptions, function (error, response) {
            const body = JSON.parse(response.body); 
            var clientServerOptions = {
                uri: process.env.CLARISA_AUTH_URL + '/api/oauth/me',
                body: JSON.stringify({}),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + body.access_token
                }
            }
            request(clientServerOptions,async function (error, response) {
                const token = await jwt.sign(JSON.parse(response.body), process.env.TOKEN_SECRET, { expiresIn: '1d' })
                res.cookie('token', token)
                res.redirect('/') 
            });
           
        });   
    } 
});



module.exports = router;