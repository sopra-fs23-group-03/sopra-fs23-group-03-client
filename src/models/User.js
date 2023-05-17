/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.groupState = "NOGROUP";
    this.groupId = null;
    Object.assign(this, data);
  }
}
export default User;
