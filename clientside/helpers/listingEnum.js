var types = {
  commercial: {
    'marker-color': '#9c89cc',
    'marker-symbol': 'shop',//
    label: 'Commercial'
  },
  residential: {
    'marker-color': '#f86767',
    'marker-symbol': 'town-hall',//
    label: 'Residential'
  },
  mixed: {
    'marker-color': '#1087BF',
    'marker-symbol': 'shop',
    label: 'Mixed-use'
  },
  infrastructure: {
    'marker-color': '#ffde00',
    'marker-symbol': 'car',
    label: 'Infrastructure'
  },
  academic: {
    'marker-color': '#89c200',
    'marker-symbol': 'college',
    label: 'Academic'
  },
  healthcare: {
    'marker-color': '#7ec9b1',
    'marker-symbol': 'hospital',
    label: 'Healthcare'
  }
};

var status = {
  'completed'            : 'Completed',
  'under-construction'   : 'Under Construction',
  'planned'              : 'Planned',
  'unclear'              : 'Unclear',
  'canceled'             : 'Canceled',
  'proposed'             : 'Proposed'
};

export default {
  types,
  status
};
