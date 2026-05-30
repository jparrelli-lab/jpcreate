const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withSwiftFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      const swiftFix = `
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_VERSION'] = '5.0'
      config.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'
    end
  end`;

      if (!podfile.includes('SWIFT_STRICT_CONCURRENCY')) {
        podfile = podfile.replace(
          /(\s*end\s*end\s*)$/,
          `${swiftFix}\n  end\nend\n`
        );
        podfile = podfile.replace(
          /(react_native_post_install\([\s\S]*?\)\s*\n)/,
          `$1${swiftFix}\n`
        );
        fs.writeFileSync(podfilePath, podfile);
      }

      return config;
    },
  ]);
};

module.exports = withSwiftFix;
