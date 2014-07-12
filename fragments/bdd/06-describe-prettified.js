/*global describe, it, beforeEach*/
/*jshint expr:true,latedef:false, camelcase:false*/

(function () {
    // 01 - base PageObject

    function PageObject(container) {
        this.container = container;
    }
    
    PageObject.prototype.query = function (selector) {
        return this.container.querySelector(selector);
    };

    PageObject.prototype.queryAll = function (selector) {
        return this.container.querySelectorAll(selector);
    };

    PageObject.prototype.simulateChange = function (element) {
        var evt;

        if ("createEvent" in document) {
            evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            element.dispatchEvent(evt);
        }
        else {
            element.fireEvent("onchange");
        }
    };

    PageObject.prototype.sendKeys = function (input, value) {
        input.value = value;
        this.simulateChange(input);
    };

    PageObject.prototype.check = function (checkbox, value) {
        if (checkbox.checked !== Boolean(value)) {
            checkbox.click();
        }
    };

    // 02 - page object for registration form

    function RegistrationPageObject(container) {
        PageObject.call(this, container);

        this.elements = {
            age:      this.query("input[id=age]"),
            agree:    this.query("input[id=agree]"),
            female:   this.query("input[id=female]"),
            gender:   this.queryAll("input[name=gender]"),
            male:     this.query("input[id=male]"),
            name:     this.query("input[id=name]"),
            submit:   this.query("button[type=submit]")
        };

        this.viewModel = window.test.user;
    }

    RegistrationPageObject.prototype = Object.create(PageObject.prototype);

    RegistrationPageObject.prototype.setName = function (value) {
        this.sendKeys(this.elements.name, value);
    };

    RegistrationPageObject.prototype.setAge = function (value) {
        this.sendKeys(this.elements.age, value);
    };

    RegistrationPageObject.prototype.setGender = function (value) {
         // HACK: no other way to reset
        this.viewModel.gender(value || '');
    };

    RegistrationPageObject.prototype.setMale = function () {
        this.elements.male.click();
    };

    RegistrationPageObject.prototype.setFemale = function () {
        this.elements.female.click();
    };

    RegistrationPageObject.prototype.setAgree = function (value) {
        this.check(this.elements.agree, value);
    };

    RegistrationPageObject.prototype.submitForm = function () {
        this.elements.submit.click();
    };

    // 03 - specs

    describe("survey app", function () {
        describe_registration_form(function () {
            describe("when submitted with empty fields", function () {
                beforeEach(function () {
                    this.page.setName("");
                    this.page.setAge("");
                    this.page.setGender(undefined);
                    this.page.setAgree(false);
                });

                after_submit(function () {
                    it_stays_on_the_same_place();
                    these_fields_should_be_invalid(['name', 'age', 'gender', 'agree']);
                });
            });

            describe("when fields are valid", function () {
                beforeEach(function () {
                    this.page.setName("Samantha Green");
                    this.page.setAge("21");
                    this.page.setFemale();
                    this.page.setAgree(true);
                });

                after_submit(function () {
                    it("should be relocated to the survey page", function () {
                        location.hash.should.equal("#/questions/1");
                    });
                });

                describe("but name is blank", function () {
                    beforeEach(function () { this.page.setName(""); });

                    after_submit(function () {
                        it_stays_on_the_same_place();
                        these_fields_should_be_invalid(['name']);
                        these_fields_should_be_valid(['age', 'gender', 'agree']);
                    });
                });

                describe("but name is too short", function () {
                    beforeEach(function () { this.page.setName("Zh"); });

                    after_submit(function () {
                        it_stays_on_the_same_place();
                        these_fields_should_be_invalid(['name']);
                        these_fields_should_be_valid(['age', 'gender', 'agree']);
                    });
                });

                describe("but age is blank", function () {
                    beforeEach(function () { this.page.setAge(""); });

                    after_submit(function () {
                        it_stays_on_the_same_place();
                        these_fields_should_be_invalid(['age']);
                        these_fields_should_be_valid(['name', 'gender', 'agree']);
                    });
                });

                describe("but age is less than 18", function () {
                    beforeEach(function () { this.page.setAge(17); });

                    after_submit(function () {
                        these_fields_should_be_invalid(['age']);
                        these_fields_should_be_valid(['name', 'gender', 'agree']);
                    });
                });

                describe("but age is more than 99", function () {
                    beforeEach(function () { this.page.setAge(99); });

                    after_submit(function () {
                        these_fields_should_be_invalid(['age']);
                        these_fields_should_be_valid(['name', 'gender', 'agree']);
                    });
                });

                describe("but gender is not selected", function () {
                    beforeEach(function () { this.page.setGender(); });

                    after_submit(function () {
                        these_fields_should_be_invalid(['gender']);
                        these_fields_should_be_valid(['name', 'age', 'agree']);
                    });
                });

                describe("but not agreed to terms", function () {
                    beforeEach(function () { this.page.setAgree(false); });

                    after_submit(function () {
                        these_fields_should_be_invalid(['agree']);
                        these_fields_should_be_valid(['name', 'age', 'gender']);
                    });
                });
            });
        });
    });

    function describe_registration_form(innerDescribe) {
        describe("registration form", function () {
            beforeEach(function () {
                location.hash = "#/register";
                var form = document.querySelector("form");
                this.page = new RegistrationPageObject(form);
            });

            innerDescribe();
        });
    }

    function describe_form_field(fieldName, innerDescribe) {
        describe("form field: " + fieldName, function () {
            beforeEach(function () {
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

    function after_submit(innerDescribe) {
        describe("after submit", function () {
            beforeEach(function () {
                this.page.submitForm();
            });

            innerDescribe();
        });
    }

    function it_should_have_label_marked_invalid() {
        it("should have label marked invalid", function () {
            this.label.className.should.match(/invalid/);
        });
    }

    function it_should_have_label_marked_valid() {
        it("should have label marked valid", function () {
            this.label.className.should.not.match(/invalid/);
        });
    }

    function it_should_not_be_blank() {
        it("should not be blank", function () {
            this.subject.value.should.not.be.empty;
        });
    }

    function it_should_be_unchecked() {
        it("should be unchecked", function () {
            this.subject.checked.should.be.false;
        });
    }

    function it_stays_on_the_same_place() {
        it("stays on the same place", function () {
            location.hash.should.equal("#/register");
        });
    }

    function these_fields_should_be_valid(fields) {
        if (fields.indexOf("name") >= 0) {
            describe_form_field("name", function () {
                it_should_have_label_marked_valid();
                it_should_not_be_blank();
            });
        }

        if (fields.indexOf("age") >= 0) {
            describe_form_field("age", function () {
                it_should_have_label_marked_valid();
                it_should_not_be_blank();
            });
        }

        if (fields.indexOf("gender") >= 0) {
            describe_form_field("gender", function () {
                it_should_have_label_marked_valid();
            });
        }

        if (fields.indexOf("agree") >= 0) {
            describe_form_field("agree", function () {
                it_should_have_label_marked_valid();
                it_should_not_be_blank();
            });
        }
    }

    function these_fields_should_be_invalid(fields) {
        if (fields.indexOf("name") >= 0) {
            describe_form_field("name", function () {
                it_should_have_label_marked_invalid();
            });
        }

        if (fields.indexOf("age") >= 0) {
            describe_form_field("age", function () {
                it_should_have_label_marked_invalid();
            });
        }

        if (fields.indexOf("gender") >= 0) {
            describe_form_field("gender", function () {
                it_should_have_label_marked_invalid();
            });

            describe_form_field("male", function () {
                it_should_be_unchecked();
            });

            describe_form_field("female", function () {
                it_should_be_unchecked();
            });
        }

        if (fields.indexOf("agree") >= 0) {
            describe_form_field("agree", function () {
                it_should_have_label_marked_invalid();
            });
        }
    }
}());
