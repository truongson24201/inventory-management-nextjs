import Header from "@/app/(log-in)/HomeHeader";

export default function Layout({
    children
}: {
    children: React.ReactNode,
}) {
    return (
        <>
            <Header />
			<main className="mx-auto max-w-[1200px] h-screen flex items-center justify-center">
				<section className="w-full h-[600px] flex gap-8 p-8 bg-gray-50 shadow-md rounded-lg">
					{children}
                </section>
			</main>
        </>
    )
}