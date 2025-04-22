import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import apiService from "../service/ApiService"

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isModulesLoaded, setIsModulesLoaded] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token")); // Estado para rastrear el token

  //verificar el token en backend
  const verifyToken = async () => {
    try {
      const response = await apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/auth/check-session`, null, true);
      return response.status === 202
    } catch (error) {
      return false;
    }
  }

  useEffect(() => {
    const responseVerify = verifyToken();

    responseVerify
      .then(response => {
        console.log("Verificación:", response);
        if (!response) {
          clearToken()
        }
      })
      .catch(error => {
        console.error("Error en la verificación:", error);
      });

    if (!token) return; // Si no hay token, no hacer nada

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({
          name: data.fullName,
          email: data.username,
          profile: data.profiles[0].name,
          avatar: data.imageId || "/img/usuario.png",
          idProfile: data.profiles[0].id
        });

        return fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/modules/all?profile=${data.profiles[0].id}&level=sidebar`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => res.json())
      .then((modules) => {
        // Ordenar los módulos por el campo "name" (alfabéticamente)
        const sortedRootModules = modules
          .map(({ name, route, iconName }) => ({
            type: "item",
            label: name,
            icon: iconName,
            path: route,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)); // Ordenar alfabéticamente por "label"

        setMenuItems(sortedRootModules); // Usar los módulos ordenados
        //setDashboardModules(dashboardChildren);
        setIsModulesLoaded(true); // Marcar los módulos como cargados
      })
      .catch((error) => console.error("Error fetching user/modules", error));
  }, [token]); // Ejecutar cada vez que el token cambie

  const updateToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken); // Actualizar el estado del token
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setToken(null); // Limpiar el estado del token
  };

  return (
    <AuthContext.Provider value={{ user, menuItems, isModulesLoaded, updateToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
}