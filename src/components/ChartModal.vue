<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { fetchDetail } from '../api/calendar.js'
import { formatNum } from '../utils/format.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  dataCode: { type: String, default: '' },
  pubTime: { type: [String, Number], default: '' },
  title: { type: String, default: '' }
})
const emit = defineEmits(['close'])

const canvasRef = ref(null)
const loading = ref(false)
const error = ref('')

watch(
  () => [props.visible, props.dataCode, props.pubTime],
  async ([visible]) => {
    if (!visible) return
    if (!props.dataCode || !props.pubTime) return
    loading.value = true
    error.value = ''
    await nextTick()
    await new Promise((r) => setTimeout(r, 20)) // 等 modal 布局完成，canvas 才有真实尺寸
    try {
      const res = await fetchDetail(props.dataCode, props.pubTime)
      if (res && res.history && res.history.length) {
        draw(canvasRef.value, res.history, props.title)
      } else {
        clearCanvas()
      }
    } catch (e) {
      console.error('[calendar] chart:', e)
      error.value = '图表加载失败'
      clearCanvas()
    } finally {
      loading.value = false
    }
  }
)

function clearCanvas() {
  const c = canvasRef.value
  if (!c) return
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, c.width, c.height)
}

/** 在 canvas 上绘制预测值/公布值双柱状图 */
function draw(canvas, history, title) {
  if (!canvas || !history || !history.length) return
  const items = history.slice().reverse()
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const W = canvas.clientWidth
  const H = canvas.clientHeight
  canvas.width = W * dpr
  canvas.height = H * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const pad = { top: 16, right: 16, bottom: 44, left: 60 }
  const cw = W - pad.left - pad.right
  const ch = H - pad.top - pad.bottom

  let maxVal = 0
  items.forEach((it) => {
    const v = Math.max(Number(it.actual) || 0, Number(it.consensus) || 0)
    if (v > maxVal) maxVal = v
  })
  ctx.clearRect(0, 0, W, H)
  if (maxVal === 0) {
    ctx.fillStyle = '#97a1b3'
    ctx.font = "14px 'PingFang SC','Microsoft YaHei',sans-serif"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('暂无历史数据', W / 2, H / 2)
    return
  }
  const step = ch / (maxVal * 1.25)
  const barW = Math.min((cw / items.length) * 0.7, 40)
  const gap = (cw - barW * items.length) / (items.length + 1)

  // 网格 + Y 轴刻度
  ctx.font = "11px 'JetBrains Mono',Consolas,monospace"
  ctx.fillStyle = '#8493a9'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  const ySteps = 5
  for (let i = 0; i <= ySteps; i++) {
    const v = ((maxVal * 1.25) / ySteps) * i
    const y = pad.top + ch - v * step
    ctx.fillText(formatNum(v), pad.left - 6, y)
    ctx.strokeStyle = '#e1e7f1'
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(W - pad.right, y)
    ctx.stroke()
  }

  // 柱体
  items.forEach((it, i) => {
    const x = pad.left + gap + i * (barW + gap)
    const aVal = Number(it.actual) || 0
    const cVal = Number(it.consensus) || 0
    const aH = aVal * step
    const cH = cVal * step
    const baseY = pad.top + ch

    if (cVal > 0) {
      ctx.fillStyle = '#2f6fd0'
      ctx.fillRect(x, baseY - cH, barW * 0.4, cH)
    }
    if (aVal > 0) {
      ctx.fillStyle = '#e57a3a'
      ctx.fillRect(x + barW * 0.5, baseY - aH, barW * 0.4, aH)
    }

    ctx.fillStyle = '#8493a9'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    const d = new Date(Number(it.public_time) * 1000)
    ctx.fillText(`${d.getMonth() + 1}/${d.getDate()}`, x + barW / 2, baseY + 6)
  })

  // 标题
  ctx.fillStyle = '#8493a9'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.font = "11px 'PingFang SC','Microsoft YaHei',sans-serif"
  ctx.fillText(title || '', W / 2, H - 14)
}

function onOverlayClick(e) {
  if (e.target === e.currentTarget) emit('close')
}

onUnmounted(clearCanvas)
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click="onOverlayClick">
    <div class="modal-box">
      <div class="modal-head">
        <h3>{{ title }}</h3>
        <button class="modal-close" @click="emit('close')">✕</button>
      </div>
      <div class="modal-legend">
        <span class="l"><span class="dot" style="background: #2f6fd0"></span>预测值</span>
        <span class="l"><span class="dot" style="background: #e57a3a"></span>公布值</span>
      </div>
      <div class="modal-body">
        <canvas ref="canvasRef"></canvas>
        <div v-if="loading" class="loading">加载中…</div>
        <div v-else-if="error" class="loading">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.modal-box {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  width: 640px;
  max-width: 92vw;
  height: 420px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
}

.modal-head {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line);
  gap: 10px;
}

.modal-head h3 {
  font-size: 14px;
  font-weight: 700;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-close {
  width: 28px;
  height: 28px;
  border: 1px solid var(--line2);
  border-radius: 7px;
  background: transparent;
  color: var(--dim);
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
  display: grid;
  place-items: center;
  flex: 0 0 28px;
}

.modal-close:hover {
  color: var(--blue-hi);
  border-color: var(--blue);
}

.modal-legend {
  display: flex;
  gap: 22px;
  padding: 0 18px 14px;
  font-size: 12px;
  color: var(--dim);
}

.modal-legend .l {
  display: flex;
  align-items: center;
  gap: 7px;
}

.modal-legend .l .dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
}

.modal-body {
  flex: 1;
  overflow: hidden;
  position: relative;
  padding: 16px 18px 10px;
}

.modal-body canvas {
  width: 100%;
  height: 100%;
}

.loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--faint);
  font-size: 13px;
}
</style>
