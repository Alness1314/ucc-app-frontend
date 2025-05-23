import React, { useEffect, useState } from "react";
import DynamicTable from "../../../components/DynamicTable"; // Importa el componente de la tabla
import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import SweetAlert2 from '../../../components/SweetAlert2';
import { PlusIcon } from "@heroicons/react/24/solid"; // Íconos de Heroicons
import Breadcrumbs from "../../../components/Breadcrumbs"; // Importa el componente Breadcrumbs
import PropTypes from "prop-types";
import apiService from '../../../service/ApiService'; // Importar el servicio de Axios
import { getColumns } from "./TableDataOdbc"

export default function OdbcConnection({ darkMode }) {

    // Agregar validación de props
    OdbcConnection.propTypes = {
        darkMode: PropTypes.bool.isRequired, // Especifica que darkMode debe ser booleano y obligatorio
    };

    const [token] = useState(localStorage.getItem("token")); // Estado para rastrear el token
    const [data, setData] = useState([]); // Estado para los datos
    const [loading, setLoading] = useState(true); // Estado para el indicador de carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const navigate = useNavigate();

    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";

    // Función para obtener los datos del endpoint
    const fechtDataAxios = () => {
        setLoading(true);
        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/odbc-conexion`)
            .then(response => setData(response.data))
            .catch(error => {
                console.error('Error fetching connections', error)
                setError(error.message);
            });
        setLoading(false);
    }

    // Ejecutar la función al cargar el componente
    useEffect(() => {
        fechtDataAxios();
    }, []);

    // Funciones para manejar acciones
    const handleDetails = (id) => {
        navigate(`/odbc/details/${id}`);
    };

    const handleUpdate = (id) => {
        navigate(`/opc-server/update/${id}`);
    };

    const handleDelete = async (id) => {
        const result = await SweetAlert2({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarlo",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/opc-conexion/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || "Error al eliminar la conexion opc");
                }

                await SweetAlert2({
                    title: "Eliminado",
                    text: responseData.message,
                    icon: "success",
                    confirmButtonText: "Aceptar",
                });

                fechtDataAxios();
            } catch (error) {
                await SweetAlert2({
                    title: "Error",
                    text: error.message,
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            }
        }
    };

    // Función para redirigir al formulario de registro
    const handleAdd = () => {
        navigate("/odbc/register");
    };

    // Columnas de la tabla
    const columns = getColumns({ handleDetails, handleUpdate, handleDelete });

    // Generar las rutas para el Breadcrumbs
    const breadcrumbsPaths = [
        {
            name: "Catálogos",
            route: "/Dashboard",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
            ),
        },
        {
            name: "Conexiones",
            route: "/connections",
        },
        {
            name: "ODBC",
            route: "/odbc",
        },
    ];

    return (
        <div className="p-0 m-0">
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />

            {/* Header panel */}
            <div className="flex justify-between items-center mb-1 mt-4 mr-4">
                {/* Title */}
                <div>
                    <Typography variant="h4" className={`mb-1 ${textColor}`}>
                        ODBC
                    </Typography>
                    <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                        Administra las conexiones ODBC
                    </Typography>
                </div>

                {/* Botón para agregar un nuevo usuario */}
                <Button
                    color="indigo"
                    className="flex items-center gap-2"
                    onClick={handleAdd}
                >
                    <PlusIcon className="h-5 w-5" />
                    Registrar
                </Button>
            </div>

            <hr className="my-2 border-gray-800" />

            {/* Mostrar la tabla con los datos */}
            <DynamicTable
                columns={columns}
                data={data}
                loading={loading}
                error={error}
            />
        </div>
    );
}