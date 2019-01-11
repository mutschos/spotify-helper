import {Request, Response, Router} from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

export class Songs {

  public static create(router: Router) {
    router.get('/songs/updateUnlistenedSongs', (req: Request, res: Response) => {
        new Songs().updateUnlistenedSongs(req, res);
      });
    router.get('/songs/fetchAlbumVersions', (req: Request, res: Response) => {
        new Songs().fetchAlbumVersionForSingles(req, res);
      });
  }

  private async updateUnlistenedSongs(req: Request, res: Response) {
    const spotifyApi = new SpotifyWebApi({accessToken: req.user.accessToken});
    try {
      const recentTracksResponse = await spotifyApi.getMyRecentlyPlayedTracks({limit: 50});
      const trackItems = recentTracksResponse.body.items;
      const recentTracksIds = this.getTrackIds(trackItems);
      // TODO pass the id via another way
      await spotifyApi.removeTracksFromPlaylist(process.env.UnlistenedSongsPlaylistId, recentTracksIds);

      const recentTrackNames = recentTracksResponse.body.items.map((i: { track: { name: any; }; }) => {
        return (i.track.name);
      });
      // tslint:disable-next-line:no-console
      console.log('Removed the following tracks', recentTrackNames);
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(error);
    }
    res.end();
  }

  private getTrackIds(trackItems: any) {
    return trackItems.map((i: {
      track: {
        uri: any;
      };
    }) => {
      return ({ uri: i.track.uri });
    });
  }

  private getTrackIdsAsString(trackItems: any) {
    return trackItems.map((i: {
      track: {
        uri: any;
      };
    }) => {
      return (i.track.uri);
    });
  }

  private async fetchAlbumVersionForSingles(req: Request, res: Response) {
    const spotifyApi = new SpotifyWebApi({accessToken: req.user.accessToken});
    const songs: any[] = await this.getSavedSongs(spotifyApi);
    const playlist = await this.createPlaylist(spotifyApi, req.user.id, 'Album Type: Singles');
    const singles = songs.filter(this.isSingle);
    const singleIds = this.getTrackIdsAsString(singles);
    this.addSongsToPlaylist(spotifyApi, playlist.id, singleIds);
    res.end();
  }

  private isSingle(trackItem: any, index: number, array: any[]): boolean {
    const albumType = trackItem.track.album.album_type;
    return albumType === 'single';
  }

  private async getSavedSongs(spotifyApi: any): Promise<any[]> {
    let songs: any[] = [];
    try {
      let numberOfSongsInResponse = 0;
      let offset = 0;
      do {
        const response = await spotifyApi.getMySavedTracks({ offset, limit: 50 });
        numberOfSongsInResponse = response.body.items.length;
        songs = songs.concat(response.body.items);
        offset = offset + 50;
      } while (numberOfSongsInResponse > 0);
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return songs;
  }

  private async createPlaylist(spotifyApi: any, userId: string, playlistName: string): Promise<any> {
    const response = await spotifyApi.createPlaylist(userId, playlistName, { public : false });
    return response.body;
  }

  private async addSongsToPlaylist(spotifyApi: any, playlistId: string, trackIds: string[]): Promise<any> {
    const numberOfTracksToAdd = trackIds.length;
    let numberOfAddedTracks = 0;
    while (numberOfAddedTracks < numberOfTracksToAdd) {
      const trackIdsToSend = trackIds.slice(numberOfAddedTracks, numberOfAddedTracks + 100);
      try {
        const response = await spotifyApi.addTracksToPlaylist(playlistId, trackIdsToSend, numberOfAddedTracks);
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(error);
      }
      numberOfAddedTracks = numberOfAddedTracks + 100;
    }
  }
}
