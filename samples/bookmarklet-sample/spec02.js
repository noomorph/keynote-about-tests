describe("survey app", function () {
    describe("registration form", function () {
        describe("when fields are empty", function () {
            describe("after submit", function () {
                suite_for_validation_in_form({
                    name: false,
                    age: false,
                    gender: false,
                    agree: false,
                });
            });
        });

        describe("when fields are valid", function () {
            describe("when submitted", function () {
                it("should relocate to survey page");
            });

            function suite_for_invalid(field) {
                var validity = {
                    name: true,
                    age: true,
                    gender: true,
                    agree: true
                };

                validity[field] = false;

                return function () {
                    describe("when submitted", function () {
                        suite_for_validation_in_form(validity);
                    });
                };
            }

            describe("but name is blank", suite_for_invalid('name'));
            describe("but name is too short", suite_for_invalid('name'));
            describe("but age is blank", suite_for_invalid('age'));
            describe("but age is less than 18", suite_for_invalid('age'));
            describe("but age is more than 99", suite_for_invalid('age'));
            describe("but gender is not selected", suite_for_invalid('gender'));
            describe("but not agreed to terms", suite_for_invalid('terms'));

        });
    });

    function suite_for_validation_in_form(validity) {
        it("should stay on registration form");

        if (validity.hasOwnProperty('name')) {
            describe("field: name", function () {
                if (validity.name) {
                    it("should be marked as valid");
                } else {
                    it("should be marked as invalid");
                }
            });
        }

        if (validity.hasOwnProperty('age')) {
            describe("field: age", function () {
                if (validity.age) {
                    it("should be marked as valid");
                } else {
                    it("should be marked as invalid");
                }
            });
        }

        if (validity.hasOwnProperty('gender')) {
            describe("field: gender", function () {
                if (validity.gender) {
                    it("should be marked as valid");
                } else {
                    it("should be marked as invalid");
                }
            });
        }

        if (validity.hasOwnProperty('agree')) {
            describe("field: agree to terms", function () {
                if (validity.agree) {
                    it("should be marked as valid");
                } else {
                    it("should be marked as invalid");
                }
            });
        }
    }
});
