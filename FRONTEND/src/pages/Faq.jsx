import SectionHeader from "../components/common/SectionHeader";
import FaqAccordion from "../components/faq/FaqAccordion";
import { FAQ_ITEMS } from "../constants/faq";

const Faq = () => {
    return (
        <div className="space-y-8">
            <SectionHeader
                title="Frequently Asked Questions"
                subtitle="Find quick answers about shortening, security, analytics, and account workflows."
            />
            <FaqAccordion items={FAQ_ITEMS} />
        </div>
    );
};

export default Faq;
