import ActionButtons from '../../components/ActionButtons'

export const getColumns = ({ handleDetails, handleUpdate, handleDelete }) => [
    {
        header: "ID",
        accessorKey: "id", // La clave debe coincidir con el campo en los datos
    },
    {
        header: "Nombre",
        accessorKey: "fullName",
    },
    {
        header: "Email",
        accessorKey: "username",
    },
    {
        header: "Perfil",
        accessorKey: "profiles", // Accede a la lista de perfiles
        cell: ({ getValue }) => {
            const profiles = getValue(); // Obtiene la lista de perfiles
            if (profiles && profiles.length > 0) {
                return profiles[0].name; // Retorna el nombre del primer perfil
            }
            return "Sin perfil"; // Mensaje por defecto si no hay perfiles
        },
    },
    {
        header: "Verificado",
        accessorKey: "verified", // Accede a la lista de perfiles
        cell: ({ getValue }) => (getValue() ? "Si" : "No"),
    },
    {
        header: "Estado",
        accessorKey: "erased",
        cell: ({ getValue }) => (getValue() ? "Inactivo" : "Activo"), // Formatear el estado
    },
    {
        header: "Fecha de Creación",
        accessorKey: "dateCreate",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(), // Formatear la fecha
    },
    {
        header: "Acciones",
        cell: ({ row }) => <ActionButtons
            id={row.original.id}
            handleDetails={() => handleDetails(row.original.id)}
            handleUpdate={() => handleUpdate(row.original.id)}
            handleDelete={() => handleDelete(row.original.id)}
        />,
    }
]