var clientside_require = require("clientside-require");
var assert = require("assert");


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
window.XMLHttpRequest = xmlhttprequest.XMLHttpRequest; // append XMLHttpRequest to window

/*
    append clientside require settings
*/
if(typeof window.require_global == "undefined") window.require_global = {};
window.require_global.model_root = "/models"; // define root for models for the data_manager


/*
    data_manager should:
        - READ:
            - be able to retreive all
            - be able to retreive by parameters
                - e.g., WHERE
        - CACHE:
            - cache every object uniquely
            - be able to update all elements of cache
                - may need to record "retreive where" statements in a list, purge that cache, then ask db for data again
*/

describe('basic', function(){
    it("should load", async function(){
        var model_manager = await clientside_require.asynchronous_require("/_controller/model_manager/index.js");
        assert.equal(typeof model_manager, "object", "model_manager should be an object");
    })
})
define('model validation', function(){
    var model_manager = await clientside_require.asynchronous_require("/_controller/model_manager/index.js"); // define globaly so the tests dont have to load it each time
    it("should be able to validate a model - model does not exist", async function(){
        model_manager.validate("a_model_that_does_not_exist")
    })
    it("should be able to validate a model - model does not define retreival", async function(){
    })
    it("should be able to validate a model - valid model", async function(){
    })
})
define("read", function(){
    it("should be able to retreive all instances for a model", async function(){
        this.skip();
    })
    it("should be able to retreive instances by parameter for a model")
    it("should throw error when model does not understand requested parameters")
})
define("cache", function(){
    it("should cache the data")
    it("should be able to update cache")
})
