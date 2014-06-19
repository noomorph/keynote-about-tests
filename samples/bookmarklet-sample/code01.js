describe("survey app", function () {
    var $ = document.querySelector.bind(document);

    describe("registration form", function () {
        var form;

        before(function () {
            location.hash = "#/register";
            form = document.forms[0];
        });

        describe("when fields are empty", function () {
            beforeEach(function () {
                $("input[id=name]").value = "";
                $("input[id=age]").value = "";
                $("input[id=agree]").checked = false;
                window.test.user.gender(''); // HACK: no way to uncheck radio
            });

            describe("after submit", function () {
                before(function () {
                    $("button[type=submit]").click();
                });

                it("stays on the same place", function () {
                    location.hash.should.equal("#/register");
                });

                describe("Name field", function () {
                    var field, label, input;

                    beforeEach(function () {
                        field = $("input[id=name]").parentElement;
                        label = field.querySelector("label");
                        input = field.querySelector("input");
                    });

                    it("should mark label as invalid", function () {
                        label.className.should.match(/invalid/);
                    });

                    it("should have blank input", function () {
                        input.value.should.be.empty;
                    });
                });
            });
        });
    });
});
