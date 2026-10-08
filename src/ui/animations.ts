/**
 * 动效系统：统一的缓动曲线、时长和动画工具
 * 基于 Apple HIG 和 Emil Kowalski 的设计工程原则
 */

/** 强化版缓动曲线 - 比 CSS 默认值更有冲击力 */
export const EASING = {
  /** 强 ease-out：UI 交互的默认选择，响应迅速 */
  out: 'cubic-bezier(0.23, 1, 0.32, 1)',
  /** 强 ease-in-out：屏幕内移动/变形 */
  inOut: 'cubic-bezier(0.77, 0, 0.175, 1)',
  /** iOS 风格抽屉曲线 */
  drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
  /** 标准 ease：颜色/透明度变化 */
  standard: 'ease',
} as const;

/** 时长标准 - UI 动画保持在 300ms 以下 */
export const DURATION = {
  /** 按钮按压反馈 */
  press: 100,
  /** 小型弹出层（工具提示、小弹窗） */
  tooltip: 150,
  /** 下拉菜单、选择器 */
  dropdown: 200,
  /** 模态框、抽屉 */
  modal: 300,
  /** 页面级过渡 */
  page: 400,
} as const;

/** Spring 配置 - 用于需要物理感的交互 */
export const SPRING = {
  /** 默认：临界阻尼，无回弹，平滑 */
  default: { mass: 1, stiffness: 180, damping: 26 },
  /** 轻快：稍有回弹，用于手势驱动的交互 */
  snappy: { mass: 1, stiffness: 200, damping: 20 },
  /** 柔和：更慢更平滑 */
  gentle: { mass: 1, stiffness: 100, damping: 26 },
} as const;

/**
 * 从元素当前的渲染值启动动画（支持中断）
 * 读取 presentation value 避免从逻辑值启动造成跳变
 */
export function getCurrentTransform(el: HTMLElement): { x: number; y: number; scale: number } {
  const computed = getComputedStyle(el);
  const matrix = computed.transform;
  
  if (matrix === 'none') return { x: 0, y: 0, scale: 1 };
  
  const values = matrix.match(/matrix.*\((.+)\)/)?.[1].split(', ') || [];
  const a = parseFloat(values[0]) || 1;
  const b = parseFloat(values[1]) || 0;
  const tx = parseFloat(values[4]) || 0;
  const ty = parseFloat(values[5]) || 0;
  
  const scale = Math.sqrt(a * a + b * b);
  
  return { x: tx, y: ty, scale };
}

/**
 * 应用标准的进入动画
 * 从 scale(0.95) + opacity 0 到完全可见
 */
export function applyEnterAnimation(
  el: HTMLElement,
  duration = DURATION.modal,
  easing = EASING.out
): void {
  el.style.opacity = '0';
  el.style.transform = 'scale(0.95)';
  
  // 强制重排以确保起始状态生效
  el.offsetHeight;
  
  el.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
  el.style.opacity = '1';
  el.style.transform = 'scale(1)';
}

/**
 * 应用标准的退出动画
 * 返回 Promise 在动画完成时 resolve
 */
export function applyExitAnimation(
  el: HTMLElement,
  duration = DURATION.modal,
  easing = EASING.out
): Promise<void> {
  return new Promise((resolve) => {
    el.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
    el.style.opacity = '0';
    el.style.transform = 'scale(0.95)';
    
    setTimeout(resolve, duration);
  });
}

/**
 * 为弹窗/抽屉等设置 transform-origin
 * 使其从触发源位置缩放而非从中心
 */
export function setOriginFromTrigger(
  popover: HTMLElement,
  trigger: HTMLElement
): void {
  const triggerRect = trigger.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  
  const originX = ((triggerRect.left + triggerRect.width / 2 - popoverRect.left) / popoverRect.width) * 100;
  const originY = ((triggerRect.top + triggerRect.height / 2 - popoverRect.top) / popoverRect.height) * 100;
  
  popover.style.transformOrigin = `${originX}% ${originY}%`;
}

/**
 * 错开动画 - 为列表项添加渐进式进入效果
 * 每个元素延迟 50ms
 */
export function applyStagger(
  elements: HTMLElement[],
  baseDelay = 0,
  staggerDelay = 50
): void {
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    
    setTimeout(() => {
      el.style.transition = `opacity ${DURATION.dropdown}ms ${EASING.out}, transform ${DURATION.dropdown}ms ${EASING.out}`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, baseDelay + i * staggerDelay);
  });
}
