const path = require('path');

// Don't open the browser during development
process.env.BROWSER = 'none';

module.exports = {
  plugins: [
    {
      // eslint-disable-next-line global-require
      plugin: require('craco-antd'),
      options: {
        customizeThemeLessPath: path.join(__dirname, 'src/style/theme/antd.tyrTheme.less'),
        babelPluginImportOptions: {
          libraryName: 'antd',
        },
      },
    },
  ],
};
