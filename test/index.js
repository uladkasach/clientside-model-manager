
/*
    setup browser env variables for clientside require
*/
var jsdom = require("jsdom");
var xmlhttprequest = require("xmlhttprequest");
global.window = new jsdom.JSDOM(``,{
    url: "http://test-env.clientside-model-manager.localhost",
    resources: "usable", // load iframes and other resources
    runScripts : "dangerously", // enable loading of scripts - dangerously is fine since we are running code we wrote.
}).window;

/*
    append clientside require settings
*/
if(typeof window.require_global == "undefined") window.require_global = {};
window.require_global.model_root = "/models"; // define root for models for the data_manager


/*
    define globals
*/
var module_path = "file:///var/www/git/More/clientside-model-manager/src/index.js";
var clientside_require = require("clientside-require");
var assert = require("assert");

describe('basic', function(){
    it("should load", async function(){
        var model_manager = await clientside_require.asynchronous_require(module_path);
        assert.equal(typeof model_manager, "object", "model_manager should be an object");
    })
})
describe('model validation', function(){
    it("should find non-existant model invalid", async function(){
        var model_manager = await clientside_require.asynchronous_require(module_path); // define globaly so the tests dont have to load it each time
        try {
            model_manager.validate_model("a_model_that_does_not_exist")
            throw new Error("should not reach here");
        } catch(error){
            console.log(error);
            assert.equal(error.message, "model does not exist");
        }

    })
    it("should be able to validate a model - model does not define retreival", async function(){
    })
    it("should be able to validate a model - valid model", async function(){
    })
})
describe("read", function(){
    it("should be able to retreive all instances for a model", async function(){
        this.skip();
    })
    it("should be able to retreive instances by parameter for a model")
    it("should throw error when model does not understand requested parameters")
})
describe("cache", function(){
    it("should cache the data")
    it("should be able to update cache")
})
