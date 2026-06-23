const Products = require("./model/product.model.js");
const { initializeDatabase } = require("./db/db.connect.js");
const express = require("express");
const Category = require("./model/category.model.js");
const Users = require("./model/user.model.js");
const Address = require("./model/address.model.js");
const Cart = require("./model/cart.model.js");
const Wishlist = require("./model/wishlist.model.js");
const Order = require("./model/order.model.js");
// const ProductsData = require('./products.json')

const app = express();
initializeDatabase();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

async function seedData() {
  try {
    for (const ProductData of ProductsData) {
      const newProduct = new Products(ProductData);
      await newProduct.save();
    }
    console.log("All products saved successfully");
  } catch (error) {
    console.log("Error seeding the data:", error.message);
  }
}

// seedData()
// * all product route are here below

async function getAllProductData() {
  try {
    const product = await Products.find().populate("categoryField");
    return product;
  } catch (error) {
    throw error;
  }
}

app.get("/api/products", async (req, res) => {
  try {
    const product = await getAllProductData();
    res.status(201).json({ data: product });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product Data" });
  }
});

async function getProductDetailByProductId(productId) {
  try {
    const product = await Products.findById(productId);
    // console.log(product);
    return product;
  } catch (error) {
    throw error;
  }
}

app.get("/api/products/:productId", async (req, res) => {
  try {
    const product = await getProductDetailByProductId(req.params.productId);
    if (product) {
      return res.status(201).json({ data: product });
    } else {
      res.status(404).json({ error: "This product Id not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product Data" });
  }
});

async function updateProductImageDetailByProductId(productId, dataToUpdate) {
  try {
    const product = await Products.findByIdAndUpdate(productId, dataToUpdate, {
      new: true,
    });
    return product;
  } catch (error) {
    throw error;
  }
}

app.post("/api/products/:productId", async (req, res) => {
  try {
    const product = await updateProductImageDetailByProductId(
      req.params.productId,
      req.body,
    );
    if (product) {
      res.status(201).json({ data: product });
    } else {
      res.status(404).json({ error: "Product Id not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product Data" });
  }
});

// ! get the Product Detail By Product Name

async function getProductDetailsByProductName(name) {
  try {
    const product = await Products.findOne({ productName: name });
    return product;
  } catch (error) {
    throw error;
  }
}

app.get("/api/productDetails/:productName", async (req, res) => {
  try {
    const product = await getProductDetailsByProductName(
      req.params.productName,
    );
    if (product) {
      res.status(201).json({ data: product });
    } else {
      res.status(404).json({ error: "This product Name not found in DB" });
      console.error(error.message);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product Detail" });
  }
});

async function createCategoryData(newCategory) {
  try {
    const category = new Category(newCategory);
    return category.save();
  } catch (error) {
    throw error;
  }
}

app.post("/category", async (req, res) => {
  try {
    const category = await createCategoryData(req.body);
    if (category) {
      res
        .status(201)
        .json({ message: "Saved all Category inside the Product Schema" });
    } else {
      res.status(404).json({ error: "Category not created" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch Category Data", details: error.message });
  }
});

async function getAllProductDataByCategoryId(categoryId) {
  try {
    const products = await Products.find({ categoryField: categoryId });
    return products;
  } catch (error) {
    throw error;
  }
}

app.get("/api/products/category/:CategoryId", async (req, res) => {
  try {
    const product = await getAllProductDataByCategoryId(req.params.CategoryId);
    console.log(product);
    if (product) {
      return res.status(200).json({ data: product });
    } else {
      res.status(404).json({ error: "This product Id not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product Data" });
  }
});

async function getAllCategoryData() {
  try {
    const category = await Category.find();
    return category;
  } catch (error) {
    throw error;
  }
}

app.get("/api/categories", async (req, res) => {
  try {
    const category = await getAllCategoryData();
    if (category) {
      res.status(201).json({ data: category });
    } else {
      res.status(404).json({ error: "Categories not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch Category Data", details: error.message });
  }
});

async function getCategoryByCategoryId(categoryId) {
  try {
    const category = await Category.findById(categoryId);
    return category;
  } catch (error) {
    throw error;
  }
}

app.get("/api/categories/:categoryId", async (req, res) => {
  try {
    const category = await getCategoryByCategoryId(req.params.categoryId);
    if (category) {
      res.status(200).json({ data: category });
    } else {
      res.status(404).json({ error: "Category Id not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch Category Data", details: error.message });
  }
});

async function getAllProductDataByCategoryName(categoryName) {
  try {
    const category = await Category.findOne({ categoryField: categoryName });
    if (!category) {
      return null;
    }
    const products = await Products.find({
      categoryField: category._id,
    }).populate("categoryField");
    return products;
  } catch (error) {
    throw error;
  }
}

app.get("/api/category/:categoryName", async (req, res) => {
  try {
    const category = await getAllProductDataByCategoryName(
      req.params.categoryName,
    );
    if (category) {
      res.json({ data: category });
    } else {
      res.status(404).json({ error: "Category Data not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Category Data" });
    console.error(error);
  }
});

async function deletedCategoryRouteWithSpecificVal(categoryId) {
  try {
    const product = await Products.findOneAndDelete({
      categoryField: categoryId,
    });
    return product;
  } catch (error) {
    throw error;
  }
}

app.delete(
  "/api/category/deletedCategoryName/:categoryName",
  async (req, res) => {
    try {
      const product = await deletedCategoryRouteWithSpecificVal(
        req.params.categoryName,
      );
      if (product.length !== 0) {
        res.status(201).json({
          json: "Deleted All Id which contains this Category Field",
          data: product,
        });
      } else {
        res.status(404).json({ error: "This Category Field not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Product Data Field" });
    }
  },
);

// * ----------------------- Add Cart Page --------------------------

// ! api for create a cart Details

async function createCartDetail(productId, productQuantity, productSize) {
  try {
    const product = await Products.findById(productId);
    if (!product) {
      return null;
    }

    const cartItem = new Cart({
      product: product._id,
      productQuantity: productQuantity,
      productSize,
      productSize,
    });

    console.log("CartItem:", cartItem);
    await cartItem.save();
    return cartItem;
  } catch (error) {
    throw error;
  }
}

app.post("/api/cart/:productId", async (req, res) => {
  try {
    const { productQuantity, productSize } = req.body;
    const cart = await createCartDetail(
      req.params.productId,
      productQuantity,
      productSize,
    );
    if (!cart) {
      return res.status(404).json({ error: "Product Id not found" });
    }
    console.log("Cart: ", cart);
    res.status(201).json({
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to add product to cart",
      details: error.message,
    });
    console.error(error.message);
  }
});

// ! api for get a Cart Detail

async function getCartDetail() {
  try {
    const product = await Cart.find().populate("product");
    return product;
  } catch (error) {
    throw error;
  }
}

app.get("/api/cart", async (req, res) => {
  try {
    const cart = await getCartDetail();
    if (!cart) {
      return res.status(404).json({ error: "Cart Detail not found" });
    } else {
      res.status(201).json({
        message: "Cart Details is this",
        data: cart,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to Fetch Cart data",
      details: error.message,
    });
  }
});

// ! api for deleted a cart detail

async function deletedCartDetailByCartId(cartId) {
  try {
    const cart = await Cart.findByIdAndDelete(cartId);
    return cart;
  } catch (error) {
    throw error;
  }
}

app.delete("/api/deletedCart/:cartId", async (req, res) => {
  try {
    const cart = await deletedCartDetailByCartId(req.params.cartId);
    if (!cart) {
      res.status(404).json({ error: "This Cart Id not found" });
    } else {
      res.status(201).json({ message: "This cart Id is deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Cart Details" });
  }
});

// ! api for update the cart detail

async function updateToCartDetailByCartId(cartId, dataToUpdate) {
  try {
    const cart = await Cart.findByIdAndUpdate(cartId, dataToUpdate, {
      new: true,
    });
    return cart;
  } catch (error) {
    throw error;
  }
}

app.put("/api/updatedCart/:cartId", async (req, res) => {
  try {
    const cart = await updateToCartDetailByCartId(req.params.cartId, req.body);
    if (cart) {
      res
        .status(201)
        .json({ message: "Cart Item update Successfully", data: cart });
    } else {
      res.status(404).json({ error: "Product Id not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Cart Data" });
  }
});

async function updatedCartSizeByCartId(cartId, dataToUpdate) {
  try {
    const cart = await Cart.findByIdAndUpdate(cartId, dataToUpdate, {
      new: true,
    });
    return cart;
  } catch (error) {
    throw error;
  }
}

app.put("/api/updateCartBySize/:cartId", async (req, res) => {
  try {
    const cart = await updatedCartSizeByCartId(req.params.cartId, req.body);
    if (cart) {
      res
        .status(201)
        .json({ message: "Cart Item updated Successfully", data: cart });
    } else {
      res.status(404).json({ error: "This Product Id not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch Cart Data" });
  }
});

// ! api for when go to checkout page then deleted all card detail

async function deletedAllCartWhenGoToCheckOut() {
  try {
    const cart = await Cart.deleteMany({});
    return cart;
  } catch (error) {
    throw error;
  }
}

app.delete("/api/cart/deletedAll", async (req, res) => {
  try {
    const cart = await deletedAllCartWhenGoToCheckOut();
    console.log(cart);
    if (cart.deletedCount > 0) {
      res.status(201).json({ message: "All Cart Data Deleted successfully" });
    } else {
      res.status(404).json({ error: "Cart already empty" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Delete Cart Data" });
  }
});

// * ----------------------- WishList Page --------------------------

async function createWishListDetail(productId, productQuantity, productSize) {
  try {
    const product = await Products.findById(productId);
    if (!product) {
      return null;
    }

    const wishlist = new Wishlist({
      product: productId,
      productQuantity: productQuantity,
      productSize: productSize,
    });

    const savedWishlist = await wishlist.save();
    return savedWishlist;
  } catch (error) {
    throw error;
  }
}

app.post("/api/wishlist/:productId", async (req, res) => {
  try {
    const { productQuantity, productSize } = req.body;
    const wishlist = await createWishListDetail(
      req.params.productId,
      productQuantity,
      productSize,
    );
    if (!wishlist) {
      res.status(404).json({ error: "This Product Id not found in product" });
    } else {
      res.status(201).json({
        message: "Wishlist added successfully",
        data: wishlist,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to add Wishlist",
    });
    console.error(error.message);
  }
});

// ! api for get a Wishlist Detail

async function getWishListData() {
  try {
    const wishlist = await Wishlist.find().populate("product");
    return wishlist;
  } catch (error) {
    throw error;
  }
}

app.get("/api/wishlist", async (req, res) => {
  try {
    const wishlist = await getWishListData();
    if (!wishlist) {
      res.status(404).json({ error: "This Wishlist Id not found" });
    } else {
      res
        .status(201)
        .json({ message: "WishList Data is this: ", data: wishlist });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Wishlist Data" });
  }
});

// ! api for Delete a Wishlist Detail

async function deletedWishlistDetails(wishlistId) {
  try {
    const wishlist = await Wishlist.findByIdAndDelete(wishlistId);
    return wishlist;
  } catch (error) {
    throw error;
  }
}

app.delete("/api/wishlist/:wishlistId", async (req, res) => {
  try {
    const wishlist = await deletedWishlistDetails(req.params.wishlistId);
    if (!wishlist) {
      res.status(404).json({ error: "This Wishlist Id not found" });
      console.error(error.message);
    } else {
      res
        .status(201)
        .json({ message: "WishList Data is this: ", data: wishlist });
      console.log("Wishlist: ", wishlist);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Wishlist Data" });
  }
});

// * ----------------------- User Profile --------------------------

// ! api for added user Profile

async function createNewUserDetails(newUser) {
  try {
    const user = new Users(newUser);
    const savedUser = user.save();
    return savedUser;
  } catch (error) {
    throw error;
  }
}

app.post("/api/user", async (req, res) => {
  try {
    const user = await createNewUserDetails(req.body);
    if (user) {
      res.status(200).json({ data: user });
    }
    res.status(404).json({ error: "Something wrong in user Details " });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user Detail" });
  }
});

// ! api for get the user Data

async function getUserDetail() {
  try {
    const user = await Users.find();
    return user;
  } catch (error) {
    throw error;
  }
}

app.get("/api/user", async (req, res) => {
  try {
    const user = await getUserDetail();
    if (user) {
      res.status(201).json({ message: "User Detail this:", data: user });
    }
    res.status(404).json({ error: "This User Id not found in Db" });
  } catch (error) {
    throw error;
  }
});

// * ----------------------- User Address --------------------------

// ! create change for user Address

async function createUserAddress(newAddress) {
  try {
    const address = new Address(newAddress);
    const savedAddress = await address.save();
    return savedAddress;
  } catch (error) {
    throw error;
  }
}

app.post("/api/address", async (req, res) => {
  try {
    const address = await createUserAddress(req.body);
    if (address) {
      res.status(200).json({ data: address });
    }
    res.status(404).json({ error: "Something wrong in address Details " });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch address Detail" });
    console.error(error.message);
  }
});

// ! get All User Address

async function getAllDetailOfUserAddress() {
  try {
    const user = await Address.find();
    return user;
  } catch (error) {
    throw error;
  }
}

app.get("/api/address", async (req, res) => {
  try {
    const address = await getAllDetailOfUserAddress();
    if (!address) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json({ data: address });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch address Detail" });
  }
});

// ! update the User Address Detail

async function updatedToUserAddressDetail(addressId, dataToUpdate) {
  try {
    const address = await Address.findByIdAndUpdate(addressId, dataToUpdate, {
      new: true,
    });
    return address;
  } catch (error) {
    throw error;
  }
}

app.put("/api/address/:addressId", async (req, res) => {
  try {
    const address = await updatedToUserAddressDetail(
      req.params.addressId,
      req.body,
    );
    if (address) {
      res.status(201).json({ data: address });
    }
    res.status(404).json({ error: "That Address Id not found" });
    console.error(error.message);
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch address data" });
  }
});

// ! delete route using address id

async function deletedUserDetailAddress(addressId) {
  try {
    const address = await Address.findByIdAndDelete(addressId);
    return address;
  } catch (error) {
    throw error;
  }
}

app.delete("/api/address/:addressId", async (req, res) => {
  try {
    const address = await deletedUserDetailAddress(req.params.addressId);
    console.log(req.params.addressId);
    if (address) {
      res.status(201).json({ data: "User Address Deleted successfully" });
    }
    res.status(404).json({ error: "User Address id not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch User Address Details" });
  }
});

// ! post route for orderDetail

async function createOrderDetails(newOrder) {
  try {
    const order = new Order(newOrder);
    const savedOrder = await order.save();
    return savedOrder;
  } catch (error) {
    throw error;
  }
}

app.post("/api/order", async (req, res) => {
  try {
    const { products, user, address } = req.body; // ✅ products array aayega ab

    // ✅ Validation - products array check karo
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "At least one product is required",
      });
    }

    if (!user || !address) {
      return res.status(400).json({
        message: "User and Address are must required",
      });
    }

    // ✅ Har product ko validate karo aur price fetch karo
    const productDetails = [];
    let totalPrice = 0;

    for (const item of products) {
      const productData = await Products.findById(item.productId);

      if (!productData) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      // ✅ Check stock availability (optional)
      if (productData.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${productData.name}`,
        });
      }

      const itemTotal = productData.productPrice * item.quantity;
      totalPrice += itemTotal;

      productDetails.push({
        product: item.productId,
        quantity: item.quantity,
        price: productData.productPrice, // ✅ Product ki price store karo
      });
    }

    // ✅ Order create karo with multiple products
    const order = new Order({
      products: productDetails, // ✅ Array of products
      user,
      address,
      totalPrice,
      orderStatus: "Processing",
    });

    const savedOrder = await order.save();

    // ✅ Populate karo sab fields ko
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("products.product") // ✅ products array ke andar product populate
      .populate("user")
      .populate("address");

    if (order) {
      res.status(201).json({
        message: "Order placed successfully",
        order: populatedOrder,
      });
    } else {
      res
        .status(404)
        .json(
          { error: "Something went wrong in data" },
          console.error(error.message),
        );
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

async function getOrderDetailsById(orderId) {
  try {
    const order = await Order.findById(orderId)
      .populate("product")
      .populate("user")
      .populate("address")
      .select("product address user totalPrice quantity orderStatus createdAt");
    return order;
  } catch (error) {
    throw error;
  }
}

// ! get route for orderDetail by orderId

app.get("/api/order/:orderId", async (req, res) => {
  try {
    const order = await getOrderDetailsById(req.params.orderId);
    if (!order) {
      res.status(404).json({ error: "Order Id not found" });
    } else {
      res.status(201).json({ message: "Order Details is this: ", data: order });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch Order Detail" });
  }
});

// ! get route for all orderDetail

async function getAllOrderDetail() {
  try {
    const order = await Order.find()
      .populate("product")
      .select("product totalPrice quantity orderStatus createdAt");
    return order;
  } catch (error) {
    throw error;
  }
}

app.get("/api/order", async (req, res) => {
  try {
    const order = await getAllOrderDetail();
    if (!order) {
      res.status(404).json({ error: "Orders not found" });
    } else {
      res.status(201).json({ message: "Order Details is this: ", data: order });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch Order Details" });
    console.error(error.message);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server is running on this", PORT);
});
