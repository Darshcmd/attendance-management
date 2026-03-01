const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB Connection URLs
const MONGO_URI = process.env.MONGO_URL || 'mongodb+srv://Darshsoni:Darshsoni@2004@cluster0.5ehysep.mongodb.net/?appName=Cluster0';

const DB_NAMES = {
    MAIN: 'attendance_main',
    RECORDS: 'attendance_records',
    LOGS: 'attendance_logs'
};

// Global database instances
let mongoClient = null;
let databases = {};

/**
 * Connect to all MongoDB databases
 * @returns {Promise<Object>} - Object containing all database connections
 */
async function connectDatabases() {
    try {
        if (!mongoClient) {
            mongoClient = new MongoClient(MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 10,
                retryWrites: true,
            });

            await mongoClient.connect();
            console.log('✅ Connected to MongoDB Atlas');
        }

        // Initialize databases
        databases.main = mongoClient.db(DB_NAMES.MAIN);
        databases.records = mongoClient.db(DB_NAMES.RECORDS);
        databases.logs = mongoClient.db(DB_NAMES.LOGS);

        console.log('✅ Connected to all 3 databases:');
        console.log(`   - ${DB_NAMES.MAIN}`);
        console.log(`   - ${DB_NAMES.RECORDS}`);
        console.log(`   - ${DB_NAMES.LOGS}`);

        return databases;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
}

/**
 * Get specific database
 * @param {string} dbType - 'main', 'records', or 'logs'
 * @returns {Object} - Database instance
 */
function getDatabase(dbType = 'main') {
    if (!databases[dbType]) {
        throw new Error(`Database "${dbType}" not initialized. Call connectDatabases() first.`);
    }
    return databases[dbType];
}

/**
 * Get a collection from specific database
 * @param {string} collectionName - Name of collection
 * @param {string} dbType - 'main', 'records', or 'logs'
 * @returns {Object} - Collection instance
 */
function getCollection(collectionName, dbType = 'main') {
    const db = getDatabase(dbType);
    return db.collection(collectionName);
}

/**
 * Create indexes for better performance
 */
async function createIndexes() {
    try {
        const recordsDb = getDatabase('records');
        const attendanceCollection = recordsDb.collection('attendance');

        // Create indexes for attendance records
        await attendanceCollection.createIndex({ schoolId: 1 });
        await attendanceCollection.createIndex({ teacherId: 1 });
        await attendanceCollection.createIndex({ rollNumber: 1 });
        await attendanceCollection.createIndex({ date: 1 });
        await attendanceCollection.createIndex({ schoolId: 1, date: -1 });

        console.log('✅ Database indexes created successfully');
    } catch (error) {
        console.error('⚠️  Index creation warning:', error.message);
    }
}

/**
 * Disconnect from MongoDB
 */
async function disconnectDatabases() {
    if (mongoClient) {
        await mongoClient.close();
        console.log('✅ Disconnected from MongoDB');
    }
}

/**
 * Check database connection status
 */
async function checkConnection() {
    try {
        const adminDb = getDatabase('main');
        const ping = await adminDb.admin().ping();
        console.log('✅ Database connection is healthy');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

module.exports = {
    connectDatabases,
    getDatabase,
    getCollection,
    createIndexes,
    disconnectDatabases,
    checkConnection,
    DB_NAMES,
    mongoClient: () => mongoClient
};
