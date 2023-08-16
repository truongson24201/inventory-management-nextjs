'use client';
import { IFacilityResponse, createFacility, getFacilities } from "@/api/facility";
import { IBranchesTourist, ITouristResponse, getTourists } from "@/api/tourist";
import ComboBox from "@/components/Combobox";
import EditText from "@/components/EditText";
import SearchInput from "@/components/SearchInput";
import Header, { Button } from "@/layouts/DashboardHeader";
import Main from "@/layouts/DashboardMain";
import Table from "@/layouts/Table";
import { Color } from "@/utils/constants/colors";
import filterByFields, { IItem, toIndexSignature } from "@/utils/functions/filterByFields";
import useLoadingAnimation from "@/utils/hooks/useLoadingAnimation";
import useNotification from "@/utils/hooks/useNotification";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [showLoading, hideLoading] = useLoadingAnimation();
    const [facilities, setFacilities] = useState<IFacilityResponse[]>([]);
    const notify = useNotification();  
    const [newFacility, setNewFacility] = useState(
        {label: "Name", value: "", icon: "signature", isRequired: true, errorText: ""});

    const router = useRouter();


    useEffect(() => {
        fetchTourists();
    },[])


    async function fetchTourists() {
        try {
            showLoading();
            const {data : facilityRes} = await getFacilities();
            setFacilities(facilityRes);
            // const {data : provinceRes} = await getProvinceDetails()
            // setAddress = 
            // facilityRes.map((item:ITouristResponse) =>{
            //     ...item,
            //     province: `${item.province?.name} + ${item.district?.name} + ${item.ward?.name}`
            // })
        
        } 
        catch (error) {
            console.log(error);
        }
        finally {
            hideLoading();
        } 
    }

    const requestCreateFacility = async (name:string) => {
        if (newFacility.value !== ""){
            try {
                const {data} = await createFacility(name);
                // router.push("./");
                facilities.push(data);
                notify("Create a facility successfully", "success");
                newFacility.value = "";
            }
            catch (error) {
                console.log(error);
                notify("Create a facility failed", "error");
            } 
        }else {
            notify("Name Facility Blank", "error");
        }
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
            <div className="flex gap-4">
                <EditText
                        icon={newFacility.icon}
                        label={newFacility.label}
                        value={newFacility.value}
                        handleChange={(e) => { 
                            setNewFacility({
                                ...newFacility,
                                value: e.target.value
                            }); 
                            console.log(e.target.value)
                        }}
                        errorText={newFacility.errorText} 
                />
                <Button 
                    text="Add Facility"
                    color={Color.WHITE}
                    bgColor={Color.GREEN} 
                    actionHandler={() => requestCreateFacility(newFacility.value)}
                />
            </div> 
            </Header>
            <Main>
                <div className="w-full h-full flex flex-col gap-3">
                    <section className="flex gap-10 h-10">
                        {/* <SearchInput
                            placeholder="Type branch ID here..."
                            value={searchValue}
                            handleChange={e => {
                                // const newSearchValue = e.target.value;
                                // setSearchValue(newSearchValue);
                                // const filterList = filterByFields(
                                //         toIndexSignature(facilities), 
                                //         newSearchValue.trim(), 
                                //         ["bracnhId", "address"]
                                //     );
                                // setFilterBranch(filterList);
                            }}
                        /> */}
                        {/* <ComboBox
                            label="Select role"
                            dataset={roles}
                            handleChange={e => {
                                setRoleId(Number.parseInt(e.target.value));
                            }}
                        />   */}
                    </section>
                    <Table
                    linkRoot="facilities/"
                    keyLink="facilityId"
                        columns={[
                            // {id: 1, text: "Id", key: "facilityId", linkRoot: "facilities/"},
                            {id: 2, text: "Name", key: "name"},
                        ]}
                        dataSet={facilities}
                    />
                </div>
            </Main>
        </section>
    )
}