<template>
  <div>
    <!--<input type="file" v-on:change="importf(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>-->
    <div @click="exportExcel">批量导出</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      excelData: [],
      sels: [{userName: '1001', realName: '张三'}]
    }
  },

  methods: {
    importf (obj) {
      let _this = this
      this.file = event.currentTarget.files[0]
      let rABS = false // 是否将文件读取为二进制字符串
      let file = this.file
      let XLSX
      let fixdata
      FileReader.prototype.readAsBinaryString = function (f) {
        let binary = ''
        let rABS = false // 是否将文件读取为二进制字符串
        // let pt = this
        let workbook // 读取完成的数据
        let reader = new FileReader()
        reader.onprogress = function (e) {
          let total = file.size
          _this.progress = (e.loaded / total) * 100
          console.log(_this.progress)
        }
        reader.onload = function (e) {
          try {
            var bytes = new Uint8Array(reader.result)
            var length = bytes.byteLength
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i])
            }
            if (rABS) {
              workbook = XLSX.read(btoa(fixdata(binary)), {
                // 手动转化
                type: 'base64'
              })
            } else {
              workbook = XLSX.read(binary, {
                type: 'binary'
              })
            }
            // excelData = [];
          } catch (e) {
            console.log('文件类型不正确')
            return
          }
          // let fromTo
          for (var sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              // fromTo = workbook.Sheets[sheet]['!ref']
              console.log(_this.excelData)
              _this.excelData = _this.excelData.concat(
                XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
              )
            }
          }
          console.log(_this.excelData)
        }
        reader.readAsArrayBuffer(f)
      }
      var reader = new FileReader()
      if (rABS) {
        reader.readAsArrayBuffer(file)
      } else {
        reader.readAsBinaryString(file)
      }
    },
    exportExcel () {
      // 兼容ie10哦！
      require.ensure([], () => {
        // const { export_json_to_excel } = require("../../vendor/Export2Excel"); //引入文    件
        const tHeader = ['用户名', '姓名'] // 将对应的属性名转换成中文
        // table表格中对应的属性名
        const filterVal = ['userName', 'realName']
        // this.sels就是你想要导出的数据[{userName: '1001', realName: '张三'}]
        const list = this.sels
        const data = this.formatJson(filterVal, list)
        this.Export2Excel.export_json_to_excel(tHeader, data, '列表excel')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
