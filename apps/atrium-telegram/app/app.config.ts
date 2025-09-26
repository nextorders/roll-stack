export default defineAppConfig({
  ui: {
    badge: {
      variants: {
        color: {
          neutral: '',
        },
      },
    },
    input: {
      slots: {
        base: '!ring-default placeholder:text-muted/50',
      },
    },
    inputMenu: {
      slots: {
        base: '!ring-default placeholder:text-muted/50',
      },
    },
    select: {
      slots: {
        base: '!ring-default placeholder:text-muted/50',
      },
    },
    selectMenu: {
      slots: {
        base: '!ring-default placeholder:text-muted/50',
      },
    },
    textarea: {
      slots: {
        base: '!ring-default placeholder:text-muted/50',
      },
    },
    button: {
      slots: {
        base: 'font-semibold font-headers',
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
        content: 'divide-y-0 !ring-default',
        header: 'pb-0 min-h-12',
        title: 'font-semibold',
      },
    },
    drawer: {
      slots: {
        header: 'text-xl/6 font-bold font-headers',
        body: 'mb-12 hide-scroll',
        content: '!max-h-10/12 ring-default/50 hide-scroll',
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
