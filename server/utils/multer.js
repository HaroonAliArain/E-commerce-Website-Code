const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const category = req.body.category || "default";
    return {
      folder: `ecommerce/${category}`,
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `product-${Date.now()}`,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1000 * 1000,
  },
});

module.exports = upload;