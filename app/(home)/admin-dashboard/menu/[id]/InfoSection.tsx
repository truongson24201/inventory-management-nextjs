import { IPriceMenuItemView } from "@/api/response";
import Title from "@/components/DashboardTitle";
import InfoBar from "@/components/InfoBar";
import InfoBarLongText from "@/components/InfoBarLongText";
import { Color } from "@/utils/constants/colors";
import Image from "next/image";

export default function InfoSection({
    menu,
}: {
    menu: any,
}) {
    const inforBars: { label: string, key: string, icon: string }[] = [
        // {label: "Id", key: "menuId", icon: "hashtag"},
        { label: "Name", key: "menuItem.menuItemName", icon: "signature" },
        { label: "Category", key: "menuItem.menuItemCategory.menuItemCategoryName", icon: "arrow-up-9-1" },
        { label: "Price", key: "price", icon: "flag" },
        { label: "Description", key: "menuItem.description", icon: "pen-to-square" },
        { label: "Status", key: "menuItem.isActive", icon: "person" },
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
                    const value = infoBar.key.split('.').reduce((obj, key) => obj?.[key], menu);
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