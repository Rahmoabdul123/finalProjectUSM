// import "../styles/LoadingIndicator.css"
import '../styles/tailwind.css';

const LoadingIndicator = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-[#010647] rounded-full animate-spin" />
        </div>
    );
};

export default LoadingIndicator;
