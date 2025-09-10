import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DynamicForm } from '../../components/DynamicForm';
import { Typography } from '@material-tailwind/react';
import Breadcrumbs from '../../components/Breadcrumbs';
import PropTypes from 'prop-types';
import apiService from "../../service/ApiService";
import Swal from 'sweetalert2';
import SweetAlert2 from '../../components/SweetAlert2';

const RegisterUser = ({ darkMode }) => {
    RegisterUser.propTypes = {
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
            name: "Usuarios",
            route: "/users",
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
            name: "Registro",
            route: "/users/register",
        },
    ];

    const mapProfileToOption = (profile) => ({
        value: profile.id,
        label: profile.name,
    });

    useEffect(() => {
        const fetchDataProfiles = () => {
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
        fetchDataProfiles();
    }, []);

    const handleSubmit = async (formData) => {
        apiService.post(`${process.env.REACT_APP_API_URL}/users`, JSON.stringify(formData), true)
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

    const formFields = [
        {
            type: 'text',
            name: 'username',
            label: 'Nombre de usuario',
            required: true,
            span: 6,
        },
        {
            type: 'password',
            name: 'password',
            label: 'Contraseña',
            required: true,
            span: 6,
        },
        {
            type: 'text',
            name: 'fullName',
            label: 'Nombre completo',
            required: true,
            span: 12,
        },
        {
            type: 'dropdown',
            name: 'profile',
            label: 'Perfil',
            required: true,
            span: 12,
            options: profileOptions,
            multiple: false
        },
        {
            type: 'text',
            name: 'serviceConfig.name',
            label: 'Nombre del servicio',
            required: true,
            span: 12,
        },
        {
            type: 'text',
            name: 'serviceConfig.usernameCv',
            label: 'Usuario del servicio',
            required: true,
            span: 6,
        },
        {
            type: 'password',
            name: 'serviceConfig.passwordCv',
            label: 'Contraseña del servicio',
            required: true,
            span: 6,
        }
    ];

    // Si está cargando, mostramos un mensaje de carga

    return (
        <div className={`${bgColor} max-h-screen`}>
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />

            {/* Título y Subtítulo */}
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Registro de Usuario
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Completa el formulario para registrar un nuevo usuario
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

export default RegisterUser;