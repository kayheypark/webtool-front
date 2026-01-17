require('dotenv').config({ path: '.env.staging' })

module.exports = {
  apps: [
    {
      name: 'webtools-front(staging)',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      port: 3000,
      env: {
        NODE_ENV: 'staging',
        ...process.env,
      },
    },
  ],
}
