const randomString = (n: number, caseInsensitive: boolean) => {
  let x = '0123456789abcdefghijklmnopqrstuvwxyz',
    y = ''
  if (!caseInsensitive) {
    x += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }
  for (let i = 0; i < n; i++) {
    y += x[Math.floor(Math.random() * x.length)]
  }
  return y
}
export const uuid = (n = 25) => {
  // 当前时间戳（hex）+ (n-5) 位随机串
  let suffix = new Date().getTime().toString(16)
  if (suffix.length > 5) {
    suffix = suffix.substring(suffix.length - 5)
  } else if (suffix.length < 5) {
    suffix = new Array(6 - suffix.length).join('0') + suffix
  }
  return randomString(n - 5, true) + suffix
}
