module.exports = {
    get_links: function () {
        var links = document.querySelectorAll('h3.r a');
        return Array.prototype.map.call(links, function(e) {
            return e.getAttribute('href');
        });
    },
    type_into_search: function (selector, text) {
        document.querySelector(selector).value = text;
        document.forms[0].submit();
    }
};
