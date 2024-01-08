import mongoose from "mongoose";

// password, name, number should be passed as arguments

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://sergeyvinokov:${password}@cluster0.84jeneq.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name,
  number,
});

if (name && number) {
  person.save().then((res) => {
    console.log(`Added ${name} ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((res) => {
    console.log(
      "Phonebook:",
      res.map((person) => {
        return `${person.name} ${person.number}`;
      })
    );

    mongoose.connection.close();
  });
}
