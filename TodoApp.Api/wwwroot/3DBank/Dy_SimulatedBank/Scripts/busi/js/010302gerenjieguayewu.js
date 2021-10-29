var date = new Date();
var year = date.getFullYear();
var month = date.getMonth()+1;
var day = date.getDate();
var date1 = String(year)+String(month)+String(day);
console.log(date1);
$("#txt_gsrq").val(date1);