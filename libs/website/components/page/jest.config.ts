/* eslint-disable */
export default {
   displayName: 'website-components-page',
   preset: '../../../../jest.preset.js',
   transform: {
      '^.+\\.[tj]sx?$': [
         '@swc/jest',
         { jsc: { transform: { react: { runtime: 'automatic' } } } },
      ],
   },
   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
   coverageDirectory: '../../../../coverage/libs/website/components/page',
};
