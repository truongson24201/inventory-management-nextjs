export function getCurrentDateFormatted() {
    const today = new Date();
  
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()+1).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
}

export function convertStringToDate(s:string) {
    parseInt(s.split("/")[2]), // Năm
    parseInt(s.split("/")[1]) - 1, // Tháng (lưu ý tháng bắt đầu từ 0)
    parseInt(s.split("/")[0]) // Ngày

  }