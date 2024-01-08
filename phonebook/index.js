import express from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(
  morgan(
    ":method :url :status :date :res[content-length] - :response-time ms :body"
  )
);
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

const data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
// get all persons
app.get("/api/persons", (req, res) => {
  res.json(data);
});

// display info about the phonebook status
app.get("/info", (req, res) => {
  const count = data.length;
  const now = new Date().toUTCString();
  res.send(`<p>Phonebook has info for ${count} people </br> ${now} </p>`);
});

// get a single person

app.get("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const person = data.find((data) => data.id === id);
  if (person) {
    res.json(person);
  }
  res.status(404).json({ message: "404 not found" });
});

// delete resource

app.delete("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const person = data.find((data) => data.id === id);
  res.json({ person, message: "Removed person successfully" });
});

// create new contact

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  const name = data.find((data) => data.name === body.name);
  const number = data.find((data) => data.number === body.number);

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  if (name) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  if (number) {
    return res.status(400).json({
      error: "number must be unique",
    });
  }

  data.concat(person);
  res.json(person);
});
