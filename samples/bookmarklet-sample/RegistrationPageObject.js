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
}());


RegistrationPageObject.prototype.submitForm = function (options) {
    this.elements.submit().click();
};
