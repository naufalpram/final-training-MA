module.exports = class RegisterUserData {
    username;
    password;
    role;
    name;
    email;
    gender;
    birthdate;
    
    constructor(data){
        this.username = data.username;
        this.password = data.password;
        this.role = data.role;
        this.name = data.name;
        this.email = data.email;
        this.gender = data.gender;
        this.birthdate = data.birthdate;
    }
}