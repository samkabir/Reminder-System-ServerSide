const express = require('express');
var cron = require('node-cron');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();

//Setting up PORT
const port = 5000;

//Connecting to Mongo DB
const uri = `mongodb+srv://${'tweetsyuser'}:${'QCD2AzI2HM7nTDpP'}@cluster0.qmw5x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('database connected!')
        const database = client.db('tweetsy');
        const reminders = database.collection('reminders');


        //Posting a reimnder
        app.post('/reminder', async (req, res) => {
            const reminderOne = req.body;
            const result = await reminders.insertOne(reminderOne);
            res.json(result);

            //initilizing the reminder
            var task = cron.schedule('0 1 * * *', () => {
                console.log(`Running a job at ${req.body.time} at ${req.body.timezone}`);
            }, {
                scheduled: true,
                timezone: req.body.timezone
            });
            task.destroy();
        });

        



    }
    finally{
        // await client.closes();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from Tweetsy')
});

app.listen(port, () => {
    console.log('listening to port', port);
})