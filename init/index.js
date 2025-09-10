const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.log(err);
});

  
async function main() {
  await mongoose.connect(MONGO_URL);
  
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.inserMany(data);
  console.log("Data has been initialized");
}; 

initDB();