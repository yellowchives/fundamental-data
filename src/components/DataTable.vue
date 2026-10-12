<script setup>
import { computed } from 'vue'
import { fmtTime, isToday, isValidValue, valueDirection } from '../utils/format.js'

const props = defineProps({
  list: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  failed: { type: Boolean, default: false },
  status: { type: String, default: '' }
})
const emit = defineEmits(['open-chart'])

const rows = computed(() => props.list)

function starChars(n) {
  n = Number(n) || 0
  return [0, 1, 2].map((i) => i < n)
}

function onRowClick(it) {
  if (!it.data_code || it.txt) return
  emit('open-chart', {
    code: it.data_code,
    pubTime: it.public_time,
    title: it.title || ''
  })
}
</script>

<template>
  <div class="panel">
    <div class="feed-head">
      <h2>宏观数据</h2>
      <span class="meta">{{ status }}</span>
    </div>

    <!-- 加载失败 -->
    <div v-if="failed" class="center-tip">
      <div class="big">⚠</div>
      数据加载失败，请检查网络
    </div>

    <!-- 无数据 -->
    <div v-else-if="!loading && !rows.length" class="center-tip">
      <div class="big">📅</div>
      当前日期暂无数据
    </div>

    <!-- 数据表 -->
    <div v-else class="scroll-wrap">
      <table class="tbl">
        <thead>
          <tr>
            <th></th>
            <th>国家</th>
            <th class="left">指标</th>
            <th>所属</th>
            <th>前值</th>
            <th>预期值</th>
            <th>公布值</th>
            <th>重要</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="it in rows"
            :key="(it.data_code || '') + '_' + (it.id || '') + '_' + (it.public_time || '')"
            :class="{ clickable: it.data_code && !it.txt }"
            @click="onRowClick(it)"
          >
            <td class="time" :class="{ soon: isToday(it.public_time) && !isValidValue(it.actual) && fmtTime(it.public_time, it.country) !== '待定' }">
              {{ fmtTime(it.public_time, it.country) }}
            </td>
            <td class="nm">{{ it.country || '' }}</td>
            <td class="ttl-wrap">
              <div class="ttl">{{ it.title || '' }}</div>
              <div class="sub">{{ it.frequency || '' }}</div>
            </td>
            <td class="cnt">{{ it.plate || '' }}</td>
            <td class="val mono" :class="valueDirection(it.previous, it.previous)">
              <template v-if="isValidValue(it.previous)">{{ it.previous }}</template>
              <template v-else>--</template>
            </td>
            <td class="val mono" :class="valueDirection(it.consensus, it.consensus)">
              <template v-if="isValidValue(it.consensus)">{{ it.consensus }}</template>
              <template v-else>--</template>
            </td>
            <td class="val mono" :class="valueDirection(it.actual, it.consensus)">
              <template v-if="isValidValue(it.actual)">{{ it.actual }}</template>
              <template v-else>--</template>
            </td>
            <td class="nm star">
              <template v-for="(on, i) in starChars(it.weightiness)" :key="i">
                <span v-if="on">★</span>
                <span v-else class="off">★</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}

.feed-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--line);
  background: var(--bg2);
}

.feed-head h2 {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.feed-head h2::before {
  content: '';
  width: 3px;
  height: 14px;
  background: var(--blue);
  border-radius: 2px;
}

.feed-head .meta {
  margin-left: auto;
  font-size: 11px;
  color: var(--faint);
  font-family: 'JetBrains Mono', Consolas, monospace;
}

.center-tip {
  padding: 46px 20px;
  text-align: center;
  color: var(--faint);
  font-size: 13px;
  letter-spacing: 1px;
}

.center-tip .big {
  font-size: 30px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.scroll-wrap {
  max-height: 74vh;
  overflow-y: auto;
}

.tbl {
  width: 100%;
  border-collapse: collapse;
}

.tbl thead th {
  font-size: 12px;
  color: var(--faint);
  font-weight: 600;
  letter-spacing: 1px;
  text-align: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line);
  background: var(--panel2);
  position: sticky;
  top: 0;
  z-index: 1;
}

.tbl thead th.left {
  text-align: left;
}

.tbl tbody td {
  padding: 12px 12px;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}

.tbl tbody tr {
  transition: background 0.12s;
}

.tbl tbody tr:hover {
  background: rgba(47, 111, 208, 0.035);
}

.tbl tbody tr.clickable {
  cursor: pointer;
}

.tbl .time {
  text-align: center;
  font: 600 11px 'JetBrains Mono', Consolas, monospace;
  color: var(--faint);
  white-space: nowrap;
}

.tbl .time.soon {
  color: var(--blue-hi);
}

.tbl .nm {
  text-align: center;
  color: var(--blue-hi);
  font: 600 12px 'JetBrains Mono', Consolas, monospace;
}

.tbl .val {
  text-align: center;
  font: 500 13px 'JetBrains Mono', Consolas, monospace;
  white-space: nowrap;
}

.tbl .val.up {
  color: var(--red);
}

.tbl .val.down {
  color: var(--green);
}

.tbl .cnt {
  text-align: center;
  color: var(--dim);
  font-size: 12px;
}

.tbl .ttl {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.tbl .sub {
  color: var(--faint);
  font-size: 10px;
  margin-top: 1px;
}

.star {
  color: var(--red);
  font-size: 11px;
  letter-spacing: 1px;
}

.star .off {
  color: var(--line2);
}

@media (max-width: 980px) {
  .tbl td,
  .tbl th {
    font-size: 12px !important;
    padding: 9px 6px !important;
  }
}
</style>
