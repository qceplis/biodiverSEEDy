const express = require("express");
const router = express.Router();
const db = require("../db/postgres");
const auth = require("../middleware/auth");
const authutil = require("../util/authenticationUtil");
const uniqid = require("uniqid");

/*
    User adds new post 
    [HttpPost] 
    Parameters - UserID - Text content - Image
*/
router.get("/:post", async (req, res) => {
  try {
    const query = "Select * from getpostbyid($1)";
    const value = [req.params.post];
    const results = await db.pool.query(query, value);
    return res.status(200).json(results.rows);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to register return");
  }
});

router.get("/sort/:species", async (req, res) => {
  try {
    const query = "Select * from getpostbyspecies($1)";
    const value = [req.params.species];
    const results = await db.pool.query(query, value);
    return res.status(200).json(results.rows);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to register return");
  }
});

router.post("/", auth, async (req, res) => {
  try {
    if (req.body.image) {
      const query = "CALL newimagepost($1, $2, $3, $4)";
      const value = [
        uniqid(),
        req.body.text,
        req.user.id,
        req.body.species,
        req.body.imageurl,
      ];
      await db.pool.query(query, value);
    } else {
      const query = "CALL newpost($1, $2, $3, $4)";
      const value = [uniqid(), req.body.text, req.user.id, req.body.species];
      await db.pool.query(query, value);
    }

    return res.status(200).send("Success");
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to register return");
  }
});

/*
    User can view seed post 
    [HttpGet] 
    Parameter - PostID 
    Get - Post’s text content - Post’s photo 

    User can view seed post according to tag
    [HttpGet] 
    Parameters - species tags
    Get - Post’s text content - Post’s photo
*/

module.exports = router;
