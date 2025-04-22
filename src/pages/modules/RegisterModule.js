import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../../components/DynamicForm';
import Swal from 'sweetalert2';
import SweetAlert2 from '../../components/SweetAlert2';
import { Typography } from '@material-tailwind/react';
import Breadcrumbs from '../../components/Breadcrumbs';
import apiService from '../../service/ApiService';
import PropTypes from 'prop-types';

const RegisterModule = ({ darkMode }) => {
    RegisterModule.propTypes = {
        darkMode: PropTypes.bool.isRequired, // O PropTypes.bool si no es obligatorio
    };

    const navigate = useNavigate();
    const [profileOptions, setProfileOptions] = useState([]);

    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";

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
        {
            name: "Registro",
            route: "/app-modules/register",
        },
    ];

    const mapProfileToOption = (profile) => ({
        value: profile.id,
        label: profile.name,
    });

    useEffect(() => {
        const fetchProfiles = () => {
            SweetAlert2({
                title: 'Cargando...',
                text: 'Por favor, espera.',
                allowOutsideClick: false,
                didOpen: (modal) => {
                    Swal.showLoading(); // Esta es la forma correcta
                }
            });
            apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/profiles`, null, true)
                .then(response => {
                    Swal.close();
                    if (response.status >= 200 && response.status < 300) {
                        const mappedProfiles = response.data.map(mapProfileToOption)
                        setProfileOptions(mappedProfiles);
                    }
                })
                .catch(error => {
                    Swal.close();
                    console.error('Error fetching profiles:', error)
                })
        }
        fetchProfiles();
    }, []);

    const handleSubmit = async (formData) => {
        apiService.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/modules`, JSON.stringify(formData), true)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    SweetAlert2({
                        title: 'Éxito',
                        text: 'Usuario registrado correctamente',
                        icon: 'success',
                        confirmButtonColor: "#3bdb39",
                        confirmButtonText: 'Aceptar',
                    });
                    navigate('/users'); // Redirige a la tabla de usuarios
                }
            })
            .catch(error => {
                SweetAlert2({
                    title: 'Error',
                    text: error.message,
                    icon: 'error',
                    confirmButtonColor: "#3bdb39",
                    confirmButtonText: 'Aceptar',
                });
            })
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

    const formFields = [
        {
            type: 'text',
            name: 'name',
            label: 'Nombre',
            required: true,
            span: 4,
        },
        {
            type: 'text',
            name: 'route',
            label: 'Ruta',
            required: true,
            span: 4,
        },
        {
            type: 'text',
            name: 'iconName',
            label: 'Nombre del icono',
            required: true,
            span: 4,
        },
        {
            type: 'text',
            name: 'description',
            label: 'Descripcion',
            required: true,
            span: 12,
        },
        {
            type: 'text',
            name: 'level',
            label: 'Nivel',
            required: true,
            span: 6,
        },
        {
            type: 'dropdown',
            name: 'isParent',
            label: 'Es modulo padre',
            required: true,
            span: 6,
            options: optionsArray,
            multiple: false, // Indicar que es un dropdown múltiple
        },
        {
            type: 'dropdown',
            name: 'profile',
            label: 'Perfil',
            required: true,
            span: 12,
            options: profileOptions,
            multiple: true, // Indicar que es un dropdown múltiple
        }
    ];

    return (
        <div className={`${bgColor} max-h-screen`}>
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />

            {/* Título y Subtítulo */}
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Registro de Modulo
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Completa el formulario para registrar un nuevo modulo
            </Typography>
            <hr className="my-2 border-gray-800" />

            {/* Formulario Dinámico */}
            <div className={`${bgColor} max-h-screen grid grid-cols-12 items-center justify-center`}>
                <div className={`mt-2 col-span-12 col-start-1 ${cardBgColor} rounded-lg shadow-lg`}>
                    <DynamicForm fields={formFields} onSubmit={handleSubmit} darkMode={darkMode} />
                </div>

            </div>
        </div>
    );
};

export default RegisterModule;