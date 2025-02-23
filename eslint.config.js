// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu(
  {},
  {
    rules: {
      'vue/no-mutating-props': [
        'error',
        {
          shallowOnly: true,
        },
      ],
      'vue/multi-word-component-names': 0,
    },
  },
)
