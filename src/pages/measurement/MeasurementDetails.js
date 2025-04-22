import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Spinner
} from "@material-tailwind/react";
import DynamicTable from "../../components/DynamicTable"; // Importar el componente de tabla dinámica
import Breadcrumbs from "../../components/Breadcrumbs"; // Importa el componente Breadcrumbs

export default function MeasurementDetails({ darkMode }) {
    const { id } = useParams(); // Obtener el ID del usuario desde la URL
    const [token] = useState(localStorage.getItem("token")); // Estado para rastrear el token
    const [measurementData, setMeasurementData] = useState(null);
    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";

    useEffect(() => {
        // Simulando la obtención de datos desde una API
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/measurementsystems/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setMeasurementData(data);
            } catch (error) {
                console.error("Error fetching measurement data:", error);
            }
        };

        fetchData();
    }, [id]);

    if (!measurementData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner color="indigo" className="h-10 w-10" />
            </div>);
    }

    // Definir los campos que queremos mostrar dinámicamente
    const fieldsToDisplay = [
        { label: "Nombre", key: "tag" },
        { label: "Tipo de conexión", key: "connectionType" },
        { label: "Elemento", key: "elementType" },
        { label: "Operación", key: "opsType" },
        { label: "Estado", key: "status", format: (value) => (value ? "Active" : "Inactive") },
    ];

    // Función para renderizar los campos dinámicamente
    const renderFields = (fields, data) => {
        return fields.map((field, index) => {
            const value = data[field.key];
            // Si el valor es nulo o indefinido, no renderizamos el campo
            if (value === null || value === undefined) return null;

            return (
                <div key={index}>
                    <p className="text-gray-900 dark:text-gray-100 font-semibold">{field.label}:</p>
                    <p className="text-gray-700 dark:text-gray-400">
                        {field.format ? field.format(value) : value}
                    </p>
                </div>
            );
        });
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
            name: "Sistemas de Medición",
            route: "/measurement-system",
        },
        {
            name: "Detalle",
            route: "/measurement-system/details/:id",
        },
    ];

    // Definir las columnas para la tabla de registros Modbus
    const modbusRegisterColumns = [
        { header: "Tag", accessorKey: "name" },
        { header: "Registro", accessorKey: "addressStart" },
        { header: "Codigo de función", accessorKey: "functionCode" },
        { header: "Tipo de Dato", accessorKey: "dataType" },
    ];

    // Definir las columnas para la tabla de registros Modbus
    const opcTagColumns = [
        { header: "Tag", accessorKey: "name" },
        { header: "Nodo ID", accessorKey: "nodeId" },
        { header: "Tipo de Dato", accessorKey: "dataType" },
        { header: "Habilitado", accessorKey: "enabled", cell: ({ getValue }) => (getValue() ? "Activo" : "Inactivo")},
    ];

    // Definir las columnas para la tabla de registros Modbus
    const odbcRegisterColumns = [
        { header: "Tag", accessorKey: "name" },
        { header: "Tabla", accessorKey: "tableName" },
        { header: "Columna", accessorKey: "columnName" },
        { header: "Filtro", accessorKey: "filter" },
        { header: "Tipo de Dato", accessorKey: "dataType"},
    ];

    return (
        <div className="p-0 m-0 h-[calc(100vh-100px)] overflow-hidden overflow-y-auto overflow-x-auto">
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Sistema de Medición
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Detalle del sistema de medición
            </Typography>
            <hr className="my-2 border-gray-800" />

            {/* Contenedor principal de la Card */}
            <div className={`${bgColor}`}>
                <div className={`mt-2 ${cardBgColor} rounded-lg shadow-lg h-full overflow-hidden`}>
                    <Card shadow={false} className={`w-full h-full ${cardBgColor}`}>
                        <CardHeader
                            color="transparent"
                            floated={false}
                            shadow={false}
                            className="mx-0 flex items-center gap-4 pt-0 pb-0"
                        >
                            <img
                                size="lg"
                                src="/icons/INVENTORY.png"
                                alt="measurement-system"
                                className="pt-1 ml-10 mb-2"
                            />
                            <div className="flex w-full flex-col gap-0.5">
                                <div className="flex items-center justify-between">
                                    <Typography variant="h5" className="text-blue-gray dark:text-gray-300">
                                        Sistema de Medicion
                                    </Typography>
                                </div>
                                <Typography className="text-blue-gray dark:text-gray-300">{id}</Typography>
                            </div>
                        </CardHeader>

                        {/* CardBody con scroll interno */}
                        <CardBody className="ml-12 mb-2 mr-10 mt-1 p-0 ">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {renderFields(fieldsToDisplay, measurementData)}
                            </div>

                            <hr className="my-4 border-gray-300" />

                            {/* Tabla de registros Modbus */}
                            {measurementData != null && measurementData.modbusRegisters.length > 0 &&
                                (<div className="mt-4 p-0 m-0">
                                    <Typography variant="h6" className="mb-0 ml-4 text-blue-gray dark:text-gray-300">
                                        Modbus Registers
                                    </Typography>
                                    <DynamicTable
                                        columns={modbusRegisterColumns}
                                        data={measurementData.modbusRegisters}
                                        loading={false}
                                        error={null}
                                        pageSize={4} // Limitar a 5 registros por página
                                        className="w-full"
                                    />
                                </div>)
                            }

                            {/* Tabla de registros OPC */}
                            {measurementData != null && measurementData.tagsOpc.length > 0 &&
                                (<div className="mt-4 p-0 m-0">
                                    <Typography variant="h6" className="mb-0 ml-4 text-blue-gray dark:text-gray-300">
                                        Opc Server Tags
                                    </Typography>
                                    <DynamicTable
                                        columns={opcTagColumns}
                                        data={measurementData.tagsOpc}
                                        loading={false}
                                        error={null}
                                        pageSize={4} // Limitar a 5 registros por página
                                        className="w-full"
                                    />
                                </div>)
                            }

                            {/* Tabla de registros ODBC */}
                            {measurementData != null && measurementData.odbcConfigurations.length > 0 &&
                                (<div className="mt-4 p-0 m-0">
                                    <Typography variant="h6" className="mb-0 ml-4 text-blue-gray dark:text-gray-300">
                                        ODBC Registers
                                    </Typography>
                                    <DynamicTable
                                        columns={odbcRegisterColumns}
                                        data={measurementData.odbcConfigurations}
                                        loading={false}
                                        error={null}
                                        pageSize={4} // Limitar a 5 registros por página
                                        className="w-full"
                                    />
                                </div>)
                            }

                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}