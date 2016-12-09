module.exports = function (w) {
    return {
        files: [
          { pattern: 'controllers/**/*.spec.ts', ignore: true },
            'controllers/**/*.ts',
            'data/**/*.ts',
            'test/**/*.ts',
            'config.ts',
        ],

        tests: [
            'controllers/**/*.spec.ts',
        ],

        env: {
            type: 'node'
        },

        // or any other supported testing framework:
        // https://wallabyjs.com/docs/integration/overview.html#supported-testing-frameworks
        testFramework: 'mocha',
      // debug: true
    };
};