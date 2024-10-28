<template>
  <div>
    <modal class="medium" @close="$parent.showPdf = false">
      <template slot="header"> 附件查看 </template>
      <template slot="body">
        <div id="pdfScale"></div>
      </template>
    </modal>
  </div>
</template>
<script>
import pdf from "./pdf.js";
import pdfWorker from "./pdf.worker.js";
import jquery from "./jquery-2.1.1.min.js";
import Pdfh5 from "./pdfh5.js";
export default {
  props: {
    url: String,
  },
  mounted() {
    var pdfh5 = new Pdfh5("#pdfScale", {
      pdfurl: this.url,
    });
  },
};
</script>
