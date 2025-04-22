import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/DynamicTable"; // Importa el componente de la tabla
import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import SweetAlert2 from '../../components/SweetAlert2';
import { PlusIcon } from "@heroicons/react/24/solid"; // Íconos de Heroicons
import Breadcrumbs from "../../components/Breadcrumbs"; // Importa el componente Breadcrumbs
import { getColumns } from "./TableDataModules"
import apiService from "../../service/ApiService";
import PropTypes from 'prop-types';

export default function Modules({ darkMode }) {
    Modules.propTypes = {
        darkMode: PropTypes.bool.isRequired, // O PropTypes.bool si no es obligatorio
    };


    const [data, setData] = useState([]); // Estado para los datos
    const [loading, setLoading] = useState(true); // Estado para el indicador de carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const navigate = useNavigate();

    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";

    // Función para obtener los datos del endpoint
    const fetchData = () => {

        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/modules/all`, null, true)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    setData(response.data)
                }
            })
            .catch(error => setError(error.message))
            .finally(setLoading(false))

    }

    // Ejecutar la función al cargar el componente
    useEffect(() => {
        setLoading(true)
        fetchData();
    }, []);

    // Funciones para manejar acciones
    const handleDetails = (id) => {
        navigate(`/modules/details/${id}`);
    };

    const handleUpdate = (id) => {
        navigate(`/modules/update/${id}`);
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
            apiService.delete(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/modules/${id}`, true)
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        SweetAlert2({
                            title: "Eliminado",
                            text: response.data.message,
                            icon: "success",
                            confirmButtonText: "Aceptar",
                        });
                        fetchData();
                    }
                })
                .catch(error => {
                    SweetAlert2({
                        title: "Error",
                        text: error.response?.data?.message || error.message,
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                })
        }
    };

    // Columnas de la tabla
    const columns = getColumns({ handleDetails, handleUpdate, handleDelete });

    // Función para redirigir al formulario de registro
    const handleAdd = () => {
        navigate("/app-modules/register");
    };

    // Generar las rutas para el Breadcrumbs
    const breadcrumbsPaths = [
        {
            name: "Configuración",
            route: "/settings",
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
            name: "Modulos",
            route: "/app-modules",
        },
    ];

    return (
        <div className="p-0 m-0 h-[calc(100vh-100px)] overflow-hidden overflow-y-auto overflow-x-auto">
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />
            {/* Header panel */}
            <div className="flex justify-between items-center mb-1 mt-4 mr-4">
                {/* Title */}
                <div>
                    <Typography variant="h4" className={`mb-1 ${textColor}`}>
                        Modulos
                    </Typography>
                    <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                        Administra los modulos de la aplicacion
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
                pageSize={5}
            />
        </div>
    );
}