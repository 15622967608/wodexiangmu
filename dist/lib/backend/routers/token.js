const jwt = require("jsonwebtoken");


let secret = 'sunyongjian'; //钥匙
function create(data, expiresIn = 60 * 60 * 24 * 7) { //expiresIn =60*60*24*7 7天有效期
    let token = jwt.sign(
        { data }, secret, {
        expiresIn
    });
    return token;
}
function verify(token) {
    let res;
    try {
        let result = jwt.verify(token, secret);
        console.log('token效验:', result)
        res = true;
    } catch (err) {
        res = false;
    }
    return res;
}

module.exports = {
    create,
    verify
}