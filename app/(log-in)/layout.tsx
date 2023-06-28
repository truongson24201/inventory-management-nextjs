import Header from "@/layouts/HomeHeader";

export default function Layout({
    children
}: {
    children: React.ReactNode,
}) {
    return (
        <>
            <Header />
			<main className="mx-auto max-w-[1200px] h-screen flex items-center justify-center">
				<section className="w-full h-[600px] flex gap-8 p-8 bg-gray-50 rounded-lg">
					{children}
                </section>
			</main>
        </>
    )
}