var Model = function(){}


Model.prototype = {
    find_all : function(params){
        var some_data =  [{id:1, val:1}, {id:2, val:2}, {id:3, val:3}] ;
        if(typeof params == "undefined"){
            return some_data // just return some data
        } else {
            return [some_data[1], some_data[2]]
        }
    },
    find : function(params){
        return [{id:2, val:2}]
    }
}

module.exports = Model;
