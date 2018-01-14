const database = require("./database");
const Record = require("../models/Record");

module.exports = {
    /**
     * Attempts to create a new record
     * @param {string} url
     * @return {object}
     */
    create: url => {
        return database.run("INSERT INTO records (url) VALUES (?)", url).then(function(res){
            
        });
    },
    /**
     * Checks if the record exists in the 'records' table
     * @param {number} id
     * @return {object}
     */
    exists: id => {
        return database.run("SELECT COUNT(1) FROM records WHERE id = ?", id).then(function(res){
            return parseInt(res[0]["COUNT(1)"], 10) === 1;
        });
    },
    /**
     * Attempts to fetch a single record
     * @param {number} id
     * @return {object}
     */
    get: id => {
        return database.run("SELECT * FROM records WHERE id = ?", id).then(function(res){
            return new Record(res[0]);
        });
    },
    /**
     * Gets record by url
     * @param {string} url
     * @returns {object}
     */
    getByUrl: url => {
        return database.run("SELECT * FROM records WHERE LOWER(url) = ?", url.toLowerCase()).then(function(res){
            return new Record(res[0]);
        });
    }
};