describe("survey app", function () {
    var $ = document.querySelector.bind(document),
        subject;

    describe_registration_form(function () {
        when_fields_are_empty(function () {
            after_submit(function () {
                validation_suite_for_registration({
                    invalid_name: true,
                    invalid_age: true,
                    invalid_gender: true,
                    invalid_agree: true
                });
            });
        });
    });

    function describe_registration_form(innerDescribe) {
        describe("registration form", function () {
            before(function () {
                location.hash = "#/register";
                this.form = document.forms[0];
            });

            innerDescribe();
        });
    }

    function when_fields_are_empty(innerDescribe) {
        describe("when fields are empty", function () {
            beforeEach(function () {
                $("input[id=name]").value = "";
                $("input[id=age]").value = "";
                $("input[id=agree]").checked = false;
                window.test.user.gender(''); // HACK: no way to uncheck radio
            });

            innerDescribe();
        });
    }

    function after_submit(innerDescribe) {
        describe("after submit", function () {
            beforeEach(function () {
                $("button[type=submit]").click();
            });

            innerDescribe();
        });
    }

    function describe_form_field(selector, innerDescribe) {
        describe("form field " + selector, function () {
            before(function () {
                this.subject = this.input = $(selector);
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

    function it_should_be_blank() {
        it("should be blank", function () {
            this.subject.value.should.be.empty;
        });
    }

    function it_should_be_unchecked() {
        it("should be unchecked", function () {
            this.subject.checked.should.be.false;
        });
    }

    function validation_suite_for_registration(options) {
        it("stays on the same place", function () {
            location.hash.should.equal("#/register");
        });

        if (options.invalid_name) {
            describe_form_field("input[id=name]", function () {
                it_should_have_label_marked_invalid();
                it_should_be_blank();
            });
        }

        if (options.invalid_age) {
            describe_form_field("input[id=age]", function () {
                it_should_have_label_marked_invalid();
                it_should_be_blank();
            });
        }

        if (options.invalid_gender) {
            describe_form_field("input[name=gender]", function () {
                it_should_have_label_marked_invalid();
            });

            describe_form_field("input[id=male]", function () {
                it_should_be_unchecked();
            });

            describe_form_field("input[id=female]", function () {
                it_should_be_unchecked();
            });
        }

        if (options.invalid_agree) {
            describe_form_field("input[id=agree]", function () {
                it_should_have_label_marked_invalid();
                it_should_be_unchecked();
            });
        }
    }
});
