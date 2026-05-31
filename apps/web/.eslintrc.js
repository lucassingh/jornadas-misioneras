/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@jornadas/eslint-config', 'next/core-web-vitals'],
  parserOptions: {
    project: true,
  },
};
