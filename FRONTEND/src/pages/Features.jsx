import SectionHeader from "../components/common/SectionHeader";

const features = [
    { title: "URL Shortening", body: "Convert long URLs into short, shareable links instantly." },
    { title: "Custom Alias", body: "Choose memorable slugs for campaign and personal links." },
    { title: "QR Code Generator", body: "Generate and download QR images for every short link." },
    { title: "Analytics", body: "Track total clicks, daily trends, and top performing links." },
    { title: "History Management", body: "Search, edit aliases, and delete URLs with pagination." },
    { title: "Secure Accounts", body: "JWT-based sessions, protected routes, and profile controls." },
];

const Features = () => {
    return (
        <div className="space-y-8">
            <SectionHeader
                title="Features"
                subtitle="Everything needed for a complete SaaS URL shortener workflow, from secure auth to analytics."
            />
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((item) => (
                    <article key={item.title} className="glass-panel rounded-3xl p-5">
                        <h2 className="text-xl font-bold text-white">{item.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
                    </article>
                ))}
            </section>
        </div>
    );
};

export default Features;
