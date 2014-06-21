/*jshint camelcase:false */
/*global describe, it, before*/

describe("survey app", function () {
    describe_survey_page(function () {
        describe_question(1, function () {
            it("should display question number", function () {
                var text = document.querySelector("#breadcrumbs").innerText; // breaks in FF
                text.trim().should.match(/.*Вопрос\s*1\s*из\s*46.*/);
            });
        });
    });

    function describe_survey_page(innerDescribe) {
        describe("survey page", function () {
            before(function (done) {
                var form = document.forms[0];
                var register = new RegistrationPageObject(form);

                register.setName("Rob Zombie");
                register.setAge(40);
                register.setMale();
                register.setAgree(true);
                register.submitForm();

                waitForCondition(function () {
                    var panel = document.querySelector("#questions");
                    return panel && panel.offsetHeight !== 0;
                }, 1000).
                then(function () { done(); }).
                catch(done);
            });

            innerDescribe();
        });
    }

    function describe_question(number, innerDescribe) {
        describe("question #" + number, function () {
            beforeEach(function () {
                location.hash = "#/questions/" + number;
            });

            innerDescribe();
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

    function waitForCondition(condition, timeout, rejectReason) {
        timeout = timeout || 5000; // 5 secs by default
        rejectReason = "waited for " + timeout + "ms " +
                       "until " + (rejectReason || "something to happen");

        return new Promise(function (resolve, reject) {
            var result = condition(),
                timerId,
                pollId;

            if (result) {
                resolve(result);
            } else {
                timerId = setTimeout(function () {
                    clearInterval(pollId);
                    reject(Error(rejectReason));
                }, timeout);

                pollId = setInterval(function () {
                    var result = condition();

                    if (result) {
                        clearTimeout(timerId);
                        clearInterval(pollId);
                        resolve(result);
                    }
                }, 10);
            }
        });
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
