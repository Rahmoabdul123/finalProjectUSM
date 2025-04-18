import { useState, useEffect } from "react";
import ProfilePassword from "../components/Profile/ProfilePassword";
import ProfileDetail from "../components/Profile/ProfileDetail";
import { Sparkle } from "lucide-react";
import StudentHeader from "../components/studentHeader";
import AdminNavi from "../components/AdminNavi";
import Footer from "../components/Footer";

function ProfileSetting() {
  const [activeTab, setActiveTab] = useState("details");
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setFirstName(localStorage.getItem("first_name") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);

  return (
    <>
      {role === "Admin" ? <AdminNavi /> : <StudentHeader />}

      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md border flex flex-col md:flex-row">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-1/3 border-r border-gray-200 p-4">
            <div className="flex flex-col items-center mb-6">
              <img
                src="/images/logoFinal-removed-bg.png"
                alt="USM Logo"
                className="h-20 mb-4"
              />
              <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <Sparkle /> Hello {firstName || "there"} <Sparkle />
              </h2>
              <h2 className="text-sm text-blue-600 mt-1">Welcome to your profile</h2>
            </div>

            <div className="space-y-4 w-full">
              <button
                onClick={() => setActiveTab("details")}
                className={`w-full px-4 py-2 text-left rounded-md font-medium transition ${
                  activeTab === "details"
                    ? "bg-blue-700 text-white shadow"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full px-4 py-2 text-left rounded-md font-medium transition ${
                  activeTab === "password"
                    ? "bg-blue-700 text-white shadow"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Password
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3 p-6">
            {activeTab === "details" ? <ProfileDetail /> : <ProfilePassword />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProfileSetting;




