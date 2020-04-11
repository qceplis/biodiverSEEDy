const db = require("../db/postgres");
authutil.checkVolunteer = async (id) => {
  try {
    const searchQuery = "select * from searchuserbyid($1)";
    const searchValue = [req.user.id];
    const user = await db.pool.query(searchQuery, searchValue);
    return user.vstatus;
  } catch (err) {
    console.log(err.stack);
  }
  return false;
};

authutil.getUser = async (id) => {
  try {
    const searchQuery = "select * from searchuserbyid($1)";
    const searchValue = [req.user.id];
    const user = await db.pool.query(searchQuery, searchValue);
    return user;
  } catch (err) {
    console.log(err.stack);
  }
  return;
};
module.exports = authutil;
