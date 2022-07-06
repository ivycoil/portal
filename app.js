const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose
	.connect("mongodb://localhost/todo")
	.then(() => console.log("Connecting to MongoDB"))
	.catch((err) => console.error("Could not connect. Basa", err));

const projectSchema = mongoose.Schema({
	title: String,
	status: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Project = mongoose.model("Project", projectSchema);

const app = express();
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/projects", (req, res) => {
	res.render("projects");
});

app.get("/api/projects", (req, res) => {
	Project.find({}, (err, results) => {
		res.send(results);
	});
});

app.post("/api/projects/add", (req, res) => {
	const project = new Project({
		title: req.body.title,
		status: req.body.status,
	});
	project.save().then((result) => res.send(result));
});

app.post("/api/projects/update", (req, res) => {
	Project.findOne({ _id: req.body.id }).then((project) => {
		project.title = req.body.title;
		project.status = req.body.status;
		project.save().then((result) => res.send(result));
	});
	console.log("Whatever");
});

app.get("/api/projects/delete/:id", (req, res) => {
	let whatever = req.params.id;
	Project.deleteOne({ _id: whatever }, (err, results) => {
		res.send(results);
	});
});

app.listen(3333, console.log("Listening to port 3333"));
