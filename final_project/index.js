const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const secretKey = "I'mHamedNAJANDAFullstackJSDeveloperAfterThisCourseOn20260115"

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: secretKey, resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers['authorization']

    if (!authHeader)
        return res.status(403).json({ "message": "User not logged in!" })
    const token = authHeader.split(" ")[1]

    if (!token)
        return res.status(403).json({ "message": "User not logged in!" })


    jwt.verify(token, secretKey, (err, decoded) => {
        if (err)
            return res.status(403).json({ "message": 'Access denied!' })
        else {
            req.username = decoded.username
            next()
        }
    })

});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
