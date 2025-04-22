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
        header: "Device/Slave Id",
        accessorKey: "deviceIdSlave",
    },
    {
        header: "IP",
        accessorKey: "ipAddress",
    },
    {
        header: "Port",
        accessorKey: "servicePort",
    },
    {
        header: "Tipo",
        accessorKey: "mediaType",
    },
    {
        header: "Transmision",
        accessorKey: "transmissionMode",
    },
    {
        header: "Estado",
        accessorKey: "enabled",
        cell: ({ getValue }) => (getValue() ? "Activo" : "Inactivo"), // Formatear el estado
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