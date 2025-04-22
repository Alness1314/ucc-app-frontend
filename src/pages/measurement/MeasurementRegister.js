import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { Typography, IconButton } from "@material-tailwind/react";
import { MenuItem, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid2 } from '@mui/material';
import Breadcrumbs from "../../components/Breadcrumbs";
import apiService from '../../service/ApiService'; // Importar el servicio de Axios
import { TrashIcon } from "@heroicons/react/24/solid"; // Íconos de Heroicons
import SweetAlert2 from '../../components/SweetAlert2';

const MeasurementRegister = ({ darkMode }) => {
    const navigate = useNavigate();
    const { control, handleSubmit, watch } = useForm();
    const [conexiones, setConexiones] = useState([]);
    const [elementos, setElementos] = useState([]);
    const [operaciones, setOperaciones] = useState([]);
    const [units, setUnits] = useState([]);
    const [connections, setConnections] = useState([]);
    const [items, setItems] = useState([]);
    const [tagNames, setTagNames] = useState([]);

    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const textColor = darkMode ? "text-white" : "text-gray-900";
    const subTextColor = darkMode ? "text-blue-gray-200" : "text-blue-grey";
    const cardBgColor = darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200";

    // Cargar datos iniciales
    useEffect(() => {
        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/enums-system/tipos/conexiones`)
            .then(response => setConexiones(response.data))
            .catch(error => console.error('Error fetching connections', error));

        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/enums-system/tipos/elementos`)
            .then(response => setElementos(response.data))
            .catch(error => console.error('Error fetching elements', error));

        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/enums-system/tipos/tags-names`)
            .then(response => setTagNames(response.data))
            .catch(error => console.error('Error fetching tag names', error));

        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/enums-system/tipos/ops-volumetricas`)
            .then(response => setOperaciones(response.data))
            .catch(error => console.error('Error fetching operations', error));

        apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/measurementunits`)
            .then(response => setUnits(response.data))
            .catch(error => console.error('Error fetching measurementUnits', error));

        Promise.all([
            apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/modbus-conexion`),
            apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/opc-conexion`),
            apiService.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/odbc-conexion`)
        ]).then(([modbusResponse, opcResponse, odbcResponse]) => {
            const modbus = modbusResponse.data.map(modbusCon => ({
                id: modbusCon.id,
                value: modbusCon.id,
                label: modbusCon.name + "  [Modbus]",
            }));
            const opc = opcResponse.data.map(opcCon => ({
                id: opcCon.id,
                value: opcCon.id,
                label: opcCon.applicationName + "  [OPC]",
            }));
            const odbc = odbcResponse.data.map(odbcCon => ({
                id: odbcCon.id,
                value: odbcCon.id,
                label: odbcCon.name + "  [ODBC]",
            }));
            setConnections([...modbus, ...opc, ...odbc]);
        }).catch(error => console.error('Error fetching elements:', error));
    }, []);

    const optionsEnabled = [
        { id: "1", value: true, label: "Habilitado" },
        { id: "2", value: false, label: "Deshabilitado" }
    ];

    const options = [
        { id: "0", value: null, label: "No aplica" },
        { id: "1", value: true, label: "Si" },
        { id: "2", value: false, label: "No" }
    ];

    const onSubmit = (data) => {
        const newItem = {
            name: data.name,
            dataType: data.dataType,
            connection: data.connection,
            nodeId: data.nodeId,
            addressStart: data.addressStart,
            functionCode: data.functionCode,
            dataSwap: data.dataSwap,
            tableName: data.tableName,
            columnName: data.columnName,
            filter: data.filter
        };
        setItems([...items, newItem]);
    };

    const sendData = () => {
        const formData = {
            tag: watch('tag'),
            connectionType: watch('connectionType'),
            elementType: watch('elementType'),
            opsType: watch('opsType'),
            status: watch('status'),
            configTemplate: items,
            recolectarDatos: watch('recolectarDatos'),
            indepentModbus: watch('indepentModbus'),
            measurementUnitId: watch('measurementUnitId')
        };

        apiService.post(
            `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_PREFIX}/measurementsystems`,
            formData, true
        )
            .then(response => {
                SweetAlert2({
                    title: 'Éxito',
                    text: 'Usuario registrado correctamente',
                    icon: 'success',
                    confirmButtonColor: "#3bdb39",
                    confirmButtonText: 'Aceptar',
                });

                navigate('/measurement-system'); // Redirige a la tabla de usuarios
            })
            .catch(error => {
                console.error('Error sending data:', error);
                SweetAlert2({
                    title: 'Error',
                    text: error.message,
                    icon: 'error',
                    confirmButtonColor: "#3bdb39",
                    confirmButtonText: 'Aceptar',
                });
            });
    };

    const handleDelete = (index) => {
        const result = SweetAlert2({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarlo",
            cancelButtonText: "Cancelar",
        });

        result.then((result) => {
            if (result.isConfirmed) {
                try {
                    const newItems = items.filter((_, i) => i !== index);
                    setItems(newItems);

                    SweetAlert2({
                        title: "Eliminado",
                        text: "Elemento eliminado correctamente",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                    });
                } catch (error) {
                    SweetAlert2({
                        title: "Error",
                        text: error.message,
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                }
            }
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
            name: "Registrar",
            route: "/measurement-system/register",
        },
    ];


    const getSelectFieldStyles = (darkMode) => ({
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
    })

    const getTextFieldStyles = (darkMode) => ({
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
    })

    function capitalizeFirstLetter(str) {
        if (!str || typeof str !== "string") {
            return str; // Retorna el valor original si no es un string válido
        }
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }


    const getDynamicColumns = (item) => {
        const dynamicFields = ['nodeId', 'addressStart', 'functionCode', 'dataSwap', 'tableName', 'columnName', 'filter'];
        return dynamicFields.map((field, index) => {
            if (item[field] !== undefined && item[field] !== null && item[field] !== '') {
                return (
                    <TableCell key={index} sx={{ color: darkMode ? "white" : "black" }}>
                        {field === 'dataSwap' ? (item[field] ? "Si" : "No") : item[field]}
                    </TableCell>
                );
            }
            return null;
        });
    };

    return (
        <div className="p-0 m-0 h-[calc(100vh-100px)] overflow-hidden overflow-y-auto overflow-x-auto">
            {/* Breadcrumbs */}
            <Breadcrumbs darkMode={darkMode} paths={breadcrumbsPaths} />
            <Typography variant="h4" className={`mb-1 ${textColor}`}>
                Sistema de Medicion
            </Typography>
            <Typography variant="paragraph" className={`mb-2 ${subTextColor}`}>
                Registra un nuevo sistema de medicion
            </Typography>
            <hr className="my-2 border-gray-800" />
            {/* Formulario Dinámico */}
            <div className={`${bgColor} max-h-screen grid grid-cols-12 items-center justify-center`}>
                <div className={`mt-2 col-span-12 col-start-1 ${cardBgColor} rounded-lg shadow-lg`}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid2 container spacing={3} style={{ padding: '24px' }}>
                            {/* Campos del formulario... */}
                            <Grid2 item size={6}>
                                <Controller
                                    name="tag"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) =>
                                        <TextField
                                            type="text"
                                            label="Tag (Nombre)"
                                            required={true}
                                            variant="outlined"
                                            size="medium"
                                            fullWidth
                                            value={value}
                                            sx={getTextFieldStyles(darkMode)}
                                            onChange={(e) => onChange(e.target.value)}
                                        />}
                                />
                            </Grid2>
                            <Grid2 item size={6}>
                                <Controller
                                    name="status"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Estado"
                                            required={true}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={getSelectFieldStyles(darkMode)}>
                                            {optionsEnabled.map((option, index) => (
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
                                    name="connectionType"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Tipo de conexion"
                                            required={true}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={getSelectFieldStyles(darkMode)}>
                                            {conexiones.map((option, index) => (
                                                <MenuItem key={index} value={option}>
                                                    {capitalizeFirstLetter(option)}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="elementType"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Tipo de elemento"
                                            required={true}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={getSelectFieldStyles(darkMode)}>
                                            {elementos.map((option, i) => (
                                                <MenuItem key={i} value={option}>
                                                    {capitalizeFirstLetter(option)}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="opsType"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Tipo de operacion"
                                            required={true}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={getSelectFieldStyles(darkMode)}>
                                            {operaciones.map((option, i) => (
                                                <MenuItem key={i} value={option}>
                                                    {capitalizeFirstLetter(option)}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>

                            <Grid2 item size={6}>
                                <Controller
                                    name="recolectarDatos"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Inicia la recoleccion de datos"
                                            required={true}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={getSelectFieldStyles(darkMode)}>
                                            {options.map((option, index) => (
                                                <MenuItem key={option.id} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={6}>
                                <Controller
                                    name="indepentModbus"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Modbus independiente"
                                            required={true}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={getSelectFieldStyles(darkMode)}>
                                            {options.map((option, index) => (
                                                <MenuItem key={option.id} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={12}>
                                <Controller
                                    name="measurementUnitId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Unidades del sistema de medicion"
                                            required={true}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={getSelectFieldStyles(darkMode)}>
                                            {units.map((option, index) => (
                                                <MenuItem key={option.id} value={option.id}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={12}>
                                <hr className={`my-2 ${darkMode ? "border-gray-400" : "border-gray-700"}`} />
                            </Grid2>
                            <Grid2 item size={12}>
                                <Typography variant="paragraph" className={`${subTextColor}`}>
                                    Configuración de tags
                                </Typography>
                            </Grid2>

                            {/* Tags para MODBUS-OPC-ODBC */}
                            <Grid2 item size={4}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Nombre"
                                            required={false}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={getSelectFieldStyles(darkMode)}>
                                            {tagNames.map((option, index) => (
                                                <MenuItem key={index} value={option}>
                                                    {capitalizeFirstLetter(option)}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="dataType"
                                    control={control}
                                    render={({ field: { onChange, value } }) =>
                                        <TextField
                                            type="text"
                                            label="Tipo de dato"
                                            required={false}
                                            variant="outlined"
                                            size="medium"
                                            fullWidth
                                            value={value}
                                            sx={getTextFieldStyles(darkMode)}
                                            onChange={(e) => onChange(e.target.value)}
                                        />}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="connection"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Conexion"
                                            required={false}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={getSelectFieldStyles(darkMode)}>
                                            {connections.map((option, index) => (
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
                                    name="nodeId"
                                    control={control}
                                    render={({ field: { onChange, value } }) =>
                                        <TextField
                                            type="text"
                                            label="Nodo ID"
                                            required={false}
                                            variant="outlined"
                                            size="medium"
                                            fullWidth
                                            value={value}
                                            sx={getTextFieldStyles(darkMode)}
                                            onChange={(e) => onChange(e.target.value)}
                                        />}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="dataSwap"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label="Intercambio de datos"
                                            required={false}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            displayEmpty
                                            sx={getSelectFieldStyles(darkMode)}>
                                            {options.map((option, index) => (
                                                <MenuItem key={option.id} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid2>
                            <Grid2 item size={6}>
                                <Controller
                                    name="addressStart"
                                    control={control}
                                    render={({ field: { onChange, value } }) =>
                                        <TextField
                                            type="text"
                                            label="Dirección Inicio"
                                            required={false}
                                            variant="outlined"
                                            size="medium"
                                            fullWidth
                                            value={value}
                                            sx={getTextFieldStyles(darkMode)}
                                            onChange={(e) => onChange(e.target.value)}
                                        />}
                                />
                            </Grid2>
                            <Grid2 item size={6}>
                                <Controller
                                    name="functionCode"
                                    control={control}
                                    render={({ field: { onChange, value } }) =>
                                        <TextField
                                            type="text"
                                            label="Codigo de función"
                                            required={false}
                                            variant="outlined"
                                            size="medium"
                                            fullWidth
                                            value={value}
                                            sx={getTextFieldStyles(darkMode)}
                                            onChange={(e) => onChange(e.target.value)}
                                        />}
                                />
                            </Grid2>

                            <Grid2 item size={4}>
                                <Controller
                                    name="tableName"
                                    control={control}
                                    render={({ field: { onChange, value } }) =>
                                        <TextField
                                            type="text"
                                            label="Nombre de la tabla"
                                            required={false}
                                            variant="outlined"
                                            size="medium"
                                            fullWidth
                                            value={value}
                                            sx={getTextFieldStyles(darkMode)}
                                            onChange={(e) => onChange(e.target.value)}
                                        />}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="columnName"
                                    control={control}
                                    render={({ field: { onChange, value } }) =>
                                        <TextField
                                            type="text"
                                            label="Nombre de la columna"
                                            required={false}
                                            variant="outlined"
                                            size="medium"
                                            fullWidth
                                            value={value}
                                            sx={getTextFieldStyles(darkMode)}
                                            onChange={(e) => onChange(e.target.value)}
                                        />}
                                />
                            </Grid2>
                            <Grid2 item size={4}>
                                <Controller
                                    name="filter"
                                    control={control}
                                    render={({ field: { onChange, value } }) =>
                                        <TextField
                                            type="text"
                                            label="Filtro"
                                            required={false}
                                            variant="outlined"
                                            size="medium"
                                            fullWidth
                                            value={value}
                                            sx={getTextFieldStyles(darkMode)}
                                            onChange={(e) => onChange(e.target.value)}
                                        />}
                                />
                            </Grid2>

                            <Grid2 item size={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="submit" variant="contained" color="primary" size='large'>
                                    Añadir
                                </Button>
                            </Grid2>
                            <Grid2 item size={12}>
                                <hr className={`my-2 ${darkMode ? "border-gray-400" : "border-gray-700"}`} />
                            </Grid2>

                            <Grid2 item size={12}>
                                <TableContainer component={Paper} sx={{ backgroundColor: darkMode ? "#333" : "#fff", color: darkMode ? "white" : "black" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>Nombre</TableCell>
                                                <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>Tipo de dato</TableCell>
                                                <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>Conexion</TableCell>
                                                {items.some(item => item.nodeId) && <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>Nodo Id</TableCell>}
                                                {items.some(item => item.addressStart) && <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>Direccion Inicio</TableCell>}
                                                {items.some(item => item.functionCode) && <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>Codigo de Funcion</TableCell>}
                                                {items.some(item => item.dataSwap !== undefined) && <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>Intercambio de datos</TableCell>}
                                                {items.some(item => item.tableName) && <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>Nombre de la tabla</TableCell>}
                                                {items.some(item => item.columnName) && <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>Nombre de la columna</TableCell>}
                                                {items.some(item => item.filter) && <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>Filtro</TableCell>}
                                                <TableCell sx={{ color: darkMode ? "white" : "black", fontWeight: "bold" }}>Eliminar</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {items.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ color: darkMode ? "white" : "black" }}>{item.name}</TableCell>
                                                    <TableCell sx={{ color: darkMode ? "white" : "black" }}>{item.dataType}</TableCell>
                                                    <TableCell sx={{ color: darkMode ? "white" : "black" }}>{item.connection}</TableCell>
                                                    {getDynamicColumns(item)}
                                                    <TableCell sx={{ color: darkMode ? "white" : "black" }}><IconButton
                                                        onClick={() => handleDelete(index)}
                                                        className="bg-indigo-400 dark:bg-indigo-200"
                                                    >
                                                        <TrashIcon className="h-5 w-5 text-white dark:text-gray-900" />
                                                    </IconButton></TableCell>
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

export default MeasurementRegister;