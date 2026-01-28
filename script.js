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
        selectedWorkout: null
      };
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