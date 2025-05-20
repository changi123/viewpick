import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Detail.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function Detail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
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

  useEffect(() => {
    fetchMovieDetail();
    fetchWatchProviders();
  }, [id]);

  if (!movie) return <p>로딩 중...</p>;

  return (
    <div className="detail-container">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <div className="detail-info">
        <h1>{movie.title}</h1>

        <div className="summary-row">
          <div className="summary-item">
            📅 <span>{movie.release_date}</span>
          </div>
          <div className="summary-item">
            ⭐ <span>{movie.vote_average}</span>
          </div>
        </div>

        {watchProviders && (
          <div className="ott-section">
            <h3>📺 OTT:</h3>
            <div className="ott-icons">
              {watchProviders.map((provider) => (
                <img
                  key={provider.provider_id}
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  title={provider.provider_name}
                  className="ott-icon"
                />
              ))}
            </div>
          </div>
        )}

        <div
          className={`overview-toggle ${showFullOverview ? "expanded" : ""}`}
        >
          <p>{movie.overview}</p>
        </div>
        {movie.overview.length > 120 && (
          <span
            className="show-more-btn"
            onClick={() => setShowFullOverview(!showFullOverview)}
          >
            {showFullOverview ? "간략히 보기" : "더보기"}
          </span>
        )}
      </div>
    </div>
  );
}

export default Detail;
