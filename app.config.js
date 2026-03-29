const appJson = require('./app.json');

module.exports = () => {
  const base = appJson.expo || {};

  return {
    ...base,
    extra: {
      ...(base.extra || {}),
      eas: {
        ...((base.extra && base.extra.eas) || {}),
        projectId:
          process.env.EAS_PROJECT_ID ||
          (base.extra && base.extra.eas && base.extra.eas.projectId) ||
          'f5419105-eb79-4624-930a-9290a3b2a5c7',
      },
    },
  };
};
