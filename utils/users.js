const users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);
  console.log(users);

  return user;
}

function getCurrentUser(id) {
  console.log(users);
  return users.find((user) => user.id === id);
}

module.exports = {
    userJoin,
    getCurrentUser,
}
