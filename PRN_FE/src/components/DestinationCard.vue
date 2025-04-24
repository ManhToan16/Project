<template>
  <div class="destination-card">
    <img :src="image" :alt="name" class="destination-image" />
    <div class="destination-content">
      <h2>{{ name }} {{ flag }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "DestinationCard",
  props: {
    name: String,
    image: String,
    flag: String,
  },
  methods: {
    handleClick() {
      this.$emit("click", this.name);
    },
  },
};
</script>

<style scoped>
.destination-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  max-width: 300px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.destination-card:hover {
  transform: translateY(-5px);
}

.destination-image {
  width: 300px;
  height: 200px;
  object-fit: cover;
}

.destination-content {
  padding: 15px;
  text-align: center;
}

.destination-content h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}
</style>