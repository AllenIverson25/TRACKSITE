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

function loadDeletedWorkoutIds() {
  const saved = localStorage.getItem('deletedWorkoutIds');
  return saved ? JSON.parse(saved) : [];
}

function saveDeletedWorkoutIds(ids) {
  localStorage.setItem('deletedWorkoutIds', JSON.stringify(ids));
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
        editingWorkout: null,
        showAddWorkoutForm: false,
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
          const deletedIds = loadDeletedWorkoutIds();
          
          // Filter out deleted workouts
          const activeWorkouts = data.workouts.filter(w => !deletedIds.includes(w.id));
          const activeCustomWorkouts = this.customWorkouts.filter(w => !deletedIds.includes(w.id));
          
          this.workouts = [...activeWorkouts, ...activeCustomWorkouts];
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
          
          // Add to deleted IDs list
          const deletedIds = loadDeletedWorkoutIds();
          if (!deletedIds.includes(workoutId)) {
            deletedIds.push(workoutId);
            saveDeletedWorkoutIds(deletedIds);
          }
          
          alert('Workout deleted successfully!');
        }
      },
      addWorkout() {
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
          alert('Workout added successfully!');
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
