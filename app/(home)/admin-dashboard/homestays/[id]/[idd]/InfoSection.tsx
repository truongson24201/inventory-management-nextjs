import { IHomestayResponse } from "@/api/homestay";
import Title from "@/components/DashboardTitle";
import InfoBar from "@/components/InfoBar";
import { Color } from "@/utils/constants/colors";
import Image from "next/image";

export default function InfoSection({
    homestay,
}: {
    homestay: IHomestayResponse,
}) {
    const inforBars: {label: string, key: "homestayId" | "name" | "numPeople" | "status" | "updateOn" | "updateBy", icon: string}[] = [
        // {label: "Id", key: "homestayId", icon: "hashtag"},
        {label: "Name", key: "name", icon: "signature"},
        {label: "Num people", key: "numPeople", icon: "arrow-up-9-1"},
        {label: "Status", key: "status", icon: "flag"},
        {label: "UpdateOn", key: "updateOn", icon: "pen-to-square"},
        {label: "UpdateBy", key: "updateBy", icon: "person"},
    ];

    return (
        <section className="w-2/5 p-3 pt-6 h-full flex flex-col border-2 rounded-l-sm gap-6">
            <Title
                text="Detailed Information"
                icon="circle-info"
                color={Color.BLUE}
            />
            <div className="relative w-full h-44">
                <Image
                    className="object-contain"
                    src="/images/branch.jpg"
                    alt="Log in image"
                    fill
                /> 
            </div>
            <div className="flex flex-col gap-3"> 
                {inforBars.map(infoBar =>
                    <InfoBar
                        label={infoBar.label}
                        value={homestay?.[infoBar.key].toString() ?? ""}
                        icon={infoBar.icon}
                    />
                )}
            </div>
        </section>
    )
}