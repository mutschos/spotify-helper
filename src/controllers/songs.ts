import {Request, Response, Router} from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

export class Songs {

  public static create(router: Router) {
    router.get('/songs/updateUnlistenedSongs', (req: Request, res: Response) => {
        new Songs().updateUnlistenedSongs(req, res);
      });
  }

  private async updateUnlistenedSongs(req: Request, res: Response) {
    const spotifyApi = new SpotifyWebApi({accessToken: req.user.accessToken});
    try {
      const recentTracksResponse = await spotifyApi.getMyRecentlyPlayedTracks({limit: 50});
      const recentTracksIds = recentTracksResponse.body.items.map((i: { track: { uri: any; }; }) => {
        return ({ uri: i.track.uri });
      });
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
}
