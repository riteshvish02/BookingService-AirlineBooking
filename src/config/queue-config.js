const amqplib = require('amqplib');
let channel,connection;
async function connectqueue(){
    try {
         connection = await amqplib.connect("amqp://localhost")
         channel = await connection.createChannel()
        await channel.assertQueue("noti-queue")
     
    } catch (error) {
        console.log(error);
    }
}

async function senddata(){
    try {
        channel.sendToQueue("noti-queue", Buffer.from("this is a test message"))
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    connectqueue,
    senddata
}