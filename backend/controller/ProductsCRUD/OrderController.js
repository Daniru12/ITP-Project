import Order from "../../models/Products/order.js"; // Order model
import Product from "../../models/Products/Product.js"; // Product model
import User from "../../models/User.js"; // User model


export const createOrder = async (req, res) => {
    const { quantity, shipping_details } = req.body;
    const productId = req.params.id; // Get productId from URL params
  
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized, please log in.' });
        }
  
        if (req.user.user_type !== 'pet_owner' && req.user.user_type !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only pet owners and admins can place orders.' });
        }
  
        const orderedProduct = await Product.findById(productId);
        if (!orderedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }
  
        if (orderedProduct.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient product quantity available.' });
        }
  
        const total_price = orderedProduct.promo_code_applied
            ? orderedProduct.price * quantity * 0.8
            : orderedProduct.price * quantity;
  
        const newOrder = new Order({
            product: productId,
            quantity,
            total_price,
            pet_owner: req.user.user_type === 'pet_owner' ? req.user._id : null,
            shipping_details,
            order_status: 'Pending',
        });
  
        const savedOrder = await newOrder.save();
  
        orderedProduct.quantity -= quantity;
        await orderedProduct.save();
  
        res.status(201).json({ message: 'Order placed successfully!', order: savedOrder });
  
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error, unable to place order.' });
    }
};
