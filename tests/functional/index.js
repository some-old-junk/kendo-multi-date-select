define(function (require) {
    var bdd = require('intern!bdd');
    var expect = require('intern/chai!expect');

    bdd.describe('index', function () {

        bdd.it('dummy successful test', function () {
            expect(true).to.be.true;
        });

        bdd.it('dummy failing test', function () {
            expect(false).to.be.true;
        })

        // bdd.describe('dummy ', function () {

        //     bdd.it('should show greeting for a person name in input after form submission', function () {
        //         return this.remote
        //             .get(require.toUrl('index.html'))
        //             .setFindTimeout(5000)
        //             .findByCssSelector('body.loaded')
        //             .findById('nameField')
        //                 .click()
        //                 .type('Elanie')
        //                 .end()
        //             .findByCssSelector('#loginForm input[type=submit]')
        //                 .click()
        //                 .end()
        //             .findById('greeting')
        //             .getVisibleText()
        //             .then(function (text) {
        //                 expect(text).to.be.equal('Hello, Elanie!')
        //             }); 
        //     });
        // });
    });
});