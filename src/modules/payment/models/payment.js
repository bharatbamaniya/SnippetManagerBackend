import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: false
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    receipt: {
        type: String,
        required: true,
    },
    notes: {
        firstName: String,
        lastName: String,
        membership: String,
    }
}, {timestamps: true});

export default mongoose.model('Payment', paymentSchema);