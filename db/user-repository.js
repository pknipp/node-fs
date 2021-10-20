const { User, Session } = require('./models');

class NullUser {
  isValid() { return false; }
  setPassword() {}
  isValidPassword() { return false; }
  toSafeObject() { return {}; }
}

async function create(details) {
  const user = await User.build(details);
  user.setPassword(details.password);
  return await user.save();
}

async function findByEmail(email) {
  let user;
  try {
    user = await User.findOne({ where: { email } });
  } catch (error) {
    console.error(error);
    return next({ status: 401, message: "User.findOne made an error" });
  }
  return user || new NullUser();
}

async function findByTokenId(tokenId) {
  const session = await Session.findOne({ where: tokenId });
  const user = session && await User.findByPk(session.userId);
  return user || new NullUser();
}

module.exports = {
  create,
  findByEmail,
  findByTokenId,
};
