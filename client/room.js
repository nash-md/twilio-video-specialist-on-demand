const data = {
  room: null,
  participants: [],
  localParticipant: new LocalParticipant(null, null, null, null, null),
  centerVideoTrack: null,
  fullScreen: false,
};

const addRemoteParticipant = function(remoteParticipant) {
  for (const participant of data.participants) {
    if (participant.identity === remoteParticipant.identity) {
      remoteParticipant.on('trackStarted', track => {
        console.log(
          '[trackStarted] received by ' +
            remoteParticipant.identity +
            ' track is type ' +
            track.kind
        );
        participant.attachTrackToDom(
          'remote-media-' + remoteParticipant.identity,
          track
        );
      });

      remoteParticipant.on('trackDisabled', track => {
        console.log(
          '[trackDisabled] received by ' +
            remoteParticipant.identity +
            ' track is type ' +
            track.kind
        );
        if (track.kind === 'audio') {
          participant.isSharingAudio = false;
        }

        if (track.kind === 'video') {
          participant.isSharingVideo = false;
        }
      });

      remoteParticipant.on('trackEnabled', track => {
        console.log(
          '[trackEnabled] received by ' +
            remoteParticipant.identity +
            ' track is type ' +
            track.kind
        );
        if (track.kind === 'audio') {
          participant.isSharingAudio = true;
        }

        if (track.kind === 'video') {
          participant.isSharingVideo = true;
        }
      });

      participant.sdk.remoteParticipant = remoteParticipant;
    }
  }
};

const removeRemoteParticipant = function(remoteParticipant) {
  for (const participant of data.participants) {
    if (participant.identity === remoteParticipant.identity) {
      participant.reset('remote-media-' + remoteParticipant.identity);
    }
  }
};

Vue.component('track-control', {
  data: function() {
    return data;
  },
  methods: {
    stopAudio: function() {
      this.$parent.localParticipant.stopAudio();
    },
    startAudio: function() {
      this.$parent.localParticipant.startAudio();
    },
    stopVideo: function() {
      this.$parent.localParticipant.stopVideo();
    },
    startVideo: function() {
      this.$parent.localParticipant.startVideo();
    },
    leaveRoom: function() {
      console.log('todo, implement');
    },
    fullScreenVideo: function() {
      var el = this.$parent.$refs.wrapper;
      console.log(el);
      if (!document.webkitFullscreenElement) {
        console.log('Not Full screen, maximizing');
        el.webkitRequestFullScreen();
        this.$parent.fullScreen = true;
      } else {
        console.log('Full Screen, minimizing!');
        document.webkitExitFullscreen();
        this.$parent.fullScreen = false;
      }

      console.log(this.fullScreen);
    },
  },
});

const app = new Vue({
  el: '#room-app',
  data: data,

  methods: {
    expand: function(participant) {
      console.log('expand video of participant: ' + participant.identity);

      if (this.centerVideoTrack) {
        this.centerVideoTrack
          .detach(document.getElementById('center-media').firstChild)
          .remove();
      }

      const element = document.createElement('video');

      const container = document.getElementById('center-media');
      container.appendChild(element);

      /* get new video track and attach */
      this.centerVideoTrack = participant.getVideoTrack();

      this.centerVideoTrack.attach(element);
    },
  },
  mounted() {
    this.accessCode = window.location.href.substr(-5);

    const vm = this;

    axios.post('/token/' + this.accessCode).then(function(response) {
      console.log('Received from /setup ::' + response);
      console.log(response.data.participantInfo);
      vm.localParticipant = new LocalParticipant(
        response.data.participantInfo.name,
        response.data.participantInfo.name,
        response.data.participantInfo.role,
        response.data.participantInfo.phoneNumber
      );

      console.log(
        'found ' +
          response.data.participantsList.length +
          ' remote participants'
      );

      for (const participantData of response.data.participantsList) {
        console.log(participantData);

        const participant = new Participant(
          participantData.name,
          participantData.name,
          participantData.role,
          participantData.phoneNumber
        );

        vm.participants.push(participant);
        console.log(
          '[DEBUG]: Will add folloing participant to the remote participant list' +
            JSON.stringify(participant)
        );
        console.log(
          '[DEBUG]: Current remoteparticpants list (vm.participants)' +
            JSON.stringify(vm.participants)
        );
      }

      Twilio.Video.createLocalTracks()
        .then(localTracks => {
          console.log('found ' + localTracks.length + ' local tracks');

          vm.localParticipant.addTracks(localTracks);

          return Twilio.Video.connect(response.data.token, {
            name: this.room,
            tracks: localTracks,
          });
        })
        .then(room => {
          vm.room = room;

          vm.localParticipant.isSharingAudio = true;
          vm.localParticipant.isSharingVideo = true;

          console.log('Successfully joined a Room: ', room);

          room.participants.forEach(function(remoteParticipant) {
            console.log(remoteParticipant.identity + ' already in the Room');
            addRemoteParticipant(remoteParticipant);
          });

          room.on('participantConnected', function(remoteParticipant) {
            console.log(remoteParticipant.identity + ' joined the Room');
            addRemoteParticipant(remoteParticipant);
          });

          room.on('participantDisconnected', function(remoteParticipant) {
            console.log(remoteParticipant.identity + ' left the Room');
            removeRemoteParticipant(remoteParticipant);
          });
        });
    });
  }
});

document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);

function exitHandler() {
  if (
    !document.fullscreenElement &&
    !document.webkitIsFullScreen &&
    !document.mozFullScreen &&
    !document.msFullscreenElement
  ) {
    document.webkitExitFullscreen();
    app.fullScreen = false;
  }
}
