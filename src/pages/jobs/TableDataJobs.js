import ActionButtons from "../../components/ActionButtons"

export const getColumns = ({ handleRun, handleStop, handleResume, handleDelete }) => [
    {
        header: "ID",
        accessorKey: "jobId", // La clave debe coincidir con el campo en los datos
    },
    {
        header: "Nombre",
        accessorKey: "jobName",
    },
    {
        header: "Descripción",
        accessorKey: "description",
    },
    {
        header: "Grupo",
        accessorKey: "jobGroup",
    },
    {
        header: "Estado",
        accessorKey: "jobStatus",
    },
    {
        header: "Habilitado",
        accessorKey: "enabled",
        cell: ({ getValue }) => (getValue() ? "Activo" : "Inactivo"), // Formatear el estado
    },
     {
                header: "Acciones",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <IconButton
                            onClick={() => handleRun(row.original.jobId)}
                            className="bg-indigo-400 dark:bg-indigo-200"
                        >
                            <PlayIcon className="h-5 w-5 text-white dark:text-gray-900" />
                        </IconButton>
                        <IconButton
                            onClick={() => handleStop(row.original.jobId)}
                            className="bg-indigo-400 dark:bg-indigo-200"
                        >
                            <StopIcon className="h-5 w-5 text-white dark:text-gray-900" />
                        </IconButton>
                        <IconButton
                            onClick={() => handleResume(row.original.jobId)}
                            className="bg-indigo-400 dark:bg-indigo-200"
                        >
                            <PlayPauseIcon className="h-5 w-5 text-white dark:text-gray-900" />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDelete(row.original.jobId)}
                            className="bg-indigo-400 dark:bg-indigo-200"
                        >
                            <TrashIcon className="h-5 w-5 text-white dark:text-gray-900" />
                        </IconButton>
                    </div>
                ),
            },
]