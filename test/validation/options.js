
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
