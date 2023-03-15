"use strict";

const PORT = 8000;
const API = `http://localhost:${PORT}`;
const delete_button_text = "Delete";
const edit_button_text = "Edit";
let user_data = {};
const notification_time = 1000;

const table_body = document.getElementById("table_body");
const form_open_button = document.getElementById("form_open_button");
const add_button = document.getElementById("add_button");
const edit_button = document.getElementById("edit_button");
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

function create_button(text, color, onClicked)
{
    const td = document.createElement("td");
    const textNode = document.createTextNode(text);
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", `btn btn-${color}`);
    button.addEventListener("click", onClicked);
    button.appendChild(textNode);
    td.appendChild(button);
    return td; 
}

function create_delete_button()
{
    return create_button(delete_button_text, "danger", onRowDelete);
}

function create_edit_button()
{
    return create_button(edit_button_text, "primary", onRowEdit);
}

function add_table_item(num, surname, name, lastname, email)
{
    const tr = document.createElement("tr");
    tr.setAttribute("id", getLocalUserId(num - 1));
    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerText = num;
    tr.appendChild(th);

    const params = Array.from([surname, name, lastname, email]);
    params.forEach(param => {
        const text_item = create_text_item(param);
        tr.appendChild(text_item);
    });

    const edit_button = create_edit_button();
    const delete_button = create_delete_button();
    tr.appendChild(edit_button);
    tr.appendChild(delete_button);
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

function showAddForm()
{
    show(inputs_form);
    show(add_button);
    clearFields();
}

function showEditForm()
{
    show(inputs_form);
    show(edit_button);
    clearFields();
}

function closeForm()
{
    hide(inputs_form);
    hide(add_button);
    hide(edit_button);
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

function addItem()
{
    add_table_item(1, surname_inp.value, name_inp.value, lastname_inp.value, email_inp.value);
    closeForm();
}

function doIfValidInput(func)
{
    if(validateInputFields())
    {
        func();
        notify("Success!", NotificationTypes["success"]);
    }
    else
    {
        notify("Invalid input!", NotificationTypes["error"]);
    }
}

function onAddButton()
{   
    doIfValidInput( () => {
        addItem();
        clearFields();
        addNewMemberAction();
    });
}

function getAllUsers()
{
    return sendQuery("/users", "GET");
}

function getLocalUserId(id)
{
    return `user_${id}`;
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
        const deleteButton = create_delete_button();
        add_table_item(i + 1, usurname, uname, ulastname, uemail, deleteButton);
    }
}

function dbRefreshListOfUsers()
{  
    getAllUsers()
        .then(res => res.json())
        .then(users => {
            const sorted = users.sort((u1, u2) => {
                if(u1.email < u2.email) return -1;
                if(u1.email > u2.email) return 1;
                return 0;
            })
            addUsers(sorted);
        });
}

function dbDeleteRow(email)
{
    sendQuery(`/user/email/${email}`, "DELETE");
}

function dbEditRow(email)
{
    const body = {
        _email: email,
        surname: surname_inp.value,
        name: name_inp.value,
        lastname: lastname_inp.value,
        email: email_inp.value
    };
    sendQuery("/user", "PATCH", body);
}

function getButtonRow(target)
{
    return target.parentNode.parentNode;
}

function getRowChildText(row, index)
{
    return row.children[index].innerText;
}

function getSurname(row)
{
    return getRowChildText(row, 1);
}

function getName(row)
{
    return getRowChildText(row, 2);
}

function getLastname(row)
{
    return getRowChildText(row, 3);
}

function getEmail(row)
{
    return getRowChildText(row, 4);
}

function onRowDelete(event)
{
    const row = getButtonRow(event.target);
    const email = getEmail(row);
    dbDeleteRow(email);
    row.remove();
}

function onRowEdit(event)
{
    showEditForm();
    const row = getButtonRow(event.target);
    surname_inp.value = getSurname(row);
    name_inp.value = getName(row);
    lastname_inp.value = getLastname(row);
    email_inp.value = getEmail(row);

    edit_button.addEventListener("click", _dbEditRow);

    function _dbEditRow()
    {
        doIfValidInput(() => {
            dbEditRow(getEmail(row));
            const inputs = Array.from([
                surname_inp, 
                name_inp, 
                lastname_inp, 
                email_inp
            ]);

            for(let i = 0; i < inputs.length; ++i)
            {
                row.children[i + 1].innerText = inputs[i].value;
            }
            
            edit_button.removeEventListener("click", _dbEditRow);
            closeForm();
        });
    }
}

surname_inp.addEventListener("change", onFieldChanged);
name_inp.addEventListener("change", onFieldChanged);
lastname_inp.addEventListener("change", onFieldChanged);
email_inp.addEventListener("change", onFieldChanged);

form_open_button.addEventListener("click", showAddForm);
add_button.addEventListener("click", onAddButton);
close_button.addEventListener("click", closeForm);

dbRefreshListOfUsers();