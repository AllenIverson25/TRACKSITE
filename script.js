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
        searchQuery: '',
        filterType: '',
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
      },
      filteredWorkouts() {
        let filtered = this.workouts;
        
        // Apply search filter
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          filtered = filtered.filter(w => 
            w.title.toLowerCase().includes(query) ||
            w.type.toLowerCase().includes(query) ||
            w.distance.toLowerCase().includes(query) ||
            w.description.toLowerCase().includes(query)
          );
        }
        
        // Apply type filter
        if (this.filterType) {
          filtered = filtered.filter(w => w.type === this.filterType);
        }
        
        return filtered;
      }
    },
    methods: {
      selectDay(day) {
        this.selectedDay = day;
      },
      selectWorkout(workout) {
        this.selectedWorkout = workout;
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      clearFilters() {
        this.searchQuery = '';
        this.filterType = '';
      },
      truncateText(text, length) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
      },
      getTypeBadge(type) {
        const badges = {
          'easy': 'bg-success',
          'tempo': 'bg-warning',
          'recovery': 'bg-info',
          'interval': 'bg-danger',
          'long': 'bg-primary',
          'custom': 'bg-secondary'
        };
        return badges[type] || 'bg-secondary';
      },
      getEffortBadge(effort) {
        const badges = {
          'easy': 'bg-success',
          'moderate': 'bg-info',
          'moderate-hard': 'bg-warning',
          'hard': 'bg-danger',
          'steady': 'bg-primary'
        };
        return badges[effort] || 'bg-secondary';
      },
      addToCalendar(day) {
        // Create a simple .ics calendar file for the selected day
        const dt = new Date();
        const uid = 'marlboroxc-' + (day.date ? day.date.replace(/\s+/g,'-') : Date.now());
        const dtstamp = dt.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
        const summary = (day.summary || (this.selectedDayWorkout ? this.selectedDayWorkout.title : 'Training'));
        const description = (this.selectedDayWorkout && this.selectedDayWorkout.description) ? this.selectedDayWorkout.description : (day.summary || '');
        const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Marlboro XC//EN\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${dtstamp}\nDTSTART:${dtstamp}\nSUMMARY:${summary}\nDESCRIPTION:${description}\nEND:VEVENT\nEND:VCALENDAR`;
        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'marlboroxc-event.ics'; document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
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
      },
      closeModal() {
        this.selectedDay = null;
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

        // Keyboard shortcut: Escape closes modals
        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            this.selectedDay = null;
            this.selectedWorkout = null;
            this.showAddWorkoutForm = false;
          }
        });
      } catch (err) {
        console.error("Data load failed", err);
      }
    }
  });

  app.mount('#app');
}