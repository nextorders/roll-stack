import type { Notification, Task, User } from '@roll-stack/database'

type TaskWithPerformer = Task & {
  performer: User | null
}

export type NotificationWithEntities = Notification & {
  task: TaskWithPerformer | null
  author: User
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationWithEntities[]>([])

  const toastContext = useToast()

  async function update() {
    try {
      const data = await $fetch('/api/notification/my')
      if (!data) {
        return
      }

      notifications.value = data
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // No session
        }
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  async function markAsViewed(notificationId: string) {
    try {
      await $fetch(`/api/notification/id/${notificationId}/viewed`, {
        method: 'POST',
      })

      await update()
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // No session
        }
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  function _showCompletedTaskToast(notification: NotificationWithEntities) {
    toastContext.add({
      id: notification.id,
      title: notification.title,
      description: notification.description ?? '',
      avatar: {
        src: notification.task?.performer?.avatarUrl ?? undefined,
        alt: '',
      },
      color: 'info',
      duration: 60000,
      actions: [{
        icon: 'i-lucide-thumbs-up',
        label: 'Лайк',
        color: 'neutral',
        variant: 'outline',
        size: 'md',
        onClick: (e) => {
          e?.stopPropagation()
        },
      }, {
        icon: 'fluent-emoji-flat:party-popper',
        label: '0',
        color: 'info',
        variant: 'soft',
        size: 'md',
        ui: {
          label: 'font-semibold',
          leadingIcon: 'motion-preset-pulse motion-duration-1500',
        },
        disabled: true,
      }],
    })

    // change likes every 3 sec
    // setInterval(() => {
    //   toastContext.update(successToastId, {
    //     actions: [{
    //       icon: 'i-lucide-thumbs-up',
    //       label: 'Похвалить',
    //       color: 'neutral',
    //       variant: 'outline',
    //       size: 'md',
    //       onClick: (e) => {
    //         e?.stopPropagation()
    //       },
    //     }, {
    //       icon: 'fluent-emoji-flat:party-popper',
    //       label: toast.task.likes.toString(),
    //       color: 'info',
    //       variant: 'soft',
    //       size: 'md',
    //       ui: {
    //         label: 'font-semibold',
    //         leadingIcon: 'motion-preset-pulse motion-duration-1500',
    //       },
    //     }],
    //   })
    // }, 3000)
  }

  // watch(notifications, () => {
  //   for (const notification of notifications.value) {
  //     // already shown?
  //     if (toastContext.toasts.value.find((toast) => toast.id === notification.id)) {
  //       continue
  //     }

  //     if (notification.type === 'task_completed') {
  //       showCompletedTaskToast(notification)
  //     }
  //   }
  // })

  return {
    notifications,

    update,
    markAsViewed,
  }
})
