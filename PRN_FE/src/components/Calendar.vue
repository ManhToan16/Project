<template>
    <div class="calendar">
      <div class="header">
        <button @click="prevMonth" class="btn btn-outline-secondary">
          Previous
        </button>
        <h2>{{ currentMonth }} {{ currentYear }}</h2>
        <button @click="nextMonth" class="btn btn-outline-secondary">Next</button>
      </div>
  
      <div class="days">
        <div class="day-name" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
        <div
          v-for="(day, index) in days"
          :key="index"
          :class="[
            'day',
            {
              inactive:
                day.isInactive || isPastDay(day.date) || isBooked(day.date),
            },
            { today: day.isToday },
            {
              'start-date':
                showRange && day.date?.getTime() === startDate?.getTime(),
            },
            {
              'end-date': showRange && day.date?.getTime() === endDate?.getTime(),
            },
            { 'in-range': showRange && isInRange(day.date) },
            { booked: isBooked(day.date) },
          ]"
          @click="selectDate(day.date)"
        >
          {{ day.number }}
        </div>
      </div>
  
      <div class="date-range-info" v-if="showRange">
        <button class="reset-btn" @click="resetRange">Reset</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  import { ElMessage } from "element-plus";
  import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isToday,
    isSameMonth,
    isWithinInterval,
    isBefore,
    startOfDay,
    parse,
    differenceInDays,
  } from "date-fns";
  
  export default {
    name: "Calendar",
    props: {
      bookedRanges: {
        type: Array,
        default: () => [],
      },
    },
    emits: ["update-range"], // Thêm sự kiện emit
    setup(props, { emit }) {
      const currentDate = ref(new Date());
      const startDate = ref(null);
      const endDate = ref(null);
      const showRange = ref(false);
  
      const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  
      const currentMonth = computed(() => {
        return format(currentDate.value, "MMMM");
      });
  
      const currentYear = computed(() => {
        return format(currentDate.value, "yyyy");
      });
  
      const days = computed(() => {
        const monthStart = startOfMonth(currentDate.value);
        const monthEnd = endOfMonth(currentDate.value);
        const daysArray = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
        const firstDay = monthStart.getDay();
        const offset = firstDay === 0 ? 6 : firstDay - 1;
        const result = [];
  
        for (let i = 0; i < offset; i++) {
          result.push({ number: "", isInactive: true });
        }
  
        daysArray.forEach((date) => {
          result.push({
            number: format(date, "d"),
            date: date,
            isInactive: !isSameMonth(date, currentDate.value),
            isToday: isToday(date),
          });
        });
  
        return result;
      });
  
      const isInRange = (date) => {
        if (!startDate.value || !endDate.value || !date) return false;
        return isWithinInterval(date, {
          start: startDate.value,
          end: endDate.value,
        });
      };
  
      const isPastDay = (date) => {
        if (!date) return false;
        const today = startOfDay(new Date());
        return isBefore(date, today);
      };
  
      const isBooked = (date) => {
        if (!date) return false;
        return props.bookedRanges.some((range) =>
          isWithinInterval(date, { start: range.start, end: range.end })
        );
      };
  
      const isRangeInvalid = (start, end) => {
        const rangeDays = eachDayOfInterval({ start, end });
        return rangeDays.some((day) => isBooked(day));
      };
  
      const prevMonth = () => {
        currentDate.value = new Date(
          currentDate.value.getFullYear(),
          currentDate.value.getMonth() - 1,
          1
        );
      };
  
      const nextMonth = () => {
        currentDate.value = new Date(
          currentDate.value.getFullYear(),
          currentDate.value.getMonth() + 1,
          1
        );
      };
  
      const selectDate = (date) => {
        if (!date || isPastDay(date) || isBooked(date)) return;
  
        if (!startDate.value) {
          startDate.value = date;
          showRange.value = false;
        } else if (!endDate.value) {
          let tempEndDate;
          if (date < startDate.value) {
            tempEndDate = startDate.value;
            startDate.value = date;
          } else {
            tempEndDate = date;
          }
  
          if (isRangeInvalid(startDate.value, tempEndDate)) {
            ElMessage.error(
              "The time period is invalid because it contains a date that has already been set!"
            );
            startDate.value = null;
            return;
          }
  
          endDate.value = tempEndDate;
          showRange.value = true;
        } else {
          startDate.value = date;
          endDate.value = null;
          showRange.value = false;
        }
  
        const daysSelected = calculateDays(startDate.value, endDate.value);
  
        emit("update-range", {
          start: startDate.value,
          end: endDate.value,
          days: daysSelected,
        });
      };
  
      const calculateDays = (start, end) => {
        if (!start || !end) return 0; // Nếu chưa chọn đủ start hoặc end, trả về 0
        return differenceInDays(end, start) + 1; // +1 để bao gồm cả ngày bắt đầu
      };
  
      const resetRange = () => {
        startDate.value = null;
        endDate.value = null;
        showRange.value = false;
        // **Cập nhật giá trị lên cha**
        emit("update-range", { start: null, end: null, days: 0 });
      };
  
      return {
        currentMonth,
        currentYear,
        days,
        daysOfWeek,
        prevMonth,
        nextMonth,
        selectDate,
        startDate,
        endDate,
        showRange,
        isInRange,
        format,
        resetRange,
        isPastDay,
        isBooked,
      };
    },
  };
  </script>
  
  <style scoped>
  .calendar {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
  
  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }
  
  .day-name {
    text-align: center;
    padding: 10px;
    background: #f0f0f0;
    font-weight: bold;
  }
  
  .day {
    padding: 15px;
    text-align: center;
    cursor: pointer;
    background: #fff;
  }
  
  .day:hover:not(.inactive) {
    background: #f0f0f0;
  }
  
  .inactive {
    color: #ccc;
    cursor: default;
  }
  
  .today {
    background: #e3f2fd;
  }
  
  .start-date,
  .end-date {
    background: #2196f3;
    color: white;
    font-weight: bold;
  }
  
  .in-range {
    background: #bbdefb;
  }
  
  .booked {
    background: #ffcccc;
    color: #721c24;
    font-weight: bold;
  }
  
  .date-range-info {
    padding: 10px;
    text-align: center;
  }
  
  .date-range-info p {
    margin: 5px 0;
  }
  
  .date-range-info span {
    font-weight: bold;
    color: #2196f3;
  }
  
  .reset-btn {
    margin-top: 10px;
    padding: 5px 15px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .reset-btn:hover {
    background-color: #d32f2f;
  }
  </style>
  