const ejs = require("ejs");
const path = require("path");

const renderTemplate = async (templateName, data) => {
    const templatePath = path.join(__dirname, "../templates/emails", templateName);
    const html = await ejs.renderFile(templatePath, data);
    return html;
};

module.exports = renderTemplate;
