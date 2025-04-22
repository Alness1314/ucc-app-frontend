import { useNavigate } from 'react-router-dom';
import DynamicForm from '../../components/DynamicForm';
import { Typography } from '@material-tailwind/react';
import Breadcrumbs from '../../components/Breadcrumbs';
import apiService from '../../service/ApiService'
import SweetAlert2 from '../../components/SweetAlert2'
import PropTypes from 'prop-types';

const VariableSettingRegister = ({ darkMode }) => {
    VariableSettingRegister.propTypes = {
        darkMode: PropTypes.bool.isRequired, // O PropTypes.bool si no es obligatorio
    };

    const navigate = useNavigate();

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
            name: "Variables",
            route: "/global-variables",
        },
        {
            name: "Registro",
            route: "/global-variables/register"
        }
    ];

    const handleSubmit = async (formData) => {
        apiService.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/global-settings`, JSON.stringify(formData), true)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    SweetAlert2({
                        title: 'Éxito',
                        text: 'Usuario registrado correctamente',
                        icon: 'success',
                        confirmButtonColor: "#3bdb39",
                        confirmButtonText: 'Aceptar',
                    });

                    navigate('/global-variables'); // Redirige a la tabla de usuarios
                }
            })
            .catch(error => SweetAlert2({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonColor: "#3bdb39",
                confirmButtonText: 'Aceptar',
            }))
    };

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
            name: 'value',
            label: 'Valor',
            required: true,
            span: 6,
        },
        {
            type: 'text',
            name: 'type',
            label: 'Tipo de dato',
            required: true,
            span: 6,
        },
        {
            type: 'text',
            name: 'group',
            label: 'Grupo',
            required: true,
            span: 6,
        }
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
                        Registro de Configuracion
                    </Typography>
                    <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                        Completa el formulario para registrar un nueva configuracion global
                    </Typography>
                </div>

            </div>

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

export default VariableSettingRegister;