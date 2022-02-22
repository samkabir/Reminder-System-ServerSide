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
            console.log(reminderOne);
            const result = await remindersCollection.insertOne(reminderOne).then( () => {
                console.log("data inserted");
            });
            
            //splitting the time
            // Example: time ='14:03' 
            let hour = reminderOne.time.substring(0,2);
            let minute = reminderOne.time.substring(3,5);
            console.log(hour, minute);

            //splitting the day
            // Example: date ='2022-03-24' 
            let day = reminderOne.date.substring(8,10);
            let month = reminderOne.date.substring(6,7);
            console.log(day, month);

            //Initilizing the reminder
            var task = cron.schedule(`${minute} ${hour} ${day} ${month} *`, () => {
                console.log(`Running a reminder at ${reminderOne.time} at ${reminderOne.timezone}`);
            }, {
                scheduled: false,
                // timezone: reminderOne.timezone
              });
            task.start();

            console.log('task has been initialised');
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