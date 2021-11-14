import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  proxy: {
    '/stream': {
      target: 'https://nls-gateway.cn-shanghai.aliyuncs.com/',
      changeOrigin: true
    }
  },
});
