const mongoose = require("mongoose");

const dbConfig = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("Database Connected");
    } catch (error) {
        console.error("Database Connection Failed:", error.message);

        process.exit(1);
    }
};

module.exports = dbConfig;