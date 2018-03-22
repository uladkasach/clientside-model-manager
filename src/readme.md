// ideal usage - mimic sequelize


so
```js
var models = await require("path/to/models")
models.Backtest.findAll({
    where : {
        Parent : parent.type,
        ParentId : parent.id,
    }
})
```


which:
1. does loads the Backtest module ONLY when models.Backtest is called (use a proxy and return a promise that has all the relevant functions defined)
2. uses the Backtest model that the user defines to find, create, etc
    - complains if one is not implemented
        - for now, each "find", "findAll" has to be implemented in each model untill better abstraction can be found

so:
```js
var active_models = {
    "Plan" : "/_models/plan.js",
    "Funding" : "/_models/funding.js",
    "Backtest" : {path:"/_models/backtest.js", preload:true}
}
var models = new Model_Manager(active_models)
module.exports = models;
```

and

```js
var Model_Manager = function(requested_models){
    // validate that models requested are in valid format
    var [valid, error] = this.basic_validation(requested_models);
    if(valid !== true) throw error;

    // normalize requested_models
    var models = this.normalize_requested_models(requested_models);

    // append models to model manager object
    this.append_models(models);

    // handle preloads
    this.handle_preloads(models);
}

Model_Manager.prototype = {
    
}
```
