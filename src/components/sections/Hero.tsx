import styles from './Hero.module.css';

interface HeroProps {
    data: {
        title: string;
        subtitle: string;
        ctaPrimary: string;
        ctaSecondary: string;
        bgImage: string;
    };
}

const Hero = ({ data }: HeroProps) => {
    return (
        <section className={styles.hero} style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${data.bgImage})` }}>
            <div className={`container ${styles.heroContent}`}>
                <h1 className="fade-in">{data.title}</h1>
                <p className="fade-in">{data.subtitle}</p>
                <div className={styles.actions}>
                    <button className="btn btn-primary">{data.ctaPrimary}</button>
                    <button className="btn btn-secondary" style={{ backgroundColor: 'white', color: 'var(--primary)' }}>{data.ctaSecondary}</button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
