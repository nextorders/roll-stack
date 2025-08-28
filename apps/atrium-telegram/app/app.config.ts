export default defineAppConfig({
  ui: {
    input: {
      slots: {
        base: '!ring-muted placeholder:text-muted/25',
      },
    },
    inputMenu: {
      slots: {
        base: '!ring-muted placeholder:text-muted/25',
      },
    },
    selectMenu: {
      slots: {
        base: '!ring-muted placeholder:text-muted/25',
      },
    },
    textarea: {
      slots: {
        base: '!ring-muted placeholder:text-muted/25',
      },
    },
    button: {
      slots: {
        base: 'font-semibold',
      },
      variants: {
        size: {
          xl: {
            base: 'px-4 py-3 font-semibold',
          },
        },
        color: {
          secondary: '!text-white disabled:!bg-inverted/25',
        },
      },
    },
    tabs: {
      variants: {
        variant: {
          pill: {
            trigger: 'data-[state=active]:!text-white',
          },
        },
      },
    },
    modal: {
      slots: {
        content: 'divide-y-0 !ring-muted/50',
        header: 'pb-0 min-h-12',
        title: 'font-semibold',
      },
    },
    navigationMenu: {
      slots: {
        link: 'text-sm',
      },
    },
    toast: {
      slots: {
        title: 'text-lg/6',
        description: 'leading-4',
        icon: 'shrink-0 size-7',
      },
    },
    card: {
      slots: {
        body: 'p-4 sm:p-4',
      },
    },
  },
})
