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
