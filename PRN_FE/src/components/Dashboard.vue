<script>
import Chart from "chart.js/auto";

export default {
    name: "Dashboard",
    data() {
        return {
            form: {
                pending: 0,
                confirmed: 0,
                cancelled: 0,
            },
        };
    },
    async created() {
        await this.fetchData();
        this.renderCharts(); // Vẽ biểu đồ sau khi lấy dữ liệu
    },
    methods: {
        async fetchData() {
            const token = localStorage.getItem("token");

            console.log("Token:", token); // Debug token
            if (!token) {
                this.$message.error("Không tìm thấy token.");
                return;
            }
            try {
                const response = await fetch(
                    "https://localhost:7210/api/booking/get-bookingstatus", // Sửa endpoint
                    {
                        method: "GET",
                        headers: {
                            accept: "*/*",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Lỗi khi lấy dữ liệu booking: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                console.log("API response:", result); // Debug dữ liệu API

                if (result && result.data) {
                    this.form.pending = result.data.pending || 0;
                    this.form.confirmed = result.data.confirmed || 0;
                    this.form.cancelled = result.data.cancelled || 0;
                } else {
                    throw new Error("Dữ liệu trả về không đúng định dạng.");
                }
                console.log("Form data:", this.form); // Debug dữ liệu sau khi gán
            } catch (error) {
                console.error("Fetch data error:", error.message); // Debug lỗi chi tiết
                this.$message.error("Không thể lấy dữ liệu booking: " + error.message);
            }
        },
        renderCharts() {
            console.log("Rendering charts with data:", this.form); // Debug dữ liệu trước khi vẽ
            // Tạo biểu đồ tròn
            const pieCtx = this.$refs.pieChart.getContext("2d");
            new Chart(pieCtx, {
                type: "pie",
                data: {
                    labels: ["Pending", "Confirmed", "Cancelled"],
                    datasets: [
                        {
                            data: [this.form.pending, this.form.confirmed, this.form.cancelled],
                            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        title: {
                            display: true,
                            text: "Thống kê trạng thái Booking",
                        },
                    },
                },
            });

            // Tạo biểu đồ cột
            const barCtx = this.$refs.barChart.getContext("2d");
            new Chart(barCtx, {
                type: "bar",
                data: {
                    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
                    datasets: [
                        {
                            label: "Doanh thu",
                            data: [65, 59, 80, 81],
                            backgroundColor: "#36A2EB",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        title: {
                            display: true,
                            text: "Biểu đồ cột mẫu",
                        },
                    },
                },
            });
        },
    },
};
</script>

<template>
    <div>
        <h1>Dashboard Management</h1>
        <canvas ref="pieChart" class="chart" width="600" height="600"></canvas>
        <canvas ref="barChart" class="chart" width="600" height="400"></canvas>
    </div>
</template>

<style scoped>
.chart {
    max-width: 600px;
    margin: 20px auto;
}
</style>