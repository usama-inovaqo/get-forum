import Image from "next/image";

type ForumLogoProps = {
    width?: number;
    height?: number;
}

export default function ForumLogo({ width = 50, height = 25 }: ForumLogoProps) {
    return (
        <Image
            src="/forum-logo.png"
            alt="Forum logo"
            width={width}
            height={height}
            priority
            className="mx-auto sm:mx-0"
        />
    );
}