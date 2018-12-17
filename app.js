const express = require("express"),
  bodyParser = require("body-parser"),
  stripe = require("stripe")("your secret key here"),
  exphbs = require("express-handlebars"),
  path = require("path"),
  app = express(),
  port = process.env.PORT || 3000;

const hbs = exphbs.create({
  /* config */
});
//-------- Middlewares -------------
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

//body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set static folder
app.use(express.static(path.join(__dirname, "/public")));
//----------------------------------

app.get("/", function(req, res) {
  res.render("index", { title: "Home ", layout: "main" });
});

//charge route
app.post("/charge", function(req, res) {
  const amount = 2500;
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "Web development eBook",
        currency: "USD",
        customer: customer.id
      })
    )
    .then(charge => res.render("success", { title: "Home ", layout: "main" }));
});

app.listen(port, function() {
  console.log("app is running on " + port);
});
