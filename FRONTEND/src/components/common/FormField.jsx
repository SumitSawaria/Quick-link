const FormField = ({ label, error, id, children }) => {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-100">
                {label}
            </label>
            {children}
            {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
        </div>
    );
};

export default FormField;
