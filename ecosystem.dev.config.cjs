require('dotenv').config({ path: '.env.dev' })

module.exports = {
  apps: [
    {
      name: 'webtools-front(dev)',
      exec_mode: 'cluster',
      instances: 2,
      script: './.output/server/index.mjs',
      port: 3000,
      env: {
        NODE_ENV: 'development',
        ...process.env,
      },
    },
  ],
}
