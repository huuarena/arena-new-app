const AppBillings = [
  // {
  //   id: 1001,
  //   type: 'application_charge',
  //   name: 'Application Charge',
  //   plan: null,
  //   price: {
  //     BASIC: 9.99,
  //     PRO: 9.99,
  //     PLUS: 9.99,
  //   },
  //   credits: {
  //     BASIC: 200000,
  //     PRO: 250000,
  //     PLUS: 300000,
  //   },
  //   features: [],
  //   extra: [],
  // },
  {
    id: 2001,
    type: 'recurring_application_charge',
    name: 'Recurring Application Charge - BASIC',
    plan: 'BASIC',
    price: 0,
    credits: null,
    features: [
      {
        label: 'EXPORT / IMPORT FILES:',
        supported: true,
      },
      {
        label: '100 Products',
        supported: true,
      },
      {
        label: '20 Custom collections',
        supported: true,
      },
      {
        label: '20 Smart collections',
        supported: true,
      },
      {
        label: '20 Pages',
        supported: true,
      },
      {
        label: '20 Blog posts',
        supported: true,
      },
      {
        label: '20 Redirects',
        supported: true,
      },
      {
        label: '20 Shop metafields',
        supported: true,
      },
      {
        label: 'Files export',
        supported: false,
      },
      {
        label: 'Themes export',
        supported: false,
      },
      {
        label: 'Supports',
        supported: true,
      },
    ],
    extra: [],
  },
  {
    id: 2002,
    type: 'recurring_application_charge',
    name: 'Recurring Application Charge - PRO',
    plan: 'PRO',
    price: 59,
    credits: null,
    features: [
      {
        label: 'EXPORT / IMPORT FILES:',
        supported: true,
      },
      {
        label: 'Up to 5,000 Products',
        supported: true,
      },
      {
        label: 'Up to 500 Custom collections',
        supported: true,
      },
      {
        label: 'All Smart collections',
        supported: true,
      },
      {
        label: '1,000 Pages',
        supported: true,
      },
      {
        label: '1,000 Blog posts',
        supported: true,
      },
      {
        label: 'All Redirects',
        supported: true,
      },
      {
        label: 'All Shop metafields',
        supported: true,
      },
      {
        label: 'All Files export',
        supported: true,
      },
      {
        label: '100 Themes export',
        supported: true,
      },
      {
        label: 'Supports',
        supported: true,
      },
    ],
    extra: [],
  },
  // {
  //   id: 2003,
  //   type: 'recurring_application_charge',
  //   name: 'Recurring Application Charge - PLUS',
  //   plan: 'PLUS',
  //   price: 16.99,
  //   credits: null,
  //   features: [],
  //   extra: [],
  // },
]

export default AppBillings
