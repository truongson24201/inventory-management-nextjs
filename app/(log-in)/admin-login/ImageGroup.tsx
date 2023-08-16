import Image from "next/image";

export default function ImageGroup({
    srcs
}: {
    srcs: [string, string]
}) {
    return (
        <section className=" hidden w-1/2 lg:w-2/3 md:flex">
            {srcs.map(src => (
                <div key={src} className="relative w-full first:hidden lg:first:block">
                    <Image
                        className="object-cover "
                        src={src}
                        alt="Log in image"
                        fill
                    /> 
                </div>
            ))} 
        </section>
    )
}