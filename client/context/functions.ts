export function cleanTime(date: string) {
    const newDate = new Date(date);
    const dateStr = newDate.toDateString().split(' ').slice(1, 3).join(' ')
    const time = newDate.toLocaleTimeString()
    return dateStr + ' ' + time;
  }

export function cleanName (name) {
    let split = name.split('-');
    if (split.length > 3){
      split = split.slice(2)
    }
    return split.join('-')
  }
