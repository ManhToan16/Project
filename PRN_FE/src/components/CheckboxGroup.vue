<script>
export default {
    props: {
        features: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            selectedIds: [],
        };
    },
    watch: {
        selectedIds(newVal) {
            this.$emit("update:selectedFeatures", newVal);
        },
    },
};
</script>

<template>
    <ul class="group-checkbox">
        <li v-for="feature in features" :key="feature.feature_id">
            <input type="checkbox" :id="'feature_' + feature.feature_id" :value="feature.feature_id"
                v-model="selectedIds" />
            <label :for="'feature_' + feature.feature_id">{{
                feature.feature_name
            }}</label>
        </li>
    </ul>
</template>

<style scoped>
/* checkboxx */
.group-checkbox {
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.group-checkbox input {
    display: none;
}

.group-checkbox label {
    border: 3px solid #999;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    transition: border 0.5s;
}

.group-checkbox input:checked~label {
    border: 3px solid #4c3228;
}

.group-checkbox input:checked~label::after {
    content: "";
    border-color: #4c3228;
    width: 15px;
    height: 15px;
    position: absolute;
    inset: -5px -5px auto;
    border-radius: 50%;
    background-image: url(@/assets/icons/brown_check.png);
    background-color: white;
    background-size: 100%;
    background-repeat: no-repeat;
}
</style>
