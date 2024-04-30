function compareTime(timestring1,timestring2){
    let Date1 = new Date(timestring1)
    let Date2 = new Date(timestring2)
    return Date1.getTime() > Date2.getTime()
  
}

module.exports = {
    compareTime
}