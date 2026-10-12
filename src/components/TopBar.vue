<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: { type: Number, required: true },
  total: { type: Number, required: true }
})
const emit = defineEmits(['refresh'])

const circumference = 2 * Math.PI * 15 // r=15
const offset = computed(() => circumference * (1 - props.count / props.total))
</script>

<template>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <span class="num">数据</span>
        <span class="txt">发布</span>
        <span class="live">LIVE</span>
      </div>
      <div class="cd-grid">
        <div class="cd">
          <div class="ring">
            <svg viewBox="0 0 34 34">
              <circle class="track" cx="17" cy="17" r="15" />
              <circle
                class="bar"
                cx="17"
                cy="17"
                r="15"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="offset"
              />
            </svg>
            <span class="n">{{ count }}</span>
          </div>
          <div class="lbl">
            <b>自动刷新</b>
            <span>到点拉取最新</span>
          </div>
        </div>
        <button class="btn" @click="emit('refresh')">立即刷新</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 14px 0 12px;
  background: rgba(243, 246, 251, 0.88);
  backdrop-filter: blur(9px);
  border-bottom: 1px solid var(--line);
}

.topbar-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 28px;
  display: flex;
  align-items: center;
  gap: 18px;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
  white-space: nowrap;
}

.brand .num {
  font: 800 30px / 1 'JetBrains Mono', Consolas, monospace;
  color: var(--blue);
  letter-spacing: -2px;
}

.brand .txt {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 3px;
}

.brand .live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--blue-hi);
}

.brand .live::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--blue-hi);
  box-shadow: 0 0 0 0 rgba(47, 111, 208, 0.5);
  animation: livepulse 2s infinite;
}

@keyframes livepulse {
  0% {
    box-shadow: 0 0 0 0 rgba(47, 111, 208, 0.55);
  }
  70% {
    box-shadow: 0 0 0 9px rgba(47, 111, 208, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(47, 111, 208, 0);
  }
}

.cd-grid {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.cd {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--dim);
  font-size: 12px;
}

.cd .ring {
  position: relative;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
}

.cd .ring svg {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
}

.cd .ring .track {
  fill: none;
  stroke: var(--line2);
  stroke-width: 3;
}

.cd .ring .bar {
  fill: none;
  stroke: var(--blue);
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
}

.cd .ring .n {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font: 600 12px 'JetBrains Mono', Consolas, monospace;
  color: var(--blue-hi);
}

.cd .lbl {
  line-height: 1.3;
}

.cd .lbl b {
  display: block;
  color: var(--text);
  font-size: 12px;
}

.cd .lbl span {
  color: var(--faint);
  font-size: 11px;
}

.btn {
  border: 1px solid var(--line2);
  background: transparent;
  color: var(--text);
  font-size: 12px;
  cursor: pointer;
  border-radius: 7px;
  padding: 6px 14px;
  transition: border-color 0.18s, color 0.18s, background 0.18s;
  font-family: inherit;
}

.btn:hover {
  border-color: var(--blue);
  color: var(--blue-hi);
}

@media (max-width: 980px) {
  .topbar-inner {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
