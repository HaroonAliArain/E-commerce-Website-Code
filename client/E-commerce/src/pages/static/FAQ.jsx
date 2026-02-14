import { HelpCircle, ChevronDown, ArrowUp, Package, CreditCard, User, ShoppingBag, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import BackButton from "../../components/ui/BackButton";

const FAQ = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [openItems, setOpenItems] = useState({});

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

    const toggleItem = (categoryIndex, itemIndex) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const faqCategories = [
        {
            title: "Orders & Shipping",
            icon: Package,
            color: "from-[var(--color-primary-400)] to-[var(--color-primary-700)]",
            questions: [
                {
                    q: "How do I track my order?",
                    a: "Once your order is shipped, you'll receive an email with a tracking number. You can also view your order status by logging into your account and visiting the 'My Orders' section. Click on any order to see detailed tracking information."
                },
                {
                    q: "How long does shipping take?",
                    a: "Standard shipping typically takes 5-7 business days. Processing time is 1-2 business days before shipping. Delivery times may vary based on your location and carrier schedules. You'll receive an estimated delivery date when you place your order."
                },
                {
                    q: "What is the shipping cost?",
                    a: "We charge a flat shipping fee of $10 for all orders, regardless of order size or destination. This covers standard ground shipping to most locations."
                },
                {
                    q: "Do you ship internationally?",
                    a: "Currently, we ship within the domestic region. International shipping is coming soon. Sign up for our newsletter to be notified when international shipping becomes available."
                },
                {
                    q: "Can I change my shipping address after ordering?",
                    a: "If your order hasn't been shipped yet, contact our customer support immediately at support@eshop.com. We'll do our best to update the address. Once shipped, address changes are not possible."
                }
            ]
        },
        {
            title: "Returns & Refunds",
            icon: ShoppingBag,
            color: "from-[var(--color-accent-400)] to-[var(--color-accent-600)]",
            questions: [
                {
                    q: "What is your return policy?",
                    a: "We accept returns within 30 days of delivery for most items. Products must be unused, in original packaging, and in resaleable condition. Some items like perishables and personalized products cannot be returned."
                },
                {
                    q: "How do I initiate a return?",
                    a: "To start a return, log into your account, go to 'My Orders', select the order, and click 'Request Return'. Alternatively, contact our customer support team at returns@eshop.com with your order number."
                },
                {
                    q: "How long do refunds take?",
                    a: "Once we receive and inspect your return, refunds are processed within 5-10 business days. The refund will be credited to your original payment method. Please allow additional time for your bank to process the transaction."
                },
                {
                    q: "Do you offer exchanges?",
                    a: "Yes! If you'd like to exchange an item for a different size or color, please initiate a return and place a new order for the desired item. This ensures the fastest processing time."
                },
                {
                    q: "Who pays for return shipping?",
                    a: "For defective or incorrect items, we provide a prepaid return label at no cost. For other returns, customers are responsible for return shipping costs."
                }
            ]
        },
        {
            title: "Account & Payment",
            icon: CreditCard,
            color: "from-[var(--color-success-400)] to-[var(--color-success-600)]",
            questions: [
                {
                    q: "How do I create an account?",
                    a: "Click the 'Register' button in the navigation bar or during checkout. You'll need to provide your name, email address, and create a password. Account creation takes less than a minute!"
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We currently accept Cash on Delivery (COD). Card payments and digital wallets are coming soon to provide you with more convenient payment options."
                },
                {
                    q: "Is my payment information secure?",
                    a: "Absolutely! We use industry-standard SSL encryption to protect all data transmissions. We never store your complete payment information on our servers, and all transactions are processed through secure, PCI-compliant payment providers."
                },
                {
                    q: "How do I reset my password?",
                    a: "Click 'Login' and then 'Forgot Password'. Enter your email address and we'll send you a password reset link. The link expires after 24 hours for security purposes."
                },
                {
                    q: "Can I use multiple payment methods for one order?",
                    a: "Currently, only one payment method can be used per order. However, we're working on implementing split payment options for future updates."
                }
            ]
        },
        {
            title: "Products",
            icon: User,
            color: "from-[var(--color-warning-400)] to-[var(--color-warning-600)]",
            questions: [
                {
                    q: "Are product images accurate?",
                    a: "We strive to display accurate product images. However, colors may vary slightly due to monitor settings and lighting conditions during photography. Product descriptions provide detailed specifications to help you make informed decisions."
                },
                {
                    q: "What if a product is out of stock?",
                    a: "If an item is out of stock, you'll see an 'Out of Stock' label on the product page. You can sign up for email notifications to be alerted when the product becomes available again."
                },
                {
                    q: "Are your products genuine?",
                    a: "Yes, we guarantee the authenticity of all products sold on E-Shop. We source directly from authorized manufacturers and distributors. Each product comes with applicable warranties and authenticity guarantees."
                },
                {
                    q: "How do I leave a product review?",
                    a: "After receiving your order, you can leave a review by visiting the product page and clicking 'Write a Review'. Only verified purchasers can leave reviews to ensure authenticity."
                }
            ]
        },
        {
            title: "General",
            icon: MessageCircle,
            color: "from-[var(--color-error-400)] to-[var(--color-error-600)]",
            questions: [
                {
                    q: "How do I contact customer support?",
                    a: "You can reach us through multiple channels:\n• Email: support@eshop.com (24-48 hour response)\n• Phone: +1 (555) 123-4567 (Mon-Fri, 9am-6pm)\n• Live chat on our website during business hours"
                },
                {
                    q: "Do you have a physical store?",
                    a: "E-Shop is an online-only retailer. This allows us to offer competitive prices by reducing overhead costs. All shopping happens through our website with convenient home delivery."
                },
                {
                    q: "How do I subscribe to your newsletter?",
                    a: "Scroll to the bottom of any page and enter your email in the newsletter signup form. You'll receive updates on new products, exclusive deals, and promotional offers."
                },
                {
                    q: "Can I cancel my order?",
                    a: "You can cancel your order if it hasn't been shipped yet. Go to 'My Orders', select the order, and click 'Cancel Order'. If the order has already shipped, you'll need to wait and initiate a return instead."
                }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <BackButton />

            {/* Header */}
            <div className="card p-6 sm:p-8">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--color-accent-400) to-(--color-accent-600) flex items-center justify-center shadow-lg shrink-0">
                        <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-theme-primary pt-2">Frequently Asked Questions</h1>
                </div>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-6">
                {faqCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="card overflow-hidden">
                        {/* Category Header */}
                        <div className="p-4 sm:p-5 border-b border-theme-primary bg-theme-secondary">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${category.color} flex items-center justify-center shadow-md`}>
                                    <category.icon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg sm:text-xl font-semibold text-theme-primary">{category.title}</h2>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="divide-y divide-(--border-primary)">
                            {category.questions.map((item, itemIndex) => {
                                const isOpen = openItems[`${categoryIndex}-${itemIndex}`];
                                return (
                                    <div key={itemIndex} className="bg-theme-primary">
                                        <button
                                            onClick={() => toggleItem(categoryIndex, itemIndex)}
                                            className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-theme-tertiary transition-colors duration-200"
                                        >
                                            <span className="font-medium text-theme-primary pr-4 text-sm sm:text-base">
                                                {item.q}
                                            </span>
                                            <ChevronDown
                                                className={`w-5 h-5 text-(--color-primary-600) shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-theme-secondary text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                                {item.a}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact CTA */}
            <div className="card p-6 sm:p-8 text-center bg-linear-to-br from-(--color-primary-50) to-(--color-primary-100)">
                <h3 className="text-lg sm:text-xl font-semibold text-theme-primary mb-2">Still have questions?</h3>
                <p className="text-theme-secondary mb-4">Our support team is here to help you 24/7</p>
                <a
                    href="mailto:support@eshop.com"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-(--color-primary-600) text-white font-medium hover:bg-(--color-primary-700) transition-colors duration-200"
                >
                    <MessageCircle className="w-5 h-5" />
                    Contact Support
                </a>
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

export default FAQ;
