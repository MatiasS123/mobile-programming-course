const data = require('../../data.json');

export default getArtistsNotAssociatedWithLabel = (labelName) => {
  const excludedLabels = [];


  for(let i = 0; i < labelName.length; i++) {
    excludedLabels.push((labelName[i].key).toLowerCase());
  }

    const artists = [];
  
    for (const artist of data.music_artists) {
      for (const song of artist.songs) {
        if (excludedLabels.includes(song.label.name.toLowerCase())) {
          break;
        }
        artists.push(artist.name);
        break;
      }
    }
  
    return artists;
}