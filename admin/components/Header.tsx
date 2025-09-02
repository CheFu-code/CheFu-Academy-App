import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <header className="my-10 flex justify-between gap-5">
            <div className="items-center justify-center flex">
                <Image
                    src="/logo.png"
                    alt="CheFu Academy"
                    width={100}
                    height={100}
                />
            </div>
            <Link className="text-lg font-semibold text-white" href="/">
                CheFu Academy
            </Link>
        </header>
    );
};

export default Header;
