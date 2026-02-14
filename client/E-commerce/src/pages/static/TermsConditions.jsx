import { FileText, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import BackButton from "../../components/ui/BackButton";

const TermsConditions = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: `By accessing and using E-Shop's website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.

These terms apply to all visitors, users, and customers who access or use our platform. We reserve the right to update or modify these terms at any time without prior notice.`
        },
        {
            title: "2. Use of Service",
            content: `You agree to use our services only for lawful purposes and in accordance with these Terms. You are prohibited from:

• Violating any applicable local, state, national, or international law
• Transmitting any harmful, threatening, abusive, or offensive content
• Attempting to gain unauthorized access to our systems or user accounts
• Interfering with or disrupting the integrity of our services
• Collecting or harvesting user information without consent
• Using automated systems to access our services without permission`
        },
        {
            title: "3. User Accounts",
            content: `When you create an account with us, you must provide accurate and complete information. You are responsible for:

• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized access
• Ensuring your account information remains current and accurate

We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.`
        },
        {
            title: "4. Products and Pricing",
            content: `We strive to display accurate product information and pricing. However:

• Prices are subject to change without notice
• We reserve the right to correct pricing errors
• Product images are for illustration purposes and may vary slightly
• We do not guarantee availability of any product
• Promotional offers may have additional terms and conditions

In case of pricing errors, we will contact you before processing your order with the correct price.`
        },
        {
            title: "5. Orders and Payments",
            content: `By placing an order, you agree to:

• Provide current, complete, and accurate purchase information
• Pay all charges at the prices in effect when incurred
• Pay any applicable taxes and shipping fees

We reserve the right to refuse or cancel orders at our discretion, including orders that appear fraudulent, violate our policies, or have pricing errors. Payment must be received before order processing.`
        },
        {
            title: "6. Shipping and Delivery",
            content: `Shipping terms include:

• Standard shipping fee of $10 applies to all orders
• Delivery times are estimates and not guaranteed
• Risk of loss passes to you upon delivery to the carrier
• We are not responsible for delays caused by carriers or customs
• International orders may be subject to import duties and taxes

You are responsible for providing accurate shipping information. Additional charges may apply for redelivery due to incorrect addresses.`
        },
        {
            title: "7. Returns and Refunds",
            content: `Our return policy allows:

• Returns within 30 days of delivery for most items
• Products must be unused and in original packaging
• Certain items (perishables, personalized goods) are non-returnable
• Refunds are processed within 5-10 business days after inspection
• Original shipping costs are non-refundable

To initiate a return, contact our customer service team with your order details.`
        },
        {
            title: "8. Intellectual Property",
            content: `All content on our website, including but not limited to:

• Text, graphics, logos, and images
• Software and underlying code
• Product descriptions and photographs
• Trademarks and service marks

is the property of E-Shop or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`
        },
        {
            title: "9. Limitation of Liability",
            content: `To the fullest extent permitted by law:

• E-Shop shall not be liable for any indirect, incidental, special, or consequential damages
• Our total liability shall not exceed the amount paid for the product or service in question
• We do not guarantee uninterrupted or error-free service
• We are not responsible for third-party actions or content

These limitations apply regardless of the form of action, whether in contract, tort, or otherwise.`
        },
        {
            title: "10. Governing Law",
            content: `These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which E-Shop operates. Any disputes arising from these terms shall be resolved through binding arbitration or in the courts of competent jurisdiction.`
        },
        {
            title: "11. Contact Information",
            content: `If you have any questions about these Terms and Conditions, please contact us:

• Email: legal@eshop.com
• Phone: +1 (555) 123-4567
• Address: 123 E-commerce St, Digital City

We aim to respond to all inquiries within 2-3 business days.`
        }
    ];

    return (
        <div className="space-y-6">
            <BackButton />

            {/* Header */}
            <div className="card p-6 sm:p-8">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--color-primary-400) to-(--color-primary-700) flex items-center justify-center shadow-lg shrink-0">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-theme-primary pt-2">Terms & Conditions</h1>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
                {sections.map((section, index) => (
                    <div key={index} className="card p-5 sm:p-6 hover:shadow-theme-md transition-all duration-200">
                        <h2 className="text-lg sm:text-xl font-semibold text-theme-primary mb-3">
                            {section.title}
                        </h2>
                        <div className="text-theme-secondary text-sm sm:text-base leading-relaxed whitespace-pre-line">
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 rounded-full bg-(--color-primary-600) text-white shadow-lg hover:bg-(--color-primary-700) transition-all duration-200 hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default TermsConditions;
