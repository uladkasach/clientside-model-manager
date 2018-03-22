/*
    define dependencies
*/
var class_path = "file:///var/www/git/More/clientside-model-manager/src/class.js";
var clientside_require = require("clientside-require");
var assert = require("assert");

describe('cache', function(){
    it("should cache the data - list", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path);
        var model_manager = new Model_Manager(); // no modules passed - but allows cache to be used
        var data = [{id:1, val:1}, {id:2, val:2}, {id:3, val:3}];
        model_manager.__data_cache.set("Test", null, data);
        var cache = model_manager.__data_cache.cache;
        assert.equal(typeof cache.Test.objects, "object");
        assert.equal(cache.Test.objects["1"].val, 1);
        assert.equal(JSON.stringify(cache.Test.queries["null"]), JSON.stringify([1,2,3]));
    })
    it("should cache the data - single", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path);
        var model_manager = new Model_Manager(); // no modules passed - but allows cache to be used
        var data = {id:1, val:1};
        model_manager.__data_cache.set("Test", null, data);
        var cache = model_manager.__data_cache.cache;
        assert.equal(typeof cache.Test.objects, "object");
        assert.equal(cache.Test.objects["1"].val, 1);
        assert.equal(JSON.stringify(cache.Test.queries["null"]), JSON.stringify([1]));
    })
    it("should update existing objects when newer data is provided", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path);
        var model_manager = new Model_Manager(); // no modules passed - but allows cache to be used
        var data = [{id:1, val:1}, {id:2, val:2}, {id:3, val:3}];
        model_manager.__data_cache.set("Test", null, data);
        model_manager.__data_cache.set("Test", {test:true}, {id:1, val:"updated value"});
        var cache = model_manager.__data_cache.cache;
        assert.equal(cache.Test.objects["1"].val, "updated value");
    })
    it("should be able to get data from cache", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path);
        var model_manager = new Model_Manager(); // no modules passed - but allows cache to be used
        var data = [{id:1, val:1}, {id:2, val:2}, {id:3, val:3}];
        model_manager.__data_cache.set("Test", undefined, data);
        var cached_data = model_manager.__data_cache.get("Test");
        assert.equal(JSON.stringify(data), JSON.stringify(data));
    })
    it("should delete elements that dont re-appear for same parameters")
})
