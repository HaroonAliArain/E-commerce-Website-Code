import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, clearError } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail } from "lucide-react";
import { toast } from "react-toastify";

const VerifyOTP = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, loading, error, isAuthenticated, registeredEmail } = useSelector(
        (state) => state.auth
    );

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
    const inputRefs = useRef([]);

    // Redirect if no email (direct access without registering)
    useEffect(() => {
        if (!registeredEmail) {
            navigate("/register", { replace: true });
        }
    }, [registeredEmail, navigate]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) {
            toast.warning("OTP has expired. Please register again.");
            navigate("/register", { replace: true });
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, navigate]);

    // Redirect after successful verification
    useEffect(() => {
        if (isAuthenticated && user) {
            toast.success(`Welcome, ${user.name}! Email verified successfully!`);
            if (user.role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    // Show error toast
    useEffect(() => {
        if (error) {
            toast.error(error);
            // If OTP expired on server side, redirect to register
            if (error.includes("expired") || error.includes("register again")) {
                setTimeout(() => {
                    navigate("/register", { replace: true });
                }, 2000);
            }
        }
    }, [error, navigate]);

    const handleChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace - move to previous input
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("");
            setOtp(digits);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join("");

        if (otpString.length !== 6) {
            toast.error("Please enter the complete 6-digit OTP.");
            return;
        }

        dispatch(verifyOtp({ email: registeredEmail, otp: otpString }));
    };

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Mask email for display
    const maskEmail = (email) => {
        if (!email) return "";
        const [name, domain] = email.split("@");
        const maskedName = name.length > 2
            ? name[0] + "•".repeat(name.length - 2) + name[name.length - 1]
            : name;
        return `${maskedName}@${domain}`;
    };

    const isExpiringSoon = timeLeft <= 30;

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-8 sm:py-12 px-6 sm:px-4">
            <div className="w-full max-w-md">
                <div className="card p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-(--color-primary-400) to-(--color-primary-600) flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Verify Your Email</h1>
                        <p className="text-theme-tertiary mt-2 text-sm sm:text-base">
                            We've sent a 6-digit code to
                        </p>
                        <p className="text-(--color-primary-600) font-medium text-sm sm:text-base flex items-center justify-center gap-1 mt-1">
                            <Mail className="w-4 h-4" />
                            {maskEmail(registeredEmail)}
                        </p>
                    </div>

                    {/* Timer */}
                    <div className="text-center mb-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${isExpiringSoon
                                ? "bg-(--color-error-50) text-(--color-error-600) border border-(--color-error-200)"
                                : "bg-(--color-primary-50) text-(--color-primary-700) border border-(--color-primary-200)"
                            }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${isExpiringSoon ? "bg-(--color-error-500) animate-pulse" : "bg-(--color-primary-500)"}`} />
                            Code expires in {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-5 sm:mb-6 p-3 sm:p-4 rounded-lg bg-(--color-error-50) border border-(--color-error-200)">
                            <p className="text-(--color-error-600) text-xs sm:text-sm text-center">
                                {error}
                                <button
                                    onClick={() => dispatch(clearError())}
                                    className="ml-2 underline"
                                >
                                    Dismiss
                                </button>
                            </p>
                        </div>
                    )}

                    {/* OTP Input */}
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center gap-1 sm:gap-3 mb-6 sm:mb-8">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="w-9 h-11 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-lg sm:rounded-xl
                    bg-theme-primary border-2 border-theme-primary text-theme-primary
                    focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
                    transition-all duration-200 outline-none"
                                />
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || otp.some((d) => !d)}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg font-medium disabled:opacity-50 text-sm sm:text-base"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Verify Email
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer info */}
                    <p className="mt-5 sm:mt-6 text-center text-theme-tertiary text-xs sm:text-sm">
                        Didn't receive the code? Check your spam folder.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
