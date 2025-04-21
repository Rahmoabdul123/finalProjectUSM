//  Code reused and adapted from: [Django & React Web App Tutorial - Authentication, Databases, Deployment & More], 
// Author :[Tech with Team]
// , [https://www.youtube.com/watch?v=c-QsfbznSXI]
// I adapted from the video to create the loading indicator however I did use tailwind instead for the css

import '../styles/tailwind.css';

const LoadingIndicator = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-[#010647] rounded-full animate-spin" />
        </div>
    );
};

export default LoadingIndicator;
