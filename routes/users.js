const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const Message = require('../models/Message');
const validator = require('validator');
const async = require('async');
const jwt = require('jsonwebtoken');
const authorization = require('../controller/Authorization');
const stringUtil = require('../utils/StringUtil');

//POST register new user
router.post('/register', function (req, res) {
  let user = req.body;
  user.is_admin = 0;
  async.waterfall([
      function (callback) {
          if (!stringUtil.validUsername(user.username)) {
              res.json(new Message(500, "Username is not valid"));
          } else if (!validator.isEmail(user.email)) {
              res.json(new Message(500, "Email is not correct!"));
          } else if (!user.password) {
              res.json(new Message(500, "Password must not null!"));
          } else {
              callback();
          }
      }, function (callback) {
          userController.findWithUserName(user.username, function (result, err) {
              if(result) {
                  if (result.length !== 0) {
                      res.json(new Message(500, "User already registered!"));
                  } else {
                      callback();
                  }
              } else res.json(new Message(500, err));
          })
      }, function (callback) {
          userController.findWithEmail(user.email, function (result, err) {
              if (result) {
                  if (result.length !== 0) {
                      res.json(new Message(500, "Email already in used!"));
                  } else {
                      callback();
                  }
              } else res.json(new Message(500, err));
          })
      }, function () {
          userController.create(user, function (result, err) {
              if (result) res.json(new Message(200, result));
              else res.json(new Message(500, err))
          })
          
      }
  ]);
});

//GET all users
router.get('/all', function (req, res) {
    userController.getAll(function (result, err) {
        if (result) {
            if (result.length !== 0) res.json(new Message(200, result));
            else res.json(new Message(200, 'No record!'));
        }
        else res.json(new Message(500, err));
    });
});

//GET user with username
router.get('/username', function (req, res) {
    userController.findWithUserName(req.query.username, function (result,err) {
        if (result) {
            if (result.length !== 0) res.json(new Message(200, result));
            else res.json(new Message(200, 'No record!'));
        }
        else res.json(new Message(500, err));
    });
});

//GET user with name
router.get('/name', function (req, res) {
    userController.findWithName(req.query.name, function (result, err) {
        if (result) {
            if (result.length !== 0) res.json(new Message(200, result));
            else res.json(new Message(200, 'No record'));
        }
        else res.json(new Message(500, err));
    })
});

//GET user with email
router.get('/email', function (req, res) {
    userController.findWithEmail(req.query.email, function (result, err) {
        if (result) {
            if (result.length !== 0) res.json(new Message(200, result));
            else res.json(new Message(500, 'No record!'));
        }
        else res.json(new Message(500, err));
    })
});

//GET user with id
router.get('/id', function (req, res) {
    userController.findWithId(req.query.id, function (result, err) {
        if (result) {
            if (result.length !== 0) res.json(new Message(200, result));
            else res.json(new Message(500, 'No record!'));
        }
        else res.json(new Message(500, err));
    })
});

//POST login as admin
router.post('/adminlogin', function (req, res) {
    let query = req.body;
    async.waterfall([
        function (callback) {
            userController.findWithUserNameAdmin(query.username, function (result, err) {
                if (result) {
                    if (result.length !== 0) callback(null, result, query);
                    else res.json(500, 'Username not found!!');
                }
                else res.json(new Message(500, err));
            })
        }, function (result, query, callback) {
            let user = result[0];
            if (query.password !== user.password) {
                res.json(new Message(500, "Password not matched"))
            } else {
                callback(null, result, user);
            }
        }, function (result, user) {
            let message = {};
            let string = JSON.stringify(user.dataValues);
            let jsonUser = JSON.parse(string);
            let token = jwt.sign(jsonUser, 'secret', {expiresIn: 60*60*24});
            message.token = token;
            message.body = jsonUser;
            res.cookie('user',jsonUser, { maxAge: 900000, httpOnly: true });
            res.cookie('token', token, { maxAge: 900000, httpOnly: true});
            res.json(new Message(200, message));
        }
    ]);
});

//POST login
router.post('/login', function (req, res) {
    let query = req.body;
    async.waterfall([
        function (callback) {
            userController.findWithUserName(query.username, function (result, err) {
                if (result) {
                    if (result.length !== 0) callback(null, result, query);
                    else res.json(new Message(500, 'Username not found!!'));
                }
                else res.json(new Message(500, err));
            })
        }, function (result, query, callback) {
            let user = result[0];
            if (user.password !== query.password) {
                res.json(new Message(500, "Password not matched!"));
            } else {
                callback(null, result, user);
            }
        }, function (result, user) {
            let message = {};
            let string = JSON.stringify(user.dataValues);
            let jsonUser = JSON.parse(string);
            let token = jwt.sign(jsonUser, 'secret', {expiresIn: 60*60*24});
            message.token = token;
            message.body = jsonUser;
            res.cookie('user',jsonUser, { maxAge: 900000, httpOnly: true });
            res.cookie('token', token, { maxAge: 900000, httpOnly: true});
            res.json(new Message(200, message));
        }
    ]);
});

//POST edit profile
router.post('/edit', authorization.ensure_authorization, function (req, res) {
    let user = req.decoded;
    let update_user = req.body;
    userController.editProfile(user.id, update_user, function (result, err) {
        if (result) res.json(new Message(200, result));
        else res.json(new Message(500, err));
    })
});

//GET logout
router.get('/logout',authorization.ensure_authorization,function (req, res) {
    res.clearCookie('token');
    res.clearCookie('user');
    res.json(new Message(200, "Success!"));
});

//DELETE user
router.post('/delete', authorization.ensure_authorization, function (req, res) {
    let user = req.decoded;
    let id = req.body.id;
    if (user.is_admin === 1) {
        userController.deleteUser(user, id, function (result, err) {
            if (result) res.json(new Message(200, result));
            else res.json(new Message(500, err));
        })
    } else {
        res.json(new Message(500, 'No permission admin!'));
    }
});

module.exports = router;
