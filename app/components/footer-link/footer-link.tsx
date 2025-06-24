import Link from "next/link";

type FooterLinkProps = {
    href: string;
    children: React.ReactNode;
};

export default function FooterLink({
    href,
    children,
}: Readonly<FooterLinkProps>) {
    return (
        <Link href={href} className="text-[#667085] hover:text-white transition-colors duration-300">
            {children}
        </Link>
    );
}
