const express = require('express');
const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');

const UserRepository = require('../../db/user-repository');
const { authenticated, generateToken } = require('./security-utils');
const { Session } = require('../../db/models');

const router = express.Router();

const email = check('email').isEmail().withMessage('Provide valid email').normalizeEmail();
const password = check('password').not().isEmpty().withMessage('Provide password');

router.get('/', asyncHandler(async function (req, res, next) {res.json({message: "Hello world"});}));

router.post('/', [email, password],
  asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next({ status: 422, errors: errors.array() });
  const { email, password } = req.body;
  let user;
  try {
    user = await UserRepository.findByEmail(email);
  } catch (e) {
    console.error(e)
    return next({ status: 401, message: "UserRepo.findByEmail did not work" });
  }
  if (!user.isValidPassword(password)) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    err.title = 'Login failed';
    err.errors = ['Invalid1 credentials'];
    return next(err);
  }
  const { tokenId, token } = generateToken(user);
  await Session.create({userId: user.id, tokenId});
  // user.tokenId = jti;
  // await user.save();
  res.cookie('token', token);
  res.json({ token, user: user.toSafeObject() });
}));

router.delete('/', [authenticated],
  asyncHandler(async (req, res) => {
  const session = await Session.findOne({where: {tokenId: req.user.tokenId}});
  await session.destroy();
  //req.user.tokenId = null;
  // await req.user.save();
  res.clearCookie('token');
  res.json({ message: 'success' });
}));

module.exports = router;
