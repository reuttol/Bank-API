const fs = require("fs");

const userModel = {
  id: "",
  name: "",
  cash: 0,
  credit: 0,
  isActive: true
};

const subCashFromAccount = (user, amount) => {
  let total = amount;
  if (user.cash >= amount) {
    user.cash -= amount;
  } else if (user.credit >= amount - user.cash) {
    user.credit -= amount - user.cash;
    user.cash = 0;
  } else {
    total = user.credit + user.cash;
    user.credit = 0;
    user.cash = 0;
  }

  return { user, total };
};

const loadUsers = () => {
  try {
    const stringData = fs.readFileSync("./users.json", {
      encoding: "utf8",
      flag: "r",
    });
    return JSON.parse(stringData);
  } catch (err) {
    return [];
  }
};

const saveUsers = (users) => {
  const dataJSON = JSON.stringify(users);
  fs.writeFileSync("./users.json", dataJSON);
};

const findUser = (users, id) => {
  for(let i=0; i< users.length; i++){
    if(users[i].id === id)
      return {index: i, user: users[i]}
  }
  return {index: -1, user: null}
};

module.exports = {
    userModel,
    subCashFromAccount,
    loadUsers,
    saveUsers,
    findUser
  };
