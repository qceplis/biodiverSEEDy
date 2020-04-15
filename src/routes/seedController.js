const express = require("express");
const router = express.Router();
const db = require("../db/postgres");
const auth = require("../middleware/auth");
const authutil = require("../util/authenticationUtil");
const uniqid = require("uniqid");

router.get("/", (req, res) =>
  db.pool.query(`SELECT * FROM getallseeds()`, (err, results) => {
    if (err) throw err;
    res.status(200).json(results.rows);
  })
);

router.post("/order", auth, async (req, res) => {
  try {
    const orderQuery = "CALL neworder($1, $2, $3)";
    const orderValue = [req.user.id, req.body.seed, req.body.quantity];
    await db.pool.query(orderQuery, orderValue);
    return res.status(200).send("Success");
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to create order");
  }
});

router.post("/return", auth, async (req, res) => {
  try {
    if (await authutil.checkVolunteer) {
      const returnQuery = "CALL newreturn($1, $2, $3)";
      const returnValue = [req.user.id, req.body.seed, req.body.quantity];
      await db.pool.query(returnQuery, returnValue);
      return res.status(200).send("Success");
    }
    return res.status(400).send("No Valid Perms");
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to register return");
  }
});

router.put("/toggleavailability/:seed", auth, async (req, res) => {
  try {
    if (await authutil.checkVolunteer) {
      const toggleQuery = "CALL updateseedavailability($1, $2)";
      const toggleValue = [req.params.seed, req.body.enabled];
      await db.pool.query(toggleQuery, toggleValue);
      return res.status(200).send("Success");
    } else {
      return res.status(400).send("Invalid Perms");
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to create order");
  }
});

router.get("/search", async (req, res) => {
  try {
    const searchQuery = "select * from searchseedsbycriteria($1, $2, $3)";
    const searchValue = [req.body.seed, req.body.commonname, req.body.seedtype];
    const results = await db.pool.query(searchQuery, searchValue);
    return res.status(200).json(results.rows);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to register return");
  }
});

router.post("/container", auth, async (req, res) => {
  try {
    if (await authutil.checkVolunteer) {
      const newContQuery = "CALL newcontainer($1, $2, $3, $4, $5)";
      const newContValue = [
        uniqid(),
        req.body.shelfnumber,
        req.body.quantity,
        req.body.seed,
        req.body.storagelocation,
      ];
      await db.pool.query(newContQuery, newContValue);
      return res.status(200).send("Success");
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to register container");
  }
});

router.put("/container/count/:container", auth, async (req, res) => {
  try {
    if (await authutil.checkVolunteer) {
      const countQuery = "CALL updateseedcount($1, $2)";
      const countValue = [req.params.container, req.body.quantity];
      await db.pool.query(countQuery, countValue);
      return res.status(200).send("Success");
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to register new amount");
  }
});

router.get("/:species/nutrition", auth, async (req, res) => {
  try {
    if (await authutil.checkVolunteer) {
      const query = "Select * from getseednutrition($1)";
      const value = [req.params.species];
      const results = await db.pool.query(query, value);
      return res.status(200).json(results.rows);
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to register return");
  }
});

router.put("/:species", auth, async (req, res) => {
  try {
    if (await authutil.checkVolunteer) {
      const query =
        "CALL updateseedattributes($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
      const value = [
        req.params.species,
        req.body.cname,
        req.body.seedtype,
        req.body.harvestyear,
        req.body.difficulty,
        req.body.instructions,
        req.body.size,
        req.body.maturity,
        req.body.wreq,
        req.body.sun,
        req.body.restriction,
        req.body.companion,
      ];
      await db.pool.query(query, value);
      return res.status(200).send("Success");
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to register species");
  }
});

router.put("/:species/nutrition", auth, async (req, res) => {
  try {
    if (await authutil.checkVolunteer) {
      const query = "CALL addnutrition($1, $2, $3)";
      const value = [
        req.body.nutrition,
        req.body.nquantity,
        req.params.species,
      ];
      await db.pool.query(query, value);
      return res.status(200).send("Success");
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to register nutritional value");
  }
});

router.post("/", auth, async (req, res) => {
  try {
    if (await authutil.checkVolunteer) {
      const query =
        "CALL newseed($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
      const value = [
        req.body.species,
        req.body.cname,
        req.body.seedtype,
        req.body.harvestyear,
        req.body.difficulty,
        req.body.instructions,
        req.body.size,
        req.body.maturity,
        req.body.wreq,
        req.body.sun,
        req.body.restriction,
        req.body.companion,
      ];
      await db.pool.query(query, value);
      return res.status(200).send("Success");
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Failed to register return");
  }
});
/*
    User views catalogue of all seeds 
    [HttpGet] 
    Get - Catalogue as list 
 
    
    User sorts catalogue based on criteria 
    [HttpGet] 
    Parameters (at least one) 
    - Species 
    - Variety 
    - CommonName 
    - SeedType 
    - YearSaved 
    - Difficulty 
    - ExpectedSize 
    - LengthToMaturity 
    - WaterRequirements 
    - PreferedSun 
    - CompanionSpecies 
    Get - Sorted catalogue results as list 

    User requests seeds for pickup 
    [HttpPost] 
    Parameters - Species - UserID - Approximate Amount 

    Volunteer indicates completion of seed dropoff 
    [HttpPost] 
    Parameter - Species - UserID - Approximate Amount

    Volunteer catalogues seed at location 
    [HttpPut] 
    Parameter - ContainerID - Shelf Number - Species - Common Name 

    Volunteer indicates new seed location 
    [HttpPut] 
    Parameter - ContainerID - Shelf Number - Species - Common Name 

    Volunteer Updates seed information 
    [HttpPut] 
    Parameter (at least one) 
    - Variety 
    - CommonName 
    - SeedType 
    - YearSaved 
    - Difficulty 
    - HowToGrow 
    - ExpectedSize 
    - LengthToMaturity 
    - WaterRequirements 
    - PreferedSun 
    - BorrowingRestriction 
    - Location 
    - Shelf Number 
    - CompanionSpecies 

    Volunteer can toggle borrowing of low stock seed
    [HttpPut] 
    Parameter - Species - Borrowing_restricted condition 

    Volunteer Adds nutritional values to species 
    [HttpPut] 
    Parameter - Name Amount(per weight) Species

    Get all info about seed including all nutrition (use inner join)
    [HttpGet]
*/

module.exports = router;
