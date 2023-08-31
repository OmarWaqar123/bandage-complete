const express = require("express")
const cors = require("cors")
const app = express();
const router = require("./Routes/auth");
const productrouter = require("./Routes/product");
const mongoose = require("mongoose");
const path = require("path")
require("dotenv").config()

mongoose.connect(process.env.mongoDB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("connection to db is successful")
}).catch(err => console.log("connection to db failed"))


app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({limit: "50mb", extended:true}))
app.use(cors({credentials:true}))
// , origin:"http://localhost:5173"
app.use("/auth",router)
app.use("/product",productrouter)

app.use(express.static(path.join(__dirname, "./Frontend/vite-project/dist")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./Frontend/vite-project/dist/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});



const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log("server is listening on port 4000")
})