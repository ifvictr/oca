const mysql = require("promise-mysql");
const Promise = require("bluebird");
const config = require("../config");
let pool;

/**
 * Returns a disposer with the connection
 * @return {object}
 */
async function getConnection(){
    // Create pool and test connection
    if(!pool){
        pool = mysql.createPool({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.name,
            connectionLimit: 10,
            supportBigNumbers: true
        });
        try{
            const connection = await pool.getConnection();
            pool.releaseConnection(connection);
            console.log("Connected to database");
        }
        catch(err){
            throw err;
        }
    }
    return pool.getConnection().disposer(connection => {
        pool.releaseConnection(connection);
    });
}

module.exports = {
    /**
     * @param {string} command
     * @param {object|boolean|number|string} params
     * @return {object}
     */
    run: async (command, params) => {
        try{
            const connection = await pool.getConnection();
            const result = await connection.query(command, (typeof params === "object") ? params : [params]);
            return result;
        }
        catch(err){
            throw err;
        }
        //
        // return Promise.using(getConnection(), function(connection){
        //     return connection.query(command, (typeof params === "object") ? params : [params])
        //         .then(function(res){
        //             return res;
        //         })
        //         .catch(function(err){
        //             throw err;
        //         });
        // })
    }
};