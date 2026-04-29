'use client';
import styles from './Process.module.css';

interface Step {
    id: string;
    title: string;
}

interface ProcessProps {
    data: {
        title: string;
        steps: Step[];
    };
}

const Process = ({ data }: ProcessProps) => {
    return (
        <section id="process" className={styles.process}>
            <div className="container">
                <h2 className="section-title">{data.title}</h2>
                <div className={styles.flow}>
                    {data.steps.map((step, index) => (
                        <div key={step.id} className={styles.step}>
                            <div className={styles.number}>{index + 1}</div>
                            <p>{step.title}</p>
                            {index < data.steps.length - 1 && <div className={styles.arrow}>→</div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
