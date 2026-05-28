const { overview } = require('./playerService');
const { stats: matchStats } = require('./matchService');

async function getOverview() {
  const playersOverview = await overview();
  const matchesOverview = await matchStats();

  return {
    ...playersOverview,
    ...matchesOverview,
  };
}

module.exports = { getOverview };
