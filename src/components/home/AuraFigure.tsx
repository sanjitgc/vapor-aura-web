import type { CSSProperties } from "react";
import Image from "next/image";
import styles from "./AuraFigure.module.css";

// The seven chakra points on the logo's meditating figure, root to crown.
// y is the dot's centre as a percentage of the figure image's height.
const CHAKRAS = [
    { y: 92.0, color: "#f33a19" },
    { y: 74.6, color: "#ee9433" },
    { y: 58.6, color: "#ede624" },
    { y: 46.3, color: "#7ee8de" },
    { y: 33.4, color: "#93d5ff" },
    { y: 21.4, color: "#f76ba3" },
    { y: 8.9, color: "#e0279a" },
];

const RINGS = 4;
const WISPS = 3;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export default function AuraFigure() {
    return (
        <figure className={styles.aura}>
            <div className={styles.stage} aria-hidden="true">
                <div className={styles.glow} />
                {Array.from({ length: RINGS }, (_, i) => (
                    <span key={i} className={styles.ring} style={{ "--i": i } as Vars} />
                ))}
                {Array.from({ length: WISPS }, (_, i) => (
                    <span key={i} className={styles.wisp} style={{ "--i": i } as Vars} />
                ))}
                <div className={styles.pedestal}>
                    <span className={styles.shadow} />
                </div>
                <div className={styles.figure}>
                    <Image
                        src="/aura-figure-v3.webp"
                        alt=""
                        width={754}
                        height={726}
                        priority
                        sizes="(max-width: 640px) 52vw, (max-width: 1024px) 34vw, 330px"
                        className={styles.figureImage}
                    />
                    {CHAKRAS.map((c, i) => (
                        <span
                            key={c.y}
                            className={styles.chakra}
                            style={{ "--y": `${c.y}%`, "--c": c.color, "--i": i } as Vars}
                        />
                    ))}
                </div>
            </div>
            <figcaption className={styles.caption}>Transcend the ordinary</figcaption>
        </figure>
    );
}
