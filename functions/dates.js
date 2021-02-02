module.exports.isBefore = (date, before) => {
    if(new Date(date) > new Date(before)) return true;
    return false;
}
module.exports.isAfter = (date, after) => {
    if(new Date(after) > new Date(date)) return true;
    return false;
}