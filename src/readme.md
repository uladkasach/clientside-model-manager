// ideal usage - mimic sequelize

/*
var models = await require("path/to/models")
models.Backtest.find_all({
    where : {
        Parent : parent.type,
        ParentId : parent.id,
    }
})
*/

/*
var active_models = {
    "Plan" : "/_models/plan.js",
    "Funding" : "/_models/funding.js",
    "Backtest" : {path:"/_models/backtest.js", preload:true}
}
var models = new Model_Manager(active_models)
module.exports = models;
*/
