global.__basedir = __dirname;
const app = require("./App");
const mongoose = require("mongoose");
mongoose.set({ strictQuery: false });
mongoose
  .connect(
    "mongodb+srv://starStaging:nQ2zYmu1APv9r8Yh@cluster0.llrjflg.mongodb.net/ihearu",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((con) => console.log("connected to remote database cluster"));
const port = 3009;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
