const config = require("./config");
const bodyParser = require("body-parser");
const express = require("express");
const hbs = require("express-handlebars");
const helmet = require("helmet");
const minifyHTML = require("express-minify-html");
const path = require("path");

const app = express();

app.engine("hbs", hbs({
    defaultLayout: "main",
    extname: "hbs"
}));
app.set("port", process.env.PORT || 3000);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views/"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(helmet());
app.use(minifyHTML({
    exception_url: false,
    override: true,
    htmlMinifier: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        minifyJS: true,
        removeComments: true,
        removeAttributeQuotes: false,
        removeEmptyAttributes: true
    }
}));

// Routes
app.use("/", require("./routes/"));
app.use("/api", require("./routes/api"));
app.use("/assets", express.static(path.join(__dirname, "static/")));
// Handle 404s
app.use((req, res) => {
    res.status(404).render("error", {
        name: config.app.name,
        page: "Error"
    });
});

app.listen(app.get("port"), () => {
    console.log(`Listening on port ${app.get("port")}`);
});