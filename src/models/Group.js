/**
 * Group model
 */
class Group {
  constructor(data = {}) {
    this.id = null;
    this.hostId = null;
    this.GroupName = null;
    Object.assign(this, data);
  }
}
export default Group;
