/*
    define dependencies
*/
var class_path = "file:///var/www/git/More/clientside-model-manager/src/class.js";
var clientside_require = require("clientside-require");
var assert = require("assert");

describe('basic', function(){
    it("should find that data can be retreived from model", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        var models = new Model_Manager({"CachableTest" : "/models/cachable"});
        assert.equal(typeof models.CachableTest, "object")
    })
    it("should find that caching prevents an additional request to be made to RESTapi", async function(){ // use a model that tracks each "request"
        this.skip();
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        var models = new Model_Manager({"RequestTrackingModel" : "/models/request_tracking"}, true);
        assert.equal(typeof models.CachableTest, "object")
    })
})
