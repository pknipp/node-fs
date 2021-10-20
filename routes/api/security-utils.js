const jwt = require('jsonwebtoken');
const uuid = require('uuid').v4;

const { jwtConfig: { secret, expiresIn } } = require('../../config');
const UserRepository = require('../../db/user-repository');

function generateToken(user) {
  const data = user.toSafeObject();
  const tokenId = uuid();
  console.log("sec-utils says that tokenId = ", tokenId)

  return {
    tokenId,
    token: jwt.sign({ data }, secret, { expiresIn: Number.parseInt(expiresIn), jwtid: tokenId })
  };
}

function restoreUser(req, res, next) {
  const { token } = req.cookies;

  if (!token) return next({ status: 401, message: 'no token in cookie' });

  return jwt.verify(token, secret, null, async (err, payload) => {
    if (err) {
      console.log("security utils line 24")
      res.clearCookie('token');
      err.status = 401;
      return next(err);
    }

    const tokenId = payload.jti;

    try {
      let user = await UserRepository.findByTokenId(tokenId);
      user.tokenId = tokenId;
      req.user = user;
    } catch (e) {
      console.error(e);
      res.clearCookie("token");
      return next({ status: 401, message: "user not found" });
    }

    if (!req.user.isValid()) {
      console.log("user is not valid?")
      res.clearCookie("token");
      return next({ status: 401, message: 'session not found' });
    }

    next();
  });
}

const authenticated = [restoreUser];

module.exports = { generateToken, authenticated };
