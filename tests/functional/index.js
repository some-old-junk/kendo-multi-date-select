define(function (require) {
    var bdd = require('intern!bdd');
    var expect = require('intern/chai!expect');

    bdd.describe('index', function () {

        bdd.it('dummy successful test', function () {
            expect(true).to.be.true;
        });

        bdd.it('dummy failing test', function () {
            expect(false).to.be.true;
        });
    });
});