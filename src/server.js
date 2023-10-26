const express = require("express");
const app = express();

const { pool } = require("./configs/dbConfig"); 
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

const initPassport = require("./configs/passportConfig");
initPassport(passport);

const PORT =  process.env.PORT || 4000;


app.set("view engine", "ejs");


app.use(express.urlencoded({ extended: false })); // used to send details from the front-end

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
    res.render("register");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
    res.render("login");
});

app.get("/users/userDetails", checkNotAuthenticated, (req, res) => {
    res.render("userDetails", { user: req.user.name, email: req.user.email });
});

app.get("/users/logout", (req, res) => {
    req.logOut((err) => {
        if (err) throw err;
    });
    req.flash("msg_success", "You have logged out");
    res.redirect("/users/login");
});


app.post("/users/register", async (req, res) => {
    let { name, email, password, password2 } = req.body;

    console.log({ name, email, password, password2 });

    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }

    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters" });
    }

    if (password != password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
        res.render("register", { errors });
    } else {
        let hashedPassword = await bcrypt.hash(password, 10);

        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (err, results) => {
                if (err) {
                    throw err;
                }

                if (results.rows.length) {
                    errors.push({ message: "Email already registered" });
                    res.render("register", { errors });
                } else {
                    pool.query(
                        `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`, [name, email, hashedPassword], (err, results) => {
                            if (err) {
                                throw err;
                            }

                            console.log(results.rows);
                            req.flash("msg_success", "You are now registered. Please log in");
                            res.redirect("/users/login");
                        }
                    );
                }
            }
        );
    }
});

app.post("/users/login", passport.authenticate("local", {
    successRedirect: "/users/userDetails",
    failureRedirect: "/users/login",
    failureFlash: true
}));


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/userDetails");
    }

    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/users/login");
}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
