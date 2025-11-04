const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
