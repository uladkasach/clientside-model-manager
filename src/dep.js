/*
    Goal is for model_manager to be able to make it easy to access a READ-ONLY, CACHED database copy on the clientside
        - note that the model definitions enable user to customize the model on the clientside
        - we can also enforce that certain models automatically update every X minutes // TODO - enable models to define an update period
        - we can also "subscribe" functions to be called when data is updated for a particular query // TODO
        - we can enable updating through model-manager // LONGTERM TODO
            - e.g., rather than defining a custom api call we can simply run:
                - var promise_to_update = model.update({
                    "prop1" : new_val_1,
                    "prop2" : new_val_2,
                })
                - and the above function would 1. update db to reflect change, 2. update clientside cache to reflect change

    model_manager should, for each model, be able to:
        - READ:
            - be able to retreive
                - all
                - by parameters
                - * options are defined and parsed in model *
            - be able to retreive by parameters
                - e.g., WHERE
        - CACHE:
            - cache every object uniquely
            - be able to pull_update all elements of cache
                -
            - be able to pull_update of specific elements
                - retreive by parameters and check updated_last time of objects


    Cache Structure:
        - for each database_pull, store all id's that have responded to it
            - cache : {
                        "model_1" : {
                                        cached_objects : {"id":"object", "id2":"object2"},
                                        queries : {
                                                        "query_1" : [1, 20, 12, 342],
                                                        "query_2" : [2, 20, 16, 342],
                                                    }
                                    }
                      }
        - when database_pull retreives objects already in cache, overwrite if object.update_time is newer
        - when retreiving from cache, retreive all that are associated with query

    Usage Example:
*/



var Model_Manager = function(model_root){
    this.model_root = this.normalize_and_validate_model_root(model_root); // define model root
}

Model_Manager.prototype = {
    /*
    var backtests = await model_manager.promise_to_retreive({ model: "backtest", where : {
        Parent : parent.type,
        ParentId : parent.id,
    });
    */
    find


    /*
        CRUD
    */

    /*
        create
    */
    create : async function(model_key, properties){
        // 0. check that model is valid and retreive model
        var model = this.retreive_model(model_key);

        // 1. check if model defines create function
        var method_not_defined = (typeof model.prototype.database.create == "undefined");
        if(method_not_defined) throw new Error("model does not support create function");

        // 2. call on model to create
        var object = model.create(properties);

        // 3. cache object in manager
        var parameters = null; // no parameters were defined for retreiving this element
        this.cache_data(model_key, parameters, [object]);
    },

    /*
        read
    */
    read : async function(model_key, parameters){
        // 0. check that model is valid and retreive model
        var model = this.retreive_model(model_key);

        // 1. check if model defines read function
        var method_not_defined = (typeof model.prototype.database.read == "undefined");
        if(method_not_defined) throw new Error("model does not support read function");

        /*
            2 - retreive data
        */
        // 2.1 - see if data is in cache
        var data = this.cache.retreive_data(model_key, parameters)

        // 2.2 - if data is not in cache, retreive it and cache it
        if(data == null){
            // 2.2.1 - retreive the data
            var data = model.read(parameters);

            // 2.2.2 - cache the data
            this.cache.add_data(model_key, parameters, data);
        }

        // 3. return data
        return data;
    },

    /*
        update
    */

    /*
        delete
    */



    /*
        initial validation and normalization
    */
    normalize_and_validate_model_root : function(model_root){
        if(typeof model_root == "undefined") throw new Error("model_root must be defined");
        if(model_root.slice(-1) == "/") model_root = model_root.slice(-1); // make sure that "/" is the last char
        return model_root;
    },
    validate_model : function(model_key){
        // to validate, retreive it and check that it has retreival protocols defined
    },
}
