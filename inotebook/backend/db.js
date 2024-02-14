const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/inotebook";

const connectToMongo = async () => {
    let retries = 3;
    while (retries > 0) {
        try {
            await mongoose.connect(mongoURI, {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
            });
            console.log("Connected to MongoDB successfully");
            return;
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            retries--;
            console.log(`Retrying connection. Remaining attempts: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds delay
        }
    }
    console.error("Failed to connect to MongoDB after multiple attempts.");
}

module.exports = connectToMongo;
