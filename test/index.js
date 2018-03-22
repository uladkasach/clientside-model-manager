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
var class_path = "file:///var/www/git/More/clientside-model-manager/src/class.js";
var clientside_require = require("clientside-require");
var assert = require("assert");

describe('syntax', function(){
    it("should load class", async function(){
        var model_manager = await clientside_require.asynchronous_require(class_path);
        assert.equal(typeof model_manager, "object", "model_manager should be an object");
    })
})
describe('validation', function(){
    require("./validation/options")
})
describe('wrap')
describe('read')
describe('cache', function(){
    it("should cache the data")
    it("should be able to update cache")
})
