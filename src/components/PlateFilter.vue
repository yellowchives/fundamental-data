<script setup>
const props = defineProps({
  plates: { type: Array, default: () => [] },
  // 已选板块名数组；空数组 = 全部
  selected: { type: Array, default: () => [] }
})
const emit = defineEmits(['select'])

function isAll() {
  return props.selected.length === 0
}

function toggleAll() {
  // 勾选"全部" = 清空其它选择
  emit('select', [])
}

function togglePlate(name) {
  const exists = props.selected.includes(name)
  const next = exists
    ? props.selected.filter((n) => n !== name)
    : [...props.selected, name]
  emit('select', next)
}
</script>

<template>
  <div class="plates">
    <label class="plate" :class="{ on: isAll() }">
      <input type="checkbox" :checked="isAll()" @change="toggleAll" />
      <span>全部</span>
    </label>

    <label
      v-for="p in plates"
      :key="p.name"
      class="plate"
      :class="{ on: selected.includes(p.name) }"
    >
      <input
        type="checkbox"
        :checked="selected.includes(p.name)"
        @change="togglePlate(p.name)"
      />
      <span>{{ p.name }}</span>
    </label>
  </div>
</template>

<style scoped>
.plates {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.plate {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid var(--line);
  background: var(--panel);
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 11px;
  color: var(--dim);
  cursor: pointer;
  user-select: none;
  transition: all 0.15s;
}

.plate:hover {
  border-color: var(--line2);
  color: var(--text);
}

.plate input {
  width: 12px;
  height: 12px;
  margin: 0;
  accent-color: var(--blue);
  cursor: pointer;
}

.plate.on {
  background: #eaf1fd;
  border-color: var(--blue);
  color: var(--blue-hi);
  font-weight: 600;
}
</style>
