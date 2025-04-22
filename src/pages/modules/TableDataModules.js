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
        header: "Direccion",
        accessorKey: "route",
    },
    {
        header: "Descripcion",
        accessorKey: "description",
    },
    {
        header: "Icono",
        accessorKey: "iconName",
    },
    {
        header: "Categoria",
        accessorKey: "level",
    },
    {
        header: "Acciones",
        cell: ({ row }) => <ActionButtons
            id={row.original.id}
            handleDetails={() => handleDetails(row.original.id)}
        />
    },
]