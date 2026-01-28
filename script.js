const { createApp } = Vue;

async function loadData() {
  const res = await fetch('./jason.json');
  return await res.json();
}

if (document.getElementById('app')) {
  const app = createApp({
    data() {
      return {
        schedule: {},
        workouts: [],
        selectedWorkout: null,
        selectedDay: null
      };
    },
    computed: {
      selectedDayWorkout() {
        if (!this.selectedDay || !this.selectedDay.workoutId) return null;
        return this.workouts.find(w => w.id === this.selectedDay.workoutId);
      }
    },
    methods: {
      selectDay(day) {
        this.selectedDay = day;
      },
      getEffortBadge(effort) {
        const badges = {
          'easy': 'bg-success',
          'moderate': 'bg-warning',
          'moderate-hard': 'bg-warning',
          'hard': 'bg-danger',
          'steady': 'bg-info'
        };
        return badges[effort] || 'bg-secondary';
      }
    },
    async mounted() {
      try {
        const data = await loadData();
        this.schedule = data.schedule;
        this.workouts = data.workouts;

        // Check for workout ID in URL
        const urlParams = new URLSearchParams(window.location.search);
        const workoutId = urlParams.get('id');
        if (workoutId) {
          this.selectedWorkout = this.workouts.find(w => w.id == workoutId);
        }
      } catch (err) {
        console.error("Data load failed", err);
      }
    }
  });

  app.mount('#app');
}