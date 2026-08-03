const SectionHeader = ({ title, subtitle, action }) => {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h1 className="text-3xl font-black text-white sm:text-4xl">{title}</h1>
                {subtitle ? <p className="mt-2 text-sm text-slate-300 sm:text-base">{subtitle}</p> : null}
            </div>
            {action || null}
        </div>
    );
};

export default SectionHeader;
