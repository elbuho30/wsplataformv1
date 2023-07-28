module.exports = function (req,res,next){
//       res.header("Access-Control-Allow-Origin", "*");
//       res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header("Access-Control-Allow-Origin" , "*");
      res.header("Access-Control-Allow-Methods" , "GET,POST,PUT,DELETE,OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
      next();
}