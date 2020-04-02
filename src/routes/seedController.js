const express = require("express");
const router = express.Router();
const db = require("../db/postgres");

router.get("/", (req, res) =>
  db.pool.query(`SELECT * FROM "Seeds"`, (err, results) => {
    if (err) throw err;
    res.status(200).json(results.rows);
  })
);

/*
    User views catalogue of all seeds 
    [HttpGet] 
    Get - Catalogue as list 
 
    User sorts catalogue based on criteria 
    [HttpGet] 
    Parameters (at least one) - Species - Variety - CommonName - SeedType - YearSaved - Difficulty - ExpectedSize - LengthToMaturity - WaterRequirements - PreferedSun - CompanionSpecies 
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

    Volunteer indicates neww seed location 
    [HttpPut] 
    Parameter - ContainerID - Shelf Number - Species - Common Name 

    Volunteer Updates seed information 
    [HttpPut] 
    Parameter (at least one) - Variety - CommonName - SeedType - YearSaved - Difficulty - HowToGrow - ExpectedSize - LengthToMaturity - WaterRequirements - PreferedSun - BorrowingRestriction - Location - Shelf Number - CompanionSpecies 

    Admin can toggle borrowing of low stock seed
    [HttpPut] 
    Parameter - Species - Borrowing_restricted condition 
*/

module.exports = router;
