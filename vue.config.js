module.exports = {
  //设置访问目录
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",

  //构建项目生成的目录
  outputDir: process.env.NODE_ENV === "production" ? "dist" : "devDist",

  //关闭语法自动编译检测
  lintOnSave: false,
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        additionalData: `@import "~@/styles/main.sass"`
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        additionalData: `@import "~@/styles/main.scss";`
      },
      // 给 less-loader 传递 Less.js 相关选项
      less: {
        // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
        // `primary` is global variables fields name
        globalVars: {
          primary: "#fff"
        }
      }
    }
  },
  devServer: {
    open:true,//运行项目后是否自动打开
    host:"0.0.0.0",//可以让其它人访问(局域网内)
    port:8080,
    proxy: {
      "/api": {
        target: "http://zx.cn",
        //target: "http://api.sherkxuan.ren",
        ws: false,//即时通讯
        changeOrigin: true,//是否开启跨域
        pathRewrite:{
          "^/api":''//查找api开头的字符替换成空字符串
        }
      }
    }
  }
};
