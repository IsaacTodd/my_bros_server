const express = require('express');
const router = express.Router();
const database = require('../database');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
router.use(express.json());
const { is_user } = require('./middleware');

function generateMd5Hash(inputString) {
    const hash = crypto.createHash('md5');
    hash.update(inputString);
    return hash.digest('hex');
}



router.post('/login', async (req,res,next)=>{
    //Written By L-M, smartest man alive.
    const { username , password } = req.body;
    const get_user = () => new Promise((resolve,reject)=>{
        database.all(`SELECT * FROM user WHERE username = '${username || ""}'`,(err,rows)=>{
            resolve(rows || []);
        })
    })
    try {
        const user = (await get_user())[0];
        if(!user) return res.status(401).json({"error":`failed to login as user ${username}`});
        const hashed_password = user.password;
        if(hashed_password !== generateMd5Hash(password)) return res.status(401).json({"error":`failed to login as user ${user.username}`}); // << Very 6Pek move here -- Isaac Todd --
        const token = jwt.sign(user, process.env.JWT_SECRET);
        return res.json({token});
    }catch(err){
        console.error(err);
        return res.status(500).json({"error":"something went wrong"});
    }

});

router.post('/register',async (req,res)=>{

    const register = (username, password) => new Promise((resolve, reject)=>{
        const hashed_password = generateMd5Hash(password);
        database.run('INSERT INTO user (username, password) VALUES ($username, $password);', {
            $username: username,
            $password: hashed_password
        },(err)=>{
            if(err) return reject("Failed to create user.");
            return resolve();
        });
    });
    try {
        const username_regex = /^[A-Za-z0-9_]{1,20}$/;
        const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,20}$/;
        const {username, password} = req.body;
        if(!username || !password) return res.status(400).json({"error":"need username and password."});  
        if (!username_regex.test(username)) return res.status(400).json({"error":"username must be less than 20 characters, and limited to numbers, English characters, and underscore."});
        if (!password_regex.test(password)) return res.status(400).json({"error":"Password must be 8–20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&_)."});
        await register(username,password)

        return res.json({"message":"success"})
    }
    catch (err){
        console.error(err);
        return res.status(500).json({"error":"something went wrong"});
    }

});

router.get('/',is_user,(req,res)=>{
    return res.json({"message":"Hello Welcome! :D"})
});


module.exports = router;