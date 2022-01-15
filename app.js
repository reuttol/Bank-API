const express = require('express')

const { getAllUsers, getUser, createNewUser, deposit, updateCredit, withdraw, transfer, toggleActive } = require("./userController");
const PORT = 3000;

const app = express();
app.use(express.json());

app.get("/users", getAllUsers);

app.get("/users/:id", getUser);

app.post("/users", createNewUser);

app.put("/users/:id/deposit", deposit);

app.put("/users/:id/credit", updateCredit);

app.put("/users/:id/withdraw", withdraw);

app.put("/users/:id/transfer", transfer);

app.put("/users/:id/active", toggleActive);

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}.`)
})