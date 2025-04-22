import React from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import MaterialTypography from "./MaterialTypography";

export function NavbarComponent({
  brandName,
  onToggleSidebar,
  user,
  menuItems,
  openProfileDialog,
  onToggleProfileDialog,
  darkMode,
  toggleDarkMode,
}) {
  const navbarColor = darkMode ? "gray" : "";
  const navClassColor = darkMode ? "from-gray-900 to-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-black";
  const dropdownColor = darkMode ? "bg-gray-800" : "bg-white";
  const modalColor = darkMode ? "bg-gray-800" : "bg-white";

  return (
    <Navbar
      variant="gradient"
      className={`sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-white border-hidden dark:bg-gray-900`}
    >
      <div className={`flex items-center justify-between ${textColor}`}>
        <div className="flex items-center">
          <IconButton
            variant="text"
            className={`mr-2 h-6 w-6 hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden ${textColor}`}
            ripple={false}
            onClick={onToggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </IconButton>
          <MaterialTypography
            as="a"
            href="#"
            className={`mr-4 cursor-pointer py-1.5 font-medium ${textColor}`}
          >
            {brandName}
          </MaterialTypography>
        </div>
        <div className="flex items-center gap-4">
          <IconButton
            variant="text"
            className={`hover:bg-transparent focus:bg-transparent active:bg-transparent ${textColor}`}
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </IconButton>

          {/* Menú desplegable del usuario */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <Button
                variant="text"
                className={`flex items-center rounded-full p-0 ${textColor}`}
              >
                <Avatar
                  variant="circular"
                  size="md"
                  alt={user?.name || "Usuario"}
                  withBorder={true}
                  className="p-0.5"
                  src={user?.avatar || "/img/usuario.png"}
                />
              </Button>
            </MenuHandler>
            <MenuList
              className={`p-1 ${dropdownColor} border-0`} // Eliminar el borde
            >
              {menuItems.map(({ label, icon: Icon, onClick }, key) => {
                const isLastItem = key === menuItems.length - 1;
                return (
                  <MenuItem
                    key={label}
                    onClick={onClick}
                    className={`flex items-center gap-2 rounded ${
                      isLastItem
                        ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                        : ""
                    } ${textColor}`} // Aplicar color de texto
                  >
                    <Icon
                      className={`h-4 w-4 ${isLastItem ? "text-red-500" : textColor}`}
                      strokeWidth={2}
                    />
                    <Typography
                      as="span"
                      variant="small"
                      className="font-normal"
                      color={isLastItem ? "red" : "inherit"}
                    >
                      {label}
                    </Typography>
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
        </div>
      </div>

      {/* Diálogo del perfil */}
      <Dialog
        open={openProfileDialog}
        handler={onToggleProfileDialog}
        className={modalColor}
      >
        <DialogHeader className={textColor}>Perfil de usuario</DialogHeader>
        <DialogBody>
          <div className="flex items-center gap-4">
            <Avatar
              src={user?.avatar || "/img/usuario.png"}
              alt={user?.name || "Usuario"}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <Typography variant="h6" className={textColor}>
                {user?.name || "Usuario"}
              </Typography>
              <Typography variant="small" className={`font-normal ${textColor}`}>
                {user?.email || "usuario@example.com"}
              </Typography>
              <Typography variant="small" className={`font-normal ${textColor}`}>
                Profile: {user?.profile || "Usuario"}
              </Typography>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={onToggleProfileDialog}
            className="mr-1"
          >
            <span>Cerrar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Navbar>
  );
}