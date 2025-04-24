<script>
import { API_ENDPOINTS } from "@/constant/apiConstants";
import CheckboxGroup from "./CheckboxGroup.vue";
import ImageUpload from "./ImageUpload.vue";
export default {
    name: "NewPlace",
    components: { CheckboxGroup, ImageUpload },
    data() {
        return {
            newRoomId: null,
            thumbnail: [], // 1 file
            fileList: [],
            provinces: [],
            districts: [],
            wards: [],
            selectedProvince: "",
            selectedDistrict: "",
            selectedWard: "",
            specificLocation: "",
            form: {
                room_number: "",
                price_per_night: "",
                description: "",
                detail_location: "",
                num_beds: "",
                num_bathrooms: "",
                selectedFeatureIds: [],
            },
            featuresList: [],
            isUploading: false,
            isThumbnailUploaded: false,
            // Object error-message
            errors: {
                room_number: "",
                price_per_night: "",
                description: "",
                province: "",
                district: "",
                ward: "",
                specificLocation: "",
                images: "",
                thumbnail: "",
                features: "",
                num_bathrooms: "",
                num_beds: "",
            },
        };
    },
    async mounted() {
        await this.loadProvinces();
        await this.loadFeature();
    },
    watch: {
        selectedProvince(newProvince) {
            this.selectedDistrict = "";
            this.selectedWard = "";
            if (newProvince) {
                this.loadDistricts(newProvince);
            }
            this.updateDetailLocation();
        },
        selectedDistrict(newDistrict) {
            this.selectedWard = "";
            if (newDistrict) {
                this.loadWards(newDistrict);
            }
            this.updateDetailLocation();
        },
        selectedWard() {
            this.updateDetailLocation();
        },
        specificLocation() {
            this.updateDetailLocation();
        },
    },
    methods: {
        // Phương thức để cập nhật detail_location
        updateDetailLocation() {
            const provinceName =
                this.provinces.find((p) => p.province_id === this.selectedProvince)
                    ?.province_name || "";
            const districtName =
                this.districts.find((d) => d.district_id === this.selectedDistrict)
                    ?.district_name || "";
            const wardName =
                this.wards.find((w) => w.ward_id === this.selectedWard)?.ward_name ||
                "";
            this.form.detail_location = [
                this.specificLocation,
                wardName,
                districtName,
                provinceName,
            ]
                .filter(Boolean)
                .join(", ");
            // console.log("Detail Location:", this.form.detail_location);
        },

        // Cập nhật fileList từ ImageUpload
        updateFileList(newFileList) {
            this.fileList = newFileList;
        },
        // Xử lý khi file được chọn từ ImageUpload
        handleFileSelected(files) {
            console.log("Files selected:", files);
        },
        // Xử lý khi người dùng yêu cầu upload từ ImageUpload
        async handleUploadRequested(files) {
            if (files.length === 0) {
                this.$message.error("Vui lòng chọn ít nhất một ảnh!");
                return;
            }

            this.isUploading = true;
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("uploads", file);
            });

            const token = localStorage.getItem("token");
            if (!token) {
                this.errorMessage = "Không tìm thấy token xác thực.";
                return;
            }

            try {
                const response = await fetch(
                    `${API_ENDPOINTS.UPLOAD_IMAGES}${this.newRoomId}`,
                    {
                        method: "POST",
                        headers: {
                            Accept: "*/*",
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );
                if (!response.ok) {
                    throw new Error("Upload thất bại!");
                }

                const data = await response.json();
                this.$message.success("Upload thành công!");
                console.log("Upload response:", data);
                this.imageUrls = data.imageUrls || [];
            } catch (error) {
                this.$message.error("Upload thất bại!");
                console.error(error);
            } finally {
                this.isUploading = false;
            }
        },

        // Xử lý cho thumbnail
        updateThumbnail(newThumbnail) {
            this.thumbnail = []; // Xóa thumbnail cũ
            this.thumbnail = newThumbnail; // Thêm thumbnail mới
            this.isThumbnailUploaded = false; // Reset trạng thái upload khi thay đổi thumbnail
            console.log("Thumbnail updated:", this.thumbnail);
        },
        handleThumbnailSelected(file) {
            console.log("Thumbnail selected:", file);
        },
        async handleThumbnailUploadRequested(files) {
            if (files.length === 0) {
                this.errors.thumbnail = "Vui lòng chọn một thumbnail!";
                this.$message.error("Vui lòng chọn một thumbnail!");
                return;
            }

            this.isUploading = true;
            const formData = new FormData();
            formData.append("upload", files[0]); // API endpoint cho single file

            const token = localStorage.getItem("token");
            if (!token) {
                this.errors.thumbnail = "Không tìm thấy token xác thực.";
                this.$message.error("Không tìm thấy token xác thực.");
                return;
            }

            try {
                const response = await fetch(
                    `${API_ENDPOINTS.UPLOAD_THUMBNAIL}${this.newRoomId}`,
                    {
                        method: "POST",
                        headers: {
                            Accept: "*/*",
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    }
                );
                if (!response.ok) {
                    throw new Error("Upload thumbnail thất bại!");
                }

                const data = await response.json();
                this.$message.success("Upload thumbnail thành công!");
                console.log("Upload thumbnail response:", data);
                this.errors.thumbnail = "";
                this.isThumbnailUploaded = true;
            } catch (error) {
                this.errors.thumbnail = "Upload thumbnail thất bại!";
                this.$message.error("Upload thumbnail thất bại!");
                console.error(error);
            } finally {
                this.isUploading = false;
            }
        },

        async loadProvinces() {
            try {
                const response = await fetch(API_ENDPOINTS.REGION_PROVINCE, {
                    method: "GET",
                    headers: {
                        Accept: "*/*",
                    },
                });
                if (!response.ok) throw new Error("Lỗi khi gọi API");
                const result = await response.json();
                this.provinces = result.data;
            } catch (error) {
                console.error("Lỗi khi tải tỉnh/thành:", error);
            }
        },
        async loadDistricts(provinceId) {
            try {
                const response = await fetch(
                    API_ENDPOINTS.REGION_DISTRICT + `${provinceId}`,
                    {
                        method: "GET",
                        headers: { Accept: "*/*" },
                    }
                );
                if (!response.ok) throw new Error("Lỗi khi gọi API quận/huyện");
                const result = await response.json();
                this.districts = result.data;
            } catch (error) {
                console.error("Lỗi khi tải quận/huyện:", error);
            }
        },
        async loadWards(districtId) {
            try {
                const response = await fetch(
                    API_ENDPOINTS.REGION_WARD + `${districtId}`,
                    {
                        method: "GET",
                        headers: { Accept: "*/*" },
                    }
                );
                if (!response.ok) throw new Error("Lỗi khi gọi API phường/xã");
                const result = await response.json();
                this.wards = result.data;
            } catch (error) {
                console.error("Lỗi khi tải phường/xã:", error);
            }
        },

        async loadFeature() {
            try {
                const response = await fetch(API_ENDPOINTS.FEATURE_ALL, {
                    method: "GET",
                    headers: { accept: "*/*" },
                });
                if (!response.ok) throw new Error("Lỗi khi gọi API feature");
                const result = await response.json();
                this.featuresList = result.data;
                // console.log("List Feature: ", this.featuresList);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        },
        handleSelection(selectedIds) {
            this.form.selectedFeatureIds = selectedIds;
            // console.log("Selected Feature:", this.form.selectedFeatureIds);
        },

        validateForm() {
            let isValid = true;
            this.clearErrors();

            if (!this.form.room_number.trim()) {
                this.errors.room_number = "Please enter your property name";
                isValid = false;
            }

            if (!this.form.price_per_night || this.form.price_per_night <= 0) {
                this.errors.price_per_night = "Please enter a valid room price";
                isValid = false;
            }

            if (!this.form.description.trim()) {
                this.errors.description = "Please enter description";
                isValid = false;
            }

            if (!this.selectedProvince) {
                this.errors.province = "Please select province/city";
                isValid = false;
            }

            if (!this.selectedDistrict) {
                this.errors.district = "Please select district";
                isValid = false;
            }

            if (!this.selectedWard) {
                this.errors.ward = "Please select ward/commune";
                isValid = false;
            }

            if (!this.specificLocation.trim()) {
                this.errors.specificLocation = "Please enter specific address";
                isValid = false;
            }

            if (this.fileList.length === 0) {
                this.errors.images = "Please select at least one photo";
                isValid = false;
            }

            if (this.thumbnail.length === 0) {
                this.errors.thumbnail = "Please select a thumbnail";
                isValid = false;
            }

            if (this.form.selectedFeatureIds.length === 0) {
                this.errors.features = "Please select at least one feature";
                isValid = false;
            }

            if (
                !this.form.num_bathrooms.length === 0 ||
                this.form.num_bathrooms <= 0
            ) {
                this.errors.num_bathrooms = "Please enter a valid number of bathrooms";
                isValid = false;
            }

            if (!this.form.num_beds.length === 0 || this.form.num_beds <= 0) {
                this.errors.num_beds = "Please enter a valid number of bedrooms";
                isValid = false;
            }

            return isValid;
        },

        // Thêm method để xóa lỗi
        clearErrors() {
            Object.keys(this.errors).forEach((key) => {
                this.errors[key] = "";
            });
        },
        // create room
        async CreateRoom() {
            if (!this.validateForm()) {
                this.$message.error("Vui lòng điền đầy đủ các trường bắt buộc!");
                return;
            }
            try {
                const body = {
                    room: {
                        room_number: this.form.room_number,
                        price_per_night: parseInt(this.form.price_per_night),
                        description: this.form.description,
                        room_status_id: 1, // Assuming 1 is available status
                        location: this.form.detail_location,
                        num_bathrooms: this.form.num_bathrooms,
                        num_beds: this.form.num_beds,
                    },
                    featureIds: this.form.selectedFeatureIds,
                };

                const token = localStorage.getItem("token");
                if (!token) {
                    this.$message.error("Không tìm thấy token xác thực.");
                    return;
                }

                const response = await fetch(API_ENDPOINTS.R_CREATE, {
                    method: "POST",
                    headers: {
                        accept: "*/*",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to create room: ${errorText}`);
                }

                const result = await response.json();
                console.log("API create response:", result);

                const roomId = result.data;
                if (!roomId && roomId !== 0) {
                    throw new Error("Room ID not found in API response");
                }
                this.newRoomId = roomId;
                // console.log("Assigned newRoomId:", this.newRoomId);
                this.$message.success("Tạo chỗ nghỉ thành công!");

                // After successful creation, trigger image upload if there are files
                if (this.fileList.length > 0 && this.newRoomId) {
                    const filesToUpload = this.fileList.map((f) => f.originFileObj);
                    await this.handleUploadRequested(filesToUpload);
                }

                // Upload thumbnail
                if (this.thumbnail.length > 0 && this.newRoomId) {
                    const thumbnailToUpload = this.thumbnail.map((f) => f.originFileObj);
                    await this.handleThumbnailUploadRequested(thumbnailToUpload);
                }
            } catch (error) {
                this.$message.error("Tạo chỗ nghỉ thất bại!");
                console.error("Error submitting form:", error);
            }
        },
    },
};
</script>
<template>
    <div class="container">
        <div class="row">
            <h2 class="title_post d-flex justify-content-center p-3 mb-3 rounded">
                New place
            </h2>

            <div class="col-md-12">
                <div class="place_item">
                    <img src="@/assets/icons/title.png" alt="" />
                    <h5 class="mb-1">Title</h5>
                </div>
                <div class="input_item">
                    <input type="text" placeholder="InterContinental Hà Nội Hồ Tây" v-model="form.room_number"
                        :class="{ 'is-invalid': errors.room_number }" />
                    <div class="error-message" v-if="errors.room_number">
                        <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                        <span>{{ errors.room_number }}</span>
                    </div>
                </div>
            </div>

            <div class="row mt-4 m-0 p-0">
                <div class="col-md-4">
                    <div class="place_item">
                        <img src="@/assets/icons/location.png" alt="" />
                        <h5 class="mb-1">Province/City</h5>
                    </div>
                    <div class="input_item">
                        <select name="provinces" id="provinces" v-model="selectedProvince"
                            :class="{ 'is-invalid': errors.province }">
                            <option value="" selected>Select Province/City</option>
                            <option v-for="province in provinces" :key="province.province_id"
                                :value="province.province_id">
                                {{ province.province_name }}
                            </option>
                        </select>
                        <div class="error-message" v-if="errors.province">
                            <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                            <span>{{ errors.province }}</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="place_item">
                        <img src="@/assets/icons/location.png" alt="" />
                        <h5 class="mb-1">District</h5>
                    </div>
                    <div class="input_item">
                        <select name="districts" id="" v-model="selectedDistrict"
                            :class="{ 'is-invalid': errors.district }">
                            <option value="" selected>Select District</option>
                            <option v-for="district in districts" :key="district.district_id"
                                :value="district.district_id">
                                {{ district.district_name }}
                            </option>
                        </select>
                        <div class="error-message" v-if="errors.district">
                            <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                            <span>{{ errors.district }}</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="place_item">
                        <img src="@/assets/icons/location.png" alt="" />
                        <h5 class="mb-1">Ward/Commune</h5>
                    </div>
                    <div class="input_item">
                        <select name="wards" id="" v-model="selectedWard" :class="{ 'is-invalid': errors.ward }">
                            <option value="" selected>Select Ward/Commune</option>
                            <option v-for="ward in wards" :key="ward.ward_id" :value="ward.ward_id">
                                {{ ward.ward_name }}
                            </option>
                        </select>
                        <div class="error-message" v-if="errors.ward">
                            <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                            <span>{{ errors.ward }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6 mt-4">
                <div class="place_item">
                    <img src="@/assets/icons/location.png" alt="" />
                    <h5 class="mb-1">Specific address</h5>
                </div>
                <div class="input_item">
                    <input type="text" v-model="specificLocation" :class="{ 'is-invalid': errors.specificLocation }" />
                    <div class="error-message" v-if="errors.specificLocation">
                        <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                        <span>{{ errors.specificLocation }}</span>
                    </div>
                </div>
            </div>

            <div class="col-md-6 mt-4">
                <div class="place_item">
                    <img src="@/assets/icons/dollar.png" alt="" />
                    <h5 class="mb-1">Price</h5>
                </div>
                <div class="input_item">
                    <input type="number" v-model="form.price_per_night"
                        :class="{ 'is-invalid': errors.price_per_night }" />
                    <div class="error-message" v-if="errors.price_per_night">
                        <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                        <span>{{ errors.price_per_night }}</span>
                    </div>
                </div>
            </div>

            <div class="col-md-6 mt-4">
                <div class="place_item">
                    <img src="@/assets/icons/dollar.png" alt="" />
                    <h5 class="mb-1">Number of bedrooms</h5>
                </div>
                <div class="input_item">
                    <input type="number" v-model="form.num_beds" :class="{ 'is-invalid': errors.num_beds }" />
                    <div class="error-message" v-if="errors.num_beds">
                        <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                        <span>{{ errors.num_beds }}</span>
                    </div>
                </div>
            </div>

            <div class="col-md-6 mt-4">
                <div class="place_item">
                    <img src="@/assets/icons/dollar.png" alt="" />
                    <h5 class="mb-1">Number of bathrooms</h5>
                </div>
                <div class="input_item">
                    <input type="number" v-model="form.num_bathrooms" :class="{ 'is-invalid': errors.num_bathrooms }" />
                    <div class="error-message" v-if="errors.num_bathrooms">
                        <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                        <span>{{ errors.num_bathrooms }}</span>
                    </div>
                </div>
            </div>

            <div class="col-md-6 mt-4">
                <div class="place_item">
                    <img src="@/assets/icons/photo.png" alt="" />
                    <h5 class="mb-1">Image</h5>
                </div>
                <div class="input_item">
                    <ImageUpload :file-list="fileList" :multiple="true" @update:fileList="updateFileList"
                        @fileSelected="handleFileSelected" @uploadRequested="handleUploadRequested" />
                    <div class="error-message" v-if="errors.images">
                        <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                        <span>{{ errors.images }}</span>
                    </div>
                </div>
            </div>

            <div class="col-md-6 mt-4">
                <div class="place_item">
                    <img src="@/assets/icons/photo.png" alt="" />
                    <h5 class="mb-1">Thumbnail</h5>
                </div>
                <div class="input_item">
                    <ImageUpload :file-list="thumbnail" :multiple="false" :disable-upload="thumbnail.length > 0"
                        @update:fileList="updateThumbnail" @fileSelected="handleThumbnailSelected"
                        @uploadRequested="handleThumbnailUploadRequested" />
                    <div class="error-message" v-if="errors.thumbnail">
                        <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                        <span>{{ errors.thumbnail }}</span>
                    </div>
                </div>
            </div>

            <div class="col-md-12 mt-4">
                <div class="place_item">
                    <img src="@/assets/icons/utilities.png" style="align-self: start" alt="" />
                    <h5>Features</h5>
                </div>
                <CheckboxGroup :features="featuresList" @update:selectedFeatures="handleSelection" />
                <div class="error-message" v-if="errors.features">
                    <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                    <span>{{ errors.features }}</span>
                </div>
            </div>

            <div class="col-md-12 mt-4">
                <div class="place_item">
                    <img src="@/assets/icons/information.png" style="align-self: start" alt="" />
                    <h5 class="mb-1">Description</h5>
                </div>
                <div class="input_item">
                    <textarea v-model="form.description" class="w-100" name="" id=""
                        :class="{ 'is-invalid': errors.description }"></textarea>
                    <div class="error-message" v-if="errors.description">
                        <img src="@/assets/icons/warning.png" alt="Warning" class="warning-icon" />
                        <span>{{ errors.description }}</span>
                    </div>
                </div>
                <button class="btn btn_create text-brown w-100 rounded" @click="CreateRoom">
                    {{ isUploading ? "Creating..." : "Create a stay" }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.title_post {
    background-color: #bca89f;
    width: 100%;
}

.place_item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.place_item img {
    width: 25px;
    height: 25px;
}

.input_item input {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.input_item select {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.input_item textarea {
    width: 100%;
    height: 200px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.btn_create {
    color: #6a4a3a;
    border: 1px solid #6a4a3a;
}

.btn_create:hover {
    color: white;
    background-color: #6a4a3a;
    border-radius: 5px;
}

/* warning */
.is-invalid {
    border-color: #dc3545 !important;
}

.error-message {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    color: #dc3545;
}

.warning-icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
}
</style>
