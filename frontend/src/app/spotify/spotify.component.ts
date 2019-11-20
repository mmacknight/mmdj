import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Song } from '@classes/song';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css']
})

export class SpotifyComponent implements OnInit {
  public token: string;
  public track_id: string;
  public device_id: string;
  public song: Song;


  @Input()
  set inp(input) {
     this.track_id = input['song_id'];
     this.song = input;
     console.log("track_id", this.track_id);
    
      if(this.track_id && this.device_id ){
        this.play(this.device_id, this.track_id);
    }
  }

  ngOnInit(){

  }


  constructor() {
    this.token ='BQCu5LbY5wTE2fwBBY_cSBKLR4BMTA5LO2rWlo_8hTElONPf4l0T2UAMF461AEM3IN8i5HfbN7et7VSNyEcChaI_tJsRR86lfpsbrdeBLviYitwhPSI91R_IfrG__wRUk9Bh9f1ZFWPiCm6bp1UWbOHlkfhFEdmV';

    window.onSpotifyWebPlaybackSDKReady = () => {

      const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(this.token); }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { 
        console.log(state)
        // if (this.song.duration && (state.duration >= this.song.duration)){
        //   this.callParent();
        // }
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        this.device_id = device_id;
        console.log('here', this.device_id);


        //player.connect();
        while (!this.track_id){

        }

        this.play(device_id, this.track_id);
        //this.play(device_id, '0jdny0dhgjUwoIp5GkqEaA');
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.connect();


    };

    // Play a specified track on the Web Playback SDK's device ID



  }

  play(device_id: any, current_track: string) {
    console.log('here');
    var spotify_uri:string = 'spotify:track:' + current_track;
    //var spotify_uri:string = 'spotify:track:0jdny0dhgjUwoIp5GkqEaA';
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: 'PUT',
         body: JSON.stringify({ uris: [spotify_uri] }),
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${this.token}`
         }
        });
  }

  @Output() myEvent = new EventEmitter<string>();
  callParent() {
    this.myEvent.emit('eventDesc');
  }

}
