var base62 = require("base62");
var bodyParser = require("body-parser");
var express = require("express");
var mysql = require("mysql");
var app = express();
var cache = require('memory-cache');
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
// App configurations
app.disable("x-powered-by");
app.set("port", process.env.PORT || 3000);
app.set('view engine', "hbs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(request, response){
    response.render("index", {
        domain: process.env.APP_DOMAIN || "example.com",
        name: process.env.APP_NAME || "???",
        tagline: process.env.APP_TAGLINE || false
    });
});
app.get("/:id", function(request, response){
    var id = request.params.id;
    // Check if an alias with this 'id' exists first
    connection.query("SELECT id FROM aliases WHERE name = ?", [id.toLowerCase()], function(error, result){
        // Yay! The alias exists in the aliases table, let's use that as our 'id'
        if(result.length !== 0){
            id = result[0].id;
        }
        // It wasn't found in the aliases table, so it isn't an alias, decode 'id' as usual
        else{
            id = base62.decode(id);
        }
        if(cache.get('r_'+id)){
            connection.query("UPDATE records SET clicks = clicks + 1 WHERE id = ?", [id]);
            // Prevent 301s from being cached on the client side
            response.setHeader("Cache-Control", "no-store,no-cache,must-revalidate,post-check=0,pre-check=0");
            response.setHeader("Expires", "0");
            let redirect_url = cache.get('r_'+id);
            response.redirect(301, redirect_url);
        }else{
            connection.query("SELECT url FROM records WHERE id = ?", [id], function(error, result){
                // Record with this id found, initiate redirect
                if(!error && result.length !== 0){
                    // Link was used, increment 'click'
                    connection.query("UPDATE records SET clicks = clicks + 1 WHERE id = ?", [id]);
                    // Prevent 301s from being cached on the client side
                    response.setHeader("Cache-Control", "no-store,no-cache,must-revalidate,post-check=0,pre-check=0");
                    response.setHeader("Expires", "0");
                    let redirect_url = result[0].url;
                    cache.put('r_'+id, redirect_url, process.env.CONF.CACHE_TIME);
                    response.redirect(301, redirect_url);
                }
                // Not found, throw a 404 and render the error page
                else{
                    response.status(404).render("error", {name: process.env.APP_NAME || "???"});
                }
            });
        }
    });
});
app.get("*", function(request, response){
   response.status(404).render("error", {name: process.env.APP_NAME || "???"});
});
app.post("/api/create", function(request, response){
    // Was the a parameter named 'url' specified?
    if(!request.body.hasOwnProperty("url")){
        response.json({success: false, message: "Parameter 'url' not found"});
        return;
    }
    var url = request.body.url;
    // Was there a protocol? If not, prepend it
    if (!url.match(/^[A-Za-z]+:\/\//)){
        // Prepend protocol to link if it isn't there yet
        url = "http://" + url;
    }
    // Is it a valid URL?
    if(!/https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/i.test(url)){
        response.json({success: false, message: "Not a valid URL"});
        return;
    }
    // Is it from the same domain?
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
        if(!error){
            var domain = process.env.APP_DOMAIN || "example.com";
            // If a row was returned, send its id
            if(result.length !== 0){
                response.json({success: true, message: "Fetched id of existing record for URL", id: base62.encode(result[0].id), domain: domain});
                return;
            }
            // Insert our new URL into the database, because it's new
            else{
                connection.query("INSERT INTO records (url) VALUES (?)", [url], function(error, result){
                    if(!error){
                        var id = result.insertId;
                        var base62id = base62.encode(id);
                        var alias = request.body.alias.toLowerCase();
                        // If the alias is empty or contains something other than alphanumerics, dashes, or underscores
                        if(alias.length === 0 || !/[a-z0-9-_]+$/i.test(alias)){
                            response.json({success: true, message: "Inserted into database with id", id: base62id, domain: domain});
                            console.log("Created new record at id " + id + " (base 62 id: " + base62id + ") containing url '" + url + "'.");
                        }
                        // The alias is good to go
                        else{
                            connection.query("INSERT INTO aliases (name, id) VALUES (?, ?)", [alias, id], function(error, result){
                                if(!error){
                                    response.json({success: true, message: "Inserted into database with alias", id: alias, domain: domain});
                                    console.log("Created new record at id " + id + " (alias: " + alias + ", base 62 id: " + base62id + ") containing url '" + url + "'.");
                                }
                                else{
                                    response.json({success: false, message: "Alias already exists"});
                                }
                            });
                        }
                    }
                    else{
                        response.json({success: false, message: "Error occurred when inserting URL into records"});
                    }
                });
            }
        }
        else{
            response.json({success: false, message: "Error occurred during fetch"});
            return;
        }
    });
});
app.listen(app.get("port"), function(){
    console.log("Listening on port " + app.get("port") + "..."); 
});