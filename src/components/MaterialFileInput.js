import React from 'react';

const MaterialFileInput = ({ onChange, accept, className }) => {
    return (
        <div className={`input-container ${className} h-full grid content-center`}>
            <input
                type="file"
                onChange={onChange}
                accept={accept}
                className={`w-full border border-blue-500 font-extralight tracking-wider text-black dark:text-white bg-transparent cursor-pointer outline-none rounded-[3px]`}
            />
        </div>
    );
};

export default MaterialFileInput;