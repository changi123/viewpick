import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function Detail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [cast, setCast] = useState([]);
  const [videoKey, setVideoKey] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showFullOverview, setShowFullOverview] = useState(false);

  const fetchMovieDetail = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ko-KR`
      );
      const data = await res.json();
      setMovie(data);
    } catch (err) {
      console.error("상세 정보 불러오기 실패:", err);
    }
  };

  const fetchWatchProviders = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`
      );
      const data = await res.json();
      const koreaData = data.results?.KR;
      if (koreaData?.flatrate) {
        setWatchProviders(koreaData.flatrate);
      }
    } catch (err) {
      console.error("OTT 정보 불러오기 실패:", err);
    }
  };

  const fetchCredits = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=ko-KR`
      );
      const data = await res.json();
      setCast(data.cast.slice(0, 5));
    } catch (err) {
      console.error("출연진 불러오기 실패:", err);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=ko-KR`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        setVideoKey(trailer.key);
      }
    } catch (err) {
      console.error("예고편 불러오기 실패:", err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}&language=ko-KR`
      );
      const data = await res.json();
      setRecommendations(data.results.slice(0, 6));
    } catch (err) {
      console.error("추천 영화 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchMovieDetail();
    fetchWatchProviders();
    fetchCredits();
    fetchVideos();
    fetchRecommendations();
  }, [id]);

  if (!movie) return <p className="loading">로딩 중...</p>;

  return (
    <>
      <style>{`
        /* 기본 폰트와 전체 레이아웃 */
        .detail-container {
          font-family: "Noto Sans KR", sans-serif;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 40px;
          padding-left: 12px;
          padding-right: 12px;
        }
        .loading {
          font-family: "Noto Sans KR", sans-serif;
          text-align: center;
          margin-top: 40px;
          font-size: 18px;
          color: #444;
        }
        /* 배경 이미지 영역 */
        .backdrop {
          height: 180px;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          overflow: hidden;
          position: relative;
          background-size: cover;
          background-position: center;
        }
        .backdrop-overlay {
          background: rgba(0,0,0,0.6);
          height: 100%;
          color: white;
          padding: 12px;
          display: flex;
          align-items: flex-end;
          box-sizing: border-box;
        }
        .backdrop-title {
          font-size: 20px;
          margin: 0;
          line-height: 1.2;
          overflow-wrap: break-word;
          word-break: break-word;
        }

        /* 기본 정보 */
        .movie-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 12px;
          margin-bottom: 24px;
        }
        .movie-poster {
          border-radius: 12px;
          width: 100%;
          max-width: 320px;
          align-self: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .movie-details {
          font-size: 14px;
          line-height: 1.4;
        }
        .movie-tagline {
          font-size: 16px;
          margin: 8px 0;
          font-weight: 600;
          color: #555;
        }
        .movie-details p {
          margin: 4px 0;
        }

        /* OTT 플랫폼 */
        .watch-providers {
          margin-top: 24px;
          text-align: center;
        }
        .watch-providers h3 {
          font-size: 18px;
        }
        .providers-list {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 12px;
        }
        .provider-logo {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #eee;
          padding: 3px;
          object-fit: contain;
        }

        /* 예고편 */
        .trailer {
          margin-top: 24px;
        }
        .trailer h3 {
          font-size: 18px;
          margin-bottom: 12px;
        }
        .trailer-wrapper {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 */
          height: 0;
          overflow: hidden;
          border-radius: 12px;
        }
        .trailer-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        /* 줄거리 */
        .overview {
          margin-top: 24px;
        }
        .overview h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        .overview-text {
          max-height: 100px;
          overflow: hidden;
          position: relative;
          font-size: 14px;
          line-height: 1.5;
          transition: max-height 0.3s ease;
        }
        .overview-text.full {
          max-height: 1000px;
        }
        .overview-toggle-btn {
          background: none;
          border: none;
          color: #e50914;
          cursor: pointer;
          text-decoration: underline;
          font-size: 14px;
          padding: 0;
          margin-top: 6px;
        }

        /* 출연진 */
        .cast-section {
          margin-top: 24px;
        }
        .cast-section h3 {
          font-size: 18px;
          margin-bottom: 12px;
        }
        .cast-list {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .cast-item {
          min-width: 90px;
          flex-shrink: 0;
          text-align: center;
        }
        .cast-img {
          width: 90px;
          height: 135px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .cast-name {
          font-size: 13px;
          margin: 6px 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cast-character {
          color: #888;
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* 추천 영화 */
        .recommendations {
          margin-top: 32px;
        }
        .recommendations h3 {
          font-size: 18px;
          margin-bottom: 12px;
        }
        .recommendations-list {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .recommendation-item {
          min-width: 100px;
          flex-shrink: 0;
        }
        .recommendation-poster {
          width: 100%;
          border-radius: 8px;
          margin-bottom: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .recommendation-title {
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }

        /* 제작사 */
        .production-companies {
          margin-top: 24px;
          text-align: center;
        }
        .production-companies h3 {
          font-size: 
18px;
margin-bottom: 12px;
}
.company-logos {
display: flex;
gap: 12px;
flex-wrap: wrap;
justify-content: center;
}
.company-logo {
height: 40px;
max-width: 100px;
object-fit: contain;
filter: grayscale(100%);
transition: filter 0.3s ease;
border-radius: 6px;
}
.company-logo:hover {
filter: grayscale(0%);
}
    /* 반응형: 모바일 화면에 더 적합하게 */
    @media (max-width: 480px) {
      .detail-container {
        max-width: 100%;
        padding-left: 8px;
        padding-right: 8px;
      }
      .backdrop {
        height: 140px;
      }
      .movie-poster {
        max-width: 100%;
      }
      .cast-img {
        width: 75px;
        height: 113px;
      }
      .recommendation-item {
        min-width: 80px;
      }
      .company-logo {
        max-width: 80px;
        height: 30px;
      }
    }
  `}</style>

      <div className="detail-container">
        {/* 배경 이미지 + 제목 */}
        <div
          className="backdrop"
          style={{
            backgroundImage: movie.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
              : "none",
          }}
          aria-label={`${movie.title} 배경 이미지`}
        >
          <div className="backdrop-overlay">
            <h1 className="backdrop-title">{movie.title}</h1>
          </div>
        </div>

        {/* 영화 포스터, 개요, 기본 정보 */}
        <div className="movie-info" role="region" aria-label="영화 기본 정보">
          {movie.poster_path && (
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={`${movie.title} 포스터`}
            />
          )}

          <p className="movie-tagline">{movie.tagline}</p>

          <div className="movie-details">
            <p>
              <strong>평점:</strong> {movie.vote_average} / 10 (
              {movie.vote_count}명)
            </p>
            <p>
              <strong>개봉일:</strong> {movie.release_date}
            </p>
            <p>
              <strong>장르:</strong>{" "}
              {movie.genres?.map((g) => g.name).join(", ") || "정보 없음"}
            </p>
            <p>
              <strong>상영 시간:</strong> {movie.runtime}분
            </p>
          </div>
        </div>

        {/* OTT 플랫폼 */}
        {watchProviders && watchProviders.length > 0 && (
          <section
            className="watch-providers"
            aria-label="시청 가능한 OTT 플랫폼"
          >
            <h3>시청 가능한 OTT 플랫폼</h3>
            <div className="providers-list">
              {watchProviders.map((provider) => (
                <img
                  key={provider.provider_id}
                  className="provider-logo"
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  title={provider.provider_name}
                />
              ))}
            </div>
          </section>
        )}

        {/* 예고편 */}
        {videoKey && (
          <section className="trailer" aria-label="예고편 영상">
            <h3>예고편</h3>
            <div className="trailer-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${videoKey}`}
                allowFullScreen
                title={`${movie.title} 예고편`}
                aria-describedby="youtube-video"
              ></iframe>
            </div>
          </section>
        )}

        {/* 줄거리 */}
        {movie.overview && (
          <section className="overview" aria-label="영화 줄거리">
            <h3>줄거리</h3>
            <p
              className={
                showFullOverview ? "overview-text full" : "overview-text"
              }
            >
              {movie.overview}
            </p>
            {movie.overview.length > 150 && (
              <button
                className="overview-toggle-btn"
                onClick={() => setShowFullOverview((prev) => !prev)}
                aria-expanded={showFullOverview}
                aria-controls="movie-overview"
              >
                {showFullOverview ? "간략히" : "더보기"}
              </button>
            )}
          </section>
        )}

        {/* 출연진 */}
        {cast.length > 0 && (
          <section className="cast-section" aria-label="출연진 정보">
            <h3>출연진</h3>
            <div className="cast-list">
              {cast.map((actor) => (
                <div key={actor.id} className="cast-item">
                  <img
                    className="cast-img"
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "/no_image_available.png"
                    }
                    alt={`${actor.name} 배우 사진`}
                  />
                  <p className="cast-name">{actor.name}</p>
                  <p className="cast-character">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 추천 영화 */}
        {recommendations.length > 0 && (
          <section className="recommendations" aria-label="추천 영화">
            <h3>추천 영화</h3>
            <div className="recommendations-list">
              {recommendations.map((rec) => (
                <div key={rec.id} className="recommendation-item">
                  <img
                    className="recommendation-poster"
                    src={
                      rec.poster_path
                        ? `https://image.tmdb.org/t/p/w185${rec.poster_path}`
                        : "/no_image_available.png"
                    }
                    alt={`${rec.title} 포스터`}
                  />
                  <p className="recommendation-title">{rec.title}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 제작사 */}
        {movie.production_companies &&
          movie.production_companies.length > 0 && (
            <section
              className="production-companies"
              aria-label="제작사 정보"
              style={{ marginTop: "24px" }}
            >
              <h3>제작사</h3>
              <div className="company-logos">
                {movie.production_companies.map((company) =>
                  company.logo_path ? (
                    <img
                      key={company.id}
                      className="company-logo"
                      src={`https://image.tmdb.org/t/p/w185${company.logo_path}`}
                      alt={company.name}
                      title={company.name}
                    />
                  ) : null
                )}
              </div>
            </section>
          )}
      </div>
    </>
  );
}

export default Detail;
