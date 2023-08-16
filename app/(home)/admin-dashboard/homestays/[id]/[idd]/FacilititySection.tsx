'use client';
import { IFacilityResponse } from "@/api/facility";
import { IImagesResponse, getFacilitiesCombobox, getFacilitiesOfHome, getImages, removeFacilityOutOf, setFacilitityInOf, setImagesInOf } from "@/api/homestay";
import DeleteButton from "@/components/DeleteButton";
import DropDown, { IDropdownData } from "@/components/DropDown";
import { FuncNav } from "@/components/NavGroup";
import Popup from "@/components/Popup";
import { Button } from "@/layouts/DashboardHeader";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import usePopup from "@/utils/hooks/usePopup";
import { useEffect, useState } from "react";

export default function FacilitiesSection({
    homestayId,
}: {
    homestayId: number,
}) {
    const [facilities , setFacilities] = useState<IFacilityResponse[]>([]);
    const popup = usePopup();
    const notify = useNotification();
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [facilitiesDataset, setFacilitiesDateset] = useState<IDropdownData[]>([]);
    const [facilityId, setFaclitityId] = useState(0);


    useEffect(() => {
        fetchFacilities();
        
    }, []);

    // useEffect(() => {
    //     fetchDropDown();
    // }, []);

   const removeThisFacilityOutOf = async(id:number) => {
        try {
            showLoading();
            
            const {data : old} = await removeFacilityOutOf(homestayId,id);
            // router.push("./")
            setFacilities(facilities.filter(t => t.facilityId != id ));
            const newDropdown = [
                ...facilitiesDataset,
                {
                    text: old.name ?? "",
                    value: old.touristId + "" ,
                }
            ];
            setFacilitiesDateset(newDropdown); 
            newDropdown?.[0] && setFaclitityId(Number.parseInt(newDropdown[0].value + ""));
            notify("REMOVE successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Remove tourist out of this branch failed!", "error");
        }
        finally {
            hideLoading();
        }
    }

    async function addThisFacilityInOf() {
        try {
            showLoading();
            const {data : newT} =  await setFacilitityInOf(homestayId,facilityId);
            // router.push("./")
            // fectTouristsDropDown();
            facilities.push(newT);
            const newDropdodwn = facilitiesDataset.filter(dd => dd.value != facilityId)
            setFacilitiesDateset(newDropdodwn);
            newDropdodwn?.[0] && setFaclitityId(Number.parseInt(newDropdodwn[0].value + ""));
            notify("ADD successfully!", "success");
        }
        catch (error) {
            console.log(error);
            notify("Add Facility into this homestay failed!", "error");
        }
        finally {
            hideLoading();
        }
    }


    async function fetchFacilities() {
        try {
            showLoading();
            const {data: facilityRes} = await getFacilitiesOfHome(homestayId);
            setFacilities(facilityRes);
            let {data: facilitiesDrop} = await getFacilitiesCombobox(homestayId);
            setFacilitiesDateset(facilitiesDrop.map(item => ({
                text: item?.name ?? "",
                value: item?.facilityId ?? 0
            })))
            setFaclitityId(facilitiesDrop[0].facilityId);
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
                <DropDown
                    label="Facilities"
                    dataset={facilitiesDataset}
                    handleChange={e => setFaclitityId(Number.parseInt(e.target.value))}
                    icon="house-medical"
                    value={facilityId}
                />
                <Button 
                    text="Add"
                    bgColor={Color.GREEN}
                    actionHandler={async() => {
                        addThisFacilityInOf();
                        
                    }}
                    color={Color.WHITE}
                />  
            </div>
            <Table
                columns={[
                    // {id: 1, text: "Id", key: "facilityId"},
                    {id: 2, text: "Name", key: "name"},
                ]}
                dataSet={facilities}
                extra={{
                    column: {id: 3, text: "Function"},
                    node: <DeleteButton />,
                    handleClick: (id: number) => {
                        removeThisFacilityOutOf(id);
                    },
                    key: "facilityId"
                }}
            />
        </section>
    )
}