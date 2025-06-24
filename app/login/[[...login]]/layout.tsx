import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import ForumLogo from "@components/logo/forum-logo";
import FooterLink from "@/app/components/footer-link/footer-link";

const footerLinks = [
  { href: "/privacy", label: "Privacy & terms" },
  { href: "/contact", label: "Contact Sales" },
];

export const metadata: Metadata = {
  title: "Forum Login",
  description: "Forum Login",
  icons: {
    icon: "/forum-logo.png",
  },
  openGraph: {
    images: [
      {
        url: "/forum-logo.png",
        width: 100,
        height: 100,
        alt: "Forum",
      },
    ],
  },
  twitter: {
    title: "Forum Login",
    description: "Forum Login",
    images: [
      {
        url: "/forum-logo.png",
        width: 100,
        height: 100,
        alt: "Forum logo",
      },
    ],
  },
};
export default function RootLoginLayout({
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full flex flex-col items-center justify-between bg-[#13161d] py-4">
      <ForumLogo />
      <div className="flex flex-col items-center justify-center text-white max-w-sm text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-semibold">
            Let&apos;s get started with your email.
          </h1>
          <div className="text-lg text-[#98A2B3]">
            Begin with using your work email.
          </div>
        </div>
        <div className="h-80">
          <SignIn
            forceRedirectUrl="/conversations"
            appearance={{
              elements: {
                rootBox: "bg-transparent rounded-lg text-white border-none",
                cardBox:
                  "bg-transparent rounded-lg text-white border-none shadow-none",
                card: "bg-transparent rounded-lg text-white border-none",
                header: "hidden",
                form: "flex flex-col gap-4",
                formFieldLabel: "hidden",
                formFieldInput: "rounded-lg bg-white text-black py-2",
                formButtonPrimary:
                  "bg-[#e1114a] hover:bg-[#e1114a] text-sm border-none shadow-none text-white rounded-full font-semibold py-3",
                buttonArrowIcon: "hidden",
                dividerRow: "text-[#475467] uppercase",
                dividerLine: "bg-[#475467]",
                socialButtons: "flex flex-col items-center gap-4",
                socialButtonsBlockButton:
                  "bg-white text-black py-2 hover:bg-white",
                socialButtonsBlockButtonText: "text-md font-medium",
                footer: "hidden",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                logoImageUrl:
                  "http://localhost:3000/forum-logo.png",
              },
            }}
          />
        </div>
      </div>
      <footer className="flex items-center justify-center gap-4 text-xs">
        {footerLinks.map((link) => (
          <FooterLink key={link.href} href={link.href}>
            {link.label}
          </FooterLink>
        ))}
      </footer>
    </div>
  );
}
