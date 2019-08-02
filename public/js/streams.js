document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.game-card').forEach(card => {
    const game_id = card.id;
    const streamers = document.createElement('div');
    streamers.className = 'streamers';
    card.appendChild(streamers);
    fetch(`/api/streams/${game_id}`)
      .then(res => res.json())
      .then(json =>
        json.forEach(streamer => {
          const link = document.createElement('a');
          link.href = `https://www.twitch.tv/${streamer.user_name}`;
          link.target = '_blank';
          link.className = 'streamer';
          link.textContent = streamer.user_name;
          streamers.appendChild(link);
        })
      );
  });
});

document.querySelectorAll('.btn-delete').forEach(del =>
  del.addEventListener('click', e => {
    const gameCard = e.target.parentElement.parentElement;
    fetch(`/api/games/${gameCard.id}`, { method: 'DELETE' });
    gameCard.remove();
  })
);
