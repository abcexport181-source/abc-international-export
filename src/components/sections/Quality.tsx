'use client';
import styles from './Quality.module.css';

interface QualityProps {
    data: {
        title: string;
        description: string;
        items: string[];
    };
}

const Quality = ({ data }: QualityProps) => {
    return (
        <section id="quality" className={styles.quality}>
            <div className="container">
                <div className={styles.card}>
                    <h2>{data.title}</h2>
                    <p>{data.description}</p>
                    <div className={styles.items}>
                        {data.items.map((item, index) => (
                            <div key={index} className={styles.item}>
                                <span>★</span>
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Quality;
