const localhost = false
  ? "http://192.168.137.101:8092"
  : "https://api-mall-dev.aphoto.cn"
export default {
  // baseUrl: 'http://192.168.140.95:8092',
  // baseUrl: 'https://api-mall-dev.aphoto.cn',
  // baseUrl: 'http://192.168.140.226:8092',
  // baseUrl: 'https://mini.aphoto.cn',
  // baseUrl: 'httpd://192.168.142.48:8084',
  baseUrl:
    process.env.NODE_ENV === "development"
      ? localhost
      : "https://mini.aphoto.cn",
  extraHost:
    process.env.NODE_ENV === "development"
      ? "https://editapi-dev.aphoto.cn"
      : "https://editapi.aphoto.cn",
  shopadmin:
    process.env.NODE_ENV === "development"
      ? localhost
      : "https://shopadmin.aphoto.cn",
  // extraHost:process.env.NODE_ENV === 'development' ? 'http://192.168.142.80:8092' : 'https://api.aphoto.cn',
  contentType: "form",
  version:'0.1.0'
}
