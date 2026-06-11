import { cookies } from "next/headers";

export interface CustomerSession {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    customer: {
        id: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone:string | null;
    };
}

export async function getSession(): Promise<CustomerSession | null> {
    const cookieStore = await cookies();
    const raw = cookieStore.get("va_session")?.value;
    if (!raw) return null;
    try {
        const session: CustomerSession = JSON.parse(raw);
        if (session.expiresAt - Date.now() < 5 * 60_000) return null;
        return session;
    } catch {
        return null;
    }
}