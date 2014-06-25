describe("survey app", function () {
    describe("registration form", function () {
        before(function () {
            location.hash = "#/register";
            var form = document.querySelector("form");
            this.page = new RegistrationPageObject(form);
        });

        describe("after user submits empty form", function () {
            beforeEach(function () {
                this.page.setName("");
                this.page.setAge("");
                this.page.setGender(undefined);
                this.page.setAgree(false);

                this.page.submitForm();
            });

            describe("form field: name", function () {
                before(function () {
                    this.subject = this.page.elements.name.parentElement;
                });

                it_should_have_label_marked_invalid();
            }); 

            describe("form field: age", function () {
                before(function () {
                    this.subject = this.page.elements.age.parentElement;
                });

                it_should_have_label_marked_invalid();
            }); 
        });
    });

    function it_should_have_label_marked_invalid() {
        it("should have label marked invalid", function () {
            var label = this.subject.querySelector("label");
            label.className.should.match(/invalid/);
        });
    }

    function simulateChange(element) {
        var evt;

        if ("createEvent" in document) {
            evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            element.dispatchEvent(evt);
        }
        else {
            element.fireEvent("onchange");
        }
    }

    function RegistrationPageObject(container) {
        this.container = container;

        this.elements = {
            age:      this.container.querySelector("input[id=age]"),
            agree:    this.container.querySelector("input[id=agree]"),
            female:   this.container.querySelector("input[id=female]"),
            gender:   this.container.querySelectorAll("input[name=gender]"),
            male:     this.container.querySelector("input[id=male]"),
            name:     this.container.querySelector("input[id=name]"),
            submit:   this.container.querySelector("button[type=submit]")
        };

        this.viewModel = function () {
            return window.test.user;
        };
    }

    RegistrationPageObject.prototype.setName = function (value) {
        this.elements.name.value = value;
        simulateChange(this.elements.name);
    };

    RegistrationPageObject.prototype.setAge = function (value) {
        this.elements.age.value = value;
        simulateChange(this.elements.age);
    };

    RegistrationPageObject.prototype.setGender = function (value) {
         // HACK: no other way to reset
        this.viewModel().gender(value || '');
    };

    RegistrationPageObject.prototype.setMale = function () {
        this.elements.male.click();
    };

    RegistrationPageObject.prototype.setFemale = function () {
        this.elements.female.click();
    };

    RegistrationPageObject.prototype.setAgree = function (value) {
        var checkbox = this.elements.agree;
        if (checkbox.checked !== Boolean(value)) {
            checkbox.click();
        }
    };

    RegistrationPageObject.prototype.submitForm = function () {
        this.elements.submit.click();
    };
});

