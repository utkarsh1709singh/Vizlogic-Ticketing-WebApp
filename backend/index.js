const express = require('expresss');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const mainRouter = require("./Routes/index");
app.use('/api/v1',mainRouter);

app.listen(3000,()=>{
    console.log('Server is listenning on port 3000');
})