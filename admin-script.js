const { createApp } = Vue;

// Admin credentials (in production, this should be handled by a backend)
const ADMIN_USERNAME = 'Coach';
const ADMIN_PASSWORD = 'DistanceRuns21';

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

function isAdminLoggedIn() {
  return localStorage.getItem('adminLoggedIn') === 'true';
}

function setAdminLoggedIn(value) {
  if (value) {
    localStorage.setItem('adminLoggedIn', 'true');
  } else {
    localStorage.removeItem('adminLoggedIn');
  }
}

if (document.getElementById('app')) {
  const app = createApp({
    data() {
      return {
        isLoggedIn: isAdminLoggedIn(),
        loginForm: {
          username: '',
          password: ''
        },
        loginError: '',
        workouts: [],
        customWorkouts: [],
        editingWorkout: null
      };
    },
    methods: {
      login() {
        if (this.loginForm.username === ADMIN_USERNAME && this.loginForm.password === ADMIN_PASSWORD) {
          this.isLoggedIn = true;
          setAdminLoggedIn(true);
          this.loginError = '';
          this.loadWorkouts();
        } else {
          this.loginError = 'Invalid username or password';
          this.loginForm.password = '';
        }
      },
      logout() {
        this.isLoggedIn = false;
        setAdminLoggedIn(false);
        this.loginForm = { username: '', password: '' };
        this.workouts = [];
      },
      async loadWorkouts() {
        try {
          const data = await loadData();
          this.customWorkouts = loadCustomWorkouts();
          this.workouts = [...data.workouts, ...this.customWorkouts];
        } catch (err) {
          console.error("Data load failed", err);
        }
      },
      selectWorkoutToEdit(workout) {
        this.editingWorkout = { ...workout };
      },
      saveWorkout() {
        const index = this.workouts.findIndex(w => w.id === this.editingWorkout.id);
        if (index !== -1) {
          this.workouts[index] = { ...this.editingWorkout };
          
          // Update custom workouts if it's a custom workout
          if (this.editingWorkout.isCustom) {
            const customIndex = this.customWorkouts.findIndex(w => w.id === this.editingWorkout.id);
            if (customIndex !== -1) {
              this.customWorkouts[customIndex] = { ...this.editingWorkout };
            }
            saveCustomWorkouts(this.customWorkouts);
          }
          
          this.editingWorkout = null;
          alert('Workout updated successfully!');
        }
      },
      deleteWorkout(workoutId) {
        if (confirm('Are you sure you want to delete this workout?')) {
          this.workouts = this.workouts.filter(w => w.id !== workoutId);
          this.customWorkouts = this.customWorkouts.filter(w => w.id !== workoutId);
          saveCustomWorkouts(this.customWorkouts);
          alert('Workout deleted successfully!');
        }
      }
    },
    async mounted() {
      if (this.isLoggedIn) {
        await this.loadWorkouts();
      }
    }
  });

  app.mount('#app');
}
