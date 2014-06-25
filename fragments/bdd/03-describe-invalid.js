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

            describe_form_field("name", function () {
                it_should_have_label_marked_invalid();
            });

            describe_form_field("age", function () {
                it_should_have_label_marked_invalid();
            });

            describe_form_field("gender", function () {
                it_should_have_label_marked_invalid();
            });

            describe_form_field("agree", function () {
                it_should_have_label_marked_invalid();
                it_should_be_unchecked();
            });
        });
    });

    function describe_form_field(fieldName, innerDescribe) {
        describe("form field: " + fieldName, function () {
            before(function () {
                var inputs = this.page.elements[fieldName];
                inputs = inputs[0] || inputs; // HACK: for gender: male, female

                this.subject = this.input = inputs;
                this.field = this.input.parentElement;
                this.label = this.field.querySelector("label");
                this.inputs = this.field.querySelectorAll("input");
                this.test.parent.title = 'form field "' + this.label.innerHTML + '"';
            });

            innerDescribe();
        }); 
    }

    function it_should_have_label_marked_invalid() {
        it("should have label marked invalid", function () {
            this.label.className.should.match(/invalid/);
        });
    }

    function it_should_be_unchecked() {
        it("should be unchecked", function () {
            this.subject.checked.should.be.false;
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

