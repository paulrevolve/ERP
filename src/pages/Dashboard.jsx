import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, Outlet } from "react-router-dom";
import NavigationSidebar from "../components/NavigationSidebar";
import TopBar from "../components/TopBar";
import ChatBot from "../components/ChatBot";

const Dashboard = ({ canView }) => {
  const [userName, setUserName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // hover state (existing)
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        setUserName(
          userObj.fullName
            ? userObj.fullName.replace(/\b\w/g, (c) => c.toUpperCase())
            : "null",
        );
      } catch {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");
      localStorage.clear();
    } catch {}
    navigate("/login", { replace: true });
  };

  // Auth Guard
  const storedUser = localStorage.getItem("currentUser");
  if (!storedUser) return <Navigate to="/login" replace />;

  const sidebarWidth = isHovered ? "w-[190px]" : "w-[56px]";
  return (
    // <>
    //   {/* Top Bar - Kept Fixed */}
    //   <div className="fixed top-0 left-0 right-0 z-90 h-14 bg-white  flex items-center">
    //     <TopBar fullName={userName} onLogout={handleLogout} />
    //   </div>

    //   {/* Main Container */}
    //   <div className=" h-screen relative overflow-hidden bg-[#E6F2F5]">
    //     {/* Sidebar Container */}
    //     {/* <div className="group bg-white border-r border-gray-200 h-full w-[56px] hover:w-[190px] transition-all duration-300">
    //       <NavigationSidebar isHovered={isHovered} isSidebarOpen=
    //       {isSidebarOpen} setIsHovered={setIsHovered} setIsSidebarOpen={setIsSidebarOpen} />
    //     </div> */}
    //     <div
    //       className={`group border  transition-all duration-300 ${sidebarWidth} `}
    //       onMouseEnter={() => setIsHovered(true)}
    //       onMouseLeave={() => setIsHovered(false)}
    //     >
    //       <NavigationSidebar
    //         canView={canView}
    //         isSidebarOpen={isSidebarOpen}
    //         setIsSidebarOpen={setIsSidebarOpen}
    //         isHovered={isHovered}
    //         setIsHovered={setIsHovered}
    //       />
    //     </div>

    //     {/* Main Content Area */}
    //     <div
    //       className={`flex-1 h-full p-4 ml-12  overflow-y-scroll`}
    //       style={{ scrollbarGutter: "stable" }}
    //     >
    //       {/* This is where the sub-pages will render */}
    //       <Outlet />
    //     </div>
    //     <ChatBot />
    //   </div>
    // </>

    <>
      {/* Top Bar - Fixed height h-14 (3.5rem) */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-white flex items-center ">
        <TopBar fullName={userName} onLogout={handleLogout} />
      </div>

      {/* Main Container - We subtract the top bar height (h-14) from the viewport height */}
      <div className="flex h-screen mt-1.5 relative overflow-hidden bg-[#E6F2F5]">
        {/* Sidebar Container */}
        <div
          className={`transition-all  absolute duration-300 z-40 bg-white ${sidebarWidth}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <NavigationSidebar
            canView={canView}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isHovered={isHovered}
            setIsHovered={setIsHovered}
          />
        </div>

        {/* Main Content Area - Flex-1 ensures it takes remaining width */}
        <div
          className="flex-1 h-full ml-12 overflow-y-auto"
          style={{ scrollbarGutter: "stable" }}
        >
          <Outlet />
        </div>

        {/* <ChatBot /> */}
      </div>
    </>
  );
};

export default Dashboard;
