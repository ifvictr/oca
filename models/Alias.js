const database = require("../helpers/database");

module.exports = class Alias{
    /**
     * @param {String} name
     */
    constructor(name){
        this.name = name;
    }
    /**
     * Gets alias name
     * @return {String}
     */
    getName(){
        return this.name;
    }
};