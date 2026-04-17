const path = require("path")

module.exports = {
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs')
    }
    return config
  },
  turbopack: {
    resolveModules: [
      path.resolve(__dirname, 'node_modules')
    ]
  },
}