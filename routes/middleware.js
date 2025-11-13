var jwt = require('jsonwebtoken');

function is_admin(req,res,next) {
    const token = req.headers['authorization'] || "";
    if(!token) return res.status(400).json({"error":"invalidtoken"});
    jwt.verify(token, process.env.JWT_SECRET);
    const user_data = jwt.decode(token);
    if(user_data?.role === "user") return res.status(401).json({"error":"unauthorized"});
    req['x_user_data'] = user_data;
    return next();

}

function is_user(req,res,next) {
    const token = req.headers['authorization'] || "";
    if(!token) return res.status(400).json({"error":"invalidtoken"});
    jwt.verify(token, process.env.JWT_SECRET);
    const user_data = jwt.decode(token);
    req['x_user_data'] = user_data;
    return next();

}


module.exports =  {is_admin , is_user};