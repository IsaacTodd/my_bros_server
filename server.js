const express = require('express');
const app = express();
require('dotenv').config();
require('./initialize_db')();


const port = process.env.PORT ||  3000;



// app.get('/', (req, res) => {

//   res.send('Hello World!')
  
// })

app.use(require('./routes/user'));
app.use("/admin", require('./routes/admin'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
