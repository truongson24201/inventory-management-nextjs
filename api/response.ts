
export interface IReservationView {
    reservationId:number,
    customer:ICustomerView,
    reservationTimeFrame:IReservationTimeFrameView,
    date:string,
    adultsQuantity:number,
    childrenQuantity:number,
    note:string,
    createdDatetime:string,
    status:string,
    tableName:string,
    price:IPriceView
}

export interface ICustomerView {
    customerId:number,
    fullName:string,
    gender:boolean,
    dateOfBirth:string,
    address:number,
    phone:string,
    email:string,
}

export interface IReservationTimeFrameView {
    reservationTimeFrameId:number,
    reservationTimeFrameName:string,
    startTime:string,
    endTime:string,
    isActive:boolean,
}


export interface IPriceView {
    priceId:number,
    dayGroup:IDayGroup,
    adultPrice:number,
    childPrice:number,
    applicationDate:string,
}

export interface IDayGroup {
    dateGroupId:number,
    DayGroupName:string,
    isActive:boolean,
}

export interface IPriceMenuItemView {
    priceMenuItemId:number,
    price:number,
    applicationDate:string,
    menuItem:IMenuItemView
}

export interface IMenuItemView {
    menuItemId:number,
    menuItemName:string,
    menuItemCategory:IMenuItemCategoryView,
    description:string,
    imageUrl:string,
    isActive:boolean
}

export interface IMenuItemCategoryView {
    menuItemCategoryId:number,
    menuItemCategoryName:string,
}


export interface ITableHistoryView {
    tableHistoryId:number,
    buffetTable:IBuffetTableView,
    startDateTime:string,
    endDateTime:string,
    childrenQuantity:number,
    adultsQuantity:number,
    tableHistoryStatus:string,
    employee:IEmployeeView,
    price:IPriceView
    reservation:IReservationView,
}


export interface IEmployeeView {
    employeeId:number,
    fullName:string,
    gender:boolean,
    dateOfBirth:string,
    idCard:string,
    address:string,
    phone:string,
    email:string,
}

export interface IBuffetTableView {
    buffetTableId:number,
    buffetTableName:string,
    TableGroup:ITableGroupView,
}

export interface ITableGroupView {
    tableGroupId:number,
    tableGroupName:string,
    minPeopleQuantity:number,
    maxPeopleQuantity:number,
}

export interface IOrderView {
    tableHistory:ITableHistoryView,
    priceMenuItem:IPriceMenuItemView,
    menuItemQuantity:number,
    createDateTime:string,
}