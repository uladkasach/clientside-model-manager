var Data_Cache = require("./cache.js");

/*
    note, we define all methods with __ prepended so that model names do not conflict with internal method names
*/

var Model_Manager = function(requested_models, use_cache){
    // noramlize and conduct basic validatation of models
    var [models, error] = this.__normalize_and_validate_models(requested_models);
    if(models == null) throw error; // if models not returned, throw error

    // define cache
    this.__data_cache = new Data_Cache();

    // append models to model manager object
    this.__append_models(models, use_cache);

    // handle preloads
    // this.__handle_preloads(models); // TODO
}

Model_Manager.prototype = {
    /*
        define methods that are publicly avail (through promise) and are avail to be wrapped
    */
    __methods : {
        read : ["find", "findAll", "find_all"],
        create : [],
        update : [],
    },


    /*
        append models to the model manager
            - enables requests such as `models.Backtest.METOD`
            - note, we append each model as a getter method, which does the following:
                - if a promise_to_load is not defined for the model, we call the method that promises to load and wrap the object and define the promise_to_load
                    - we wrap each model so that we can cache the data
                - now that a promise_to_load is defined, we return the promise of the wrapped model object
                    - the promise immediately includes the wrapped methods the model manager supports: this.__methods
    */
    __append_models : function(models, use_cache){
        // start the model_cache
        this.__model_cache = models;

        // append each model as a getter
        var keys = Object.keys(models);
        var values = Object.values(models);
        for(var i = 0; i < keys.length; i++){
            let model_name = keys[i];
            let options = values[i];
            Object.defineProperty(this, model_name, { get: function() { return this.__retreive_wrapped_model_promise(model_name, use_cache)} });
        }
    },

    /*
        retreiving and wrapping models
    */
    __retreive_wrapped_model_promise : function(model_name, use_cache){
        // build and cache promise if not already set
        if(typeof this.__model_cache[model_name].path == "string"){ // if .path is defined in the model_cache for this model, then it has not started loading yet
            var model_options = this.__model_cache[model_name]; // if we are calling cache_promise_to_load_model, then model_cache contains model_options still
            var wrapped_promise_to_load = this.__generate_wrapped_promise_to_load_model(model_name, model_options, use_cache);
            this.__model_cache[model_name] = wrapped_promise_to_load;
        }
        // return cached promise
        return this.__model_cache[model_name];
    },
    __generate_wrapped_promise_to_load_model : function(model_name, options, use_cache){
        // generate promise to load the wrapped module
        var promise_module = this.__load_and_wrap_module(model_name, options, use_cache);

        /*
            append public methods to promise
                - enables functionality such as `models.Backtest.find()` without needing to resolve `Backtest` first
                - should throw error if turns out the method is not defined in the model
        */
        var public_methods = [].concat(this.__methods.read, this.__methods.update, this.__methods.create)
        public_methods.forEach((method)=>{
            promise_module[method] = async function(parameters, force_sync){
                var model = await this; // wait for promise to resolve; `this` is the promise
                if(typeof model[method] == "undefined")  throw new Error(model_name + "." + method + " is not defined")
                if(typeof model[method] != "function") throw new Error(model_name + "." + method + " is not a function")
                return model[method](parameters, force_sync);
            }
        })

        /*
            append the "sync" method if caching is enabled
                - runs either a default availible method or the method selected with force_request = true
                - NOTE: the methods themselfs, if they were wrapped, can be used with force_request directly
        */
        if(use_cache) promise_module["sync"] = async function(parameters, method){ // run the method with the parameters to cache it with force_request = true
            var model = await this; // wait for promise to resolve; `this` is the promise
            if(typeof method == "undefined"){ // try and find a default
                if(typeof model.find == "function") var default_method = model.find.bind(model);
                if(typeof model.findAll == "function") var default_method = model.findAll.bind(model);
                if(typeof model.find_all == "function") var default_method = model.find_all.bind(model);
                if(typeof default_method == "undefined") throw new Error("method is not defined and no defaults can be found");
                await default_method(parameters, true); // use the default
            } else { // else if its defined, just use the defined one
                await model[method](parameters, true);
            }
        };

        // return the data
        return promise_module;
    },
    __load_and_wrap_module : async function(model_name, options, use_cache){
        //retreiving the model
        var source_model = await clientside_require.asynchronous_require(options.path); // retreive the model
        var model = Object.assign({}, source_model); // make a copy of the object so that we dont modify the source model
                                                     //     models typically are not large and wont be a problem to duplicate in the memory
                                                     //     the advantage of doing this is that the user will not get a modified model if they try to access it directly
                                                     //     && that more than one Module_Manager can wrap the model without stepping on eachothers toes
                                                     //     NOTE: however, "static" properties and methods of the object that we do not modify will remain passed by reference (found through testing)
                                                     //         which means that the data acts exactly like you would expect it to were we not wrapping anything
                                                     //         this is most likely due to the fact that object.assign performs a shallow copy

        //return the unmodified model if cacheing is not requested
        if(use_cache !== true) return model;

        // wrap the read methods (if they are defined) to support caching:
        var read_methods = this.__methods.read;
        read_methods.forEach((method)=>{
            if(typeof model[method] != "function") return;
            var original_method = model[method].bind(model);
            model[method] = this.__wrap_a_read_method(model_name, original_method);
            model["__original_"+method] = original_method; // define original method
        })

        // TODO - wrap create and update methods to support caching

        // return the modified models
        return model;
    },

    /*
        wrapping helpers
    */
    __wrap_a_read_method : function(model_name, original_method){
        var new_find = async function(parameters, force_request){
            // attempt to get the data first
            var data = this.__data_cache.get(model_name, parameters);

            // if data is null, or we have a forced_request (syncing), then promise to retreive the data from the model
            if(data == null || force_request === true){
                var data = await Promise.resolve(original_method(parameters)); // wrap in promise to ensure its async even if orig was not
                this.__data_cache.set(model_name, parameters, data);
                var data = this.__data_cache.get(model_name, parameters); // grab data from cache again to ensure consistency
            }

            // return the data
            return data;
        }
        return new_find.bind(this);
    },

    /*
        normalization and validation
    */
    __normalize_and_validate_models : function(models){
        if(typeof models == "undefined") models = {}; // default to empty models object

        var normalized_models = {};

        var keys = Object.keys(models);
        var values = Object.values(models);
        for(var i = 0; i < values.length; i++){
            let model_name = keys[i];
            let options = values[i];

            //normalize : cast to defaults
            if(typeof options == "string") options = {path : options};
            if(typeof options.preload == "undefined") options.preload = false; // default to not preload

            //validate
            if(typeof options !== "object") var error = new Error("options for `"+model_+name+"` must be an object.");
            if(typeof options.path != "string") var error = new Error("options.path for `"+model_name+"` must be a string.");
            if(typeof options.preload != "boolean") var error = new Error("options.preload for `"+model_name+"` must be a boolean.");

            //append to data
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
