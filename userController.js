const {
  userModel,
  subCashFromAccount,
  loadUsers,
  saveUsers,
  findUser
} = require("./utils");

const getAllUsers = (req, res) => {
  const users = loadUsers();

  const balance = req.query.balance || 0;
  const orderBy = req.query.order_by || "id";
  const direction = req.query.direction === 'asc' ? 1 : -1 ;

  const filtered = users
    .filter((user) => user.cash >= balance && user.isActive)
    .sort((userA, userB) => (userA[orderBy] - userB[orderBy]) *direction);

  res.status(200).send(filtered);
};

const getUser = (req, res) => {
  const id = req.params.id;
  const users = loadUsers();
  const {user} = findUser(users, id);

  if (!user)
    return res.status(400).send({ error: `user with id ${id} doesn't exist` });

  res.status(200).send(user);
};

const createNewUser = (req, res) => {
  const id = req.body.id;
  const users = loadUsers();
  const {user} = findUser(users, id);

  if (user)
    return res.status(400).send({ error: `user with id ${id} already exist` });

  const name = req.body.name;
  const newUser = { ...userModel, id, name };
  users.push(newUser);
  saveUsers(users);
  res.status(200).send({msg: "User was created successfully", user: newUser});
};

const deposit = (req, res) => {
  const id = req.params.id;
  const users = loadUsers();
  const {index, user} = findUser(users, id);
  if (!user)
    return res.status(400).send({ error: `user with id ${id} doesn't exist` });

  if (!user.isActive)
    return res.status(400).send({ error: `user is not active` });

  const amount = parseInt(req.body.amount);
  if (amount < 1)
    return res.status(400).send({
      error: `can't add ${amount ? "negative" : "zero"} amount`,
    });

  user.cash += amount;
  users[index] = user;
  saveUsers(users);
  res.status(200).send({msg: `Deposited ${amount} succefully`, user});
};

const updateCredit = (req, res) => {
  const id = req.params.id;
  const users = loadUsers();
  const {index, user} = findUser(users, id);
  if (!user)
    return res.status(400).send({ error: `user with id ${id} doesn't exist` });

  if (!user.isActive)
    return res.status(400).send({ error: `user is not active` });

  const amount = parseInt(req.body.amount);
  if (amount < 1)
    return res.status(400).send({
      error: `can't add ${amount ? "negative" : "zero"} amount`,
    });

  user.credit = amount;
  users[index] = user;
  saveUsers(users);
  res.status(200).send({msg: "Updated credit successfully", user});
};

const withdraw = (req, res) => {
  const id = req.params.id;
  const users = loadUsers();
  const {index, user} = findUser(users, id);
  if (!user)
    return res.status(400).send({ error: `user with id ${id} doesn't exist` });

  if (!user.isActive)
    return res.status(400).send({ error: `user is not active` });

  const amount = parseInt(req.body.amount);
  if (amount < 1)
    return res.status(400).send({
      error: `can't add ${amount ? "negative" : "zero"} amount`,
    });

  const transObj = subCashFromAccount(user, amount);
  users[index] = transObj.user;
  saveUsers(users);
  res.status(200).send({
    msg: `Withdraw completed successfully. withdrew ${transObj.total}`,
    user,
  });
};

const transfer = (req, res) => {
  const id = req.params.id;
  const reciverID = req.body.id;

  const users = loadUsers();
  const senderObj = findUser(users, id);
  const recieverObj = findUser(users, reciverID);
  
  if (!senderObj.user)
    return res.status(400).send({ error: `user with id ${id} doesn't exist` });
  
  if (!recieverObj.user)
    return res
      .status(400)
      .send({ error: `user with id ${reciverID} doesn't exist` });

  if (!senderObj.user.isActive || !recieverObj.user.isActive)
    return res.status(400).send({ error: `user is not active` });

  const amount = parseInt(req.body.amount);
  if (amount < 1)
    return res.status(400).send({
      error: `can't add ${amount ? "negative" : "zero"} amount`,
    });

  const transObj = subCashFromAccount(senderObj.user, amount);

  recieverObj.user.cash += transObj.total;
  users[recieverObj.index] = recieverObj.user;
  users[senderObj.index] = senderObj.user;
  saveUsers(users);
  res.status(200).send({
    msg: `Transfer completed successfully. transferred ${transObj.total}`,
    sender: senderObj.user,
    reciever: recieverObj.user,
  });
};

const toggleActive = (req, res) => {
  const id = req.params.id;
  const users = loadUsers();
  const {index, user} = findUser(users, id);
  if (!user)
    return res.status(400).send({ error: `user with id ${id} doesn't exist` });

  user.isActive = !user.isActive;
  users[index] = user;
  saveUsers(users);
  res
    .status(200)
    .send({ msg: `user is ${user.isActive ? "" : "not"} active`, user });
};

module.exports = {
  getAllUsers,
  getUser,
  createNewUser,
  deposit,
  updateCredit,
  withdraw,
  transfer,
  toggleActive,
};
