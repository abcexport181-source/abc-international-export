'use client';
import styles from './Industries.module.css';

interface Industry {
    id: string;
    name: string;
    icon: string;
}

interface IndustriesProps {
    data: {
        title: string;
        items: Industry[];
    };
}

const Industries = ({ data }: IndustriesProps) => {
    return (
        <section id="industries" className={styles.industries}>
            <div className="container">
                <h2 className="section-title">{data.title}</h2>
                <div className={styles.grid}>
                    {data.items.map((item) => (
                        <div key={item.id} className={styles.item}>
                            <div className={styles.icon}>{item.icon}</div>
                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Industries;
