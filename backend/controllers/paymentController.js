const Razorpay = require('razorpay');
const asyncHandler = require("../middlewares/asyncHandler");

// const razorpay = new Razorpay({ key_id: "rzp_test_m8mkcKrmzK0IXv", key_secret: "RVmY275QvG4qrYGWlhkM9RqF" })

// @desc   Create razorpay order
// @route  POST /api/payment/checkout
// @access Private
const checkout = asyncHandler(async (req, res) => {
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEYID, key_secret: process.env.RAZORPAY_KEYSECRET })
    // console.log(process.env.RAZORPAY_KEYID);
    const { order } = req.body;
    // console.log(order);
    // console.log("ok");
    amount = order.totalPrice;
    // console.log(amount);
    var options = {
        amount: amount * 100, // amount in smallest currency unit
        currency: "INR",
        receipt: `order_${Date.now()}`,
    };
    const ordr = await razorpay.orders.create(options);
    res.json({
        order,
        payStatus: "created",
        id: ordr._id,
        key_id: process.env.RAZORPAY_KEYID,
    });
});

// @desc   Verify payment
// @route  POST /api/orders/verify
// @access Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { order } = req.body;
    // console.log(order);
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            // update_time: req.body.update_time,
            // email_address: req.body.email_address,
            update_time: Date.now(),
            // razorpay_order_id: req.body.orderId,
            // razorpay_payment_id: req.body.paymentId,
            // razorpay_signature: req.body.signature
        };

        const updatedOrder = await order.save();

        res.status(200).json({ success: true, updatedOrder });
    } else {
        res.status(400);
        throw new Error("Order not found");
    }
    // const { orderId, paymentId, signature } = req.body;
    // const generated_signature = crypto.create
    // const shasum = crypto.createHmac
    // const expected_signature = shasum('sha256', `${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
    // if (expected_signature === razorpay_signature) {
    //     res.status(200).json({
    //         message: "Payment successful"
    //     });
    // }
    // else {
    //     res.status(400);
    //     throw new Error("Payment verification failed");
    // }
});


module.exports = { checkout, verifyPayment };