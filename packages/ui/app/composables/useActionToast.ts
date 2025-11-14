function _useActionToast() {
  const toast = useToast()
  const { t } = useI18n()

  function start() {
    const id = Math.random().toString(36).slice(2)

    toast.add({
      id,
      title: t('toast.in-process'),
      description: t('toast.updating-data'),
      icon: 'i-lucide-loader-circle',
      duration: 80000,
      ui: {
        icon: 'animate-spin',
      },
    })

    return id
  }

  function success(id: string, title: string, description?: string) {
    toast.update(id, {
      title,
      description: description || t('toast.success'),
      icon: 'i-lucide-check',
      color: 'success',
      duration: 3000,
      ui: {
        icon: '',
      },
    })
  }

  function error(id: string, description: string = t('error.default')) {
    toast.update(id, {
      title: t('error.title'),
      icon: 'i-lucide-x',
      color: 'error',
      description,
      duration: 5000,
      ui: {
        icon: '',
      },
    })
  }

  function close(id: string) {
    toast.remove(id)
  }

  return {
    start,
    success,
    error,
    close,
  }
}

export const useActionToast = createSharedComposable(_useActionToast)
