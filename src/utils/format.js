// 时间与数值格式化工具

export const pad = (n) => String(n).padStart(2, '0')
export const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

/** Date -> 'YYYY-MM-DD' */
export function dstr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Date -> 数字 YYYYMMDD */
export function dateNum(d) {
  return Number(dstr(d).replace(/-/g, ''))
}

/** 给定日期，返回其前一天 23:59:59 的 Unix 秒时间戳（用于接口 public_time） */
export function yesterdayEndUnix(d) {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 0)
  t.setDate(t.getDate() - 1)
  return Math.floor(t.getTime() / 1000)
}

/** 把秒级时间戳格式化为 'HH:MM'，对中国的 00:00 视为待定 */
export function fmtTime(sec, country) {
  if (!sec) return '待定'
  const d = new Date(Number(sec) * 1000)
  const s = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  if (s === '00:00' && country === '中国') return '待定'
  return s
}

/** 判断秒级时间戳是否属于今天 */
export function isToday(sec) {
  const d = new Date(sec * 1000)
  return dateNum(d) === dateNum(new Date())
}

/** 把字符串转义，防止 XSS */
export function esc(s) {
  return String(s == null ? '' : s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  )
}

/** 判断一个值是否为「有效公布值」（非空、非"遍历中"） */
export function isValidValue(t) {
  return typeof t === 'string' && t.trim() !== '' && t.trim() !== '遍历中'
}

/** 计算公布值相对预期值的涨跌方向：'up' | 'down' | '' */
export function valueDirection(v, ref) {
  if (!isValidValue(v) || !isValidValue(ref)) return ''
  const a = parseFloat(String(v).replace(/,/g, ''))
  const b = parseFloat(String(ref).replace(/,/g, ''))
  if (isNaN(a) || isNaN(b)) return ''
  return a > b ? 'up' : a < b ? 'down' : ''
}

/** 把数值压缩为带单位的简短字符串（用于图表 Y 轴） */
export function formatNum(v) {
  if (v >= 10000) return (v / 10000).toFixed(1) + '万'
  if (v >= 1000) return (v / 1000).toFixed(1) + '千'
  if (v >= 1) return v.toFixed(1)
  return v.toFixed(2)
}
