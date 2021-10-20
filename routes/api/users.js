const express = require('express');
const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const Sequelize = require('sequelize');
const { create } = require("../../db/user-repository")
const { User, Session } = require('../../db/models');
const { authenticated, generateToken } = require('./security-utils');

const router = express.Router();

const email = check('email').isEmail().withMessage('Give a valid email address').normalizeEmail();
// const firstName = check('firstName').not().isEmpty().withMessage('Provide first name');
// const lastName = check('lastName').not().isEmpty().withMessage('Provide last name');
const password = check('password').not().isEmpty().withMessage('Provide a password');

router.post('/', email, password,
  asyncHandler(async (req, res, next) => {
    let message;
    const errors = validationResult(req).errors;
    if (errors.length) return res.status(400).json({message: errors[0].msg});
    let response = { user: {} };
    if (errors.length) {
      message = errors[0].msg;
    } else {
      let otherUser = await User.findOne({where: {email: req.body.email}});
      if (otherUser) {
        message = "That email is taken.";
      } else {
        const user = await create(req.body);
        const { tokenId, token } = generateToken(user);
        await Session.create({userId: user.id, tokenId});
        res.cookie("token", token);
        // response.token = token;
        response.user = {...response.user, ...user.toSafeObject()}
      }
    }
    response.user.message = message;
    res.json(response);
}));

router.put('/', [authenticated], email, password, asyncHandler(async (req, res, next) => {
  try {
  let user = req.user;
  let message = "Success!";
  const errors = validationResult(req).errors;
  if (user.id === 1) {
    message = "You cannot edit my 'demo' user, whose details are needed in order to allow my site's visitors to login easily.  Feel free to use the 'Signup' route to create a new user if you'd like to test out the 'EditUser' route.";
  } else if (errors.length) {
    message = errors[0].msg;
  } else {
    let otherUser = await User.findOne({
      where: {
        [Sequelize.Op.and]: [
          {email: req.body.email},
          {[Sequelize.Op.not]: {id: user.id }}
        ]
      }
    });
    if (otherUser) {
      message = "That email is taken.";
    } else {
      user.email = req.body.email;
      user = user.setPassword(req.body.password);
      await user.save();
      // Find session
      let tokenId = req.user.tokenId;
      let session = await Session.findOne({where: {tokenId}});
      // Now that user is edited and session is found, overwrite tokenId in db
      const { tokenId: newTokenId, token } = generateToken(user);
      console.log("newTokenId = ", newTokenId)
      session.tokenId = newTokenId;
      await session.save();
      res.cookie("token", token);
    }
  }
  await user.save();
  res.json({user: {...user.toSafeObject(), message}});
} catch(e){
  console.log(e)
}
}));

router.get('/', asyncHandler(async function (req, res, next) {
    const users = await User.findAll();
    res.json(users);
}));

router.get('/me', authenticated, function(req, res) {
  res.json({ email: req.user.email });
});

router.delete("", [authenticated], asyncHandler(async (req, res, next) => {
  const user = req.user;
  const userId = user.id;
  if (userId === 1) return res.json({ message: "You cannot delete my 'demo' user, because visitors to my site use that for testing purposes.  Create a new user via the 'Signup' route if you'd like to test out the deletion of a user." })
  // user.tokenId = null;
  res.clearCookie('token');
  // For some reason, the onDelete: cascade does not seem to work in the session model
  let sessions = await Session.findAll({where: {userId}});
  for (let i = 0; i < sessions.length; i++) {
    await sessions[i].destroy();
  }
  await user.destroy();
  res.json({});
}));

module.exports = router;
