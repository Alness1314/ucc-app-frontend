import React, { useState, useContext } from "react";
import { Sidebar } from "./Sidebar";
import { NavbarComponent } from "./Navbar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserCircleIcon, PowerIcon } from "@heroicons/react/24/solid";
import { Spinner } from "@material-tailwind/react";

export function Layout({ children, darkMode, toggleDarkMode, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, menuItems, isModulesLoaded } = useContext(AuthContext);
  const navigate = useNavigate();

  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const handleOpenProfileDialog = () => setOpenProfileDialog(!openProfileDialog);

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!isModulesLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  const menuItemsNav = [
    {
      label: "Perfil",
      icon: UserCircleIcon,
      onClick: handleOpenProfileDialog,
    },
    {
      label: "Cerrar sesión",
      icon: PowerIcon,
      onClick: () => {
        onLogout();
        navigate("/");
      },
    },
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed lg:relative z-20 transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <Sidebar
          brandName="UCC 360"
          brandLogo={darkMode ? `/img/cv360_LW.png` : `/img/cv360_L.png`}
          menuItems={menuItems}
          footerContent="versión 1.0"
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onCloseSidebar={handleCloseSidebar}
          onLogout={() => {
            onLogout();
            navigate("/");
          }}
        />
      </div>

      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {user && (
          <NavbarComponent
            brandName="Unidad Central de Control"
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            user={user}
            menuItems={menuItemsNav}
            openProfileDialog={openProfileDialog}
            onToggleProfileDialog={handleOpenProfileDialog}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            onLogout={() => {
              onLogout();
              navigate("/");
            }}
          />
        )}

        {/* Contenedor del contenido */}
        <main className={`flex-1 p-2 overflow-y-auto bg-white dark:bg-gray-900`}>
          {children} {/* Aquí se renderiza el contenido de la ruta */}
        </main>
      </div>
    </div>
  );
}