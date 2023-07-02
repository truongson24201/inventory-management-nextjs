export default function Page({
    params
}: {
    params: {id: string}
}) {
    console.log(params);
    return (
        <h1>{params.id} Editing</h1>
    )
}