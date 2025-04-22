import ActionButtons from "../../../components/ActionButtons"

export const getColumns = ({ handleDetails, handleUpdate, handleDelete }) => [
    {
        header: "ID",
        accessorKey: "id", // La clave debe coincidir con el campo en los datos
    },
    {
        header: "Nombre",
        accessorKey: "name",
    },
    {
        header: "Driver",
        accessorKey: "driver",
    },
    {
        header: "Base de datos",
        accessorKey: "databaseName",
    },
    {
        header: "Host",
        accessorKey: "host",
    },
    {
        header: "Puerto",
        accessorKey: "port",
    },
    {
        header: "Estado",
        accessorKey: "enabled",
        cell: ({ getValue }) => (getValue() ? "Activo" : "Inactivo"), // Formatear el estado
    },
    {
        header: "Acciones",
        cell: ({ row }) => (
            <ActionButtons
                id={row.original.id}
                handleDetails={handleDetails}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
            />
        ),
    },
]