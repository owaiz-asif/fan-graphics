import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import nodemailer from 'nodemailer'

let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function verifyToken(token) {
  try { return jwt.verify(token, process.env.JWT_SECRET) } catch { return null }
}

function getAuthUser(request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return verifyToken(authHeader.split(' ')[1])
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendOTPEmail(toEmail, otp, otpType = 'verification') {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { 
        user: process.env.NODEMAILER_EMAIL, 
        pass: process.env.NODEMAILER_PASSWORD 
      }
    })
    
    const emailTemplates = {
      admin_login: {
        subject: 'AFN GRAPHICS - Admin Login OTP',
        title: 'Admin Login Verification',
        message: 'Your admin login OTP code is:'
      },
      forgot_password: {
        subject: 'AFN GRAPHICS - Password Reset OTP',
        title: 'Password Reset Request',
        message: 'Your password reset OTP code is:'
      },
      verification: {
        subject: 'AFN GRAPHICS - OTP Verification',
        title: 'OTP Verification',
        message: 'Your OTP code is:'
      }
    }
    
    const template = emailTemplates[otpType] || emailTemplates.verification
    
    await transporter.sendMail({
      from: `"AFN GRAPHICS" <${process.env.NODEMAILER_EMAIL}>`,
      to: toEmail,
      subject: template.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #e91e8c 0%, #7c3aed 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: white; margin: 0; text-align: center;">AFN GRAPHICS</h2>
            <p style="color: white; margin: 5px 0 0 0; text-align: center; font-size: 12px;">You Dream it... We Design it...!!!</p>
          </div>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-top: 0;">${template.title}</h3>
            <p style="color: #666; font-size: 14px;">${template.message}</p>
            
            <div style="background: linear-gradient(135deg, #e91e8c 0%, #7c3aed 100%); padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: white; letter-spacing: 8px; margin: 0; font-size: 36px;">${otp}</h1>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-bottom: 0;">
              ⏱️ This code expires in 5 minutes
            </p>
          </div>
          
          <p style="color: #999; font-size: 11px; text-align: center; margin-top: 20px;">
            If you didn't request this code, please ignore this email.<br/>
            © 2025 AFN GRAPHICS. All rights reserved.
          </p>
        </div>
      `
    })
    console.log(`✅ OTP email sent successfully to ${toEmail}`)
    return true
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error.message)
    return false
  }
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // ========== AUTH ==========
    if (route === '/auth/register' && method === 'POST') {
      const body = await request.json()
      const { username, name, phone, password, address, email } = body
      if (!username || !name || !phone || !password) {
        return handleCORS(NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 }))
      }
      const existing = await db.collection('users').findOne({ $or: [{ username }, { phone }] })
      if (existing) return handleCORS(NextResponse.json({ error: 'Username or phone already registered' }, { status: 400 }))
      const hashedPwd = await bcrypt.hash(password, 10)
      const user = { id: uuidv4(), username, name, phone, email: email || '', password: hashedPwd, address: address || '', role: 'user', created_at: new Date() }
      await db.collection('users').insertOne(user)
      const token = generateToken({ id: user.id, username: user.username, role: 'user' })
      return handleCORS(NextResponse.json({ token, user: { id: user.id, username: user.username, name: user.name, phone: user.phone, email: user.email, address: user.address, role: 'user' } }))
    }

    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json()
      const { identifier, password } = body
      const user = await db.collection('users').findOne({ $or: [{ username: identifier }, { phone: identifier }] })
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return handleCORS(NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }))
      }
      const token = generateToken({ id: user.id, username: user.username, role: user.role })
      return handleCORS(NextResponse.json({ token, user: { id: user.id, username: user.username, name: user.name, phone: user.phone, email: user.email, address: user.address, role: user.role } }))
    }

    if (route === '/auth/forgot-password' && method === 'POST') {
      const { identifier } = await request.json()
      const user = await db.collection('users').findOne({ $or: [{ username: identifier }, { phone: identifier }] })
      if (!user) return handleCORS(NextResponse.json({ error: 'User not found' }, { status: 404 }))
      if (!user.email) return handleCORS(NextResponse.json({ error: 'No email associated with this account' }, { status: 400 }))
      const otp = generateOTP()
      await db.collection('otp_codes').deleteMany({ user_id: user.id, type: 'forgot_password' })
      await db.collection('otp_codes').insertOne({ id: uuidv4(), user_id: user.id, otp, type: 'forgot_password', expires_at: new Date(Date.now() + 5 * 60 * 1000), created_at: new Date() })
      const emailSent = await sendOTPEmail(user.email, otp, 'forgot_password')
      const response = { message: emailSent ? 'OTP sent to your email' : 'OTP generated (email delivery failed)', email_sent: emailSent }
      // Only include OTP hint if email failed (for development/testing)
      if (!emailSent) response.otp_hint = otp
      return handleCORS(NextResponse.json(response))
    }

    if (route === '/auth/verify-otp' && method === 'POST') {
      const { identifier, otp } = await request.json()
      const user = await db.collection('users').findOne({ $or: [{ username: identifier }, { phone: identifier }] })
      if (!user) return handleCORS(NextResponse.json({ error: 'User not found' }, { status: 404 }))
      const otpRec = await db.collection('otp_codes').findOne({ user_id: user.id, otp, type: 'forgot_password', expires_at: { $gt: new Date() } })
      if (!otpRec) return handleCORS(NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 }))
      return handleCORS(NextResponse.json({ message: 'OTP verified', user_id: user.id }))
    }

    if (route === '/auth/reset-password' && method === 'POST') {
      const { user_id, new_password } = await request.json()
      await db.collection('users').updateOne({ id: user_id }, { $set: { password: await bcrypt.hash(new_password, 10) } })
      await db.collection('otp_codes').deleteMany({ user_id })
      return handleCORS(NextResponse.json({ message: 'Password reset successful' }))
    }

    // ========== PRODUCTS ==========
    if (route === '/products' && method === 'GET') {
      const url = new URL(request.url)
      const category = url.searchParams.get('category')
      const search = url.searchParams.get('search')
      const brand = url.searchParams.get('brand')
      let filter = {}
      if (brand) filter.brand = brand
      if (category && category !== 'all') filter.category = category
      if (search) {
        filter.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }, { category: { $regex: search, $options: 'i' } }]
      }
      const products = await db.collection('products').find(filter).sort({ created_at: -1 }).toArray()
      return handleCORS(NextResponse.json(products.map(({ _id, ...r }) => r)))
    }

    if (path[0] === 'products' && path.length === 2 && method === 'GET') {
      const product = await db.collection('products').findOne({ id: path[1] })
      if (!product) return handleCORS(NextResponse.json({ error: 'Product not found' }, { status: 404 }))
      const { _id, ...clean } = product
      return handleCORS(NextResponse.json(clean))
    }

    if (route === '/products' && method === 'POST') {
      const user = getAuthUser(request)
      if (!user || user.role !== 'admin') return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const body = await request.json()
      const product = { id: uuidv4(), name: body.name, price: parseFloat(body.price) || 0, description: body.description || '', category: body.category || 'Uncategorized', brand: body.brand || 'afn_graphics', image_url: body.image_url || '', created_at: new Date() }
      await db.collection('products').insertOne(product)
      const { _id, ...clean } = product
      return handleCORS(NextResponse.json(clean))
    }

    if (path[0] === 'products' && path.length === 2 && method === 'PUT') {
      const user = getAuthUser(request)
      if (!user || user.role !== 'admin') return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const body = await request.json()
      const upd = {}
      if (body.name !== undefined) upd.name = body.name
      if (body.price !== undefined) upd.price = parseFloat(body.price)
      if (body.description !== undefined) upd.description = body.description
      if (body.category !== undefined) upd.category = body.category
      if (body.brand !== undefined) upd.brand = body.brand
      if (body.image_url !== undefined) upd.image_url = body.image_url
      await db.collection('products').updateOne({ id: path[1] }, { $set: upd })
      const updated = await db.collection('products').findOne({ id: path[1] })
      if (!updated) return handleCORS(NextResponse.json({ error: 'Product not found' }, { status: 404 }))
      const { _id, ...clean } = updated
      return handleCORS(NextResponse.json(clean))
    }

    if (path[0] === 'products' && path.length === 2 && method === 'DELETE') {
      const user = getAuthUser(request)
      if (!user || user.role !== 'admin') return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      await db.collection('products').deleteOne({ id: path[1] })
      return handleCORS(NextResponse.json({ message: 'Product deleted' }))
    }

    // ========== CATEGORIES ==========
    if (route === '/categories' && method === 'GET') {
      const url = new URL(request.url)
      const brand = url.searchParams.get('brand')
      let filter = {}
      if (brand) filter.brand = brand
      const cats = await db.collection('categories').find(filter).sort({ name: 1 }).toArray()
      return handleCORS(NextResponse.json(cats.map(({ _id, ...r }) => r)))
    }

    if (route === '/categories' && method === 'POST') {
      const user = getAuthUser(request)
      if (!user || user.role !== 'admin') return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const body = await request.json()
      const cat = { id: uuidv4(), name: body.name, brand: body.brand || 'afn_graphics', created_at: new Date() }
      await db.collection('categories').insertOne(cat)
      const { _id, ...clean } = cat
      return handleCORS(NextResponse.json(clean))
    }

    if (path[0] === 'categories' && path.length === 2 && method === 'DELETE') {
      const user = getAuthUser(request)
      if (!user || user.role !== 'admin') return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      await db.collection('categories').deleteOne({ id: path[1] })
      return handleCORS(NextResponse.json({ message: 'Category deleted' }))
    }

    // ========== CART ==========
    if (route === '/cart' && method === 'GET') {
      const user = getAuthUser(request)
      if (!user) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const items = await db.collection('cart_items').find({ user_id: user.id }).toArray()
      return handleCORS(NextResponse.json(items.map(({ _id, ...r }) => r)))
    }

    if (route === '/cart' && method === 'POST') {
      const user = getAuthUser(request)
      if (!user) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const { product_id, quantity } = await request.json()
      const existing = await db.collection('cart_items').findOne({ user_id: user.id, product_id })
      if (existing) {
        await db.collection('cart_items').updateOne({ user_id: user.id, product_id }, { $inc: { quantity: quantity || 1 } })
      } else {
        const product = await db.collection('products').findOne({ id: product_id })
        if (!product) return handleCORS(NextResponse.json({ error: 'Product not found' }, { status: 404 }))
        await db.collection('cart_items').insertOne({ id: uuidv4(), user_id: user.id, product_id, product_name: product.name, product_price: product.price, product_image: product.image_url, product_brand: product.brand, quantity: quantity || 1, created_at: new Date() })
      }
      const items = await db.collection('cart_items').find({ user_id: user.id }).toArray()
      return handleCORS(NextResponse.json(items.map(({ _id, ...r }) => r)))
    }

    if (path[0] === 'cart' && path.length === 2 && method === 'PUT') {
      const user = getAuthUser(request)
      if (!user) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const { quantity } = await request.json()
      if (quantity <= 0) await db.collection('cart_items').deleteOne({ id: path[1], user_id: user.id })
      else await db.collection('cart_items').updateOne({ id: path[1], user_id: user.id }, { $set: { quantity } })
      const items = await db.collection('cart_items').find({ user_id: user.id }).toArray()
      return handleCORS(NextResponse.json(items.map(({ _id, ...r }) => r)))
    }

    if (path[0] === 'cart' && path.length === 2 && method === 'DELETE') {
      const user = getAuthUser(request)
      if (!user) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      await db.collection('cart_items').deleteOne({ id: path[1], user_id: user.id })
      const items = await db.collection('cart_items').find({ user_id: user.id }).toArray()
      return handleCORS(NextResponse.json(items.map(({ _id, ...r }) => r)))
    }

    // ========== ORDERS ==========
    if (route === '/orders' && method === 'POST') {
      const user = getAuthUser(request)
      if (!user) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const { products, total_price, transaction_id } = await request.json()
      const order = { id: uuidv4(), user_id: user.id, products, total_price: parseFloat(total_price), transaction_id, status: 'Pending', created_at: new Date() }
      await db.collection('orders').insertOne(order)
      await db.collection('cart_items').deleteMany({ user_id: user.id })
      const { _id, ...clean } = order
      return handleCORS(NextResponse.json(clean))
    }

    if (route === '/orders' && method === 'GET') {
      const user = getAuthUser(request)
      if (!user) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const orders = await db.collection('orders').find({ user_id: user.id }).sort({ created_at: -1 }).toArray()
      return handleCORS(NextResponse.json(orders.map(({ _id, ...r }) => r)))
    }

    if (path[0] === 'orders' && path.length === 2 && method === 'PUT') {
      const user = getAuthUser(request)
      if (!user || user.role !== 'admin') return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const { status } = await request.json()
      await db.collection('orders').updateOne({ id: path[1] }, { $set: { status } })
      const updated = await db.collection('orders').findOne({ id: path[1] })
      const { _id, ...clean } = updated
      return handleCORS(NextResponse.json(clean))
    }

    // ========== ADMIN ==========
    if (route === '/admin/login' && method === 'POST') {
      const { username, password } = await request.json()
      if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const otp = generateOTP()
        await db.collection('otp_codes').deleteMany({ admin: true, type: 'admin_login' })
        await db.collection('otp_codes').insertOne({ id: uuidv4(), admin: true, otp, type: 'admin_login', expires_at: new Date(Date.now() + 5 * 60 * 1000), created_at: new Date() })
        const emailSent = await sendOTPEmail(process.env.ADMIN_EMAIL, otp, 'admin_login')
        const response = { message: emailSent ? 'OTP sent to admin email' : 'OTP generated (email delivery failed)', email_sent: emailSent }
        // Only include OTP hint if email failed (for development/testing)
        if (!emailSent) response.otp_hint = otp
        return handleCORS(NextResponse.json(response))
      }
      return handleCORS(NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 }))
    }

    if (route === '/admin/verify-otp' && method === 'POST') {
      const { otp } = await request.json()
      const otpRec = await db.collection('otp_codes').findOne({ admin: true, otp, type: 'admin_login', expires_at: { $gt: new Date() } })
      if (!otpRec) return handleCORS(NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 }))
      await db.collection('otp_codes').deleteMany({ admin: true, type: 'admin_login' })
      const token = generateToken({ id: 'admin', username: process.env.ADMIN_USERNAME, role: 'admin' })
      return handleCORS(NextResponse.json({ token, user: { id: 'admin', username: process.env.ADMIN_USERNAME, name: 'Admin', role: 'admin' } }))
    }

    if (route === '/admin/orders' && method === 'GET') {
      const user = getAuthUser(request)
      if (!user || user.role !== 'admin') return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const orders = await db.collection('orders').find({}).sort({ created_at: -1 }).toArray()
      const clean = orders.map(({ _id, ...r }) => r)
      for (let o of clean) {
        const u = await db.collection('users').findOne({ id: o.user_id })
        if (u) { o.user_name = u.name; o.user_phone = u.phone; o.user_email = u.email }
      }
      return handleCORS(NextResponse.json(clean))
    }

    // ========== CLOUDINARY ==========
    if (route === '/cloudinary/signature' && method === 'GET') {
      const user = getAuthUser(request)
      if (!user || user.role !== 'admin') return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const timestamp = Math.round(new Date().getTime() / 1000)
      const signature = cloudinary.utils.api_sign_request({ timestamp, folder: 'afn_products' }, process.env.CLOUDINARY_API_SECRET)
      return handleCORS(NextResponse.json({ signature, timestamp, cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, folder: 'afn_products' }))
    }

    // ========== SEED ==========
    if (route === '/seed' && method === 'POST') {
      // Check if data needs migration (no brand field)
      const sampleProd = await db.collection('products').findOne({})
      if (sampleProd && !sampleProd.brand) {
        await db.collection('products').deleteMany({})
        await db.collection('categories').deleteMany({})
      }

      // Seed AFN Graphics categories
      const afnCats = ['Logo Designing', 'Banner Design', 'Visiting Cards', 'Brochures', 'Bill Books', 'Employee ID Cards', 'Lanyard Prints', 'Labels & Stickers']
      for (const name of afnCats) {
        const exists = await db.collection('categories').findOne({ name, brand: 'afn_graphics' })
        if (!exists) await db.collection('categories').insertOne({ id: uuidv4(), name, brand: 'afn_graphics', created_at: new Date() })
      }

      // Seed Crazzy Gifts categories
      const crazzyCats = ['Personalized Mugs', 'Custom T-Shirts', 'Photo Frames', 'Keychains', 'Gift Hampers', 'Mobile Covers', 'Cushion Covers', 'Wall Clocks', 'Personalized Pens']
      for (const name of crazzyCats) {
        const exists = await db.collection('categories').findOne({ name, brand: 'crazzy_gifts' })
        if (!exists) await db.collection('categories').insertOne({ id: uuidv4(), name, brand: 'crazzy_gifts', created_at: new Date() })
      }

      // Seed admin
      const adminExists = await db.collection('users').findOne({ username: process.env.ADMIN_USERNAME })
      if (!adminExists) {
        await db.collection('users').insertOne({ id: uuidv4(), username: process.env.ADMIN_USERNAME, name: 'AFN Graphics Admin', phone: '6360772095', email: process.env.ADMIN_EMAIL, password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10), address: '', role: 'admin', created_at: new Date() })
      }

      // Seed AFN products
      const afnCount = await db.collection('products').countDocuments({ brand: 'afn_graphics' })
      if (afnCount === 0) {
        const afnProducts = [
          { name: 'Premium Logo Design', price: 2500, description: 'Professional custom logo design with unlimited revisions. Stand out with a unique brand identity.', category: 'Logo Designing', brand: 'afn_graphics', image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600' },
          { name: 'Corporate Banner Design', price: 1500, description: 'Eye-catching banner designs for events, promotions, and business branding.', category: 'Banner Design', brand: 'afn_graphics', image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600' },
          { name: 'Business Visiting Cards', price: 500, description: 'Premium quality visiting cards with elegant design. Pack of 100 on 300gsm paper.', category: 'Visiting Cards', brand: 'afn_graphics', image_url: 'https://images.pexels.com/photos/4623113/pexels-photo-4623113.jpeg?auto=compress&w=600' },
          { name: 'Company Brochure Design', price: 3000, description: 'Multi-page professional brochure design with stunning layouts.', category: 'Brochures', brand: 'afn_graphics', image_url: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=600' },
          { name: 'Custom Bill Book', price: 800, description: 'Customized bill books with your company logo and details.', category: 'Bill Books', brand: 'afn_graphics', image_url: 'https://images.unsplash.com/photo-1581079289196-67865ea83118?w=600' },
          { name: 'Employee ID Card', price: 200, description: 'Professional employee ID cards with photo. Durable PVC material.', category: 'Employee ID Cards', brand: 'afn_graphics', image_url: 'https://images.pexels.com/photos/12902944/pexels-photo-12902944.jpeg?auto=compress&w=600' },
          { name: 'Custom Lanyard Print', price: 150, description: 'Branded lanyards with custom prints for corporate events.', category: 'Lanyard Prints', brand: 'afn_graphics', image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600' },
          { name: 'Product Labels Pack', price: 300, description: 'Custom product labels with vibrant colors. Pack of 500 labels.', category: 'Labels & Stickers', brand: 'afn_graphics', image_url: 'https://images.unsplash.com/photo-1581079289196-67865ea83118?w=600' },
          { name: 'Minimalist Logo Package', price: 1800, description: 'Clean modern minimalist logo. 3 concepts, unlimited revisions.', category: 'Logo Designing', brand: 'afn_graphics', image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600' },
          { name: 'Roll-Up Banner Stand', price: 2200, description: 'Premium roll-up banner with stand for exhibitions and retail.', category: 'Banner Design', brand: 'afn_graphics', image_url: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=600' },
          { name: 'Luxury Visiting Cards', price: 1200, description: 'Premium cards with foil stamping. Pack of 200 on 400gsm stock.', category: 'Visiting Cards', brand: 'afn_graphics', image_url: 'https://images.pexels.com/photos/4623113/pexels-photo-4623113.jpeg?auto=compress&w=600' },
          { name: 'Tri-Fold Brochure', price: 1800, description: 'Professional tri-fold brochure with custom illustrations.', category: 'Brochures', brand: 'afn_graphics', image_url: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=600' },
        ]
        for (const p of afnProducts) await db.collection('products').insertOne({ id: uuidv4(), ...p, created_at: new Date() })
      }

      // Seed Crazzy Gifts products
      const crazzyCount = await db.collection('products').countDocuments({ brand: 'crazzy_gifts' })
      if (crazzyCount === 0) {
        const crazzyProducts = [
          { name: 'Magic Color Changing Mug', price: 450, description: 'Personalized magic mug that reveals your photo with hot water. Perfect surprise gift!', category: 'Personalized Mugs', brand: 'crazzy_gifts', image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600' },
          { name: 'Custom Photo Mug', price: 299, description: 'White ceramic mug with your favorite photo printed in vibrant colors.', category: 'Personalized Mugs', brand: 'crazzy_gifts', image_url: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=600' },
          { name: 'Custom Printed T-Shirt', price: 599, description: 'Premium cotton t-shirt with your custom design. Available in all sizes.', category: 'Custom T-Shirts', brand: 'crazzy_gifts', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600' },
          { name: 'Collage Photo Frame', price: 799, description: 'Beautiful collage photo frame with space for 8 photos. Wooden frame.', category: 'Photo Frames', brand: 'crazzy_gifts', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600' },
          { name: 'Custom Metal Keychain', price: 199, description: 'Premium metal keychain with your name or photo engraved.', category: 'Keychains', brand: 'crazzy_gifts', image_url: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=600' },
          { name: 'Premium Gift Hamper', price: 1999, description: 'Luxury gift hamper with chocolates, mug, frame, and more. Perfect for all occasions.', category: 'Gift Hampers', brand: 'crazzy_gifts', image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238f7e7?w=600' },
          { name: 'Custom Phone Cover', price: 349, description: 'Personalized phone cover with your photo. Available for all models.', category: 'Mobile Covers', brand: 'crazzy_gifts', image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600' },
          { name: 'Photo Cushion Cover', price: 499, description: 'Soft velvet cushion cover with your custom photo print.', category: 'Cushion Covers', brand: 'crazzy_gifts', image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
          { name: 'Custom Wall Clock', price: 899, description: 'Wooden wall clock with your favorite photo. Silent movement.', category: 'Wall Clocks', brand: 'crazzy_gifts', image_url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600' },
          { name: 'Personalized Pen Set', price: 349, description: 'Elegant pen set with your name engraved. Comes in a gift box.', category: 'Personalized Pens', brand: 'crazzy_gifts', image_url: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600' },
        ]
        for (const p of crazzyProducts) await db.collection('products').insertOne({ id: uuidv4(), ...p, created_at: new Date() })
      }

      return handleCORS(NextResponse.json({ message: 'Database seeded successfully' }))
    }

    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'AFN Graphics API', status: 'running' }))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute