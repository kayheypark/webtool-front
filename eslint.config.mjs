// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Prettier와 충돌하지 않도록 void elements의 self-closing 허용
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always', // <input />, <br />, <hr /> 등 void elements는 항상 self-closing 허용
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
})
