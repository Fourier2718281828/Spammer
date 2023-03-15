"use strict";

const PORT = 8000;
const API = `http://localhost:${PORT}`;
const delete_button_text = "Delete";
let user_data = {};
const notification_time = 1000;

const table_body = document.getElementById("table_body");
const form_open_button = document.getElementById("form_open_button");
const add_button = document.getElementById("add_button");
const close_button = document.getElementById("close_button");
const inputs_form = document.getElementById("inputs_form");

const surname_inp = document.getElementById("surname_inp");
const name_inp = document.getElementById("name_inp");
const lastname_inp = document.getElementById("lastname_inp");
const email_inp = document.getElementById("email_inp");

const notification = document.getElementById("notification");


const NotificationTypes = Object.freeze({
    success: "success",
    error  : "danger",
});

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

function hide(doc_elem)
{
    doc_elem.style.display = "none";
}

function show(doc_elem)
{
    doc_elem.style.display = "flex";
}

function showForm()
{
    show(inputs_form);
    clearFields();
}

function closeForm()
{
    hide(inputs_form);
    clearFields();
}

function onFieldChanged(event)
{
    const {
        name, value
    } = event.target;
    user_data[name] = value;
}

function clearFields()
{
    surname_inp.value   = "";
    name_inp.value      = "";
    lastname_inp.value  = "";
    email_inp.value     = "";
}

function addItem()
{
    add_table_item(1, ...Object.values(user_data));
    hide(inputs_form);
}

function validateInputFields()
{
    return !(
                surname_inp.value  === ""  ||
                name_inp.value     === ""  ||
                lastname_inp.value === ""  ||
                email_inp.value    === ""
            );
}

function notification_setup(text, type)
{
    notification.innerText = text;
    notification.setAttribute("class", `notification_${type}`);
}

function notify(text, type)
{
    notification_setup(text, type);
    show(notification);
    const tm = setTimeout(() => {
        hide(notification);
        clearTimeout(tm);
    }, notification_time);
}

function clear_user_data()
{
    user_data = {};
}

function sendQuery(url, queryType, data)
{
    return fetch(API + url, {
        method: queryType, 
        headers: {"content-type": "application/json"}, 
        body: JSON.stringify(data)
    });
}

//What if server is not running but we add a member?
//It would be added to the list but not to the db
//await fetch?
function addNewMemberAction()
{
    sendQuery("/user", "POST", user_data);
    clear_user_data();
}

function onAddButton()
{   
    if(validateInputFields())
    {
        addItem();
        clearFields();
        notify("Success!", NotificationTypes["success"]);
        addNewMemberAction();
    }
    else
    {
        notify("Invalid input!", NotificationTypes["error"]);
    }
}

function getAllUsers()
{
    return sendQuery("/users", "GET");
}

function addUsers(users)
{
    for(let i = 0; i < users.length; ++i)
    {
        const user = users[i];  
        const usurname = user["surname"];
        const uname = user["name"];
        const ulastname = user["lastname"];
        const uemail = user["email"];
        add_table_item(i + 1, usurname, uname, ulastname, uemail);
    }
}

function refreshListOfUsers()
{  
    getAllUsers()
        .then(res => res.json())
        .then(users => {
            addUsers(users);
        });
}

surname_inp.addEventListener("change", onFieldChanged);
name_inp.addEventListener("change", onFieldChanged);
lastname_inp.addEventListener("change", onFieldChanged);
email_inp.addEventListener("change", onFieldChanged);

form_open_button.addEventListener("click", showForm);
add_button.addEventListener("click", onAddButton);
close_button.addEventListener("click", closeForm);

refreshListOfUsers();