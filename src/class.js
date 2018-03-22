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

/*
    note, we define all methods with __ prepended so that model names do not conflict with internal method names
*/

var Model_Manager = function(requested_models){
    // noramlize and conduct basic validatation of models
    var [models, error] = this.__normalize_and_validate_models(requested_models);
    if(models == null) throw error; // if models not returned, throw error

    // append models to model manager object
    this.__append_models(models);

    // handle preloads
    this.__handle_preloads(models);
}

Model_Manager.prototype = {
    /*
        append models to the model manager
            - enables requests such as `models.Backtest.METOD`
            - note, we append each model as a getter method, which does the following:
                - if a promise_to_load is not defined for the model, we call the method that promises to load and wrap the object and define the promise_to_load
                    - we wrap each model so that we can cache the data
                - now that a promise_to_load is defined, we return the promise of the wrapped model object
                    - the promise immediately includes the wrapped methods the model manager supports:
                        - find
                        - findAll = find_all // syntax agnostic
                        - save // TODO
                        - update // TODO
    */
    __append_models : function(models){
        // append each model as a getter
        var keys = Object.keys(models);
        var values = Object.values(models);
        for(var i = 0; i < keys.length; i++){
            let model_name = keys[i];
            let options = values[i];
        }
    },
    __wrap_model : function(model){
        /*

        */
    },

    /*
        normalization and validation
    */
    __normalize_and_validate_models : function(models){
        var normalized_models = {};

        var keys = Object.keys(models);
        var values = Object.values(models);
        for(var i = 0; i < values.length; i++){
            let model_name = keys[i];
            let options = values[i];

            /*
                normalize : cast to defaults
            */
            if(typeof options == "string") options = {path : options};
            if(typeof options.preload == "undefined") options.preload = false; // default to not preload

            /*
                validate
            */
            if(typeof options !== "object") var error = new Error("options for `"+model_+name+"` must be an object.");
            if(typeof options.path != "string") var error = new Error("options.path for `"+model_name+"` must be a string.");
            if(typeof options.preload != "boolean") var error = new Error("options.preload for `"+model_name+"` must be a boolean.");

            /*
                append to data
            */
            normalized_models[model_name] = options;
        }

        if(typeof error !== "undefined") normalized_models = null; // clear modules if error is defined
        return [normalized_models, error];
    },
    /*
    validate_model_file : await function(model_path){
        // check that file can be loaded
        try {

        }


        // return validity - NOTE: we dont need to return the actual content since the clientside-model-manager already caches the request (we wont suffer latency by require'ing it in the future again)
        return validity;
    },
    */
}


module.exports = Model_Manager;
