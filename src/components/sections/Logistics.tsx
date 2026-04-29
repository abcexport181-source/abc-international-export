'use client';
import styles from './Logistics.module.css';

interface LogisticsProps {
    data: {
        title: string;
        description: string;
        features: string[];
        image: string;
    };
}

const Logistics = ({ data }: LogisticsProps) => {
    return (
        <section id="logistics" className={styles.logistics}>
            <div className={`container ${styles.grid}`}>
                <div className={styles.content}>
                    <h2 className="section-title" style={{ textAlign: 'left' }}>{data.title}</h2>
                    <p>{data.description}</p>
                    <ul className={styles.features}>
                        {data.features.map((feature, index) => (
                            <li key={index}><span>✓</span> {feature}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.image}>
                    <img src={data.image} alt="Logistics" className="fade-in" />
                </div>
            </div>
        </section>
    );
};

export default Logistics;
