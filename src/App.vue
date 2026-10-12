<script setup>
import { ref, onMounted } from 'vue'
import TopBar from './components/TopBar.vue'
import ControlBar from './components/ControlBar.vue'
import DataTable from './components/DataTable.vue'
import ChartModal from './components/ChartModal.vue'
import { fetchList, fetchPlates } from './api/calendar.js'
import { yesterdayEndUnix } from './utils/format.js'
import { useCountdown } from './composables/useCountdown.js'

const REFRESH_INTERVAL = 60 // 自动刷新间隔（秒）

// 日期
const date = ref(new Date())

// 筛选状态
const onlyImportant = ref(false)
const plates = ref([])
const selectedPlates = ref([]) // 空数组 = 全部
const weightStr = '1,2,3'

// 未选任何板块时传所有板块名拼成的串（接口约定），而非空字符串
function plateParam() {
  return selectedPlates.value.length
    ? selectedPlates.value.join(',')
    : plates.value.map((p) => p.name).join(',')
}

// 列表数据
const list = ref([])
const loading = ref(false)
const failed = ref(false)
const status = ref('')

// 图表弹窗
const chartVisible = ref(false)
const chartCode = ref('')
const chartPubTime = ref('')
const chartTitle = ref('')

// 防止并发刷新：用序列号确保只渲染最新一次
let loadSeq = 0
let fetching = false
let queued = false

const { count, total, start: startCount, stop: stopCount } = useCountdown(REFRESH_INTERVAL, refresh)

async function refresh() {
  if (fetching) {
    queued = true
    return
  }
  fetching = true
  loading.value = true
  failed.value = false
  const seq = ++loadSeq
  try {
    let data = await fetchList({
      publicTime: yesterdayEndUnix(date.value),
      plate: plateParam(),
      weight: weightStr
    })
    if (onlyImportant.value) {
      data = data.filter((x) => Number(x.weightiness || 0) >= 2)
    }
    if (seq !== loadSeq) return // 已被后续请求覆盖
    list.value = data
    status.value = `${data.length} 条 · ${new Date().toLocaleTimeString('zh-CN', { hour12: false })}`
  } catch (e) {
    console.error('[calendar] refresh:', e)
    if (seq === loadSeq) {
      list.value = []
      failed.value = true
      status.value = '拉取失败，稍后重试'
    }
  } finally {
    if (seq === loadSeq) loading.value = false
    fetching = false
    if (queued) {
      queued = false
      refresh()
    }
  }
}

async function loadPlates() {
  try {
    plates.value = await fetchPlates()
  } catch (e) {
    console.error('[calendar] loadPlates:', e)
  }
}

function shift(days) {
  date.value = new Date(date.value.getTime() + days * 86400000)
  startCount()
  refresh()
}

function goToday() {
  date.value = new Date()
  startCount()
  refresh()
}

function toggleImportant() {
  onlyImportant.value = !onlyImportant.value
  startCount()
  refresh()
}

function selectPlates(names) {
  selectedPlates.value = names
  startCount()
  refresh()
}

function openChart({ code, pubTime, title }) {
  stopCount()
  chartCode.value = code
  chartPubTime.value = pubTime
  chartTitle.value = title
  chartVisible.value = true
}

function closeChart() {
  chartVisible.value = false
}

onMounted(async () => {
  await loadPlates()
  refresh()
  startCount()
})
</script>

<template>
  <TopBar :count="count" :total="total" @refresh="() => { startCount(); refresh() }" />
  <ControlBar
    :date="date"
    :only-important="onlyImportant"
    :plates="plates"
    :selected-plates="selectedPlates"
    @shift="shift"
    @today="goToday"
    @toggle-important="toggleImportant"
    @select-plates="selectPlates"
  />
  <div class="stage">
    <DataTable
      :list="list"
      :loading="loading"
      :failed="failed"
      :status="status"
      @open-chart="openChart"
    />
  </div>
  <footer>数据发布 · 数据来自同花顺公开接口 · 点击数据行查看历史走势</footer>

  <ChartModal
    :visible="chartVisible"
    :data-code="chartCode"
    :pub-time="chartPubTime"
    :title="chartTitle"
    @close="closeChart"
  />
</template>

<style scoped>
.stage {
  max-width: 1180px;
  margin: 16px auto 60px;
  padding: 0 28px;
}

footer {
  max-width: 1180px;
  margin: -30px auto 40px;
  padding: 0 28px;
  font-size: 11px;
  color: var(--faint);
  text-align: center;
  letter-spacing: 1px;
}

@media (max-width: 980px) {
  .stage,
  footer {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
