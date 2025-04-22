import React, { useEffect, useState } from "react";
import DynamicTable from "../../components/DynamicTable"; // Importa el componente de la tabla
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import SweetAlert2 from '../../components/SweetAlert2';
import { TrashIcon, PlusIcon, StopIcon, PlayIcon, PlayPauseIcon } from "@heroicons/react/24/solid"; // Íconos de Heroicons
import Breadcrumbs from "../../components/Breadcrumbs"; // Importa el componente Breadcrumbs
import apiService from "../../service/ApiService";
import Swal from 'sweetalert2';
import { getColumns } from "./TableDataJobs"

export default function JobServices({ darkMode }) {
    const [token] = useState(localStorage.getItem("token")); // Estado para rastrear el token
    const [data, setData] = useState([]); // Estado para los datos
    const [loading, setLoading] = useState(true); // Estado para el indicador de carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const navigate = useNavigate();

    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";

    // Función para obtener los datos del endpoint
    const fetchData = async () => {
        if (!token) return;
        try {
            setLoading(true); // Activar el indicador de carga
            const response = await apiService.get(
                `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/crons`,
                null, // No se necesitan parámetros adicionales
                true // Indica que la solicitud requiere autenticación
            );
            setData(response.data); // Guardar los datos en el estado
        } catch (err) {
            setError(err.message); // Manejar errores
        } finally {
            setLoading(false); // Desactivar el indicador de carga
        }
    };

    // Ejecutar la función al cargar el componente
    useEffect(() => {
        fetchData();
    }, []);

    // Columnas de la tabla
    const columns = [
        {
            header: "ID",
            accessorKey: "jobId", // La clave debe coincidir con el campo en los datos
        },
        {
            header: "Nombre",
            accessorKey: "jobName",
        },
        {
            header: "Descripción",
            accessorKey: "description",
        },
        {
            header: "Grupo",
            accessorKey: "jobGroup",
        },
        {
            header: "Estado",
            accessorKey: "jobStatus",
        },
        {
            header: "Habilitado",
            accessorKey: "enabled",
            cell: ({ getValue }) => (getValue() ? "Activo" : "Inactivo"), // Formatear el estado
        },
        {
            header: "Acciones",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <IconButton
                        onClick={() => handleRun(row.original.jobId)}
                        className="bg-indigo-400 dark:bg-indigo-200"
                    >
                        <PlayIcon className="h-5 w-5 text-white dark:text-gray-900" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleStop(row.original.jobId)}
                        className="bg-indigo-400 dark:bg-indigo-200"
                    >
                        <StopIcon className="h-5 w-5 text-white dark:text-gray-900" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleResume(row.original.jobId)}
                        className="bg-indigo-400 dark:bg-indigo-200"
                    >
                        <PlayPauseIcon className="h-5 w-5 text-white dark:text-gray-900" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(row.original.jobId)}
                        className="bg-indigo-400 dark:bg-indigo-200"
                    >
                        <TrashIcon className="h-5 w-5 text-white dark:text-gray-900" />
                    </IconButton>
                </div>
            ),
        },
    ];

    // Funciones para manejar acciones
    const handleRun = async (id) => {
        try {
            const response = await apiService.post(
                `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/crons/runjob/${id}`,
                null, // No se envía body en esta solicitud
                true // Indica que la solicitud requiere autenticación
            );

            await Swal.fire({
                title: 'Éxito',
                text: 'Tarea ejecutada correctamente',
                icon: 'success',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            });

            fetchData(); // Refrescar los datos de la tabla
        } catch (error) {
            await Swal.fire({
                title: 'Error',
                text: error.message || 'Error al ejecutar la tarea',
                icon: 'error',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const handleResume = async (id) => {
        try {
            const response = await apiService.post(
                `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/crons/resumejob/${id}`,
                null, // No se envía body en esta solicitud
                true // Indica que la solicitud requiere autenticación
            );

            await Swal.fire({
                title: 'Éxito',
                text: 'Tarea reanudada correctamente',
                icon: 'success',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            });

            fetchData(); // Refrescar los datos de la tabla
        } catch (error) {
            await Swal.fire({
                title: 'Error',
                text: error.message || 'Error al reanudar la tarea',
                icon: 'error',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const handleStop = async (id) => {
        try {
            const response = await apiService.post(
                `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/crons/pausejob/${id}`,
                null, // No se envía body en esta solicitud
                true // Indica que la solicitud requiere autenticación
            );

            await Swal.fire({
                title: 'Éxito',
                text: 'Tarea pausada correctamente',
                icon: 'success',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            });

            fetchData(); // Refrescar los datos de la tabla
        } catch (error) {
            await Swal.fire({
                title: 'Error',
                text: error.message || 'Error al pausar la tarea',
                icon: 'error',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            });
        }
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
                const response = await apiService.delete(
                    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/crons/deletejob/${id}`,
                    true
                );

                await SweetAlert2({
                    title: "Eliminado",
                    text: "Tarea eliminada correctamente",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                });

                fetchData(); // Refrescar los datos de la tabla
            } catch (error) {
                await SweetAlert2({
                    title: "Error",
                    text: error.message || "Error al eliminar la tarea",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            }
        }
    };

      // Columnas de la tabla
  const columns = getColumns({ handleDelete, handleRun, handleResume, handleStop});

    // Función para redirigir al formulario de registro
    const handleAdd = () => {
        navigate("/cron-services/register");
    };

    // Generar las rutas para el Breadcrumbs
    const breadcrumbsPaths = [
        {
            name: "Home",
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
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Servicios
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Administra los servicios en ejecucion
            </Typography>
            <hr className="my-2 border-gray-800" />

            {/* Botón para agregar un nuevo sistema de medición */}
            <div className="flex justify-end mb-1 mt-4 mr-4">
                <Button
                    color="indigo"
                    className="flex items-center gap-2"
                    onClick={handleAddMeasurementSystem}
                >
                    <PlusIcon className="h-5 w-5" />
                    Registrar
                </Button>
            </div>

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