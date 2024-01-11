const { mongoose } = require("mongoose");
require("dotenv").config();
const url = process.env.MONGO_URI;
console.log(url);
mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((res) => console.log("Connected to Mongodb"))
  .catch((err) => console.error(err));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is  required"],
    minLength: [3, "Name must be at least 3 characters"],
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "User phone number required"],
    unique: [true, "Phone number must be unique"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
