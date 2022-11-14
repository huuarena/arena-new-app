const AppBillings = [
  {
    id: 1001,
    type: 'application_charge',
    name: 'Application Charge',
    plan: null,
    price: {
      BASIC: 9.99,
      PRO: 9.99,
      PLUS: 9.99,
    },
    credits: {
      BASIC: 200000,
      PRO: 250000,
      PLUS: 300000,
    },
    features: [],
    extra: [],
  },
  {
    id: 2001,
    type: 'recurring_application_charge',
    name: 'Recurring Application Charge - BASIC',
    plan: 'BASIC',
    price: 0,
    credits: null,
    features: [
      {
        label: 'Feature 1',
        supported: true,
      },
      {
        label: 'Feature 2',
        supported: true,
      },
      {
        label: 'Feature 3',
        supported: true,
      },
      {
        label: 'Feature 4',
        supported: false,
      },
      {
        label: 'Feature 5',
        supported: false,
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
        label: 'Feature 1',
        supported: true,
      },
      {
        label: 'Feature 2',
        supported: true,
      },
      {
        label: 'Feature 3',
        supported: true,
      },
      {
        label: 'Feature 4',
        supported: true,
      },
      {
        label: 'Feature 5',
        supported: true,
      },
    ],
    extra: [],
  },
  {
    id: 2003,
    type: 'recurring_application_charge',
    name: 'Recurring Application Charge - PLUS',
    plan: 'PLUS',
    price: 16.99,
    credits: null,
    features: [],
    extra: [],
  },
]

export default AppBillings
