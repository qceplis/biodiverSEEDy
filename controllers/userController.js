/*
    User creates profile 
    [HttpPost] 
    Parameters - UserID 
 
    User logs in 
    [HttpGet] 
    Parameters - UserID 

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