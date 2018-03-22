/*
    define dependencies
*/
var class_path = "file:///var/www/git/More/clientside-model-manager/src/class.js";
var clientside_require = require("clientside-require");
var assert = require("assert");

describe('options', function(){
    it("should validate valid options", async function(){
        var Module_Manager = await clientside_require.asynchronous_require(class_path); // define globaly so the tests dont have to load it each time
        var requested_models = {
            "Test" : {path : "/_models/test", preload:false}
        }
        var [models, error] = Module_Manager.prototype.__normalize_and_validate_models(requested_models);
        assert.equal(typeof error, "undefined");
        assert.equal(typeof models, "object");
        assert.equal(JSON.stringify(models), JSON.stringify(requested_models), "models should be equivalent")
    })
    it("should normalize string to object options", async function(){
        var Module_Manager = await clientside_require.asynchronous_require(class_path); // define globaly so the tests dont have to load it each time
        var requested_models = {
            "Test" : "/_models/test"
        }
        var [models, error] = Module_Manager.prototype.__normalize_and_validate_models(requested_models);
        assert.equal(typeof error, "undefined");
        assert.equal(typeof models, "object");
        assert.equal(models.Test.path, "/_models/test");
    })
    it("should default preload to false", async function(){
        var Module_Manager = await clientside_require.asynchronous_require(class_path); // define globaly so the tests dont have to load it each time
        var requested_models = {
            "Test" : "/_models/test"
        }
        var [models, error] = Module_Manager.prototype.__normalize_and_validate_models(requested_models);
        assert.equal(typeof error, "undefined");
        assert.equal(typeof models, "object");
        assert.equal(models.Test.preload, false);
    })
})
