const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // 加载带编译器版本的Vue，默认false
  runtimeCompiler: false
});
