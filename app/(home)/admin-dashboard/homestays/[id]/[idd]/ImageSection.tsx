'use client';
import { IImagesResponse, getImages, removeImageOutOf, setImagesInOf } from "@/api/homestay";
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
    homestayId,
}: {
    homestayId: number,
}) {
    const [images , setImages] = useState<IImagesResponse[]>([]);
    const popup = usePopup();
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [fileList, setFiles] = useState<FileList | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    async function fetchImages() {
        try {
            showLoading();
            const {data: imagesRes} = await getImages(homestayId);
            setImages(imagesRes);
            
        }
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        }
    }
    return (
        <section className="flex flex-col gap-4 w-full h-full">
            <div className="flex justify-between">
                <input
                    type="file"
                    multiple
                    onChange={(e) => {
                        setFiles(e.target.files);
                        
                    }}
                />
                <Button 
                    text="Add"
                    bgColor={Color.GREEN}
                    actionHandler={async() => {
                        try {
                            showLoading();
                            const {data} = await setImagesInOf(homestayId,fileList);
                            notify("Add images successfully", "success");
                            setImages(data);
                        }
                        catch (error) {
                            console.log(error);
                            notify("Add images failed", "error");
                        }
                        finally {
                            hideLoading();
                        }
                        
                    }}
                    color={Color.WHITE}
                />  
            </div>
            <Table
                columns={[
                    // {id: 1, text: "Id", key: "imageId"},
                    {id: 2, text: "url", key: "url", isImage: true},
                ]}
                dataSet={images}
                extra={{
                    column: {id: 3, text: "Function"},
                    node: <DeleteButton />,
                    handleClick: (id: number) => {
                        popup.show(
                            <Popup text="This image will be remove out of homestay, you're sure?">
                            <Button
                                text="Remove"
                                color={Color.WHITE}
                                bgColor={Color.RED} 
                                actionHandler={async () => {
                                    popup.hide();
                                    try {
                                        showLoading();
                                        await removeImageOutOf(homestayId,id);
                                        setImages(images.filter(t => t.imageId != id))
                                    }
                                    catch (error) {
                                        console.log(error);
                                        notify("Delete failed", "error");
                                    }
                                    finally {
                                        hideLoading();
                                    }
                                }}
                            />
                            <Button
                                text="Cancel"
                                color={Color.BLACK}
                                bgColor={Color.WHITE} 
                                actionHandler={() => {popup.hide()}}
                            />
                        </Popup>
                        )
                    },
                    key: "imageId"
                }}
            />
        </section>
    )
}