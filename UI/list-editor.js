"use strict";
const table_body = document.getElementById("table_body");
const form_open_button = document.getElementById("form_open_button");
const add_button = document.getElementById("add_button");
const close_button = document.getElementById("close_button");
const inputs_form = document.getElementById("inputs_form");

const surname_inp = document.getElementById("surname_inp");
const name_inp = document.getElementById("name_inp");
const lastname_inp = document.getElementById("lastname_inp");
const email_inp = document.getElementById("email_inp");

const delete_button_text = "Delete";
const user_data = {};

function create_text_item(text)
{
    const td = document.createElement("td");
    const textNode = document.createTextNode(text);
    td.appendChild(textNode);
    return td;
}

function create_button(text)
{
    const td = document.createElement("td");
    const textNode = document.createTextNode(text);
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-danger");
    button.appendChild(textNode);
    td.appendChild(button);
    return td; 
}

function create_delete_button()
{
    return create_button(delete_button_text);
}

function add_table_item(num, surname, name, lastname, email)
{
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerText = num;
    tr.appendChild(th);

    const params = Array.from([surname, name, lastname, email]);
    params.forEach(param => {
        const text_item = create_text_item(param);
        tr.appendChild(text_item);
    });

    const button = create_delete_button();
    tr.appendChild(button);
    table_body.appendChild(tr);
}

form_open_button.addEventListener("click", event => {
    inputs_form.style.display = "flex";
    clearFields();
});

function changeField(event)
{
    const {
        name, value
    } = event.target;
    user_data[name] = value;
}

function clearFields()
{
    surname_inp.value = "";
    name_inp.value = "";
    lastname_inp.value = "";
    email_inp.value = "";
}

function addItem()
{
    console.log("user_data:", user_data);
    add_table_item(1, ...Object.values(user_data));
    inputs_form.style.display = "none";
    clearFields();
}

function closeForm()
{
    inputs_form.style.display = "none";
    clearFields();
}

surname_inp.addEventListener("change", changeField);
name_inp.addEventListener("change", changeField);
lastname_inp.addEventListener("change", changeField);
email_inp.addEventListener("change", changeField);

add_button.addEventListener("click", addItem);
close_button.addEventListener("click", closeForm);