const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const PORT = 8000;
const { sendLetter } = require("./letter-sender");
const {
    saveRow,
    allRows,
    updateRow,
    deleteRow,
    dbSetUp,
    findByEmail,
} = require("./DB/database");

app.use(cors())
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    dbSetUp();
});

app.get("/status", (req, res) => {
    res.status(200).send("Backend server is running.");
});

app.post("/user", async (req, res) => {
    try {
        await saveRow(req.body);
        res.send("Saved successfully.");
    }
    catch (err) {
        res.send(`Save error: ${ err.message }.`);
    }
});

app.get("/users", async (req, res) => {
    try {
        const found = await allRows();
        res.send(found);
    }
    catch (err) {
        res.send(`Find all error: ${ err.message }.`);
    }
});

app.patch("/user", async (req, res) => {
    try {
        const body = req.body;
        const email = body._email;
        delete body._email;
        if(email === undefined)
            res.send("Update error: body must contain email field.");

        const updated = await updateRow(email, body);

        if(updated.matchedCount === 0)
            res.send(`User with id ${email} does not exist.`);
        else
            res.send(`Successful update of film with id ${email}.`);
    }
    catch (err) {
        res.send(`Update error: ${ err.message }`);
    }
});

app.get("/user/email/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const found = await findByEmail(email);
        if(found)
            res.status(200).send(found);
        else
            res.status(500).send(`No user with email ${email} found.`);
    }
    catch (err) {
        res.status(500).send(`Find all error: ${ err.message }.`);
    }
});

app.delete("/user/email/:email", async (req, res) => {

    try {
        const email = req.params.email;
        const deleted = await deleteRow(email);
        if(deleted.deletedCount === 0)
            res.send(`User with email ${email} does not exist.`);
        else
            res.send(`Successful delete of user with email ${email}`);
    }
    catch (err) {
        res.send(`Delete error: ${ err.message }`);
    }
});

app.post("/letter", async (req, res) => {
    try {
        console.log("server body:", req.body);
        const body = req.body;
        const myEmail = body.myEmail;
        const myPassword = body.myPassword;
        const toEmail = body.toEmail;
        const title = body.title;
        const text = body.text;
        await sendLetter(myEmail, myPassword, toEmail, title, text);
        res.status(200).send('Email sent successfully');
    }
    catch (err) {
        res.status(500).send('Failed to send email');
    }
});