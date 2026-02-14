import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-3 py-2 bg-blue-900 text-white rounded-lg font-medium transition-all duration-300 ease-in-out hover:bg-blue-800 active:scale-95">
            <ArrowLeft className="w-5 h-5" />
            Back
        </button>
    );
};

export default BackButton;
