const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = require("./app");

// START SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
