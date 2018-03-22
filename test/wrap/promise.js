/*
    define dependencies
*/
var class_path = "file:///var/www/git/More/clientside-model-manager/src/class.js";
var clientside_require = require("clientside-require");
var assert = require("assert");

describe('promise', function(){
    it("should be able to wrap the promise with defined proxy __methods", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        var models = new Model_Manager();
        var model_promise = models.__generate_wrapped_promise_to_load_model("Test", {path : "/models/cachable"});
        var public_methods = ["find", "find_all", "findAll"];
        public_methods.forEach((method)=>{
            assert.equal(typeof model_promise[method], "function")
        })
    })
    it("should find that proxy methods resolve with accurate response", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        var models = new Model_Manager();
        var Test = models.__generate_wrapped_promise_to_load_model("Test", {path : "/models/cachable"});
        var response = await Test.find();
        assert.equal(JSON.stringify(response), JSON.stringify([{id:2,val:2}]), "value returned by proxy method should be accurate");
    })
    it("should find that proxy methods resolve with accurate response - with cache", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        var models = new Model_Manager();
        var Test = models.__generate_wrapped_promise_to_load_model("Test", {path : "/models/cachable"}, true);
        var response = await Test.find();
        assert.equal(JSON.stringify(response), JSON.stringify([{id:2,val:2}]), "value returned by proxy method should be accurate");
    })
    it("should find that proxy methods not defined in model throws error", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        var models = new Model_Manager();
        var Test = models.__generate_wrapped_promise_to_load_model("Test", {path : "/models/cachable"}, true);
        try {
            var response = await Test.findAll();
            throw new Error("should not reach here")
        } catch (error){
            assert.equal(error.message.indexOf("Test.findAll"), 0, "error message should start with an expected string")
        }
    })
    it("should find that `sync` method is appended when caching is requested")
})
