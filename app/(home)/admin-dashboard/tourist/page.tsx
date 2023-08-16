'use client';
import { IBranchesTourist, ITouristResponse, createTourist, getTourists } from "@/api/tourist";
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
    const [tourists, setTourists] = useState<ITouristResponse[]>([]);
    const notify = useNotification();  
    
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [newTourist, setNewTourist] = useState({
        label: "Name", 
        value: "", 
        icon: "", 
        isRequired: true, 
        errorText: "" , 
        type: ""
    });

    useEffect(() => {
        fetchTourists();
    },[])


    async function fetchTourists() {
        try {
            showLoading();
            const {data : touristRes} = await getTourists();
            setTourists(touristRes);
            // const {data : provinceRes} = await getProvinceDetails()
            // setAddress = 
            // touristRes.map((item:ITouristResponse) =>{
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

    const requestCreateTourist = async (name:string) => {
        if (newTourist.value !== ""){
            try {
                const {data} = await createTourist(name);
                // router.push("./");
                tourists.push(data);
                notify("Create a tourist successfully", "success");
                newTourist.value = "";
            }
            catch (error) {
                console.log(error);
                notify("Create a tourist failed", "error");
            } 
        }else {
            notify("Name Tourist Blank", "error");
        }
    }

    return (
        <section className="w-full flex flex-col">
            <Header>
                <div className="flex gap-4">
                    <EditText
                        icon={newTourist.icon}
                        label={newTourist.label}
                        value={newTourist.value}
                        type={newTourist.type}
                        handleChange={(e) => { 
                            setNewTourist({
                                ...newTourist,
                                value: e.target.value
                            }); 
                            console.log(e.target.value)
                        }}
                        errorText={newTourist.errorText} 
                    />
                    <Button 
                        text="Add Tourist"
                        color={Color.WHITE}
                        bgColor={Color.GREEN} 
                        actionHandler={() => requestCreateTourist(newTourist.value)}
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
                                //         toIndexSignature(tourists), 
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
                        linkRoot="tourist/"
                        keyLink="touristId"
                        columns={[
                            // {id: 1, text: "Id", key: "touristId", linkRoot: "tourist/"},
                            {id: 2, text: "Name", key: "name"},
                        ]}
                        dataSet={tourists}
                    />
                </div>
            </Main>
        </section>
    )
}