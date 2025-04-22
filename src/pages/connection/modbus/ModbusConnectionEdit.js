import React, { useState, useEffect } from 'react';
import { Typography } from '@material-tailwind/react';
import { useParams, useNavigate } from 'react-router-dom';
import SweetAlert2 from '../../../components/SweetAlert2';
import DynamicForm from '../../../components/DynamicForm'; // Importa el componente DynamicForm
import Breadcrumbs from '../../../components/Breadcrumbs';

const ModbusConnectionEdit = ({ darkMode }) => {
    const navigate = useNavigate();
    const { connectionId } = useParams(); // Obtener el ID del usuario desde la URL
    const [token] = useState(localStorage.getItem('token')); // Estado para rastrear el token
    const [initialData, setInitialData] = useState(null); // Estado para almacenar los datos iniciales del usuario

    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";


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
            name: "Conexiones",
            route: "/connections",
        },
        {
            name: "Modbus",
            route: "/modbus",
        },
        {
            name: "Actualizar",
            route: `/modbus/update/${connectionId}`,
        },
    ];

    // Cargar los datos del usuario cuando el diálogo se abre
    useEffect(() => {
        if (connectionId) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/modbus-conexion/${connectionId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.message || 'Error al cargar los datos de la conexion modbus');
                    }
                    setInitialData(data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchUserData();
        }
    }, [connectionId, token]);



    // Función para manejar el envío del formulario de edición
    const handleSubmit = async (formData) => {
        try {
            // Eliminar los campos de contraseña si están vacíos
            if (!formData.password) {
                delete formData.password;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/modbus-conexion/${connectionId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al actualizar el usuario');
            }

            await SweetAlert2({
                title: 'Éxito',
                text: 'Usuario actualizado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
            navigate('/modbus'); // Redirige a la tabla de usuarios
        } catch (error) {
            await SweetAlert2({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const optionsArray = [
        {
            value: true,
            label: "Si",
        },
        {
            value: false,
            label: "No",
        }
    ]

    const optionsEstadoArray = [
        {
            value: true,
            label: "Activo",
        },
        {
            value: false,
            label: "Inactivo",
        }
    ]

    const optionMediaArray = [
        {
            value: "ETHERNET",
            label: "Ethernet",
        },
        {
            value: "RS-485",
            label: "RS-485",
        },
        {
            value: "RS-422",
            label: "RS-422",
        },
        {
            value: "RS-232",
            label: "RS-232",
        }
    ]

    const optionProtocolArray = [
        {
            value: "MODBUS",
            label: "Modbus",
        }
    ]

    const optionTransmisionArray = [
        {
            value: "TCPIP",
            label: "TCP/IP",
        },
        {
            value: "RTU",
            label: "RTU",
        },
        {
            value: "ASCII",
            label: "ASCII",
        },
        {
            value: "UDP",
            label: "UDP",
        }
    ]

    const formFields = [
        {
            type: 'text',
            name: 'name',
            label: 'Nombre',
            required: true,
            span: 6,
        },
        {
            type: 'text',
            name: 'deviceIdSlave',
            label: 'Device - ID / Slave ',
            required: true,
            span: 6,
        },
        {
            type: 'text',
            name: 'ipAddress',
            label: 'Direccion IP',
            required: false,
            span: 8,
        },
        {
            type: 'number',
            name: 'servicePort',
            label: 'Puerto',
            required: false,
            span: 4,
        },
        {
            type: 'number',
            name: 'baudRate',
            label: 'Tasa de baudios',
            required: false,
            span: 2,
        },
        {
            type: 'number',
            name: 'wordLength',
            label: 'Longitud de termino',
            required: false,
            span: 2,
        },
        {
            type: 'number',
            name: 'parity',
            label: 'Paridad',
            required: false,
            span: 2,
        },
        {
            type: 'number',
            name: 'stopBit',
            label: 'Detener Bit',
            required: false,
            span: 2,
        },
        {
            type: 'number',
            name: 'scanTime',
            label: 'Tiempo de escaneo',
            required: false,
            span: 2,
        },
        {
            type: 'number',
            name: 'slaveResponseTimeOut',
            label: 'Tiempo de espera',
            required: false,
            span: 2,
        },
        {
            type: 'dropdown',
            name: 'mediaType',
            label: 'Tipo de medio',
            options: optionMediaArray,
            required: false,
            span: 4,
        },
        {
            type: 'dropdown',
            name: 'protocol',
            label: 'Protocolo',
            options: optionProtocolArray,
            required: false,
            span: 4,
        },
        {
            type: 'dropdown',
            name: 'transmissionMode',
            label: 'Modo de transmision',
            options: optionTransmisionArray,
            required: false,
            span: 4,
        },
        {
            type: 'dropdown',
            name: 'singleReg',
            label: 'Registro unico',
            options: optionsArray,
            required: false,
            span: 6,
            multiple: false,
        },
        {
            type: 'dropdown',
            name: 'status',
            label: 'Estado',
            required: false,
            options: optionsEstadoArray,
            span: 6,
            multiple: false,
        }
        
    ];

    return (
        <div className={`${bgColor} max-h-screen`}>
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />

            {/* Título y Subtítulo */}
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Actualizar de Conexion Modbus
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Completa el formulario para actualizar la conexion Modbus
            </Typography>
            <hr className="my-2 border-gray-800" />

            {/* Formulario Dinámico */}
            <div className={`${bgColor} max-h-screen grid grid-cols-12 items-center justify-center`}>
                <div className={`mt-2 col-span-12 col-start-1 ${cardBgColor} rounded-lg shadow-lg`}>
                    <DynamicForm
                        fields={formFields}
                        onSubmit={handleSubmit}
                        initialValues={initialData}
                        darkMode={darkMode}
                    />
                </div>

            </div>
        </div>
    );

};

export default ModbusConnectionEdit;