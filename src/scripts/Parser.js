export default {
  name: 'Parser',
  parseArray: (arr) => {
    for (let entry of arr) {
      entry.id = parseInt(entry.id)
      entry.day = parseInt(entry.day)
      entry.starts = parseFloat(entry.starts)
      entry.duration = parseFloat(entry.duration)
      if (entry.mandatory) {
        entry.mandatory.replaceAll(' ','')
        entry.mandatory = entry.mandatory.split(',')
      }
    }
    return arr
  }
}
