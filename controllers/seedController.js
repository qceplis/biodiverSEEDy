/*
    User views catalogue of seeds 
    [HttpGet] 
    Get - Seed attributes as list 

    User sorts catalogue based on criteria 
    [HttpGet] 
    Parameters - Species - Name - Tags 
    Get - SortedCatalogue 

    User requests seeds 
    [HttpPost] 
    Parameters - UserID - Amount - Species

    Volunteer indicates completion of seed pickup 
    [HttpPost] 
    Parameter - Species - UserID 

    Volunteer catalogues seed at location 
    [HttpPut] 
    Parameter - ContainerID - Shelf Number - Species - Common Name 

    Volunteer Updates seed information 
    [HttpPut] 
    Parameter - Variety - CommonName - SeedType - YearSaved - Difficulty - HowToGrow - ExpectedSize - LengthToMaturity - WaterRequirements - PreferedSun - BorrowingRestriction - Location - Shelf Number - CompanionSpecies 
 
    Admin can toggle borrowing of low stock seed
    [HttpPut] 
    Parameter - Species - Borrowing_restricted condition 
*/