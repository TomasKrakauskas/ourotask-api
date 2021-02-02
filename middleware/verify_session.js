var jwt = require('jsonwebtoken');
const { token } = require('morgan');

module.exports.validate = (req, res, next) =>{
  // console.log(req.headers);
  var header = req.headers["authorization"]; 

  if(req.method == "OPTIONS") return next();
  else if(!header) return res.status(401).send({ message: 'Not authorised' });
  else { 
    try{

      let token = header;
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      if(!decoded) return res.status(401).send({ message: 'Not authorised' });

      res.locals._id = decoded._id;

      return next();

    } 
    catch(err) { 
      return res.status(401).send({ message: 'Not authorised' }); 
    }
  }
}
module.exports.refresh = (req, res, next) => {
  
  if(req.method == "OPTIONS") return next();
  else if(!req.body.refresh) return res.status(401).send({ message: 'Not authorised' });
  else { 

    try{

      let token = req.body.refresh;
      var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      if(!decoded) return res.status(401).send({ message: 'Not authorised' });

      res.locals._id = decoded._id;

      return next();

    } 
    catch(err) { 
      return res.status(401).send({ message: 'Not authorised' }); 
    }
  }
}