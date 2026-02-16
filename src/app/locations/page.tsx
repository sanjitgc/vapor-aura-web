import styles from "./page.module.css";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import MapSelector from "@/components/common/MapSelector";

const locations = [
    {
        id: 1,
        name: "Vapor Aura - Sachse",
        address: "5848 S State Hwy 78 #108, Sachse, TX 75048",
        phone: "(512) 555-0123",
        hours: "Mon-Sun: 10AM - 10PM",
        mapUrl: "https://maps.google.com/maps?q=5848+S+State+Hwy+78+%23108,+Sachse,+TX+75048&t=&z=13&ie=UTF8&iwloc=&output=embed"
    },
    {
        id: 2,
        name: "Vapor Aura - Irving",
        address: "825 W Royal Ln #140, Irving, TX 75039",
        phone: "(512) 555-0456",
        hours: "Mon-Sun: 10AM - 10PM",
        mapUrl: "https://maps.google.com/maps?q=825+W+Royal+Ln+%23140,+Irving,+TX+75039&t=&z=13&ie=UTF8&iwloc=&output=embed"
    }
];

export default function Locations() {
    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1 className={styles.title}>OUR LOCATIONS</h1>
                <p className={styles.subtitle}>Visit us at one of our premium smoke shops near you.</p>
            </header>

            <div className={styles.grid}>
                {locations.map((loc) => (
                    <Card key={loc.id} className={styles.locationCard}>
                        <div className={styles.mapContainer}>
                            <iframe
                                src={loc.mapUrl}
                                title={`${loc.name} map`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                        <div className={styles.info}>
                            <h2 className={styles.name}>{loc.name}</h2>
                            <div className={styles.details}>
                                <p><strong>Address:</strong> {loc.address}</p>
                                <p><strong>Phone:</strong> {loc.phone}</p>
                                <p><strong>Hours:</strong> {loc.hours}</p>
                            </div>

                            <div className={styles.actions}>
                                <MapSelector address={loc.address} />
                                <Button href={`tel:${loc.phone.replace(/[^0-9]/g, '')}`} variant="secondary" size="md">
                                    Call Now
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </main>
    );
}
