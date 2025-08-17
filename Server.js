const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve your HTML form file
app.use(express.static(path.join(__dirname)));

// Handle form submission
app.post("/save_booking", (req, res) => {
  const filePath = path.join(__dirname, "bookings.json");

  // Read existing bookings or start empty array
  let bookings = [];
  if (fs.existsSync(filePath)) {
    bookings = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  // Add new booking
  bookings.push({
    grade: req.body.grade,
    lessonType: req.body.lessonType,
    subject: req.body.subject,
    duration: req.body.duration,
    hours: req.body.hours,
    name_first: req.body.name_first,
    name_last: req.body.name_last,
    email_address: req.body.email_address,
    cell_number: req.body.cell_number,
    total_price: req.body.amount,
    timestamp: new Date().toISOString()
  });

  // Save back to file
  fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2));

  // Redirect to PayFast
  const payfastURL = "https://www.payfast.co.za/eng/process";
  const queryString = new URLSearchParams(req.body).toString();
  res.redirect(`${payfastURL}?${queryString}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
