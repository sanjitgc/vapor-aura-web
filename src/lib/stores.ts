export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://vaporauratx.com").replace(/\/$/, "");

export const SOCIAL = {
    instagram: "https://www.instagram.com/vaporaurasmokeshop/",
    facebook: "https://www.facebook.com/profile.php?id=61588307159610",
};

export const STORES = [
    {
        slug: "sachse",
        name: "Vapor Aura – Sachse",
        street: "5848 S State Hwy 78 #108",
        city: "Sachse",
        zip: "75048",
        phone: "(214) 501-3222",
        tel: "tel:+12145013222",
        hoursSummary: "Sun–Wed 7 AM–1 AM, Thu–Sat 7 AM–2 AM",
        // schema.org: closing after midnight is written as the next day's time
        openingHours: [
            { days: ["Sunday", "Monday", "Tuesday", "Wednesday"], opens: "07:00", closes: "01:00" },
            { days: ["Thursday", "Friday", "Saturday"], opens: "07:00", closes: "02:00" },
        ],
    },
    {
        slug: "irving",
        name: "Vapor Aura – Irving",
        street: "825 W Royal Ln Suite 140",
        city: "Irving",
        zip: "75039",
        phone: "(214) 272-8395",
        tel: "tel:+12142728395",
        hoursSummary: "Open 24 hours",
        openingHours: [
            { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" },
        ],
    },
];
