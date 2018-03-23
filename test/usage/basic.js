/*
    define dependencies
*/
var class_path = "file:///var/www/git/More/clientside-model-manager/src/class.js";
var clientside_require = require("clientside-require");
var assert = require("assert");

describe('basic', function(){
    it("should not load models untill they are accessed the first time", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        var models = new Model_Manager({"CachableTest" : "/models/cachable"});
        assert.equal(typeof models.__model_cache["CachableTest"].path, "string", "model_cache for model should contain options string if not loaded yet")
        models.CachableTest; // access model
        assert.equal(typeof models.__model_cache["CachableTest"].then, "function", "model_cache for model should contain a promise now that its loading")
    })
    it("should find that data can be retreived from model", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        var models = new Model_Manager({"CachableTest" : "/models/cachable"});
        var data = await models.CachableTest.find();
        assert.equal(JSON.stringify(data), JSON.stringify([{id:2,val:2}]), "data should be expected")
    })
    it("should find that caching prevents an additional request to be made to model", async function(){ // use a model that tracks each "request"
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        var models = new Model_Manager({"RequestTrackingModel" : "/models/request_tracking"}, true);
        var model = await models.RequestTrackingModel;
        assert.equal(model.requests.length, 0, "model should have no reqeusts");
        await models.RequestTrackingModel.find_all();
        assert.equal(model.requests.length, 1, "model should have 1 reqeust");
        await models.RequestTrackingModel.find_all();
        assert.equal(model.requests.length, 1, "model should still have 1 reqeust");
    })
    it("should find that syncing enables more than one request to be made to model", async function(){ // use a model that tracks each "request"
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        var models = new Model_Manager({"RequestTrackingModel" : "/models/request_tracking"}, true);
        var model = await models.RequestTrackingModel;
        model.requests = []; // refresh requests list from previous tests
        assert.equal(model.requests.length, 0, "model should have no reqeusts");
        await models.RequestTrackingModel.find_all();
        assert.equal(model.requests.length, 1, "model should have 1 reqeust");
        await models.RequestTrackingModel.find_all();
        assert.equal(model.requests.length, 1, "model should still have 1 reqeust");
        await models.RequestTrackingModel.find_all(undefined, true) // pass true to force request
        assert.equal(model.requests.length, 2, "model should have 2 requests");
        await models.RequestTrackingModel.sync() // force sync all elements
        assert.equal(model.requests.length, 3, "model should have 3 requests");
    })
})
