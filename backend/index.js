const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const path = require("path")
const dbConfig = require("./config/db.config.cjs")
const app = express()
const Routes = require("./routes/route.js")

const PORT = process.env.PORT || 5000

dotenv.config();

app.use(express.json({ limit: '10mb' }))
app.use(cors())

// Serve static files from frontend build
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

// Connect to MongoDB using native client
async function startServer() {
    try {
        // Initialize native MongoDB connections for 3-database setup
        const databases = await dbConfig.connectDatabases();
        await dbConfig.createIndexes();
        const isConnected = await dbConfig.checkConnection();
        
        if (!isConnected) {
            throw new Error("Failed to verify database connection");
        }

        // Also connect Mongoose to main database for compatibility with existing models
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'attendance_main',
            ssl: true,
            tlsAllowInvalidCertificates: true,
            retryWrites: true,
            retryReads: true,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 10000,
        });
        console.log('✅ Connected to Mongoose (attendance_main)');

        // Set databases in app locals for access in controllers
        app.locals.databases = databases;
        app.locals.dbConfig = dbConfig;

        // Routes
        app.use('/', Routes);

        // Serve index.html for React Router (catch-all route)
        app.get('*', (req, res) => {
            res.sendFile(path.join(frontendBuildPath, 'index.html'));
        });

        // Start listening
        app.listen(PORT, () => {
            console.log(`\n✅ Server started at port ${PORT}\n`);
            console.log('📚 Database Architecture:');
            console.log('   1️⃣  attendance_main (Core: admins, teachers, students, classes, subjects, notices, complaints)');
            console.log('   2️⃣  attendance_records (Attendance tracking - optimized for high volume)');
            console.log('   3️⃣  attendance_logs (System logs & analytics)\n');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Start the server
startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⏹️  Shutting down gracefully...');
    await mongoose.disconnect();
    await dbConfig.disconnectDatabases();
    process.exit(0);
});