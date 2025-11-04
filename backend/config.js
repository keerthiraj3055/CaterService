module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/caterservice',
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-key'
};