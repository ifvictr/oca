const database = require("../helpers/database");

module.exports = class Record{
    /**
     * @param {Number} id
     */
    constructor(id){
        this.id = id;
        this.data = {};
    }
    /**
     * Gets data
     * @return {Object}
     */
    getData(){
        return this.data;
    }
    /**
     * Gets record id
     * @return {Number}
     */
    getId(){
        return this.id;
    }
};