const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")


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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));




app.get("/", (req, res) => {
  res.send("Hello World");
});

//Index Route
app.get("/listings" , async (req, res) => {
   const allListings = await Listing.find({});
   res.render("listings/index", {allListings});
});


//New Route

app.get("/listings/new", (req , res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id" , async( req , res, next) => {
  try {
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("Listing not found");
    }
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    next(err);
  }

});

//Create Route 
app.post("/listings", async (req , res ,next) => {
  try{
    console.log(req.body); // Log the incoming data
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  } catch(err) {
    next(err);
  }
  
});

//Edit Route 
app.get("/listings/:id/edit", async (req , res, next) => {
  try {
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("Listing not found");
    }
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/edit.ejs" , {listing})
  } catch (err) {
    next(err);
  }

});

//Update Route 
app.put("/listings/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("Listing not found");
    }
    const updated = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if (!updated) {
      return res.status(404).send("Listing not found");
    }
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
});

//Delete Route
app.delete("/listings/:id" , async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("Listing not found");
    }
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }
    console.log(deletedListing);
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
})



// app.get("/testListing" , (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute , Goa",
//     country: "India"
// });

//  sampleListing.save();
// console.log("sample was saved");
// res.send("successful testing");

// });

app.use((err , req , res, next) => {
  console.error(err); // Log the actual error
  res.send("something went wrong!");
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});