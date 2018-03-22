/*
    this.__data_cache.set(model_name, parameters, data);
    return this.__data_cache.get(model_name, parameters);


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
                                    objects : {"id":"object", "id2":"object2"},
                                    queries : {
                                                    "query_1" : [1, 20, 12, 342],
                                                    "query_2" : [2, 20, 16, 342],
                                                }
                                }
                  }
        - when database_pull retreives objects already in cache, overwrite if object.update_time is newer
        - when retreiving from cache, retreive all that are associated with query

*/

var Data_Cache = function(){
    this.cache = {}; // initialize cache as empty
}
Data_Cache.prototype = {
    set : function(model_name, parameters, data){
        // ensure that the cache container for this model is defined
        if(typeof this.cache[model_name] == "undefined") this.cache[model_name] = {objects : {}, queries : {}};

        // normalize the data
        if(!Array.isArray(data)) data = [data]; // cast to array if single object

        // validate the data that was retreived - each element has to have a unique id
        var [valid, error] = this.validate_data(data);
        if(!valid) throw error;

        // record each data element into objects cache
        data.forEach((object)=>{
            this.cache[model_name].objects[object.id] = object;
        })

        // record this query, value is the id's of the objects that this query should retreive
        this.cache[model_name].queries[JSON.stringify(parameters)] = data.map((object)=>object.id);
    },
    get : function(model_name, parameters){
        // check that the cache is defined for this model
        if(typeof this.cache[model_name] == "undefined") return null;

        // check that the cache is defined for the query
        if(typeof this.cache[model_name].queries[JSON.stringify(parameters)] == "undefined") return null;

        // if it is defined, get the data for the query
        //      - for each id listed for the query, add it to the data list. return the full data list
        var ids_to_return = this.cache[model_name].queries[JSON.stringify(parameters)];
        var data = [];
        ids_to_return.forEach((id)=>{
            data.push(this.cache[model_name].objects[id]);
        })

        // return the data
        return data;
    },

    validate_data : function(data){
        for(var i = 0; i < data.length; i++){
            var object = data[i];
            if(typeof object.id == "undefined") var error = new Error("object.id must be defined for each data object");
        }
        if(typeof error != "undefined") return [false, error];
        return [true, null];
    }
}

module.exports = Data_Cache;
