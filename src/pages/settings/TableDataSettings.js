import ActionButtons from '../../components/ActionButtons'

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
        header: "Valor",
        accessorKey: "value",
    },
    {
        header: "Categoria",
        accessorKey: "group",
    },
    {
        header: "Estado",
        accessorKey: "enabled",
        cell: ({ getValue }) => (getValue() ? "Activo" : "Inactivo"), // Formatear el estado
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