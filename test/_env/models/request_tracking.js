module.exports = {
    requests : [],
    find_all : function(params){
        this.requests.push(new Date());
        var some_data =  [{id:1, val:1}, {id:2, val:2}, {id:3, val:3}] ;
        if(this.requests.length == 1){ // first time return all
            return some_data // just return some data
        } else { // second time return less
            return [some_data[1], some_data[2]]
        }
    },
}
