<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="商品缩略图" name="goods_icon" extra="用于封面展示">
      <a-upload
        v-model:fileList="fileList"
        name="files"
        :multiple="true"
        list-type="picture-card"
        class="avatar-uploader-solo"
        :show-upload-list="false"
        :action="uploadUrl"
        :data="{ file_type: 'image' }"
        :before-upload="beforeUpload"
        @change="handleChangeImg($event, index, 0)"
      >
        <div v-if="form.goods_icon" class="uploadShowImg">
          <img :src="form.goods_icon" alt="avatar" />
          <div>更换</div>
        </div>
        <div v-else>
          <a-spin v-if="loading" />
          <plus-outlined v-else />
          <div class="ant-upload-text">上传</div>
        </div>
        <div
          v-if="form.goods_icon"
          style="font-size: 10px; color: red"
          @click.stop="form.goods_icon = ''"
        >
          删除
        </div>
      </a-upload>
    </a-form-item>
    <a-form-item
      label="商品相册"
      name="goods_photoList"
      extra="用于商品细节展示,最多十张"

    >
      <div class="clearfix">
        <a-upload
          name="files"
          :action="uploadUrl"
          list-type="picture-card"
          v-model:file-list="fileListImg"
          :data="{ file_type: 'image' }"
          :multiple="true"
          @preview="handlePreview"
          @change="changeImgList"
        >
          <div v-if="fileListImg.length < 10">
            <plus-outlined />
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <a-modal
          :visible="previewVisible"
          :footer="null"
          @cancel="handleCancel"
        >
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div>
    </a-form-item>
    <a-form-item label="商品详情" name="goods_details">
      <TEditor
        ref="editor"
        v-model:value="form.goods_details"
        @input="getContent"
        placeholder="建议使用图片详情"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import { message } from "ant-design-vue";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
function getBase64List(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  props: {
    fatherData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 19 },
      fileList: [], //上传图片列表
      fileListImg: [], //相册列表
      imageUrl: "", //成功图片的路径
      uploadUrl: this.$PathUrl + "/v1/upload", //上传路径
      previewVisible: false, //多图预览窗口状态
      previewImage: "", //预览图片的链接
      form: {
        goods_icon: "",
        goods_photoList: [], //列表
        goods_details: "", //商品详情
      },
      rules:{
        goods_icon: [
          { required: true, message: '请上传商品封面', trigger: 'blur' },
        ],
        goods_photoList: [
          { type:'array',required: true, message: '请上传商品细节展示图', trigger: 'blur' },
        ],
        goods_details: [
          { required: true, message: '请填写商品详情', trigger: 'blur' },
        ]
      },
    };
  },
  created() {
    this.init();
  },

  methods: {
    //表单验证
    async onSubmit() {
      return await this.$refs.ruleForm
        .validate()
        .then(() => {
          //alert('ok');
          this.$emit("formData", [this.form,this.fileListImg]);
          return true;
        })
        .catch((error) => {
          message.warning("请检查表单填写是否正确!");
          return false;
        });
    },
    //富文本传值
    getContent(value){
      this.form.goods_details = value
    },
    //初始方法
    init() {
      //处理表单初始值(父传子or子传父)
      if (this.fatherData.length != 0) {
        this.form = this.fatherData[0];
        this.fileListImg = this.fatherData[1];
      }
    },
    //父组件点击上一步
    onBack() {
      this.$emit("formData", [this.form,this.fileListImg]);
    },
    changeImgList(info) {
      if (info.file.status === "error") {
        message.error("上传文件出错");
      }
      if (info.file.status === "done") {
        if (info.file.response.code == 200) {
          this.form.goods_photoList.push(info.file.response.data.url);
        } else {
          message.error(info.file.response.data);
        }
      }
      if (info.file.status === "removed") {
        let ids = this.form.goods_photoList.indexOf(
          info.file.response.data.url
        );
        this.form.goods_photoList.splice(ids, 1);
      }
    },
    //点击文件链接或预览图标时的回调
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64List(file.originFileObj);
      }
      console.log(this.fileListImg);
      this.previewImage = file.response.data.url || file.thumbUrl;
      this.previewVisible = true;
    },
    //取消图片预览
    handleCancel() {
      this.previewVisible = false;
    },
    //删除图片
    delImg(index, type) {
      if (type) {
        this.formData[index].sku_img = "";
      } else {
        this.allData.sku_img = "";
      }
    },
    //选择图片事件
    handleChangeImg(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        if (info.file.response.code != 200) {
          this.loading = false;
          message.error(info.file.response.data);
          return;
        }
        this.form.goods_icon = info.file.response.data.url;
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
      if (info.file.status === "error") {
        this.loading = false;
        message.error("上传文件出错");
      }
    },
    //文件上传钩子
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("你只能上传JPG|JPEG|PNG格式的图片");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("图片大小不能超过2MB");
      }
      return isJpgOrPng && isLt2M;
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader-solo > .ant-upload {
  width: 128px;
  height: 128px;
}
.avatar-uploader-solo {
  .uploadShowImg {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 120px;
      height: 120px;
    }
    div {
      position: absolute;
      width: 120px;
      height: 128px;
      line-height: 120px;
      color: rgba(0, 0, 0, 0);
    }
    div:hover {
      background: rgba(0, 0, 0, 0.295);
      color: rgb(255, 0, 0);
    }
  }
}
</style>