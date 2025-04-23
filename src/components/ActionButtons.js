import React from "react";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid"; // Íconos de Heroicons
import { IconButton } from "@material-tailwind/react";
import PropTypes from "prop-types";

const ActionButtons = ({ id, handleDetails, handleUpdate, handleDelete }) => {


    if (!id) return null; // Si no hay ID, no renderizar nada

    return (
        <div className="flex gap-2">
            {handleDetails && (
                <IconButton
                    onClick={() => handleDetails(id)}
                    className="bg-indigo-400 dark:bg-indigo-200"
                >
                    <EyeIcon className="h-5 w-5 text-white dark:text-gray-900" />
                </IconButton>
            )}
            {handleUpdate && (
                <IconButton
                    onClick={() => handleUpdate(id)}
                    className="bg-indigo-400 dark:bg-indigo-200"
                >
                    <PencilSquareIcon className="h-5 w-5 text-white dark:text-gray-900" />
                </IconButton>
            )}
            {handleDelete && (
                <IconButton
                    onClick={() => handleDelete(id)}
                    className="bg-indigo-400 dark:bg-indigo-200"
                >
                    <TrashIcon className="h-5 w-5 text-white dark:text-gray-900" />
                </IconButton>
            )}
        </div>);
};

// Agregar validación de props
ActionButtons.propTypes = {
    id: PropTypes.any.isRequired,
    handleDetails: PropTypes.func,
    handleUpdate: PropTypes.func,
    handleDelete: PropTypes.func,
};


export default React.memo(ActionButtons);