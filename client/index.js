const app = new Vue({
  el: '#create-appointment-app',
  data: {
    title: null,
    doctor: null,
    patient: null,
    time: 0,
    record: false,
    isSubmitted: false,
    isError: false,
    errorMessage: '',
    meetingParticipants: [],
  },
  methods: {
    isFormSubmitted: function() {
      return this.isSubmitted;
    },
    isFormError: function() {
      return this.isError;
    },
    addParticipant: function() {
      var elem = document.createElement('div.fields');
      this.meetingParticipants.push({
        name: '',
        phoneNumber: '',
        role: '',
        textRecordingLink: false,
      });
    },
    removeParticipant: function(index) {
      this.meetingParticipants.splice(index, 1);
    },
    create: function() {
      this.$validator.validateAll().then(result => {
        console.log(result);
        if (result) {
          vm = this;
          const payload = {
            name: this.title,
            participants: this.meetingParticipants,
            recordSession: this.record,
          };
          console.log(payload);
          axios
            .post('/api/meetings/create-with-participants', payload)
            .then(function(response) {
              vm.isSubmitted = true;
              Vue.nextTick(function() {
                // DOM updated
              });
              console.log(vm.isSubmitted);
            })
            .catch(function(error) {
              vm.isError = true;
              vm.errorMessage = error.response.data.error.message;
              console.log(error.response.data.error.message);
            });
        }
      });
    },
    showAboutModal: function() {
      $('.ui.modal').modal('show');
    },
  },
  updated: function() {
    $('.ui.checkbox').checkbox();
  },
  mounted: function() {
    $('.ui.checkbox').checkbox();
    $('.ui.modal').modal('hide');
  },
});
