import ActionButtons from '../../components/ActionButtons'

export const getColumns = ({ handleDetails, handleUpdate, handleDelete }) => [
    {
        header: "ID",
        accessorKey: "id", // La clave debe coincidir con el campo en los datos
    },
    {
        header: "Nombre",
        accessorKey: "tag",
    },
    {
        header: "Typo",
        accessorKey: "connectionType",
    },
    {
        header: "Elemento",
        accessorKey: "elementType",
    },
    {
        header: "Operacion",
        accessorKey: "opsType",
    },
    {
        header: "Estado",
        accessorKey: "status",
        cell: ({ getValue }) => (getValue() ? "Activo" : "Inactivo"), // Formatear el estado
    },
    {
        header: "Acciones",
        cell: ({ row }) => <ActionButtons
            id={row.original.id}
            handleDetails={() => handleDetails(row.original.id)}
            handleDelete={() => handleDelete(row.original.id)}
        />,
    }
]