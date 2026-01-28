const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      announcements: [],
      schedule: {},
      workouts: [],
      selectedWorkout: null
    };
  },
  async mounted() {
    try {
      const res = await fetch('./assets/data/data.json');
      const data = await res.json();
      this.announcements = data.announcements;
      this.schedule = data.schedule;
      this.workouts = data.workouts;
    } catch (err) {
      console.error("Data load failed", err);
    }
  }
});

app.mount('#app');