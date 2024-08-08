import { IPriceMenuItemView } from "@/api/response";
import Title from "@/components/DashboardTitle";
import InfoBar from "@/components/InfoBar";
import InfoBarLongText from "@/components/InfoBarLongText";
import { Color } from "@/utils/constants/colors";
import Image from "next/image";

export default function InfoSection({
    tableHistory,
}: {
    tableHistory: any,
}) {
    const inforBars: { label: string, key: string, icon: string }[] = [
        // {label: "Id", key: "menuId", icon: "hashtag"},
        { label: "Table", key: "buffetTable.buffetTableName", icon: "arrow-up-9-1" },
        { label: "Frame", key: "reservation.reservationTimeFrame.reservationTimeFrameName", icon: "signature" },
        { label: "Price Adult", key: "price.adultPrice", icon: "flag" },
        { label: "Price Child", key: "price.childPrice", icon: "flag" },
        { label: "Adult", key: "adultsQuantity", icon: "flag" },
        { label: "Child", key: "childrenQuantity", icon: "flag" },
        { label: "Start", key: "startDateTime", icon: "pen-to-square" },
        { label: "End", key: "endDateTime", icon: "pen-to-square" },
        { label: "Status", key: "tableHistoryStatus", icon: "person" },
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
                {inforBars.map(infoBar => {
                    const value = infoBar.key.split('.').reduce((obj, key) => obj?.[key], tableHistory);
                    const isLongText = infoBar.key === "menuItem.description";
                    return (
                        <InfoBarLongText
                            key={infoBar.key}
                            label={infoBar.label}
                            value={value?.toString() ?? ""}
                            icon={infoBar.icon}
                            isLongText={isLongText}
                        />
                    );
                })}
            </div>
        </section>
    )
}