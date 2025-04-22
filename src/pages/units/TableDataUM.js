
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
        header: "Volumen Unidad",
        accessorKey: "volumenUm",
    },
    {
        header: "Temperatura Unidad",
        accessorKey: "temperaturaUm",
    },
    {
        header: "Presion Unidad",
        accessorKey: "presionUm",
    },
    {
        header: "Fecha Inicio Unidad",
        accessorKey: "fechaInicio",
    },
    {
        header: "Fecha Fin Unidad",
        accessorKey: "fechaFin",
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