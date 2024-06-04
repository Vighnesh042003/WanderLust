const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.catch(err => console.log(err))
.then(()=>console.log("Connected TO DB") );

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:"665a823a06a8562991d7bba9"}));
    await Listing.insertMany(initData.data);

    console.log("Data was initialized");
}

initDB();