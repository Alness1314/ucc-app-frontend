import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Typography } from '@material-tailwind/react';
import { MenuItem, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid2 } from '@mui/material';
import apiService from '../../service/ApiService'; // Importar el servicio de Axios
import SweetAlert2 from '../../components/SweetAlert2';

const LinkConfigRegister = ({ darkMode }) => {
    const navigate = useNavigate();
    const { control, handleSubmit, watch } = useForm();
    const [measurementSystems, setMeasurementSystems] = useState([]);
    const [installations, setInstallations] = useState([]);
    const [elements, setElements] = useState([]);
    const [items, setItems] = useState([]);
    const selectedInstallation = watch('installation');
    const selectedMeasurementSystem = watch('measurementSystem');
    const user = localStorage.getItem("user");

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
            name: "Enlace cv360",
            route: "/link-config",
        },
        {
            name: "Registro",
            route: "/link-config/register",
        }
    ];

    useEffect(() => {
        // Cargar sistemas de medición
        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/measurementsystems`)
            .then(response => setMeasurementSystems(response.data))
            .catch(error => console.error('Error fetching measurement systems:', error));

        // Cargar instalaciones
        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/helper-query/cv360/instalaciones/by-user/${user}`)
            .then(response => setInstallations(response.data))
            .catch(error => console.error('Error fetching installations:', error));
    }, [user]);

    useEffect(() => {
        if (selectedInstallation) {
            // Cargar tanques y ductos basado en la instalación seleccionada
            Promise.all([
                apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/helper-query/cv360/instalaciones/${selectedInstallation}/tanks`),
                apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/helper-query/cv360/instalaciones/${selectedInstallation}/ducts`)
            ]).then(([tanksResponse, ductsResponse]) => {
                setElements([...tanksResponse.data, ...ductsResponse.data]);
            }).catch(error => console.error('Error fetching elements:', error));
        }
    }, [selectedInstallation]);

    const onSubmit = (data) => {
        const newItem = {
            instalacionCvId: data.installation,
            elementoCvId: data.element,
            elementoUccId: data.uccId
        };
        setItems([...items, newItem]);
    };

    const sendData = () => {
        apiService.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/measurementsystems/${selectedMeasurementSystem}/linkconfigurations/list`, items)
            .then(response => {
                SweetAlert2({
                    title: 'Éxito',
                    text: 'Usuario registrado correctamente',
                    icon: 'success',
                    confirmButtonColor: "#3bdb39",
                    confirmButtonText: 'Aceptar',
                });

                navigate('/link-config'); // Redirige a la tabla de usuarios
            })
            .catch(error => {
                console.error('Error sending data:', error)
                SweetAlert2({
                    title: 'Error',
                    text: error.message,
                    icon: 'error',
                    confirmButtonColor: "#3bdb39",
                    confirmButtonText: 'Aceptar',
                });
            });
    };

    return (
        <div className={`${bgColor} max-h-screen`}>
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />

            {/* Título y Subtítulo */}
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Registro de Enlace CV360
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Completa el formulario para registrar un nuevo enlace CV360
            </Typography>
            <hr className="my-2 border-gray-800" />

            {/* Formulario Dinámico */}
            <div className={`${bgColor} max-h-screen grid grid-cols-12 items-center justify-center`}>
                <div className={`mt-2 col-span-12 col-start-1 ${cardBgColor} rounded-lg shadow-lg`}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid2 container spacing={3} style={{ padding: '24px' }}>
                            <Grid2 item size={12} >
                                <Controller
                                    name="measurementSystem"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Sistema de Medicion"
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
                                            {measurementSystems.map((option, i) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.tag}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
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
                                            {installations.map((option, i) => (
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
                                            {elements.map((option, i) => (
                                                <MenuItem key={option.publicKey} value={option.publicKey}>
                                                    {option.externalKey}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />

                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="uccId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => <TextField {...field} label="UCC ID" fullWidth sx={{
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
                                    }} />}
                                />

                            </Grid2>
                            <Grid2 item size={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="submit" variant="contained" color="primary" size='large'>
                                    Añadir
                                </Button>
                            </Grid2>
                            <Grid2 item size={12}>
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        backgroundColor: darkMode ? "#333" : "#fff",
                                        color: darkMode ? "white" : "black",
                                    }}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>
                                                    Instalacion CV ID
                                                </TableCell>
                                                <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>
                                                    Elemento CV ID
                                                </TableCell>
                                                <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>
                                                    Elemento UCC ID
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {items.map((item, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        "&:nth-of-type(odd)": {
                                                            backgroundColor: darkMode ? "#444" : "#f9f9f9",
                                                        },
                                                        "&:nth-of-type(even)": {
                                                            backgroundColor: darkMode ? "#555" : "#fff",
                                                        },
                                                        "&:hover": {
                                                            backgroundColor: darkMode ? "#666" : "#f1f1f1",
                                                        },
                                                    }}
                                                >
                                                    <TableCell sx={{ color: darkMode ? "white" : "black" }}>
                                                        {item.instalacionCvId}
                                                    </TableCell>
                                                    <TableCell sx={{ color: darkMode ? "white" : "black" }}>
                                                        {item.elementoCvId}
                                                    </TableCell>
                                                    <TableCell sx={{ color: darkMode ? "white" : "black" }}>
                                                        {item.elementoUccId}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

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
        </div>
    );
};

export default LinkConfigRegister;