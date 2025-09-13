const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Get token from Authorization header (Bearer <token>) or from session (if using sessions for login)
    const token = req.header('Authorization')?.replace('Bearer ', '')
        || req.session?.token; // Optional: add this line to support session

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Use your JWT secret ("fingerprint_customer" or process.env.JWT_SECRET)
        const decoded = jwt.verify(token, "fingerprint_customer");
        req.user = decoded; // Attach decoded user info to the request
        next(); // Proceed to the next route handler
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
