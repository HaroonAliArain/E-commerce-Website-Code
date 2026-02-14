const mongoose = require("mongoose");

function generateSlug(text) {
    if (!text || typeof text !== "string") return "undefined-slug";
    return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: String,
    isFeatured: { 
        type: Boolean, 
        default: false 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    }
}, { timestamps: true });

categorySchema.pre("validate", function () {
    if (!this.slug && this.name) {
        this.slug = generateSlug(this.name);
    }
});

module.exports = mongoose.model("Category", categorySchema);
