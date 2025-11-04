const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

// Mock multer
jest.mock('multer', () => {
  const multer = () => ({
    array: jest.fn(() => (req, res, next) => {
      // Mock file upload - add mock files to req.files
      req.files = [
        {
          fieldname: 'images',
          originalname: 'test-image.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('mock image data'),
          size: 1024,
        },
      ];
      next();
    }),
  });
  multer.memoryStorage = jest.fn();
  return multer;
});

// Mock redis service
jest.mock('../src/services/redis.service', () => ({
  isTokenBlacklisted: jest.fn().mockResolvedValue(false),
}));

// Mock imagekit service
jest.mock('../src/services/imagekit.service', () => ({
  uploadImage: jest.fn().mockResolvedValue({
    url: 'https://ik.imagekit.io/mock/test-image.jpg',
    fileId: 'mock-file-id',
  }),
}));

const productRoutes = require('../src/routes/product.route');
const User = require('../src/models/user.model');
const Product = require('../src/models/product.model');

let app;
let testUser;
let adminUser;
let token;
let adminToken;

beforeAll(async () => {
  // Create test app
  app = express();
  app.use(express.json());

  // Set cookies for authentication (since middleware reads from cookies)
  app.use((req, res, next) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      req.cookies = { token };
    }
    next();
  });

  app.use('/api/products', productRoutes);

  // Create test users
  testUser = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'user',
  });
  await testUser.save();

  adminUser = new User({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'hashedpassword',
    role: 'admin',
  });
  await adminUser.save();

  // Generate tokens
  token = jwt.sign({ userId: testUser._id, role: testUser.role }, process.env.JWT_SECRET || 'testsecret');
  adminToken = jwt.sign({ userId: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET || 'testsecret');
});

beforeEach(async () => {
  await Product.deleteMany({});
});

describe('POST /api/products', () => {
  it('should create product successfully for admin user (201)', async () => {
    const productData = {
      name: 'Test Product',
      price: 29.99,
      stock: 10,
      category: 'Electronics',
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('name', productData.name)
      .field('price', productData.price.toString())
      .field('stock', productData.stock.toString())
      .field('category', productData.category)
      .attach('images', Buffer.from('mock image'), 'test-image.jpg');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('product');
    expect(response.body.product.name).toBe(productData.name);
    expect(response.body.product.images).toHaveLength(1);
    expect(response.body.product.images[0]).toHaveProperty('url');
  });

  it('should return 403 for unauthorized user (not admin/seller)', async () => {
    const productData = {
      name: 'Test Product',
      price: 29.99,
      stock: 10,
      category: 'Electronics',
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', productData.name)
      .field('price', productData.price.toString())
      .field('stock', productData.stock.toString())
      .field('category', productData.category)
      .attach('images', Buffer.from('mock image'), 'test-image.jpg');

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Access denied. Only admin or seller can create products.');
  });

  it('should return 400 for validation errors (missing required fields)', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('price', '29.99')
      .field('stock', '10')
      // Missing name and category
      .attach('images', Buffer.from('mock image'), 'test-image.jpg');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  it('should return 400 for invalid input (negative price)', async () => {
    const productData = {
      name: 'Test Product',
      price: -10, // Invalid negative price
      stock: 10,
      category: 'Electronics',
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('name', productData.name)
      .field('price', productData.price.toString())
      .field('stock', productData.stock.toString())
      .field('category', productData.category)
      .attach('images', Buffer.from('mock image'), 'test-image.jpg');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
});
