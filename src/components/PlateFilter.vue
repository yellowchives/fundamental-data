<script setup>
const props = defineProps({
  plates: { type: Array, default: () => [] },
  selected: { type: String, default: '' }
})
const emit = defineEmits(['select'])

function onClick(name) {
  emit('select', name)
}
</script>

<template>
  <div class="plates">
    <span
      class="plate"
      :class="{ on: selected === '' }"
      @click="onClick('')"
    >全部</span>
    <span
      v-for="p in plates"
      :key="p.name"
      class="plate"
      :class="{ on: selected === p.name }"
      @click="onClick(p.name)"
    >{{ p.name }}</span>
  </div>
</template>

<style scoped>
.plates {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.plate {
  border: 1px solid var(--line);
  background: var(--panel);
  border-radius: 999px;
  padding: 3px 12px;
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

.plate.on {
  background: var(--blue);
  border-color: var(--blue);
  color: #fff;
  font-weight: 600;
}
</style>
