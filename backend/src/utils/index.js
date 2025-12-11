

const sum = function (items, prop) {
    return items.reduce(function (a, b) {
        return a + Number(b[prop]);
    }, 0);
};
module.exports = { sum };
