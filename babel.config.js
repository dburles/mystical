module.exports = {
  comments: false,
  plugins: ['@babel/transform-runtime'],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: process.env.BABEL_ESM ? false : 'commonjs',
        shippedProposals: true,
        loose: true,
      },
    ],
    '@babel/preset-react',
  ],
};
