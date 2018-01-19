class Participant {
  constructor(identity, name, role, phoneNumber) {
    this.identity = identity,
      this.name = name,
      this.role = role,
      this.phoneNumber = phoneNumber,
      this.sdk = { remoteParticipant: null, tracks: null },
      this.isSharingAudio = false,
      this.isSharingVideo = false
  }

  attachTrackToDom(id, track) {
    const container = document.getElementById(id).appendChild(track.attach());      
    const element = document.createElement('video');  
    
    container.appendChild(element)  
    track.attach(element);
  }

  reset(id) {
    const container = document.getElementById(id)
    while(container.hasChildNodes() ){
      container.removeChild(container.lastChild);
    }
    this.sdk.remoteParticipant = null;
    this.isSharingAudio = false;
    this.isSharingVideo = false;
  }

  getVideoTrack() {
    if(this.sdk.remoteParticipant.videoTracks){
      return this.sdk.remoteParticipant.videoTracks.values().next().value
    }
  }

}

class LocalParticipant extends Participant {
  constructor(identity, name, role, phoneNumber) {
    super(identity, name, role, phoneNumber)
    this.tracks = null;
  }

  stopAudio() {
    this.tracks.forEach(function (track) {
      if (track.kind === 'audio') {
        track.disable();
      }
    })
    this.isSharingAudio = false;
  };

  startAudio() {
    this.tracks.forEach(function (track) {
      if (track.kind === 'audio') {
        track.enable();
      }
    })
    this.isSharingAudio = true;
  };

  stopVideo() {
    this.tracks.forEach(function (track) {
      if (track.kind === 'video') {
        track.disable();
      }
    })
    this.isSharingVideo = false;
  };

  startVideo() {
    this.tracks.forEach(function (track) {
      if (track.kind === 'video') {
        track.enable();
      }
    })
    this.isSharingVideo = true;
  };

  addTracks(tracks) {
    this.tracks = tracks;

    for (const track of this.tracks) {

      if (track.kind === 'audio') {

        track.on('disabled', function (track) {
          console.log('[disabled] for track ' + track.id + ', ' + track.kind)
          this.isSharingAudio = false;
        });

        track.on('enabled', function (track) {
          console.log('[enabled] for track ' + track.id + ', ' + track.kind)
          this.isSharingAudio = true;
        });

      }

      if (track.kind === 'video') {
        /* preview video */
        this.attachTrackToDom('local-media-' + this.identity, track)

        track.on('disabled', function (track) {
          console.log('[disabled] for track ' + track.id + ', ' + track.kind)
          this.isSharingVideo = false;
        });

        track.on('enabled', function (track) {
          console.log('[enabled] for track ' + track.id + ', ' + track.kind)
          this.isSharingVideo = true;
        });

      }

    }

  }

  getVideoTrack() {
    for (const track of this.tracks) {
      if (track.kind === 'video') {
        return track;
      }
    }
  }
}
