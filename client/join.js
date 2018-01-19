const app = new Vue({
  el: '#join-appointment-app',
  data: {
    hasRequestedOtp: false,
    accessCode: null,
    otp: '',
    isError: false,
    errorMsg: '',
  },
  methods: {
    isOtpRequested: function() {
      return this.hasRequestedOtp;
    },

    request: function() {
      this.hasRequestedOtp = true;
      const payload = {
        accessCode: this.accessCode,
      };

      axios
        .post('/api/Participants/request-otp', payload)
        .then(function(response) {
          this.hasRequestedOtp = true;
        })
        .catch(function(error) {
          this.hasRequestedOtp = true;
          console.log(error);
        });
    },
    validate: function() {
      const payload = {
        accessCode: this.accessCode,
        otp: this.otp,
      };

      var vm = this;

      axios
        .post('/api/Participants/validate-otp', payload)
        .then(function(response) {
          window.location.href = '/room/' + vm.accessCode;
        })
        .catch(function(error) {
          console.log(error);
          isError = true;
          errorMsg = error;
        });
    },
    showAboutModal: function() {
      $('.ui.modal').modal('show');
    },
  },
  mounted() {
    this.accessCode = window.location.href.substr(-5);
    $('.ui.modal').modal('hide');
  },
});
