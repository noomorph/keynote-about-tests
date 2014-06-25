describe("survey app", function () {
    describe_registration_form(function () {
        when_fields_are_empty(function () {
            after_submit(function () {
                validation_suite_for_registration({
                    name: false,
                    age: false,
                    gender: false,
                    agree: false
                });
            });
        });

        when_fields_are_valid(function () {
            after_submit(function () {
                it("should be relocated to the survey page", function () {
                    location.hash.should.equal("#/questions/1");
                });
            });

            describe("but name is blank", suite_for_invalid('name', ''));
            describe("but name is too short", suite_for_invalid('name', 'Zh'));
            describe("but age is blank", suite_for_invalid('age', ''));
            describe("but age is less than 18", suite_for_invalid('age', 17));
            describe("but age is more than 99", suite_for_invalid('age', 100));
            describe("but gender is not selected", suite_for_invalid('gender', undefined));
            describe("but not agreed to terms", suite_for_invalid('agree', false));

            function suite_for_invalid(field, value) {
                return function () {
                    beforeEach(function () {
                        var o = {};
                        o[field] = value;
                        this.page.fillForm(o);
                    });

                    describe("when submitted", function () {
                        validation_suite_for_registration({
                            name:   field !== 'name',
                            age:    field !== 'age',
                            gender: field !== 'gender',
                            agree:  field !== 'agree'
                        });
                    });
                };
            }
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

    function when_fields_are_empty(innerDescribe) {
        describe("when fields are empty", function () {
            beforeEach(function () {
                this.page.fillForm({
                    name: "",
                    age: "",
                    gender: undefined,
                    agree: false
                });
            });

            innerDescribe();
        });
    }

    function when_fields_are_valid(innerDescribe) {
        describe("when fields are valid", function () {
            beforeEach(function () {
                this.page.fillForm({
                    name: "Samantha Green",
                    age: "21",
                    female: true,
                    agree: true
                });
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

    function describe_form_field(fieldName, innerDescribe) {
        describe("form field: " + fieldName, function () {
            before(function () {
                var inputs = this.page.elements[fieldName]();
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

    function validation_suite_for_registration(validity) {
        it("stays on the same place", function () {
            location.hash.should.equal("#/register");
        });

        if (validity.hasOwnProperty("name")) {
            describe_form_field("name", function () {
                if (validity.name) {
                    it_should_have_label_marked_valid();
                    it_should_not_be_blank();
                } else {
                    it_should_have_label_marked_invalid();
                }
            });
        }

        if (validity.hasOwnProperty("age")) {
            describe_form_field("age", function () {
                if (validity.age) {
                    it_should_have_label_marked_valid();
                    it_should_not_be_blank();
                } else {
                    it_should_have_label_marked_invalid();
                }
            });
        }

        if (validity.hasOwnProperty("gender")) {
            describe_form_field("gender", function () {
                if (validity.gender) {
                    it_should_have_label_marked_valid();
                } else {
                    it_should_have_label_marked_invalid();
                }
            });

            describe_form_field("male", function () {
                if (!validity.gender) {
                    it_should_be_unchecked();
                }
            });

            describe_form_field("female", function () {
                if (!validity.gender) {
                    it_should_be_unchecked();
                }
            });
        }

        if (validity.hasOwnProperty("agree")) {
            describe_form_field("agree", function () {
                if (validity.agree) {
                    it_should_have_label_marked_valid();
                    it_should_not_be_blank();
                } else {
                    it_should_have_label_marked_invalid();
                    it_should_be_unchecked();
                }
            });
        }
    }

    function RegistrationPageObject(container) {
        this.elements = {
            name: function () {
                return container.querySelector("input[id=name]");
            },
            age: function () {
                return container.querySelector("input[id=age]");
            },
            gender: function () {
                return container.querySelectorAll("input[name=gender]");
            },
            male: function () {
                return container.querySelector("input[id=male]");
            },
            female: function () {
                return container.querySelector("input[id=female]");
            },
            agree: function () {
                return container.querySelector("input[id=agree]");
            },
            submit: function () {
                return container.querySelector("button[type=submit]");
            }
        };

        this.viewModel = function () {
            return window.test.user;
        };
    }

    (function () {
        var utils = {
            simulateChange: function (element) {
                var evt;

                if ("createEvent" in document) {
                    evt = document.createEvent("HTMLEvents");
                    evt.initEvent("change", false, true);
                    element.dispatchEvent(evt);
                }
                else {
                    element.fireEvent("onchange");
                }
            },
            setValue: function (element, value) {
                element.value = value;
                utils.simulateChange(element);
            },
            check: function (element, checked) {
                if (element.checked !== Boolean(checked)) {
                    element.click();
                }
            }
        };


        RegistrationPageObject.prototype.fillForm = function (options) {
            var input;

            if (options.hasOwnProperty("name")) {
                utils.setValue(this.elements.name(), options.name);
            }

            if (options.hasOwnProperty("age")) {
                utils.setValue(this.elements.age(), options.age);
            }

            if (options.hasOwnProperty("male")) {
                this.elements.male().click();
            }

            if (options.hasOwnProperty("female")) {
                this.elements.female().click();
            }

            if (options.hasOwnProperty("gender")) {
                this.viewModel().gender(options.gender || ''); // HACK: no other way to reset
            }

            if (options.hasOwnProperty("agree")) {
                utils.check(this.elements.agree(), options.agree);
            }
        };

        RegistrationPageObject.prototype.submitForm = function (options) {
            this.elements.submit().click();
        };
    }());
});


