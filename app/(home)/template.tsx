'use client';
export default function Template({
    children
}: {
    children: React.ReactNode
}) {
    // const token = localStorage.getItem("token");
    // if ( token === null || token === "") {
    //     throw new Error("Unauthorization");
    // }
    return (
        <>{children}</>
    )
}