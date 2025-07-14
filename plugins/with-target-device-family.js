const { withXcodeProject } = require('@expo/config-plugins');

module.exports = function withTargetDeviceFamily(config) {
  return withXcodeProject(config, (config) => {
    const project = config.modResults;

    // Find the build configuration
    const targetName = config.ios.bundleIdentifier;

    for (const target in project.pbxNativeTargetSection()) {
      if (target.includes('TargetAttributes')) continue;

      const buildConfigs = project.pbxXCBuildConfigurationSection();
      for (const configName in buildConfigs) {
        const buildConfig = buildConfigs[configName];
        if (
          typeof buildConfig?.buildSettings === 'object' &&
          buildConfig?.buildSettings?.PRODUCT_NAME
        ) {
          buildConfig.buildSettings['TARGETED_DEVICE_FAMILY'] = '"1,2"';
        }
      }
    }

    return config;
  });
};
