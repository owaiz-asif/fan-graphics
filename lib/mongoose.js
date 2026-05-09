import mongoose from 'mongoose'

const MONGODB_URI = process.env.NODE_ENV === 'production'
  ? process.env.MONGODB_URI
  : 'mongodb://localhost:27017/afngraphics'

const globalWithMongoose = globalThis
const cached = globalWithMongoose.mongoose || { conn: null, promise: null }
globalWithMongoose.mongoose = cached

async function connectDB() {
  // Only validate in production at runtime, not build time
  if (process.env.NODE_ENV === 'production' && !MONGODB_URI) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URI in production.')
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/afngraphics', {
      bufferCommands: false,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
    }).then((mongooseInstance) => mongooseInstance.connection)
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    cached.promise = null
    cached.conn = null
    console.error('MongoDB connection error:', error)
    throw new Error(`MongoDB connection failed: ${error.message}`)
  }
}

export default connectDB
