import React, { useState } from "react";
import { Card, CardBody, CardHeader, Switch } from "@material-tailwind/react";
import Footer from "./Footer";
import MaterialButton from "../components/MaterialButton";
import MaterialInput from "../components/MaterialInput";
import MaterialTypography from "../components/MaterialTypography";
import apiService from "../service/ApiService"
import Swal from 'sweetalert2';
import SweetAlert2 from '../components/SweetAlert2';
import PropTypes from "prop-types";

function Login({ darkMode, toggleDarkMode, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginEx = (e) => {
    e.preventDefault();
    SweetAlert2({
      title: 'Cargando...',
      text: 'Por favor, espera.',
      allowOutsideClick: false,
      didOpen: (modal) => {
        Swal.showLoading(); // Esta es la forma correcta
      }
    });
    apiService.post(`${process.env.REACT_APP_API_URL}/login`, { username, password }, false)
      .then(response => {
        Swal.close();
        if (response.status === 202) {
          localStorage.setItem("token", response.data.token); // Guardar token en localStorage
          localStorage.setItem("user", username); // Guardar nombre de usuario en localStorage
          setError(""); // Limpiar errores
          onLogin(response.data.token); // Llamar a onLogin con el token
        } else if (response.status === 401) {
          setError("Usuario o contraseña incorrectos.");
        } else {
          setError(response.data.message || "Error al iniciar sesión.");
        }
      })
      .catch(error => {
        Swal.close();
        // Verificamos si el error contiene una respuesta del servidor
        if (error.response && error.response.status === 401) {
          setError("Usuario o contraseña incorrectos.");
        } else if (error.response) {
          setError(error.response.data?.message || `Error: ${error.response.status}`);
        } else {
          setError("Error de conexión con el servidor.");
        }
      })
  }

  return (
    <section
      className={`px-8 ${darkMode ? "bg-gray-900" : "bg-white"}`}
      style={{
        backgroundImage: `url(${process.env.REACT_APP_BACKGROUND_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {/* Botón para cambiar entre modo claro y oscuro */}
      <div className="absolute top-4 right-4">
        <Switch
          checked={darkMode}
          onChange={toggleDarkMode}
          label={darkMode ? "Modo Oscuro" : "Modo Claro"}
          color="indigo"
        />
      </div>

      <div className="container mx-auto h-screen grid place-items-center">
        <Card
          shadow={false}
          className="md:px-12 md:py-10 py-8 border rounded-lg w-full max-w-md bg-white/90 border-gray-200 dark:bg-gray-900/90 dark:border-gray-800"
        >
          <CardHeader shadow={false} floated={false} className="text-center bg-transparent">
            <div className="flex justify-center mb-2">
              <img src="/img/logo.png" alt="Icono" className="w-24 h-24 mb-4" />
            </div>
            <MaterialTypography
              variant="h1"
              className="!text-3xl lg:text-4xl font-bold"
              darkMode={darkMode} // Pasar darkMode como prop
              light={"text-white"}
              dark={"text-gray-900"}
            >
              Inicio de Sesión
            </MaterialTypography>
            <MaterialTypography
              className="text-[14px] font-normal md:max-w-sm"
              darkMode={darkMode} // Pasar darkMode como prop
              light={"text-gray-300"}
              dark={"text-gray-600"}
            >
              Ingresa tu correo electrónico y contraseña.
            </MaterialTypography>
          </CardHeader>
          <CardBody>
            <form onSubmit={loginEx} className="flex flex-col gap-4 md:mt-8">
              <div>
                <MaterialInput
                  id="username"
                  mode={darkMode}
                  type="text"
                  label="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={darkMode ? "text-white" : "text-gray-900"}
                />
              </div>

              <div>
                <MaterialInput
                  id="password"
                  mode={darkMode}
                  type="password"
                  label="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={darkMode ? "text-white" : "text-gray-900"}
                />
              </div>

              {/* Mostrar mensaje de error */}
              {error && (
                <MaterialTypography
                  className="text-center text-red-500 text-sm"
                >
                  {error}
                </MaterialTypography>
              )}

              <MaterialButton
                mode={darkMode}
                fullWidth
                className="mt-4"
                type="submit"
              >
                Ingresar
              </MaterialButton>

              <MaterialTypography className="text-center">
                <a
                  href="/"
                  className={`${darkMode ? "text-indigo-300 hover:text-indigo-200" : "text-indigo-500 hover:text-indigo-700"
                    }`}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </MaterialTypography>
            </form>
          </CardBody>
        </Card>
      </div>

      {/* Footer fijo */}
      <Footer />
    </section>
  );
}

// Agregar validación de props
Login.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func,
  onLogin: PropTypes.func
};

export default Login;