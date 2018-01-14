const database = require("./database");
const Alias = require("../models/Alias");

module.exports = {
    /**
     * Attempts to create a new alias
     * @param {string} name
     * @returns {object}
     */
    create: name => {
        // TODO: Finish implementation
    },
    /**
     * Checks if the alias exists in the 'aliases' table
     * @param {string} name
     * @return {object}
     */
    exists: name => {
        return database.run("SELECT COUNT(1) FROM aliases WHERE name = ?", name).then(function(res){
            return parseInt(res[0]["COUNT(1)"], 10) === 1;
        });
    },
    /**
     * Attempts to fetch a single alias
     * @param {string} name
     * @return {object}
     */
    get: name => {
        return database.run("SELECT * FROM aliases WHERE name = ?", name.toLowerCase()).then(function(res){
            return new Alias(res[0]);
        });
    }
};