import styles from "./NicotineWarning.module.css";

// FDA-required warning for ads of nicotine products (21 CFR 1143.3): top of the page,
// at least 20% of the screen, Helvetica/Arial bold, white on black, with a border.
export default function NicotineWarning() {
    return (
        <div className={styles.band} role="note">
            <div className={styles.box}>
                <p>WARNING: This product contains nicotine. Nicotine is an addictive chemical.</p>
            </div>
        </div>
    );
}
