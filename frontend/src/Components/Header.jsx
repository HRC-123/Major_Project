import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useGlobalContext } from "../context/GlobalContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  LogOut,Upload,Bookmark
} from "lucide-react";


const Header = ({hideContribute,hideSaved}) => {
  const { googleLoginDetails, setGoogleLoginDetails } = useGlobalContext();
  
  const navigate = useNavigate();

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  const onLoginSuccess = async(res) => {
    const decoded = jwtDecode(res.credential);
    localStorage.setItem("email", decoded?.email);
    localStorage.setItem("name", decoded?.name);
    localStorage.setItem("profilePicture", decoded?.picture);
    const email = decoded?.email || "";
    const name = decoded?.name || "";
    const profilePicture = decoded?.picture || "";
    setGoogleLoginDetails({
      email: decoded?.email,
      name: decoded?.name,
      profilePicture: decoded?.picture,
    });

    await fetch(`${SERVER_URL}/save-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name }),
    });


    toast.success(`Login Successful: ${decoded?.name}`, {
      id: "login-successful",
    });
    navigate("/");
  };

  const onLoginFailure = (res) => {
    console.error("Login Failed:", res);
    toast.error("Login failed. Please try again.", { id: "login-failed" });
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    setGoogleLoginDetails({ email: "", name: "", profilePicture: "" });
    toast.success("You have successfully logged out.", { id: "logged-out" });
    navigate("/");
    };
    
    return (
      <header className="w-full bg-[#2C3E50] text-white shadow-md">
        <div className="container mx-auto py-3 px-4 flex justify-between items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
              <img
                src="/nitjlogo.png"
                alt="NITJ Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">NITJ Study Resources Hub</h1>
              <p className="text-xs text-yellow-200">
                National Institute of Technology, Jalandhar
              </p>
            </div>
          </div>

          {/* User Authentication Area */}
          <div className="flex items-center space-x-4">
            {!hideContribute && (
              <div className="mt-4 md:mt-0 flex gap-4 ">
                <button
                  onClick={() => navigate("/upload")}
                  className="px-3 py-2 bg-white text-[#2C3E50] rounded-md hover:bg-gray-100 transition font-bold shadow-lg flex items-center"
                >
                  <Upload className="w-5 h-5 mr-2" /> Contribute
                </button>
              </div>
            )}

            {!hideSaved && (
              <div className="mt-4 md:mt-0 flex gap-4 ">
                <button
                  onClick={() => navigate("/saved")}
                  className="px-3 py-2 bg-white text-[#2C3E50] rounded-md hover:bg-gray-100 transition font-bold shadow-lg flex items-center"
                >
                  <Bookmark className="w-5 h-5 mr-2" /> Saved Resources
                </button>
              </div>
            )}

            {!googleLoginDetails?.email ? (
              <GoogleLogin
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                size="large"
              />
            ) : (
              <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
                {googleLoginDetails.profilePicture && (
                  <img
                    src={googleLoginDetails.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="text-xs text-gray-700">
                  <p className="font-bold">{googleLoginDetails.name}</p>
                  <p className="text-gray-500">{googleLoginDetails.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  Logout
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
};

export default Header;