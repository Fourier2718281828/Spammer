const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const PORT = 8000;
const {
    saveRow,
    allRows,
    updateRow,
    deleteRow,
    dbSetUp,
} = require("./DB/database");

app.use(cors())
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    dbSetUp();
});

app.post("/user", async (req, res) => {
    try {
        console.log("body: ", req.body)
        await saveRow(req.body);
        res.send("Saved successfully.");
    }
    catch (err) {
        res.send(`Save error: ${ err.message }.`);
    }
});

app.get("/films", async (req, res) => {
    try {
        const found = await allRows();
        res.send(found);
    }
    catch (err) {
        res.send(`Find all error: ${ err.message }.`);
    }
});

app.patch("/film", async (req, res) => {
    try {
        const body = req.body;
        const id = body.id;
        if(id === undefined)
            res.send("Update error: body must contain id field.");

        const updatedFields = {...body};
        delete updatedFields.id;
        const updated = await updateRow(id, updatedFields);

        if(updated.matchedCount === 0)
            res.send(`Film with id ${id} does not exist.`);
        else
            res.send(`Successful update of film with id ${id}.`);
    }
    catch (err) {
        res.send(`Update error: ${ err.message }`);
    }
});

app.delete("/film/id/:id", async (req, res) => {

    try {
        const id = req.params.id;
        const deleted = await deleteRow(id);
        if(deleted.deletedCount === 0)
            res.send(`Film with id ${id} does not exist.`);
        else
            res.send(`Successful delete of film with id ${id}`);
    }
    catch (err) {
        res.send(`Delete error: ${ err.message }`);
    }
});

app.get("/film/name/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const result = await findFilmsByName(name);
        if(!result)
            res.send(`No film with name ${name} was found.`);
        else
            res.send(result);
    }
    catch (err) {
        res.send(`Find error: ${ err.message }.`);
    }
});