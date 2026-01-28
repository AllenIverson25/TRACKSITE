const { createApp } = Vue;

async function loadData() {
  const res = await fetch('./jason.json');
  return await res.json();
}

function loadCustomWorkouts() {
  const saved = localStorage.getItem('customWorkouts');
  return saved ? JSON.parse(saved) : [];
}

function saveCustomWorkouts(workouts) {
  localStorage.setItem('customWorkouts', JSON.stringify(workouts));
}

function isCoachLoggedIn() {
  return localStorage.getItem('adminLoggedIn') === 'true';
}

if (document.getElementById('app')) {
  const app = createApp({
    data() {
      return {
        schedule: {},
        workouts: [],
        customWorkouts: [],
        selectedWorkout: null,
        selectedDay: null,
        showAddWorkoutForm: false,
        isCoachLoggedIn: isCoachLoggedIn(),
        newWorkout: {
          title: '',
          type: '',
          effort: '',
          distance: '',
          duration: '',
          description: ''
        }
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
      },
      addWorkout() {
        if (!this.isCoachLoggedIn) {
          alert('You must be logged in as a coach to add workouts. Please go to the Admin page and log in.');
          return;
        }
        
        if (this.newWorkout.title && this.newWorkout.type && this.newWorkout.effort && this.newWorkout.distance && this.newWorkout.description) {
          const newId = Math.max(...this.workouts.map(w => w.id), 0) + 1;
          const workout = {
            id: newId,
            title: this.newWorkout.title,
            type: this.newWorkout.type,
            effort: this.newWorkout.effort,
            distance: this.newWorkout.distance,
            duration: this.newWorkout.duration || null,
            description: this.newWorkout.description,
            isCustom: true
          };
          
          this.workouts.push(workout);
          this.customWorkouts.push(workout);
          saveCustomWorkouts(this.customWorkouts);
          
          // Reset form
          this.newWorkout = {
            title: '',
            type: '',
            effort: '',
            distance: '',
            duration: '',
            description: ''
          };
          this.showAddWorkoutForm = false;
          
          // Show success message
          alert('Workout added successfully!');
        }
      }
    },
    async mounted() {
      try {
        const data = await loadData();
        this.schedule = data.schedule;
        this.workouts = data.workouts;
        
        // Load custom workouts from localStorage
        this.customWorkouts = loadCustomWorkouts();
        this.workouts = [...this.workouts, ...this.customWorkouts];
        
        // Check if coach is logged in
        this.isCoachLoggedIn = isCoachLoggedIn();

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