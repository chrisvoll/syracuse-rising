// <str>10,000,000 -> <int>10000000
function normalizeCost(cost) {
  if (!cost) return 0;
  if (typeof cost === 'number') return cost;
  return parseInt(cost.replace(/,/g, '') || 0, 10);
}

// 10,000,000 -> $10000000
function formatCost(cost) {
  if (!cost) return null;
  return '$' + commarizeCost(normalizeCost(cost));
}

// 10,000,000,000 -> $10b
// 10,000,000 -> $10m
// 10,100,000 -> $10m
// 1,000 -> $1k
// 1,100 -> $1k
// 100 -> $100
// 0 -> null
function shortenCost(cost) {
  if (!cost) return null;
  cost = normalizeCost(cost);
  if (cost >= 1000000000) {
    cost = (cost / 1000000000).toFixed(2) + 'b';
  } else if (cost >= 1000000) {
    cost = (cost / 1000000).toFixed(0) + 'm';
  } else if (cost >= 1000) {
    cost = (cost / 1000).toFixed(0) + 'k';
  }
  return (cost ? '$' : '') + cost;
}

// <int>1000000 -> <str>1,000,000
function commarizeCost(cost) {
  return cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function imageUrl(url) {
  return 'url(https://dl.dropboxusercontent.com/u/21879/syracuse/' + url + ')';
}

export default {
  normalizeCost,
  formatCost,
  shortenCost,
  commarizeCost,
  imageUrl
};
