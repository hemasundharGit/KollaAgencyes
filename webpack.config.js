module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  ignoreWarnings: [
    {
      module: /@mediapipe\/tasks-vision/,
    },
  ],
};