import type { Mood } from './data';

// TMDB genre IDs (movies). Source: GET /genre/movie/list.
// 28 Action, 12 Adventure, 16 Animation, 35 Comedy, 80 Crime, 99 Documentary,
// 18 Drama, 10751 Family, 14 Fantasy, 36 History, 27 Horror, 10402 Music,
// 9648 Mystery, 10749 Romance, 878 Science Fiction, 10770 TV Movie,
// 53 Thriller, 10752 War, 37 Western.
export interface MoodFilter {
  // Genres ANDed via with_genres (comma-joined) — TMDB requires every listed
  // genre to be present. We pass them OR-joined (pipe) for breadth.
  withGenres: number[];
  // Genres to exclude.
  withoutGenres?: number[];
  // Minimum vote_average to keep low-quality noise out of the deck.
  voteAverageGte?: number;
  // Minimum vote_count — TMDB returns lots of obscure films otherwise.
  voteCountGte?: number;
  // Cap runtime (e.g. for chill/short picks).
  runtimeLte?: number;
}

export const MOOD_FILTERS: Record<Mood, MoodFilter> = {
  feelgood: {
    withGenres: [35, 10751, 10402], // Comedy, Family, Music
    withoutGenres: [27, 53],         // no Horror/Thriller
    voteAverageGte: 6.5,
    voteCountGte: 200,
  },
  intense: {
    withGenres: [53, 80, 18],        // Thriller, Crime, Drama
    voteAverageGte: 6.5,
    voteCountGte: 300,
  },
  scary: {
    withGenres: [27, 9648],          // Horror, Mystery
    voteAverageGte: 5.5,
    voteCountGte: 150,
  },
  romance: {
    withGenres: [10749],             // Romance
    voteAverageGte: 6.0,
    voteCountGte: 150,
  },
  weird: {
    withGenres: [14, 878, 16],       // Fantasy, Sci-Fi, Animation
    voteAverageGte: 6.5,
    voteCountGte: 200,
  },
  chill: {
    withGenres: [99, 10751, 16],     // Documentary, Family, Animation
    voteAverageGte: 6.5,
    voteCountGte: 100,
    runtimeLte: 110,
  },
};
