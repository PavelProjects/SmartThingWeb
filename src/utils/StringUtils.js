export function systemNameToNormal(value) {
  if (typeof value != 'string' || value.length == 0) {
    return ''
  }
  return value.split('').reduce((acc, ch) => {
    if (ch === '_') {
      acc += ' '
    } else if (ch === ch.toUpperCase()) {
      acc += ' ' + ch.toLowerCase()
    } else {
      acc += ch
    }
    return acc
  }, '')
}
