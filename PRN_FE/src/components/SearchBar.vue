<script>
export default {
  name: "SearchBar",
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    emitSearch() {
      this.$emit("search", this.searchQuery);
    },
  },
};
</script>

<template>
  <div class="search-bar">
    <input
      class="w-100"
      type="text"
      placeholder="Where do you want to go?"
      v-model="searchQuery"
      @keypress.enter="emitSearch"
    />
    <!-- <input type="date" placeholder="Nhận phòng" /> -->
    <!-- <input type="date" placeholder="Trả phòng" /> -->
    <!-- <select>
      <option value="1">1 người lớn</option>
      <option value="2">2 người lớn</option>
      ...
    </select> -->
    <!-- <button>Tìm</button> -->
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  background-color: #8b6c5c;
  padding: 5px;
  border: solid 1px #8b6c5c;
  border-radius: 5px;
}
.search-bar input,
.search-bar select,
.search-bar button {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}
.search-bar input,
.search-bar select {
  background-color: #f8f8f8;
  color: #333;
  font-family: sans-serif;
}

.search-bar button {
  background-color: #f8f8f8;
  color: #765341;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
.search-bar input:hover,
.search-bar select:hover {
  border-color: #6a4a3a;
}

.search-bar input:focus,
.search-bar select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
}

.search-bar button:hover {
  background-color: #6a4a3a;
  color: white;
}
.search-bar {
  display: flex;
  align-items: center;
}
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar input,
  .search-bar select,
  .search-bar button {
    margin: 5px 0;
  }
}
</style>
