<script setup>
import { ref, defineEmits, defineProps } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { Upload, Button, message } from "ant-design-vue";

// Định nghĩa props để nhận disableUpload từ parent
const props = defineProps({
  fileList: Array, // Danh sách file từ parent
  multiple: Boolean, // Cho phép chọn nhiều file hay không
  disableUpload: Boolean, // Trạng thái vô hiệu hóa
});

const fileList = ref(props.fileList || []); // Khởi tạo fileList từ props
const emit = defineEmits(["update:fileList", "fileSelected"]);

const handleChange = (info) => {
  const newFile = info.file;
  if (!fileList.value.some((f) => f.name === newFile.name)) {
    fileList.value.push({
      name: newFile.name,
      url: URL.createObjectURL(newFile),
      originFileObj: newFile,
    });
  }

  emit("update:fileList", fileList.value);
  emit(
    "fileSelected",
    fileList.value.map((f) => f.originFileObj)
  );
};

const handleRemove = (file) => {
  fileList.value = fileList.value.filter((f) => f.name !== file.name);
  URL.revokeObjectURL(file.url); // Giải phóng bộ nhớ
  message.success("Ảnh đã được xóa!");

  // Cập nhật lại danh sách sau khi xóa
  emit("update:fileList", fileList.value);
  emit(
    "fileSelected",
    fileList.value.map((f) => f.originFileObj)
  );
};

const beforeUpload = () => {
  return false;
};
</script>

<template>
  <Upload
    v-model:file-list="fileList"
    list-type="picture"
    :multiple="multiple"
    :before-upload="beforeUpload"
    @change="handleChange"
    @remove="handleRemove"
  >
    <Button type="primary" :disabled="disableUpload">
      <UploadOutlined /> Select photo
    </Button>
  </Upload>
</template>
