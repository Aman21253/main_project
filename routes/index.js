const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const router = express.Router();

router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedIn, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success });
});

router.get("/cart", isLoggedIn, async function (req, res) {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart");

    if (!user.cart || user.cart.length === 0) {
        return res.render("cart", { user, bill: 0, cartWithImages: [] });
    }

    // Create a separate array ONLY for EJS
    const cartWithImages = user.cart.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        discount: item.discount,
        image: item.image ? item.image.toString("base64") : null
    }));

    const bill = user.cart.reduce((sum, item) => {
        return sum + item.price - item.discount;
    }, 0) + 20;

    res.render("cart", { user, bill, cartWithImages });
});

router.get("/logout", isLoggedIn, function (req, res) {
    res.render("shop");
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
    // console.log(req.user);
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
});
router.get("/remove/:productid", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });

    user.cart = user.cart.filter(
        productId => productId.toString() !== req.params.productid
    );

    await user.save();
    req.flash("success", "Item removed from cart");
    res.redirect("/cart");
});

// ---------------- CHECKOUT -------------------
router.post("/checkout", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email })
        .populate("cart");

    if (!user.cart || user.cart.length === 0) {
        req.flash("error", "Cart is empty!");
        return res.redirect("/cart");
    }

    const totalBill = user.cart.reduce(
        (sum, item) => sum + (item.price - item.discount),
        0
    );

    // 👉 You can create an order model if needed
    // For now, just clearing cart after checkout
    user.cart = [];
    await user.save();

    req.flash("success", `Checkout successful — Paid ₹${totalBill}`);
    res.redirect("/shop");
});

module.exports = router;