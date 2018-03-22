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
window.XMLHttpRequest = xmlhttprequest.XMLHttpRequest; // remove cross origin concerns

/*
    define dependencies
*/
var class_path = "file:///var/www/git/More/clientside-model-manager/src/class.js";
var clientside_require = require("clientside-require");
var assert = require("assert");

describe('syntax', function(){
    it("should load class", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        assert.equal(typeof Model_Manager, "function", "Model_Manager should be an function");
    })
})
describe('validation', function(){
    require("./validation/options")
})
describe('wrap', function(){
    require("./wrap/model")
    require("./wrap/promise")
})
describe('read', function(){})
require("./cache/")
