const express = require("express");
const router = express.Router();
const db = require("../db/postgres");
const uniqid = require("uniqid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check");
require("dotenv").config({ path: "../.env" });

/*
searchUser->
    mid - member id
    uname - username
    phash - hashed password
    vstatus - volunteer boolean
    hours - number of hours worked as volunteer
*/

router.post(
  "/signup",
  [
    check("username", "Please Enter a Valid Username")
      .not()
      .isEmpty(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    try {
      const { username, password } = req.body;
      const searchQuery = "select * from searchuser($1)";
      const searchValues = [username];
      searchResults = await db.pool.query(searchQuery, searchValues);

      if (searchResults.rows.length > 0) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
      const memberID = uniqid();
      const signUpQuery = "CALL signup($1, $2, $3)";
      const signUpValues = [memberID, username, hashedPassword];
      await db.pool.query(signUpQuery, signUpValues);

      const payload = {
        user: {
          id: memberID
        }
      };

      jwt.sign(
        payload,
        process.env.TOKENSIG,
        {
          expiresIn: 10000
        },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.status(200).json({
            token
          });
        }
      );
    } catch (err) {
      console.log(err.stack);
      res.status(500).send("error in signup");
    }
  }
);

router.post(
  "/login",
  [
    check("username", "Please Enter a Valid Username")
      .not()
      .isEmpty(),
    check("password", "Please enter a valid password")
      .not()
      .isEmpty()
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    try {
      const { username, password } = req.body;
      const searchQuery = "select * from searchUser($1)";
      const searchValues = [username];
      searchResults = await db.pool.query(searchQuery, searchValues);

      if (searchResults.rows.length != 1) {
        return res.status(400).json({
          msg: "User does not exist"
        });
      }

      const isMatch = await bcrypt.compare(
        password,
        searchResults.rows[0].phash
      );
      if (!isMatch) {
        return res.status(400).json({
          message: "Incorrect password"
        });
      }
      const payload = {
        user: {
          id: searchResults.rows[0].mid
        }
      };

      jwt.sign(
        payload,
        process.env.TOKENSIG,
        {
          expiresIn: 10000
        },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.status(200).json({
            token
          });
        }
      );
    } catch (err) {
      console.log(err.stack);
      res.status(500).send("error in login");
    }
  }
);

router.get("/:username/history", auth, async (req, res) => {
  try {
    //Check credentials of current logged in user
    const searchQuery = "select * from searchuserbyid($1)";
    const searchValue = [req.user.id];

    const curUser = await db.pool.query(searchQuery, searchValue);
    //Check credentials of looked up user
    const searchTarQuery = "select * from searchuser($1)";
    const searchTarValue = [req.params.username];
    const targetUser = await db.pool.query(searchTarQuery, searchTarValue);

    if (!curUser || !targetUser) {
      return res.status(400).json("Could not find user");
    }
    if (curUser.vstatus || curUser.rows[0].mid == targetUser.rows[0].mid) {
      const getTransactionQuery = "select * from getAllTransaction($1)";
      const getTransactionValue = [targetUser.rows[0].mid];
      const result = await db.pool.query(
        getTransactionQuery,
        getTransactionValue
      );
      return res.status(200).json(result.rows);
    }
    return res.status(400).json("Invalid Permissions");
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed History Lookup");
  }
});

router.get("/me", auth, async (req, res) => {
  res.status(200).json({ id: req.user.id });
});
/*
    User creates profile 
    [HttpPost] 
    Parameters - UserID 
 
    User logs in 
    [HttpGet] 
    Parameters - UserID 
    Get - Validation token

    User can send email to organizer 
    [HttpPost] 
    Parameters - UserID - Text Content

    Admin can view transaction history of user 
    [HttpGet] 
    Parameter - UserID 
    Get - SeedOrders 
        - Number of seeds 
        - Date 
    - SeedHarvests 
        - Number of seeds 
        - Date 
*/

module.exports = router;
