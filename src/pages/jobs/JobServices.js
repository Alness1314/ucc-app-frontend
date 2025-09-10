import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/DynamicTable"; // Importa el componente de la tabla
import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import SweetAlert2 from '../../components/SweetAlert2';
import { PlusIcon } from "@heroicons/react/24/solid"; // Íconos de Heroicons
import Breadcrumbs from "../../components/Breadcrumbs"; // Importa el componente Breadcrumbs
import apiService from "../../service/ApiService";
import { getColumns } from "./TableDataJobs"

export default function JobServices({ darkMode }) {
    const [data, setData] = useState([]); // Estado para los datos
    const [loading, setLoading] = useState(true); // Estado para el indicador de carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const navigate = useNavigate();

    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";

    // Función para obtener los datos del endpoint
    const fetchData = async () =>{
        apiService.get(
            `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/crons`,
            null, // No se necesitan parámetros adicionales
            true // Indica que la solicitud requiere autenticación
        ).then(response => {
            if (response.status >= 200 && response.status < 300) {
                setData(response.data);
            }
        })
            .catch(error => setError(error.message))
            .finally(() => setLoading(false))
    };

    // Ejecutar la función al cargar el componente
    useEffect(() => {
        fetchData();
    },[]);

    // Funciones para manejar acciones
    const handleRun = async (id) => {
        apiService.post(
            `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/crons/runjob/${id}`,
            null, // No se envía body en esta solicitud
            true // Indica que la solicitud requiere autenticación
        ).then(response => {
            if (response.status >= 200 && response.status < 300) {
                SweetAlert2({
                    title: 'Éxito',
                    text: 'Servicio ejecutado correctamente',
                    icon: 'success',
                    confirmButtonColor: "#3bdb39",
                    confirmButtonText: 'Aceptar',
                });

                fetchData(); // Refrescar los datos de la tabla
            }
        })
            .catch(error => SweetAlert2({
                title: 'Error',
                text: error.message || 'Error al ejecutar la tarea',
                icon: 'error',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            }))
    };

    const handleResume = async (id) => {
        apiService.post(
            `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/crons/resumejob/${id}`,
            null, // No se envía body en esta solicitud
            true // Indica que la solicitud requiere autenticación
        ).then(response => {
            if (response.status >= 200 && response.status < 300) {
                SweetAlert2({
                    title: 'Éxito',
                    text: 'Servicio reanudado correctamente',
                    icon: 'success',
                    confirmButtonColor: "#3bdb39",
                    confirmButtonText: 'Aceptar',
                });

                fetchData(); // Refrescar los datos de la tabla
            }
        })
            .catch(error => {
                SweetAlert2({
                    title: 'Error',
                    text: error.message || 'Error al reanudar la tarea',
                    icon: 'error',
                    confirmButtonColor: "#3bdb39",
                    confirmButtonText: 'Aceptar',
                });
            })
    };

    const handleStop = async (id) => {
        apiService.post(
            `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/crons/pausejob/${id}`,
            null, // No se envía body en esta solicitud
            true // Indica que la solicitud requiere autenticación
        ).then(response => {
            if (response.status >= 200 && response.status < 300) {
                SweetAlert2({
                    title: 'Éxito',
                    text: 'Servicio pausado correctamente',
                    icon: 'success',
                    confirmButtonColor: "#3bdb39",
                    confirmButtonText: 'Aceptar',
                });

                fetchData(); // Refrescar los datos de la tabla
            }
        })
            .catch(error => {
                SweetAlert2({
                    title: 'Error',
                    text: error.message || 'Error al pausar la tarea',
                    icon: 'error',
                    confirmButtonColor: "#3bdb39",
                    confirmButtonText: 'Aceptar',
                });
            })
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
            apiService.delete(
                `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/crons/deletejob/${id}`,
                true
            ).then(response => {
                if (response.status >= 200 && response.status < 300) {
                    SweetAlert2({
                        title: "Eliminado",
                        text: "Servicio eliminado correctamente",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                    });

                    fetchData(); // Refrescar los datos de la tabla
                }
            })
                .catch(error => {
                    SweetAlert2({
                        title: "Error",
                        text: error.message || "Error al eliminar el servicio",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                })
        }
    };

    // Columnas de la tabla
    const columns = getColumns({ handleDelete, handleRun, handleResume, handleStop });

    // Función para redirigir al formulario de registro
    const handleAdd = () => {
        navigate("/cron-services/register");
    };

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
            name: "Servicios",
            route: "/cron-services",
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
                        Servicios
                    </Typography>
                    <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                        Administra los servicios en ejecucion
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