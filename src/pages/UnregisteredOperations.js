import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Typography,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Alert
} from "@material-tailwind/react";
import { MenuItem, TextField, Button, Grid2 } from '@mui/material';
import MaterialFileInput from "../components/MaterialFileInput";
import Breadcrumbs from "../components/Breadcrumbs";
import apiService from '../service/ApiService'; // Importar el servicio de Axios
import Swal from 'sweetalert2';
import SweetAlert2 from '../components/SweetAlert2';

const UnregisteredOperations = ({ darkMode }) => {
    const user = localStorage.getItem("user");
    const { control, handleSubmit, watch } = useForm();
    const [facilities, setFacilities] = useState([]);
    const [tanks, setTanks] = useState([]);
    const [ducts, setDucts] = useState([]);
    const [items, setItems] = useState([]);
    const selectedInstallation = watch('installation');
    const selectedElement = watch('element');

    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";

    // Estados para el formulario
    const [backendResponse, setBackendResponse] = useState([]); // Respuesta del backend
    const [showResponseModal, setShowResponseModal] = useState(false); // Controlar visibilidad del modal de respuesta

    useEffect(() => {
        // Cargar instalaciones
        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/helper-query/cv360/instalaciones/by-user/${user}`)
            .then(response => setFacilities(response.data))
            .catch(error => console.error('Error fetching installations:', error));
    }, [user]);

    useEffect(() => {
        if (selectedInstallation) {
            // Cargar tanques basado en la instalación seleccionada
            apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/helper-query/cv360/instalaciones/${selectedInstallation}/tanks`)
                .then(response => {
                    const sortedTanks = response.data
                        .map(({ publicKey, claveIdentificacionTanque }) => ({
                            value: publicKey,
                            label: claveIdentificacionTanque
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label));
                    setTanks(sortedTanks)
                })
                .catch(error => console.error('Error fetching tanks:', error))

            // Cargar ductos basado en la instalación seleccionada
            apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/helper-query/cv360/instalaciones/${selectedInstallation}/ducts`)
                .then(response => {
                    const sortedDucts = response.data
                        .map(({ publicKey, claveIdentificacionDucto }) => ({
                            value: publicKey,
                            label: claveIdentificacionDucto
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label));
                    setDucts(sortedDucts)
                })
                .catch(error => console.error('Error fetching ducts:', error))
        }
    }, [selectedInstallation]);

    const optionsElements = [
        {
            id: "1",
            value: "TANK",
            label: "Tanque",
        },
        {
            id: "2",
            value: "DUCT",
            label: "Ducto",
        }
    ]

    const optionsOps = [
        {
            id: "1",
            value: "Recepcion",
            label: "Recepcion",
        },
        {
            id: "2",
            value: "Entrega",
            label: "Entrega",
        }, {
            id: "3",
            value: "Existencia",
            label: "Existencia",
        }
    ]

    const filteredOps = selectedElement === "TANK" ? optionsOps : optionsOps.filter(op => op.value !== "Existencia");

    const onSubmit = (data) => {
        const newItem = {
            instalacionCvId: data.installation,
            elementoCvId: data.element,
            elementoUccId: data.uccId
        };
        setItems([...items, newItem]);
    };

    const sendData = () => {
        SweetAlert2({
            title: 'Cargando...',
            text: 'Por favor, espera mientras se procesa la solicitud.',
            allowOutsideClick: false,
            didOpen: (modal) => {
                Swal.showLoading(); // Esta es la forma correcta
            }
        });

        const formData = new FormData();
        formData.append("type", watch('type'));
        formData.append("element", watch('element'));
        formData.append("file", watch('file'));

        apiService.post(
            `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/ops-no-registradas/upload/instalacion/${watch('installation')}/elemento/${watch('element') === "TANK" ? watch('tankKey') : watch('ductKey')}`,
            formData,
            true,
            { 'Content-Type': 'multipart/form-data' }
        )
            .then(response => {
                Swal.close(); // Cerrar el loading
                setBackendResponse(response.data);
                setShowResponseModal(true);
            })
            .catch(error => {
                Swal.close(); // Cerrar el loading en caso de error
                console.error('Error sending data:', error);
                setBackendResponse([{ message: "Error al registrar la operación.", code: "ERROR", status: false }]);
                setShowResponseModal(true);
            });
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
            name: "Operaciones no registradas",
            route: "/unregistered-operations",
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
                        Operaciones no registradas
                    </Typography>
                    <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                        Genera operaciones no registradas mediante un archivo csv
                    </Typography>
                </div>

            </div>

            <hr className="my-2 border-gray-800" />
            {/* Formulario Dinámico */}
            <div className={`${bgColor} max-h-screen grid grid-cols-12 items-center justify-center`}>
                <div className={`mt-2 col-span-12 col-start-1 ${cardBgColor} rounded-lg shadow-lg`}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid2 container spacing={3} style={{ padding: '24px' }}>
                            <Grid2 item size={12}>
                                <Controller
                                    name="installation"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Instalacion"
                                            required={true}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: darkMode ? "white" : "gray",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: darkMode ? "primary.main" : "gray",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: darkMode ? "primary.main" : "gray",
                                                    },
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: darkMode ? "white" : "gray",
                                                },
                                                "& .MuiSelect-icon": {
                                                    color: darkMode ? "white" : "gray",
                                                },
                                                "& .MuiInputBase-input": {
                                                    color: darkMode ? "white" : "black",
                                                },
                                                "& .MuiMenuItem-root": {
                                                    color: darkMode ? "white" : "black",
                                                    backgroundColor: darkMode ? "#333" : "#fff",
                                                },
                                                "& .MuiPaper-root": {
                                                    backgroundColor: darkMode ? "#333" : "#fff",
                                                },
                                            }}>
                                            {facilities.map((option, i) => (
                                                <MenuItem key={option.publicKey} value={option.publicKey}>
                                                    {option.claveInstalacion}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="element"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Elemento"
                                            required={true}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: darkMode ? "white" : "gray",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: darkMode ? "primary.main" : "gray",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: darkMode ? "primary.main" : "gray",
                                                    },
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: darkMode ? "white" : "gray",
                                                },
                                                "& .MuiSelect-icon": {
                                                    color: darkMode ? "white" : "gray",
                                                },
                                                "& .MuiInputBase-input": {
                                                    color: darkMode ? "white" : "black",
                                                },
                                                "& .MuiMenuItem-root": {
                                                    color: darkMode ? "white" : "black",
                                                    backgroundColor: darkMode ? "#333" : "#fff",
                                                },
                                                "& .MuiPaper-root": {
                                                    backgroundColor: darkMode ? "#333" : "#fff",
                                                },
                                            }}>
                                            {optionsElements.map((option, i) => (
                                                <MenuItem key={option.id} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="tankKey"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Tanques"
                                            required={selectedElement === "TANK"}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            disabled={selectedElement !== "TANK"}
                                            displayEmpty
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: darkMode ? "white" : "gray",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: darkMode ? "primary.main" : "gray",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: darkMode ? "primary.main" : "gray",
                                                    },
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: darkMode ? "white" : "gray",
                                                },
                                                "& .MuiSelect-icon": {
                                                    color: darkMode ? "white" : "gray",
                                                },
                                                "& .MuiInputBase-input": {
                                                    color: darkMode ? "white" : "black",
                                                },
                                                "& .MuiMenuItem-root": {
                                                    color: darkMode ? "white" : "black",
                                                    backgroundColor: darkMode ? "#333" : "#fff",
                                                },
                                                "& .MuiPaper-root": {
                                                    backgroundColor: darkMode ? "#333" : "#fff",
                                                },
                                            }}>
                                            {tanks.map((option, i) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="ductKey"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Ductos"
                                            required={selectedElement === "DUCT"}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            disabled={selectedElement !== "DUCT"}
                                            displayEmpty
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: darkMode ? "white" : "gray",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: darkMode ? "primary.main" : "gray",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: darkMode ? "primary.main" : "gray",
                                                    },
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: darkMode ? "white" : "gray",
                                                },
                                                "& .MuiSelect-icon": {
                                                    color: darkMode ? "white" : "gray",
                                                },
                                                "& .MuiInputBase-input": {
                                                    color: darkMode ? "white" : "black",
                                                },
                                                "& .MuiMenuItem-root": {
                                                    color: darkMode ? "white" : "black",
                                                    backgroundColor: darkMode ? "#333" : "#fff",
                                                },
                                                "& .MuiPaper-root": {
                                                    backgroundColor: darkMode ? "#333" : "#fff",
                                                },
                                            }}>
                                            {ducts.map((option, i) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="type"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Operacion Volumetrica"
                                            required={true}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": {
                                                        borderColor: darkMode ? "white" : "gray",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: darkMode ? "primary.main" : "gray",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: darkMode ? "primary.main" : "gray",
                                                    },
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: darkMode ? "white" : "gray",
                                                },
                                                "& .MuiSelect-icon": {
                                                    color: darkMode ? "white" : "gray",
                                                },
                                                "& .MuiInputBase-input": {
                                                    color: darkMode ? "white" : "black",
                                                },
                                                "& .MuiMenuItem-root": {
                                                    color: darkMode ? "white" : "black",
                                                    backgroundColor: darkMode ? "#333" : "#fff",
                                                },
                                                "& .MuiPaper-root": {
                                                    backgroundColor: darkMode ? "#333" : "#fff",
                                                },
                                            }}>
                                            {filteredOps.map((option, i) => (
                                                <MenuItem key={option.id} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={8}>
                                <Controller
                                    name="file"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange } }) => (
                                        <MaterialFileInput
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    onChange(file); // Actualiza el campo con el archivo seleccionado
                                                }
                                            }}
                                            className="w-full"
                                            darkMode={darkMode}
                                        />
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={sendData} variant="contained" color="primary" size='large'>
                                    Enviar
                                </Button>
                            </Grid2>
                        </Grid2>
                    </form>
                </div>
            </div>

            {/* Modal para mostrar la respuesta del backend */}
            <Dialog open={showResponseModal} handler={() => setShowResponseModal(false)} size="md" className="bg-white dark:bg-gray-900 ">
                <DialogHeader className="text-gray-800 dark:text-gray-50">Respuesta del Backend</DialogHeader>
                <DialogBody className="h-[32rem] overflow-y-auto">
                    {backendResponse.map((response, index) => (
                        <Alert key={index} color={response.status ? "green" : "red"} className="mb-3">
                            <strong>Código: {response.code}</strong>
                            <br />
                            {response.message}
                        </Alert>
                    ))}
                </DialogBody>
                <DialogFooter>
                    <Button color="primary" onClick={() => setShowResponseModal(false)}>
                        <span>Cerrar</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default UnregisteredOperations;