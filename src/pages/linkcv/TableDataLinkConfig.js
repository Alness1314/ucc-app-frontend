import ActionButtons from "../../components/ActionButtons"

export const getColumns = ({ handleDetails, handleUpdate, handleDelete }) => [
    {
        header: "ID",
        accessorKey: "id", // La clave debe coincidir con el campo en los datos
    },
    {
        header: "Instalacion Cv360",
        accessorKey: "instalacionCvId",
    },
    {
        header: "Elemento Cv360",
        accessorKey: "elementoCvId",
    },
    {
        header: "Elemento UCC",
        accessorKey: "elementoUccId",
    },
    {
        header: "Acciones",
        cell: ({ row }) => <ActionButtons
            id={row.original.id}
            handleDelete={() => handleDelete(row.original.id)}
        />,
    }
]