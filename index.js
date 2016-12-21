var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var app = express();
var connection = mysql.createConnection(process.env.DATABASE_URL);
// Attempt to connect to database, terminate on fail
connection.connect(function(error){
    if(error){
        console.log("Failed to connect to database, please make sure everything is configured correctly.");
        process.exit(1);
    }
    else{
        console.log("Successfully connected to database! :)");
    }
});
app.set("port", process.env.PORT || 3000);
app.set('view engine', "hbs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(request, response){
    response.render("index", {name: process.env.APP_NAME, domain: process.env.APP_DOMAIN});
});
app.get("/:id", function(request, response){
    var id = request.params.id;
    // Convert id back into base 10, and check database for id (base 10) from there
    connection.query("SELECT url FROM records WHERE id = ?", [parseInt(id, 36)], function(error, result){
        // Record with the id was found, initiate redirect
        try{
            response.redirect(301, result[0].url);
        }
        // Not found, throw a 404 and render the error page
        catch(error){
            response.status(404).render("error", {name: process.env.APP_NAME});
        }
    });
});
app.get("*", function(request, response){
   response.status(404).render("error", {name: process.env.APP_NAME});
});
app.post("/api/create", function(request, response){
    // Was the a parameter named 'url' specified?
    if(!request.body.hasOwnProperty("url")){
        response.json({success: false, message: "Parameter 'url' not found"});
        return;
    }
    var url = request.body.url;
    // Was there a protocol? If not, prepend it.
    if (!url.match(/^[A-Za-z]+:\/\//)){
        // Prepend protocol to link if it isn't there yet
        url = "http://" + url;
    }
    // Is it a valid URL?
    if(!/https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/i.test(url)){
        response.json({success: false, message: "Not a valid URL"});
        return;
    }
    if(new RegExp("^https?://" + process.env.APP_DOMAIN, "gi").test(url)){
        response.json({success: false, message: "Cannot be from same domain"});
        return;
    }
    // Remove trailing slash and hash
    var lastChar = url[url.length - 1];
    if(lastChar === "/" || lastChar === "#"){
        url = url.slice(0, -1);
    }
    // Check to see if any existing record has the same URL, if so, return that one instead
    connection.query("SELECT id FROM records WHERE url = ? ORDER BY id LIMIT 1", [url], function(error, result){
        if(error){
            response.json({success: false, message: "Error occurred during fetch"});
            return;
        }
        else{
            var domain = process.env.APP_DOMAIN;
            // If a row was returned, send its id
            if(result.length != 0){
                response.json({success: true, message: "Fetched id of existing record for URL", id: result[0].id, domain: domain});
                return;
            }
            // Insert our new URL into the database, because it's new
            else{
                connection.query("INSERT INTO records (url) VALUES (?)", [url], function(error, result){
                    if(error){
                        response.json({success: false, message: "Error occurred during creation"});
                    }
                    else{
                        var id = result.insertId;
                        response.json({success: true, message: "Inserted into database", id: id, domain: domain});
                        console.log("Created new record with id " + id + " containing url '" + url + "'.");
                    }
                });
            }
        }
    });
});
app.listen(app.get("port"), function(){
    console.log("Listening on port " + app.get("port") + "..."); 
});