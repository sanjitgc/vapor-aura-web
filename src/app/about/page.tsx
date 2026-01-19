import styles from "./page.module.css";

export default function About() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <section className={styles.hero}>
                    <h1 className={styles.title}>THE AURA</h1>
                    <p className={styles.lead}>
                        Born in Texas. Built for the Elite. Vapor Aura is more than a store.
                    </p>
                </section>

                <section className={styles.content}>
                    <div className={styles.block}>
                        <h2 className={styles.heading}>Our Mission</h2>
                        <p className={styles.text}>
                            At Vapor Aura, we believe that the smoking experience should be nothing short of exceptional.
                            We curate the finest selection of vapes, glass, and accessories from around the globe to bring
                            a premium standard to the Texas smoke shop scene.
                        </p>
                    </div>

                    <div className={styles.block}>
                        <h2 className={styles.heading}>The Experience</h2>
                        <p className={styles.text}>
                            Step into any of our locations and you&apos;ll feel the difference. From our knowledgeable staff
                            to our carefully designed atmosphere, every detail is crafted to elevate your visit. We are
                            not just selling products; we are cultivating a lifestyle.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
