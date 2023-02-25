const humanTime = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US")
}

const jsDateFormat = (dateStr) => {
  try {
    const date = new Date(dateStr)
    console.log(dateStr, date)
    return date && date.toISOString().split('T')[0]
  } catch(e){
    return dateStr
  }
}

export {humanTime, jsDateFormat}