import { reqUpload } from "@/base/request/api";

export default class UploadFile {
    static async uploadPic(fileObj, module, result, uploadProgress) {
        this.upload(fileObj, reqUpload, result, module, uploadProgress)
    }

    static async upload(fileObj, reqUploadFile = () => { }, result = () => { }, module, uploadProgress = () => { }, fileName = "fileName") {
        if (!fileObj) throw "文件为空";
        // FormData 对象
        let form = new FormData();
        form.append(fileName, fileObj);
        let config = {
            timeout: 60000,
            onUploadProgress: progressEvent => {
                let complete =
                    ((progressEvent.loaded / progressEvent.total) * 100) | 0;
                uploadProgress(complete);
            }
        };
        const request = await reqUploadFile(form, config, module);
        result(request);
    }

    static download(data, name) {
        console.log(name);
        if (!data || data.size === 0) {
            //return this.$message.warning("网络请求失败");
        }
        let url = window.URL.createObjectURL(data);
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
}
