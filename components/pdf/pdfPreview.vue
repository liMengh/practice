<template>
  <div @click="previewClick">
        <canvas ref="pdfId" style="direction: ltr"></canvas>
  </div>
</template>
<script>
import pdfjsLib from "./pdf.js";
export default {
  props: {
    url: String,
    pdfScale: Number,
  },
  methods: {
    previewClick() {
      this.$emit("previewClick")
    },
    initShowPdf() {
      let that = this;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "../js/pdf/pdf.worker.js";
      let loadingTask = pdfjsLib.getDocument(this.url);
      loadingTask.promise.then(function (pdf) {
        pdf.getPage(1).then(function (page) {
          const { pdfScale } = that;
          let scale = pdfScale ? pdfScale : 0.15;
          let viewport = page.getViewport({ scale: scale });

          let canvas = that.$refs.pdfId;
          let context = canvas.getContext("2d");
          canvas.height = 100;
          canvas.width = 100;

          let renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page.render(renderContext);
        });
      });
    },
  },
  mounted() {
    this.initShowPdf();
  },
};
</script>
<style lang="scss">
</style>
