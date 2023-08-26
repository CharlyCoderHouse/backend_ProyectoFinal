export default class UsersDto {

    constructor(user) {
        this.name = `${user.first_name} ${user.last_name}`
        this.email =  user.email 
        this.age = user.age ? user.age : ''
        this.role = user.role
        this.cart = user.cart._id
        this._id = user._id 
        this.last_connecion = user.last_connection
    }

}