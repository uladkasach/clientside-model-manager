# clientside-model-manager


# Basic Usage
### 1. define your models
```js
var Backtest = function(object){
    Object.assign(this, object); // when we retrieve an object from the database, append its values to this object
}
Backtest.prototype = {
    find : async function(options){
        // validate the options
        var [valid, error] = this.validate_find_options(options);
        if(valid !== true) throw error;

        // pass request to server
        var database_object = await api.get("/models/find/backtest", options); // let the server handle interpreting and validating the where string

        // cast server response to backtest objects
        var casted_object =  new this.constructor(database_object); // same as `new Backtest(database_object)``

        // return the data
        return data;
    },
}
```

### 2. initialize the model manager
```js
var active_models = {
    "Plan" : "/_models/plan.js",
    "Funding" : "/_models/funding.js",
    "Backtest" : {path:"/_models/backtest.js", preload:true}
}
var models = new Model_Manager(active_models)
module.exports = models;
```

### 3. use the models - like you would with sequelize or mongodb
```js
var models = await require("path/to/models")
models.Backtest.find({
    where : {
        Parent : parent.type,
        ParentId : parent.id,
    }
})
```

# Caching
Since making requests to the database is expensive from the client, the module manager comes with the ability to cache data. The only thing a developer must keep in mind while using the caching functionality is that the developer will need to manually trigger data_pulls from the database to ensure that data is up to date.
- note, automatic timed updates will be availible in future - but this will still not resolve this problem entirely
