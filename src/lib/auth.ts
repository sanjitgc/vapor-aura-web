export const ADMIN_EMAILS = [
    "employee.vaporaura@gmail.com",
    "admin@vaporaura.com",
];

export function isAdmin(email: string | null): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
}