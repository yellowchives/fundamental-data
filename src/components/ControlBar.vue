<script setup>
import { computed } from 'vue'
import PlateFilter from './PlateFilter.vue'
import { dstr, WEEKDAYS } from '../utils/format.js'

const props = defineProps({
  date: { type: Date, required: true },
  onlyImportant: { type: Boolean, default: false },
  plates: { type: Array, default: () => [] },
  selectedPlate: { type: String, default: '' }
})
const emit = defineEmits(['shift', 'today', 'toggle-important', 'select-plate'])

const dateText = computed(() => dstr(props.date))
const weekText = computed(() => WEEKDAYS[props.date.getDay()])
</script>

<template>
  <div class="ctl">
    <div class="fdate">
      <button title="前一天" @click="emit('shift', -1)">‹</button>
      <div class="d">
        <span>{{ dateText }}</span>
        <span class="wd">{{ weekText }}</span>
      </div>
      <button title="后一天" @click="emit('shift', 1)">›</button>
      <button class="today" @click="emit('today')">今天</button>
    </div>

    <button class="fbtn" :class="{ on: onlyImportant }" @click="emit('toggle-important')">
      仅看重要
    </button>

    <PlateFilter
      :plates="plates"
      :selected="selectedPlate"
      @select="emit('select-plate', $event)"
    />
  </div>
</template>

<style scoped>
.ctl {
  max-width: 1180px;
  margin: 16px auto 0;
  padding: 0 28px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.fdate {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 4px 6px;
}

.fdate button {
  width: 28px;
  height: 28px;
  border: 1px solid var(--line2);
  border-radius: 7px;
  background: transparent;
  color: var(--dim);
  font-size: 14px;
  cursor: pointer;
  line-height: 1;
}

.fdate button:hover {
  border-color: var(--blue);
  color: var(--blue-hi);
}

.fdate .d {
  min-width: 128px;
  text-align: center;
  font: 600 14px 'JetBrains Mono', Consolas, monospace;
  color: var(--blue-hi);
}

.fdate .wd {
  display: block;
  font: 500 10px 'PingFang SC', sans-serif;
  color: var(--faint);
  letter-spacing: 2px;
  margin-top: 1px;
}

.fdate .today {
  border-radius: 6px;
  font-size: 11px;
  padding: 0 10px;
  height: 28px;
  border: 1px solid var(--line2);
  background: transparent;
  color: var(--dim);
  cursor: pointer;
  font-family: inherit;
  width: auto;
}

.fdate .today:hover {
  color: var(--blue-hi);
  border-color: var(--blue);
}

.fbtn {
  border: 1px solid var(--line2);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 11px;
  background: var(--panel);
  color: var(--dim);
  cursor: pointer;
  font-family: inherit;
}

.fbtn:hover {
  color: var(--blue-hi);
  border-color: var(--blue);
}

.fbtn.on {
  background: var(--blue);
  color: #fff;
  border-color: var(--blue);
}

@media (max-width: 980px) {
  .ctl {
    padding-left: 16px;
    padding-right: 16px;
    gap: 10px;
  }
}
</style>
