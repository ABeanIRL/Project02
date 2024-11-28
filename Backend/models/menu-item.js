import mongoose from 'mongoose';

export const menuItemSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    image: Buffer,
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
});

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);