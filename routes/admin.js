const express = require('express');
const util = require('node:util');
const router = express.Router();
router.use(express.json());
const { is_admin } = require('./middleware');
const fs = require('fs/promises');
const exec = util.promisify(require('node:child_process').exec);
const path = require('path');

router.use('/', is_admin);
router.get('/welcome', (req,res)=>{
    return res.json({"message":"welcome Admin!"});
})

router.get('/notes', async (req,res)=>{
    try {
        const user_data = req['x_user_data']; 
        const note_list = ((await exec(`ls ${process.cwd()}/containers/${user_data.username}`)).stdout).split('\n').filter((v,i)=>{if(v) return v});
        return res.json(note_list)
        //const fileContent = fs.readFileSync('path/to/your/file.txt', 'utf8');
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"error":"something went wrong"});
    }
})


router.post('/notes/create', async (req,res)=>{
    try {
        const note_content = req.body.content || "";
        const user_data = req['x_user_data']; 
        const directoryPath = path.join(process.cwd(),'containers', user_data.username);

        try {await fs.mkdir(directoryPath, { recursive: true });} catch(err){};
        const note_id = Math.floor(Date.now() / 1000).toString();
        await fs.writeFile(path.join(directoryPath,note_id),note_content);
        return res.json({filename:note_id})
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"error":"something went wrong"});
    }
})

router.get('/note', async (req,res)=>{
    try { 
        const user_data = req['x_user_data']; 
        const filename = req.query.filename || "";
        const note_path = path.join(process.cwd(),'containers', user_data.username,filename);
        const content = await fs.readFile(note_path,{encoding:"utf-8"})
        return res.send(content);

    }
    catch(err){
        console.error(err);
        return res.status(500).json({"error":"something went wrong"});        
    }
})

router.delete('/note/:note_id', async (req,res)=>{
    try{
        const user_data = req['x_user_data']; 
        const directoryPath = path.join(process.cwd(),'containers', user_data.username);
        const node_id = (Number(req.params['note_id']) || '').toString();
        await fs.unlink(path.join(directoryPath,node_id));
        return res.json({"message":"success"});
        
    }
    catch(err){
        console.error(err);
        return res.status(500).json({"error":"something went wrong"});        
    }
})



module.exports = router;