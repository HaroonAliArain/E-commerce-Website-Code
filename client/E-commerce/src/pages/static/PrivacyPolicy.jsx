import { Shield, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import BackButton from "../../components/ui/BackButton";

const PrivacyPolicy = () => {
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
            title: "1. Information We Collect",
            content: `We collect information you provide directly to us, including:

• Personal Information: Name, email address, phone number, and shipping address when you create an account or place an order
• Payment Information: Credit card details and billing address (processed securely through our payment providers)
• Account Data: Username, password, and account preferences
• Communication Data: Messages, reviews, and feedback you send to us

We also automatically collect certain information when you visit our website, including your IP address, browser type, device information, and browsing behavior.`
        },
        {
            title: "2. How We Use Your Information",
            content: `We use the information we collect to:

• Process and fulfill your orders
• Send order confirmations and shipping updates
• Provide customer support and respond to inquiries
• Personalize your shopping experience
• Send promotional communications (with your consent)
• Improve our website and services
• Detect and prevent fraud or abuse
• Comply with legal obligations

We will never sell your personal information to third parties for their marketing purposes.`
        },
        {
            title: "3. Cookie Policy",
            content: `We use cookies and similar tracking technologies to enhance your experience:

• Essential Cookies: Required for website functionality (cart, login sessions)
• Analytics Cookies: Help us understand how visitors use our site
• Marketing Cookies: Used to deliver relevant advertisements
• Preference Cookies: Remember your settings and preferences

You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect website functionality.`
        },
        {
            title: "4. Information Sharing",
            content: `We may share your information with:

• Service Providers: Companies that help us operate our business (payment processors, shipping carriers, email services)
• Business Partners: Trusted partners who help us provide services to you
• Legal Requirements: When required by law, court order, or government request
• Business Transfers: In connection with a merger, acquisition, or sale of assets

All third parties are required to protect your information and use it only for the purposes we specify.`
        },
        {
            title: "5. Data Security",
            content: `We implement robust security measures to protect your information:

• SSL encryption for all data transmissions
• Secure storage of personal and payment information
• Regular security audits and vulnerability assessments
• Access controls limiting employee access to personal data
• Secure payment processing through PCI-compliant providers

While we strive to protect your information, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and protect your account credentials.`
        },
        {
            title: "6. Your Privacy Rights",
            content: `Depending on your location, you may have the following rights:

• Access: Request a copy of the personal information we hold about you
• Correction: Request correction of inaccurate or incomplete information
• Deletion: Request deletion of your personal information
• Portability: Request transfer of your data to another service
• Opt-out: Unsubscribe from marketing communications at any time
• Restriction: Request limitation of processing in certain circumstances

To exercise these rights, contact us at privacy@eshop.com. We will respond within 30 days.`
        },
        {
            title: "7. Data Retention",
            content: `We retain your personal information for as long as necessary to:

• Provide our services to you
• Comply with legal and regulatory requirements
• Resolve disputes and enforce agreements
• Maintain business records

Order history and transaction records are retained for 7 years for tax and legal purposes. You may request deletion of your account at any time, subject to legal retention requirements.`
        },
        {
            title: "8. Children's Privacy",
            content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately and we will take steps to delete it.

Parents and guardians should monitor their children's online activities and teach them about internet safety.`
        },
        {
            title: "9. International Transfers",
            content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers, including:

• Standard contractual clauses approved by regulatory authorities
• Privacy Shield certification (where applicable)
• Binding corporate rules for group companies

By using our services, you consent to the transfer of your information as described in this policy.`
        },
        {
            title: "10. Updates to This Policy",
            content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by:

• Posting a notice on our website
• Sending an email to registered users
• Updating the "Last Updated" date at the top of this policy

Your continued use of our services after changes are posted constitutes acceptance of the updated policy.`
        },
        {
            title: "11. Contact Us",
            content: `If you have questions about this Privacy Policy or our data practices, please contact us:

• Privacy Officer: privacy@eshop.com
• General Support: support@eshop.com
• Phone: +1 (555) 123-4567
• Address: 123 E-commerce St, Digital City

We are committed to resolving any concerns about your privacy and will respond to all inquiries within 2-3 business days.`
        }
    ];

    return (
        <div className="space-y-6">
            <BackButton />

            {/* Header */}
            <div className="card p-6 sm:p-8">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--color-success-400) to-(--color-success-600) flex items-center justify-center shadow-lg shrink-0">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-theme-primary pt-2">Privacy Policy</h1>
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

export default PrivacyPolicy;
