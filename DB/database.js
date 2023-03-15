"use strict";
const mongoose = require("mongoose");
const { mongoConfig } = require("./config");

function dbSetUp()
{
    mongoose.connect(mongoConfig.db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () => {
        console.log("Connected to mongoDB");
    });

    mongoose.connection.on("error", err => {
        console.log("Not connected to mongoDB", err);
    });
}

const MongusSchema = mongoose.Schema;
const RowSchema = new MongusSchema({
    surname: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
});

const row = mongoose.model("SpammedEmails", RowSchema);

async function saveRow(inRow)
{
    const toSave = new row(inRow);
    const saveResult = await toSave.save();
    return saveResult;
}

async function allRows()
{
    const findResult = await row.find();
    return findResult;
}

async function updateRow(id, newRow)
{
    const monId = new mongoose.Types.ObjectId(id);
    const updateResult = await row.updateOne({ _id: monId }, { $set : newRow});
    return updateResult;
}

async function deleteRow(id)
{
    const monId = new mongoose.Types.ObjectId(id);
    const deleteResult = await row.deleteOne({_id : monId});
    return deleteResult;
}


module.exports = {
    saveRow,
    allRows,
    updateRow,
    deleteRow,
    dbSetUp,
}
