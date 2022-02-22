const express = require('express');
var cron = require('node-cron');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

//Setting up PORT
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

//Connecting to Mongo DB
const uri = `mongodb+srv://${'tweetsyuser'}:${'QCD2AzI2HM7nTDpP'}@cluster0.qmw5x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('database connected!')
        const database = client.db('tweetsy');
        const remindersCollection = database.collection('reminders');


        //Posting a reimnder
        app.post('/reminders', async (req, res) => {
            const reminderOne = req.body;
            const result = await remindersCollection.insertOne(reminderOne).then( () => {
                console.log("data inserted");
            });
            res.json(result);

            // //initilizing the reminder
            // var task = cron.schedule('0 1 * * *', () => {
            //     console.log(`Running a reminder at ${req.body.time} at ${req.body.timezone}`);
            // }, {
            //     scheduled: true,
            //     timezone: req.body.timezone
            // });
            // task.destroy();
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