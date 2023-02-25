const toYears = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US")
}

const jsDateFormat = (dateStr) => {
  var d = new Date(dateStr),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
    month = '0' + month;
  if (day.length < 2) 
    day = '0' + day;

  return [year, month, day].join('-');
}

export {toYears, jsDateFormat}