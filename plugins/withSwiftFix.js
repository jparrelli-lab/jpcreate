const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withSwiftFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (!podfile.includes('SWIFT_STRICT_CONCURRENCY')) {
        // Insert the Swift fix right before the closing `end` of the post_install block
        const marker = 'react_native_post_install(';
        const markerIdx = podfile.indexOf(marker);
        if (markerIdx !== -1) {
          // Find the `end` that closes the post_install do block (2nd `end` from end of file)
          const lastEnd = podfile.lastIndexOf('end');
          const secondLastEnd = podfile.lastIndexOf('end', lastEnd - 1);

          const swiftFix = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |bc|
        bc.build_settings['SWIFT_VERSION'] = '5.0'
        bc.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'
      end
    end

`;
          podfile = podfile.slice(0, secondLastEnd) + swiftFix + podfile.slice(secondLastEnd);
          fs.writeFileSync(podfilePath, podfile);
        }
      }

      return config;
    },
  ]);
};

module.exports = withSwiftFix;
