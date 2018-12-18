
class Users {

  constructor (){
    this.users=[];
  }
  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser (id)  {
    var userlist = this.getUser(id);

    if(userlist){
      this.users = this.users.filter((user) => user.id !== id);
    }
    return userlist;
  }

  getUser (id)  {
    var user = this.users.filter((user) => {
      return user.id === id;
    });
    return user;
  }

  getUserList (room)  {
    var userlist = this.users.filter((user) => {
      return user.room === room;
    });
    var namesArray = userlist.map((user) => {
      return user.name;
    });

    return namesArray;
  }
}

module.exports = {Users};
