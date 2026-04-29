'use client';
import styles from './Services.module.css';
import { FiPackage, FiGlobe, FiShield, FiTruck } from 'react-icons/fi';

interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface ServicesProps {
    data: {
        title: string;
        items: Service[];
    };
}

const getIcon = (title: string, defaultIcon: string) => {
    switch (title.toLowerCase()) {
        case 'product sourcing': return <FiPackage />;
        case 'global export': return <FiGlobe />;
        case 'quality control': return <FiShield />;
        case 'logistics support': return <FiTruck />;
        default: return <FiPackage />;
    }
};

const Services = ({ data }: ServicesProps) => {
    return (
        <section id="services" className={styles.services}>
            <div className="container">
                <h2 className="section-title">{data.title}</h2>
                <div className={styles.grid}>
                    {data.items.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.icon}>{getIcon(item.title, item.icon)}</div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
