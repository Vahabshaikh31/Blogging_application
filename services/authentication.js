const jsonwebtoken = require("jsonwebtoken");

const secret = "$uperman@123"; // Use environment variable for secret

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  // Add token expiration time
  const token = jsonwebtoken.sign(payload, secret); // Token expires in 1 hour
  return token;
}

function validateToken(token) {
  try {
    const payload = jsonwebtoken.verify(token, secret);
    return payload;
  } catch (err) {
    console.error("Invalid token:", err.message);
    return null; // Return null or handle the error as needed
  }
}

module.exports = {
  createTokenForUser,
  validateToken,
};
