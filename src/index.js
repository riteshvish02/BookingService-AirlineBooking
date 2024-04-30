const express = require('express');

const app = express();
const {serverconfig,Logger} = require("./config")

const CRON = require('./utils/common/node-cron')

const apiroutes = require("./routes")
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api",apiroutes)
app.listen(serverconfig.PORT,()=>{
    console.log(`server listening on ${serverconfig.PORT}`);
    Logger.info(`server listening on ${serverconfig.PORT}`,"root",{})
    CRON()
})