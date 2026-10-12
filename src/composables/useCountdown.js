import { ref, onUnmounted } from 'vue'

/**
 * 自动刷新倒计时
 * @param {number} total 倒计时总秒数
 * @param {Function} onZero 倒计时归零时的回调（通常是触发刷新）
 */
export function useCountdown(total = 60, onZero) {
  const count = ref(total)
  let timer = null

  function paint() {
    // 占位：实际进度环由组件根据 count 计算
  }

  function start() {
    stop()
    count.value = total
    paint()
    timer = setInterval(() => {
      count.value--
      if (count.value <= 0) {
        restart()
        onZero && onZero()
      }
    }, 1000)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function restart() {
    count.value = total
    paint()
  }

  onUnmounted(stop)

  return { count, total, start, stop, restart }
}
