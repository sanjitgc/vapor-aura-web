import styles from "./Button.module.css";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    href?: string;
    target?: string;
    children: React.ReactNode;
}

export default function Button({
    variant = "primary",
    size = "md",
    href,
    className = "",
    children,
    target,
    ...props
}: ButtonProps) {
    const classNames = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classNames} target={target}>
                {children}
            </Link>
        );
    }

    return (
        <button className={classNames} {...props}>
            {children}
        </button>
    );
}
