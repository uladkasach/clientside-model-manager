/*
    define dependencies
*/
var class_path = "file:///var/www/git/More/clientside-model-manager/src/class.js";
var clientside_require = require("clientside-require");
var assert = require("assert");
const AsyncFunction = (async () => {}).constructor; // define async function type

//require("/var/www/git/More/clientside-model-manager/src/class.js");

describe('model', function(){
    it("should be able to load a model", async function(){
        var model = await clientside_require.asynchronous_require("/models/test");
        assert.equal(typeof model, "object");
        assert.equal(model.foo, "bar");
    })
    it("should be able to wrap the model - use_cache = false", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path);
        var model = await Model_Manager.prototype.__load_and_wrap_module("Test", {path : "/models/test"});
        assert.equal(typeof model, "object");
        assert.equal(model.foo, "bar");
        assert.equal(model.find[Symbol.toStringTag] == "AsyncFunction", false, "ensure that its not an async function") // when wrapped its converted to async
    })
    it("should be able to wrap the model - use_cache = true", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path);
        var model = await Model_Manager.prototype.__load_and_wrap_module("Test", {path : "/models/test"}, true);
        assert.equal(model.find[Symbol.toStringTag] == "AsyncFunction", true, "ensure that it is an async function") // when wrapped its converted to async
    })
})
