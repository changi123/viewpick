const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getRandomMovies(genreIds = [], retries = 3) {
  // 초기 페이지는 1
  let totalPages = 1;

  // 먼저 1페이지 조회해서 실제 total_pages 알아내기
  const genreQuery =
    genreIds.length > 0 ? `&with_genres=${genreIds.join(",")}` : "";

  const firstRes = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&page=1${genreQuery}`
  );
  const firstData = await firstRes.json();

  totalPages = firstData.total_pages > 500 ? 500 : firstData.total_pages; // TMDb API 제한 최대 500페이지

  for (let attempt = 0; attempt < retries; attempt++) {
    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&page=${randomPage}${genreQuery}`
    );
    const data = await res.json();

    const validMovies = data.results.filter(
      (movie) => movie.overview && movie.poster_path && movie.vote_average >= 7
    );

    if (validMovies.length > 0) {
      const shuffled = validMovies.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 10);
    }
  }

  // 모든 시도 실패 시 빈 배열 반환
  return [];
}
