import React, { useState, useEffect, useRef } from "react";
import { getRandomMovies } from "../api/tmdb";
import { Link } from "react-router-dom";

function Home() {
  const [movies, setMovies] = useState([]);
  const [mood, setMood] = useState("");
  const selectRef = useRef(null);

  const moodGenreMap = {
    happy: [35, 16, 10749, 10751], // 코미디, 애니, 로맨스, 가족
    sad: [18, 10402], // 드라마, 음악
    bored: [28, 53, 80], // 액션, 스릴러, 범죄
    excited: [12, 14, 878], // 모험, 판타지, SF
    scared: [27, 9648], // 공포, 미스터리
    curious: [99, 36], // 다큐멘터리, 역사
  };

  const fetchMovies = async () => {
    try {
      const genreIds = moodGenreMap[mood] || [];
      const moviesData = await getRandomMovies(genreIds);
      setMovies(moviesData);
    } catch (error) {
      console.error("영화 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleMoodChange = (e) => {
    setMood(e.target.value);
    // 선택 후 드롭다운 닫기 위해 포커스 해제
    if (selectRef.current) {
      selectRef.current.blur();
    }
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Noto Sans KR', sans-serif",
      textAlign: "center",
    },
    title: {
      fontSize: "2.5rem",
      marginBottom: "15px",
      color: "#333",
    },
    dropdownWrapper: {
      position: "relative",
      width: "100%",
      maxWidth: "320px",
      margin: "0 auto 20px",
    },
    dropdown: {
      width: "100%",
      padding: "14px 40px 14px 15px",
      fontSize: "1.2rem",
      borderRadius: "10px",
      border: "1.8px solid #ff6b6b",
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      backgroundColor: "#fff",
      boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)",
      cursor: "pointer",
    },
    dropdownIcon: {
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      fontSize: "1.4rem",
      color: "#ff6b6b",
    },
    button: {
      backgroundColor: "#ff6b6b",
      color: "white",
      border: "none",
      padding: "12px 25px",
      borderRadius: "8px",
      fontSize: "1.1rem",
      cursor: "pointer",
      marginBottom: "30px",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#ff4c4c",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "25px",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      textAlign: "left",
      transition: "transform 0.2s ease",
    },
    cardHover: {
      transform: "scale(1.03)",
    },
    poster: {
      width: "100%",
      height: "280px",
      objectFit: "cover",
      borderBottom: "1px solid #eee",
    },
    info: {
      padding: "15px",
    },
    titleText: {
      margin: "0 0 10px",
      fontSize: "1.2rem",
      color: "#222",
    },
    paragraph: {
      fontSize: "0.9rem",
      color: "#555",
      lineHeight: "1.3",
      marginBottom: "10px",
    },
    rating: {
      fontWeight: "700",
      color: "#ff9900",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎲 오늘 뭐 볼까?</h1>

      <div style={styles.dropdownWrapper}>
        <select
          id="mood"
          ref={selectRef}
          value={mood}
          onChange={handleMoodChange}
          style={styles.dropdown}
        >
          <option value="">-- 선택하세요 --</option>
          <option value="happy">😊 기분 전환이 필요해요</option>
          <option value="sad">😢 감성적인 게 좋아요</option>
          <option value="bored">😐 지루해요</option>
          <option value="excited">🤩 신나요</option>
          <option value="scared">😱 무서운 게 보고 싶어요</option>
          <option value="curious">🧠 뭔가 배우고 싶어요</option>
        </select>
        <span style={styles.dropdownIcon}>▼</span>
      </div>

      <button
        style={styles.button}
        onClick={fetchMovies}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#ff4c4c")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#ff6b6b")}
      >
        추천 받기
      </button>

      <div style={styles.grid}>
        {movies
          .filter((movie) => movie.overview && movie.poster_path)
          .map((movie) => (
            <Link
              to={`/detail/${movie.id}`}
              key={movie.id}
              style={styles.card}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                style={styles.poster}
              />
              <div style={styles.info}>
                <h3 style={styles.titleText}>{movie.title}</h3>
                <p style={styles.paragraph}>{movie.overview.slice(0, 80)}...</p>
                <p style={styles.rating}>⭐ {movie.vote_average}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Home;
