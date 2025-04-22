import React, { useState, useEffect } from 'react';
import { Button, Typography, Dialog, DialogBody, DialogFooter } from '@material-tailwind/react';
import SweetAlert2 from '../../components/SweetAlert2';
import DynamicForm from '../../components/DynamicForm'; // Importa el componente DynamicForm
import PropTypes from 'prop-types';
import apiService from '../../service/ApiService';

const EditUser = ({ darkMode, open, handleOpen, userId }) => {
    EditUser.propTypes = {
        darkMode: PropTypes.bool.isRequired,
        open: PropTypes.bool,
        handleOpen: PropTypes.func,
        userId: PropTypes.any
    };

    const [initialData, setInitialData] = useState(null); // Estado para almacenar los datos iniciales del usuario

    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";

    // Cargar los datos del usuario cuando el diálogo se abre
    useEffect(() => {
        if (open && userId) {
            const fetchUserData = () => {
                apiService.get(`${process.env.REACT_APP_API_URL}/users/${userId}`, null, true)
                    .then(response => {
                        if (response.status >= 200 && response.status < 300) {
                            setInitialData(response.data)
                        }
                    })
                    .catch(error => {
                        console.error(error)
                        SweetAlert2({
                            title: 'Error',
                            text: error.message,
                            icon: 'error',
                            confirmButtonColor: "#3bdb39",
                            confirmButtonText: 'Aceptar',
                        });
                    })
            }
            fetchUserData();
        }
    }, [open, userId]);



    // Función para manejar el envío del formulario de edición
    const handleSubmit = async (formData) => {
        // Eliminar los campos de contraseña si están vacíos
        if (!formData.password) {
            delete formData.password;
        }

        apiService.put(`${process.env.REACT_APP_API_URL}/users/${userId}`, JSON.stringify(formData), true)
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    handleOpen();
                    SweetAlert2({
                        title: 'Éxito',
                        text: 'Usuario actualizado correctamente',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                    });
                }
            })
            .catch(error => {
                handleOpen(); // Cerrar el diálogo después de la actualización
                SweetAlert2({
                    title: 'Error',
                    text: error.message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            })
    };

    // Definir los campos del formulario dinámico
    const formFields = [
        {
            type: 'password',
            name: 'password',
            label: 'Contraseña',
            required: true, // No es obligatorio para la edición
            span: 12,
        },
        {
            type: 'password',
            name: 'serviceConfig.passwordCv',
            label: 'Contraseña CV360',
            required: true, // No es obligatorio para la edición
            span: 12,
        },
    ];

    return (
        <Dialog open={open} handler={handleOpen} size="sm" className='bg-white dark:bg-gray-900'>
            <DialogBody>
                <Typography variant='h5' className='ml-2 text-gray-900 dark:text-white'>Editar Usuario</Typography>
                <Typography variant='paragraph' className='ml-2 text-blue-grey dark:text-blue-gray-200'>Cambia la contraseña de usuario y usuario cv360</Typography>
                <hr className="my-2 border-gray-800 mb-8" />
                {/* Formulario Dinámico */}
                <div className={`${bgColor} max-h-screen grid grid-cols-12 items-center justify-center`}>
                    <div className={`mt-2 col-span-10 col-start-2 ${cardBgColor} rounded-lg shadow-lg p-4`}>
                        <DynamicForm
                            fields={formFields}
                            onSubmit={handleSubmit}
                            initialValues={initialData}
                            darkMode={darkMode}
                        />
                    </div>
                </div>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
                    Cancelar
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default EditUser;