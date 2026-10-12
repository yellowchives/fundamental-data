// 同花顺宏观财经数据接口封装
const API = 'https://ftapi.10jqka.com.cn/futgwapi/api/news/calendar/v2/'
const HEADERS = { 'User-Agent': 'Mozilla/5.0', Referer: 'https://s.thsi.cn/' }

/**
 * 通用请求方法
 * @param {string} path 接口路径，如 'last_data'
 * @param {Object} params 查询参数
 * @returns {Promise<Array>} data 字段
 */
async function request(path, params) {
  const qs = Object.entries(params || {})
    .map(([k, v]) => `${k}=${encodeURIComponent(v == null ? '' : v)}`)
    .join('&')
  const res = await fetch(API + path + (qs ? '?' + qs : ''), { headers: HEADERS })
  const j = await res.json()
  if (j.code !== 0) throw new Error(j.msg || path)
  return j.data || []
}

/**
 * 拉取某天的数据列表（已发布 + 即将发布，去重并按时间倒序）
 */
export async function fetchList({ publicTime, plate, weight }) {
  const base = {
    last: 'last_data',
    after: 'after_data',
    plate: plate || '',
    weight: weight || '1,2,3',
    public_time: publicTime
  }
  const page = { page_size: 100 }
  const [last, after] = await Promise.all([
    request(base.last, { ...base, ...page }),
    request(base.after, { ...base, ...page })
  ])

  const seen = {}
  const merged = []
  ;[...(after || [])].reverse().concat(last || []).forEach((it) => {
    const key = `${it.data_code || ''}_${it.id || ''}_${it.public_time || ''}`
    if (seen[key]) return
    seen[key] = 1
    merged.push(it)
  })
  merged.sort((a, b) => Number(b.public_time || 0) - Number(a.public_time || 0))
  return merged
}

/** 拉取板块列表 */
export async function fetchPlates() {
  return request('data/plate', {})
}

/** 拉取某指标的历史走势明细 */
export async function fetchDetail(dataCode, publicTime) {
  return request('data/detail', { data_code: dataCode, public_time: publicTime })
}
