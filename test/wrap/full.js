/*
    define dependencies
*/
var class_path = "file:///var/www/git/More/clientside-model-manager/src/class.js";
var clientside_require = require("clientside-require");
var assert = require("assert");

describe('full', function(){
    it("should find that models are appended", async function(){
        var Model_Manager = await clientside_require.asynchronous_require(class_path, {require:"sync"});
        var models = new Model_Manager({"CachableTest" : "/models/cachable", "BasicTest" : "/models/test"});
        assert.equal(typeof models.CachableTest, "object")
        assert.equal(typeof models.BasicTest, "object")
    })
})
