import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, MenuItem, Button, Grid2 } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const DynamicForm = ({ fields, onSubmit, initialValues, darkMode = false }) => {
    const { control, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
    }, [initialValues, reset]);

    const getColumnClass = (span) => {
        return span;
    };

    // Función para convertir nombres de campos con notación de puntos en un objeto anidado
    const buildNestedObject = (data) => {
        const result = {};
        for (const key in data) {
            if (key.includes('.')) {
                const keys = key.split('.');
                let current = result;
                for (let i = 0; i < keys.length - 1; i++) {
                    const nestedKey = keys[i];
                    if (!current[nestedKey]) {
                        current[nestedKey] = {};
                    }
                    current = current[nestedKey];
                }
                current[keys[keys.length - 1]] = data[key];
            } else {
                result[key] = data[key];
            }
        }
        return result;
    };

    const handleFormSubmit = (data) => {
        // Construir el objeto anidado
        const nestedData = buildNestedObject(data);

        // Formatear los valores antes de enviarlos
        const formattedData = {};
        Object.keys(nestedData).forEach((key) => {
            const field = fields.find((f) => f.name === key || f.name.startsWith(key + '.'));
            if (field) {
                if (field.type === 'date') {
                    formattedData[key] = dayjs(nestedData[key]).format('YYYY-MM-DD'); // Solo fecha
                } else if (field.type === 'time') {
                    formattedData[key] = dayjs(nestedData[key]).format('HH:mm:ss'); // Solo hora
                } else if (field.type === 'datetime') {
                    formattedData[key] = dayjs(nestedData[key]).toISOString(); // Fecha y hora
                } else {
                    formattedData[key] = nestedData[key]; // Otros campos
                }
            }
        });

        onSubmit(formattedData); // Enviar datos formateados
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid2 container spacing={3} style={{ padding: '24px' }}>
                    {fields.map((field, index) => (
                        <Grid2 item size={getColumnClass(field.span)} key={index}>
                            {field.type === 'dropdown' ? (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    defaultValue={field.multiple ? [] : ''}
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            select
                                            label={field.label}
                                            required={field.required}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            SelectProps={{
                                                multiple: field.multiple,
                                            }}
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
                                            }}
                                        >
                                            {field.options.map((option, i) => (
                                                <MenuItem key={i} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            ) : field.type === 'datetime' ? (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value } }) => (
                                        <DateTimePicker
                                            label={field.label}
                                            value={value ? dayjs(value) : null}
                                            size="small"
                                            onChange={(newValue) => onChange(newValue)}
                                            sx={{
                                                width: '100%', // Asegura que ocupe todo el ancho
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
                                                "& .MuiInputBase-input": {
                                                    color: darkMode ? "white" : "black",
                                                },
                                            }}
                                        />
                                    )}
                                />
                            ) : field.type === 'date' ? (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value } }) => (
                                        <DatePicker
                                            label={field.label}
                                            value={value ? dayjs(value) : null}
                                            size="small"
                                            onChange={(newValue) => onChange(newValue)}
                                            sx={{
                                                width: '100%', // Asegura que ocupe todo el ancho
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
                                                "& .MuiInputBase-input": {
                                                    color: darkMode ? "white" : "black",
                                                },
                                            }}
                                        />
                                    )}
                                />
                            ) : field.type === 'time' ? (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange, value } }) => (
                                        <TimePicker
                                            label={field.label}
                                            size="small"
                                            value={value ? dayjs(value) : null}
                                            onChange={(newValue) => onChange(newValue)}
                                            views={field.views || ['hours', 'minutes']}
                                            sx={{
                                                width: '100%', // Asegura que ocupe todo el ancho
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
                                                "& .MuiInputBase-input": {
                                                    color: darkMode ? "white" : "black",
                                                },
                                            }}
                                        />
                                    )}
                                />
                            ) : (
                                <Controller
                                    name={field.name}
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <TextField
                                            type={field.type}
                                            label={field.label}
                                            required={field.required}
                                            variant="outlined"
                                            fullWidth
                                            size="medium"
                                            value={value}
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
                                            }}
                                            onChange={(e) => onChange(e.target.value)}
                                        />
                                    )}
                                />
                            )}
                        </Grid2>
                    ))}
                    <Grid2 item size={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" color="primary" size='large'>
                            Enviar
                        </Button>
                    </Grid2>
                </Grid2>
            </form>
        </LocalizationProvider>
    );
};

export default DynamicForm;