'use client';
import { IImagesResponse, getImages, removeImageOutOf, setImagesInOf } from "@/api/homestay";
import { IPriceMenuItemView } from "@/api/response";
import DeleteButton from "@/components/DeleteButton";
import { FuncNav } from "@/components/NavGroup";
import Popup from "@/components/Popup";
import { Button } from "@/layouts/DashboardHeader";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import { useEffect, useState } from "react";

export default function ImagesSection({
    image,
}: {
    image: IPriceMenuItemView[],
}) {
    return (
        <section className="flex flex-col gap-4 w-full h-full">
            <div className="flex justify-between">
            </div>
            <Table
                columns={[
                    // {id: 1, text: "Id", key: "imageId"},
                    {id: 1, text: "url", key: "menuItem.imageUrl", isImage: true},
                ]}
                dataSet={image}
            />
        </section>
    )
}