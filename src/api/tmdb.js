const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getRandomMovies(genreIds = [], retries = 5) {
  const genreQuery =
    genreIds.length > 0 ? `&with_genres=${genreIds.join(",")}` : "";
  const releaseDateQuery = "&primary_release_date.gte=2012-01-01";

  // 1. 우선 totalPages를 가져옴
  const firstRes = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&page=1${genreQuery}${releaseDateQuery}`
  );
  const firstData = await firstRes.json();

  let totalPages = firstData.total_pages;
  if (!totalPages || totalPages === 0) return []; // 영화 없음

  totalPages = Math.min(totalPages, 400); // TMDb API 제한

  // 재시도 루프
  for (let attempt = 0; attempt < retries; attempt++) {
    const randomPage = Math.floor(Math.random() * totalPages) + 1;

    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&page=${randomPage}${genreQuery}${releaseDateQuery}`
    );
    const data = await res.json();

    if (!data.results) continue;

    const validMovies = data.results.filter(
      (movie) => movie.overview && movie.poster_path && movie.vote_average >= 7
    );

    if (validMovies.length > 0) {
      const shuffled = validMovies.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 10);
    }
  }

  // fallback: 첫 페이지에서라도 가져오기
  const fallbackMovies =
    firstData.results?.filter(
      (movie) => movie.overview && movie.poster_path && movie.vote_average >= 7
    ) || [];

  return fallbackMovies.slice(0, 10);
}
