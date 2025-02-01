import {Router} from "express";
import razorpayInstance from "../config/razorpay.js";
import Payment from "../models/payment.js";
import {MembershipType, paymentAmount} from "../config/config.js";
import {validateWebhookSignature} from "razorpay/dist/utils/razorpay-utils.js";

const paymentRouter = new Router();

paymentRouter.post('/create', async (req, res) => {
    try {

        const {firstName, lastName, membershipType} = req.body;

        if (!membershipType || !Object.keys(MembershipType).includes(membershipType.toLowerCase())) {
            // todo send error response
        }

        // Convert to Paisa from Rupee
        const amount = paymentAmount[membershipType] * 100;

        const order = await razorpayInstance.orders.create({
            amount: amount,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName,
                lastName,
                membershipType,
            }
        })

        // Save it in my database
        console.log(order);

        const payment = new Payment({
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        });

        const savedPayment = await payment.save();

        // Return my order details to frontend
        res.json({...savedPayment.toJSON(), key: process.env.RAZORPAY_KEY_ID});

    } catch (e) {
        return res.status(500).send({message: e.message})
    }

});

paymentRouter.post('/webhook', async (req, res) => {
    try {
        const webhookBody = req.body;
        const webhookSignature = req.get('X-Razorpay-Signature');
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        console.log(webhookSecret, webhookSignature, webhookBody)
        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(webhookBody),
            webhookSignature,
            webhookSecret
        );
        console.log('is valid', isWebhookValid)

        if (!isWebhookValid) {
            return res.status(400).send({message: 'Invalid webhook'})
        }

        const orderId = webhookBody.payload.payment.entity.order_id;
        const status = webhookBody.payload.payload.entity.status;

        console.log('orderId', orderId, 'status', status);
        const payment = await Payment.findOne({orderId}).exec();
        payment.status = status;

        console.log('payment', payment)
        await payment.save();

        return res.status(200).send({message: 'Webhook call completed successfully'})
    } catch (e) {
        console.log(e);
        return res.status(500).send({message: e.message})
    }
})


export default paymentRouter;
