exports.validUsername = function (username) {
    let validCharacters = '1234567890-_.abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < username.length; i++) {
        if (validCharacters.indexOf(username.substr(i, 1)) === -1) {
            return false;
        }
    }
    return true;
};