import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation, Outlet } from "react-router-dom";
import NavigationSidebar from "../components/NavigationSidebar";
import TopBar from "../components/TopBar";
import ChatBot from "../components/ChatBot";
import RecentQuickSwitcher from "../components/RecentQuickSwitcher";
import { useRecentStore } from "../store/useRecentStore";
import { getRouteMeta } from "../utils/routeMeta";

const Dashboard = ({ canView }) => {
  const [userName, setUserName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // hover state (existing)
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const addRecentPage = useRecentStore((state) => state.addRecentPage);

  useEffect(() => {
    if (location.pathname && location.pathname !== "/login" && location.pathname !== "/") {
      const meta = getRouteMeta(location.pathname);
      addRecentPage({
        path: location.pathname,
        title: meta.title,
        category: meta.category,
      });
    }
  }, [location.pathname, addRecentPage]);

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

        {/* Quick Switcher Modal */}
        <RecentQuickSwitcher />
      </div>
    </>
  );
};

export default Dashboard;

