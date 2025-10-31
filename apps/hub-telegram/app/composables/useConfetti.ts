function _useConfetti() {
  const isShown = ref(false)

  function pop() {
    isShown.value = true
    setTimeout(() => {
      isShown.value = false
    }, 5000)
  }

  return { isShown, pop }
}

export const useConfetti = createSharedComposable(_useConfetti)
