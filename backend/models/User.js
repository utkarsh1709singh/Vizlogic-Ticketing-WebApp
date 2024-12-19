const bcrypt = require('bcryptjs');

// Simulating an in-memory user store for testing
let users = [];

// Simulate User Schema
class User {
  constructor(name, email, password, role = 'customer') {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  // Method to hash password (simulating bcrypt.hash for testing)
  async save() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    users.push(this); // Add to in-memory store (array)
    return this;
  }

  // Static method to find a user by email (simulating a DB query)
  static async findOne({ email }) {
    return users.find((user) => user.email === email);
  }

  // Method to compare entered password with stored password (simulating bcrypt.compare)
  static async comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}

module.exports = User;

