import React, { useState, useEffect } from 'react';
import { Typography } from '@material-tailwind/react';
import { useParams, useNavigate } from 'react-router-dom';
import SweetAlert2 from '../../../components/SweetAlert2';
import { DynamicForm } from '../../../components/DynamicForm'; // Importa el componente DynamicForm
import Breadcrumbs from '../../../components/Breadcrumbs';
import apiService from '../../../service/ApiService';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const OpcConnectionEdit = ({ darkMode }) => {
    OpcConnectionEdit.propTypes = {
        darkMode: PropTypes.bool.isRequired, // O PropTypes.bool si no es obligatorio
    };


    const navigate = useNavigate();
    const { connectionId } = useParams(); // Obtener el ID del usuario desde la URL
    const [initialData, setInitialData] = useState(null); // Estado para almacenar los datos iniciales del usuario
    const [enumOptions, setEnumOptions] = useState([]);

    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";


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
            name: "Opc Server",
            route: "/opc-server",
        },
        {
            name: "Editar",
            route: `/opc-server/update/${connectionId}`,
        },
    ];

    function capitalizeFirstLetter(str) {
        if (!str || typeof str !== "string") {
            return str; // Retorna el valor original si no es un string válido
        }
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    useEffect(() => {
        const mapEnumToOption = (secutiry) => ({
            value: secutiry,
            label: capitalizeFirstLetter(secutiry),
        });


        const fetchEnumSecurity = () => {
            SweetAlert2({
                title: 'Cargando...',
                text: 'Por favor, espera.',
                allowOutsideClick: false,
                didOpen: (modal) => {
                    Swal.showLoading(); // Esta es la forma correcta
                }
            });
            apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/enums-system/tipos/opc-security`, null, true)
                .then(response => {
                    Swal.close();
                    if (response.status >= 200 && response.status < 300) {
                        const mappedEnum = response.data.map(mapEnumToOption)
                        setEnumOptions(mappedEnum);
                    }
                })
                .catch(error => {
                    Swal.close();
                    console.error('Error fetching profiles:', error)
                })
        };

        fetchEnumSecurity();
    }, []);




    // Cargar los datos del usuario cuando el diálogo se abre
    useEffect(() => {
        const fetchUserData = () => {
            SweetAlert2({
                title: 'Cargando...',
                text: 'Por favor, espera.',
                allowOutsideClick: false,
                didOpen: (modal) => {
                    Swal.showLoading(); // Esta es la forma correcta
                }
            });
            apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/opc-conexion/${connectionId}`, null, true)
                .then(response => {
                    Swal.close();
                    if (response.status >= 200 && response.status < 300) {
                        setInitialData(response.data);
                    }
                })
                .catch(error => {
                    Swal.close();
                    console.error('Error fetching profiles:', error)
                })
        }
        fetchUserData();

    }, [connectionId]);



    // Función para manejar el envío del formulario de edición
    const handleSubmit = async (formData) => {
        if (!formData.password || formData.password === "") {
            delete formData.password;
        }

        if (!formData.username || formData.username === "") {
            delete formData.username;
        }

        apiService.put(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/opc-conexion/${connectionId}`, JSON.stringify(formData), true)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    SweetAlert2({
                        title: 'Éxito',
                        text: 'Conexion actualizada correctamente',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                    });
                    navigate('/opc-server');
                }
            })
            .catch(error => SweetAlert2({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            }))
    };

    // Definir los campos del formulario dinámico
    const formFields = [
        {
            type: 'text',
            name: 'applicationName',
            label: 'Nombre de la aplicacion',
            required: true,
            span: 4,
        },
        {
            type: 'text',
            name: 'endpointUri',
            label: 'Endpoint / Uri',
            required: true,
            span: 4,
        },
        {
            type: 'dropdown',
            name: 'securityPolicy',
            label: 'Politica de Seguridad',
            required: true,
            span: 4,
            options: enumOptions,
            multiple: false, // Indicar que es un dropdown múltiple
        },
        {
            type: 'text',
            name: 'username',
            label: 'Nombre de usuario',
            required: false,
            span: 6,
        },
        {
            type: 'password',
            name: 'password',
            label: 'Contraseña',
            required: false,
            span: 6,
        },

    ];

    return (
        <div className={`${bgColor} max-h-screen`}>
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />

            {/* Header panel */}
            <div className="flex justify-between items-center mb-1 mt-4 mr-4">
                {/* Title */}
                <div>
                    <Typography variant="h4" className={`mb-1 ${textColor}`}>
                        Actualizar de Conexion OPC
                    </Typography>
                    <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                        Completa el formulario para actualizar la conexion OPC
                    </Typography>
                </div>
            </div>

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

export default OpcConnectionEdit;