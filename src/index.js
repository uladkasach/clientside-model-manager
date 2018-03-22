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
*/



var Model_Manager = function(model_root){
    this.model_root = this.normalize_and_validate_model_root(model_root); // define model root
}

Model_Manager.prototype = {

    /*
        create
    */

    /*
        read
    */

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
