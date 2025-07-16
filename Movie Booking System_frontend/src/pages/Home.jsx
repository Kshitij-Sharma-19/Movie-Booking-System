import React, { useEffect, useState, useMemo } from "react";
import {
  Typography,
  Button,
  Box,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Grid,
  Skeleton,
  IconButton,
  MobileStepper,
  Chip,
  Rating,
} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link } from "react-router-dom";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarIcon from "@mui/icons-material/Star";
import logo from "../assets/images/logo.png";
import { getAllMovies } from "../services/movieService";
import YouTube from 'react-youtube';

// OMDb utility
const OMDB_API_KEY = "YOUR_OMDB_KEY";
const fetchOmdbData = async (title, year) => {
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}${
    year ? `&y=${year}` : ""
  }&apikey=${OMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch OMDb data");
  return res.json();
};

// Utility to get poster from assets
const getPosterUrl = (movieTitle) => {
  if (!movieTitle) return "default.jpg";
  // Clean the movie title for filename
  const cleanTitle = movieTitle
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
    console.log(cleanTitle);
  return `/assests/posters/${cleanTitle}.jpeg`;
};

// Enhanced Banner Component
const Banner = ({ movies, activeIndex, setActiveIndex, bannerPaused, setBannerPaused }) => {
  const [omdb, setOmdb] = useState(null);
  const [imageError, setImageError] = useState(false);


  const movie = movies?.[activeIndex] || null;

  useEffect(() => {
    if (movie?.title) {
      setOmdb(null);
      setImageError(false);
      fetchOmdbData(movie.title, movie.releaseDate?.slice(0, 4))
        .then((data) => {
          if (data && data.Response === "True") setOmdb(data);
          else setOmdb(null);
        })
        .catch(() => setOmdb(null));
    }
  }, [movie]);

  if (!movie) {
    return (
      <Box sx={{ width: "100%", height: 500, mb: 4, mt: 4 }}>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={500}
          sx={{ borderRadius: 3 }}
        />
      </Box>
    );
  }

  // Priority: Local assets > OMDb poster > movie.posterUrl
  const bannerImg = !imageError 
    ? getPosterUrl(movie.title)
    : (omdb && omdb.Poster && omdb.Poster !== "N/A" && omdb.Poster) ||
      movie.posterUrl ||
      "";
    

  const handleNextSlide = () => {
    setActiveIndex((i) => (i === movies.length - 1 ? 0 : i + 1));
  };

  const handlePrevSlide = () => {
    setActiveIndex((i) => (i === 0 ? movies.length - 1 : i - 1));
  };

  return (
    <Box sx={{ width: "100%", position: "relative", mb: 6 }}>
      {/* Main Banner Container */}
      <Box
  sx={{
    width: "100%",
    height: { xs: 400, sm: 450, md: 500 },
    marginTop: -3,
    position: "relative",
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    backgroundColor: "#000", // fallback in case image fails to load
    backgroundImage: `
      linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.95) 0%,
        rgba(0, 0, 0, 0.7) 40%,
        rgba(0, 0, 0, 0.3) 70%,
        rgba(0, 0, 0, 0.1) 100%
      ),
      url(${bannerImg})
    `,
    backgroundSize: "contain", // or try "contain" if image is getting cropped
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundAttachment: "scroll", // prevents parallax-type zooming
    display: "flex",
    alignItems: "center",
    transition: "all 0.5s ease-in-out",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(45deg, rgba(139, 69, 19, 0.1) 0%, rgba(255, 140, 0, 0.05) 100%)",
      zIndex: 1,
    }
  }}
>
        {/* Background Image with Error Handling */}
        <img
          src={bannerImg}
          alt=""
          onError={() => setImageError(true)}
          style={{ display: "none" }}
        />

        {/* Navigation Arrows */}
        <IconButton
          onClick={handlePrevSlide}
          sx={{
            position: "absolute",
            left: { xs: 8, md: 20 },
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            color: "#fff",
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            width: { xs: 40, md: 50 },
            height: { xs: 40, md: 50 },
            transition: "all 0.3s ease",
            "&:hover": { 
              backgroundColor: "rgba(255,193,7,0.8)",
              transform: "translateY(-50%) scale(1.1)",
              color: "#000"
            },
            "&:hover .arrow-icon": {
      transform: "translateX(-4px)",
    },
          }}
        >
          <KeyboardArrowLeft fontSize="large" 
             className="arrow-icon" 
    sx={{
      transition: "transform 0.3s ease",
    }}
          />
        </IconButton>

        <IconButton
          onClick={handleNextSlide}
          sx={{
            position: "absolute",
            right: { xs: 8, md: 20 },
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            color: "#fff",
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            width: { xs: 40, md: 50 },
            height: { xs: 40, md: 50 },
            transition: "all 0.3s ease",
            "&:hover": { 
              backgroundColor: "rgba(255,193,7,0.8)",
              transform: "translateY(-50%) scale(1.1)",
              color: "#000",
            },
            "&:hover .arrow-icon": {
      transform: "translateX(4px)", // 👈 Slide to right
    },
          }}
        >
          <KeyboardArrowRight fontSize="large" 
             className="arrow-icon" // 👈 Target with hover
    sx={{
      transition: "transform 0.3s ease", // 👈 Smooth movement
    }}
          />
        </IconButton>

        {/* Content Container */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            color: "white",
            px: { xs: 3, sm: 4, md: 6 },
            py: { xs: 3, md: 4 },
            maxWidth: { xs: "100%", md: "60%" },
            width: "100%",
          }}
        >
        <Box sx={{ ml: 3 }}>
          {/* Movie Title */}
          <Typography
  variant="h2"
  component="h1"
  sx={{
    fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', 'Arial Black', Gadget, sans-serif",
    fontWeight: "bold",
    fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
    mb: 2,
    textShadow: "2px 2px 8px rgba(0,0,0,0.35)",
    letterSpacing: "0.05em",
    lineHeight: 1.2,
    color: "#ffd500ff", // Gold for cinematic effect
  }}
>
  {movie.title}
</Typography>

          {/* Movie Info Chips */}
          <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" gap={1}>
            {movie.releaseDate && (
              <Chip
                icon={<CalendarTodayIcon />}
                label={new Date(movie.releaseDate).getFullYear()}
                onClick = {(e) =>e.preventDefault()}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  fontWeight: 600,
                }}
              />
            )}
            {movie.genre && (
              <Chip
                label={movie.genre}
                onClick = {(e) =>e.preventDefault()}
                sx={{
                  backgroundColor: "rgba(255,193,7,0.2)",
                  color: "#ffd700",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,193,7,0.3)",
                  fontWeight: 600,
                }}
              />
            )}
            {true && (
              <Chip
                icon={<AccessTimeIcon />}
                label={movie.durationMinutes +" minutes"}
                onClick = {(e) => e.preventDefault()}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  fontWeight: 600,
                }}
              />
            )}
          </Stack>

          {/* Rating */}
          {omdb?.imdbRating && omdb.imdbRating !== "N/A" && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating
                value={parseFloat(omdb.imdbRating) / 2}
                precision={0.1}
                readOnly
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarIcon fontSize="inherit" />}
                sx={{
                  "& .MuiRating-iconFilled": { color: "#ffd700" },
                  "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.3)" },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  color: "#ffd700",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                }}
              >
                {omdb.imdbRating}/10
              </Typography>
            </Box>
          )}

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.9)",
              textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
              maxWidth: "90%",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {omdb?.Plot && omdb.Plot !== "N/A"
              ? omdb.Plot
              : movie.description || "Discover this amazing movie experience."}
          </Typography>

          {/* Action Buttons */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<LocalMoviesIcon />}
              component={Link}
              to={`/movies/${movie.id}`}
              sx={{
                background: "linear-gradient(45deg, #ff6b35, #ff8c42)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.1rem",
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 8px 16px rgba(255, 107, 53, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(45deg, #ff8c42, #ff6b35)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 24px rgba(255, 107, 53, 0.4)",
                },
              }}
            >
              Book Tickets
            </Button>
            
            {movie.trailerYoutubeId && (
  <a
    href={`https://www.youtube.com/watch?v=${movie.trailerYoutubeId}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none" }} // optional: removes underline
    onClick={() => setBannerPaused(true)}
  >
    <Button
    endIcon={<YouTubeIcon/>}
      variant="outlined"
      size="large"
      startIcon={<PlayArrowIcon />}
      sx={{
        borderColor: "rgba(255,255,255,0.5)",
        color: "#fff",
        fontWeight: 600,
        fontSize: "1.1rem",
        px: 4,
        py: 1.5,
        borderRadius: 3,
        textTransform: "none",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255,255,255,0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.2)",
          borderColor: "#fff",
          transform: "translateY(-2px)",
        },
      }}
    >
      Watch Trailer on
    </Button>
  </a>
)}
          </Stack>
        </Box>
        </Box>

        {/* Trailer/Poster Container - Desktop Only */}
        <Box
          sx={{
            position: "absolute",
            right: { md: 40 },
            top: "50%",
            transform: "translateY(-50%)",
            width: { md: 320, lg: 400 },
            height: { md: 200, lg: 250 },
            display: { xs: "none", md: "block" },
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 15px 30px rgba(0,0,0,0.4)",
            border: "3px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(5px)",
            zIndex: 3,
          }}
        >
          {movie.trailerYoutubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=0&mute=1&controls=1&rel=0`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onMouseEnter={() => setBannerPaused(true)}
              onMouseLeave={() => setBannerPaused(false)}
              onClick={()=> setBannerPaused(true)}
              style={{ borderRadius: "8px" }}
            />
          ) : (
            <img
              src={bannerImg}
              alt={movie.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
        </Box>
      </Box>

      {/* Slide Indicators */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 3,
          gap: 1,
        }}
      >
        {movies.map((_, index) => (
          <Box
            key={index}
            onClick={() => setActiveIndex(index)}
            sx={{
              width: activeIndex === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: activeIndex === index ? "#ff6b35" : "rgba(0,0,0,0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: activeIndex === index ? "#ff8c42" : "rgba(0,0,0,0.5)",
                transform: "scale(1.2)",
              },
            }}
          />
        ))}
      </Box>

      {/* Mobile Stepper */}
      <MobileStepper
        variant="text"
        steps={movies.length}
        position="static"
        activeStep={activeIndex}
        sx={{
          background: "transparent",
          justifyContent: "center",
          display: { xs: "flex", md: "none" },
          mt: 2,
        }}
        nextButton={
          <IconButton
            size="small"
            onClick={handleNextSlide}
            sx={{
              color: "#ff6b35",
              "&:hover": { backgroundColor: "rgba(255, 107, 53, 0.1)" },
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        }
        backButton={
          <IconButton
            size="small"
            onClick={handlePrevSlide}
            sx={{
              color: "#ff6b35",
              "&:hover": { backgroundColor: "rgba(255, 107, 53, 0.1)" },
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
        }
      />
    </Box>
  );
};

// Enhanced Now Showing Section
const NowShowingSection = ({ movies }) => (
  <Box sx={{ width: "100%", mb: 6 }}>
    <Typography 
      variant="h3" 
      fontWeight="bold" 
      mb={4}
      sx={{
        textAlign: "center",
        background: "linear-gradient(45deg, #333, #666)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Now Showing
    </Typography>
    <Grid container spacing={3}>
      {movies.length === 0
        ? Array.from({ length: 6 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))
        : movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card 
  sx={{ 
    borderRadius: 3, 
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    height: "100%",
    transition: "all 0.3s ease",
    background: "linear-gradient(135deg, #232526 0%, #414345 100%)", // subtle background
    position: "relative",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
    }
  }}
>
  <CardActionArea component={Link} to={`/movies/${movie.id}`}>
    <Box
      sx={{
        width: "100%",
        height: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 60%, rgba(255,255,255,0.06), rgba(0,0,0,0.12) 80%)",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: "hidden",
        position: "relative"
      }}
    >
      <CardMedia
        component="img"
        image={getPosterUrl(movie.title) || movie.posterUrl || ""}
        alt={movie.title}
        sx={{
          objectFit: "contain", // <-- prevents zoom/crop
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.08)",
          transition: "transform 0.4s",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          borderRadius: 2,
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: "0 8px 36px rgba(255, 193, 7, 0.15)",
          },
        }}
        onError={(e) => {
          // fallback: blank or placeholder image (optional)
          e.target.onerror = null;
          e.target.src = movie.posterUrl || "/default-poster.png";
        }}
      />
    </Box>
    <CardContent sx={{ p: 2 }}>
      <Typography
        gutterBottom
        variant="h6"
        component="div"
        sx={{
          fontFamily:"monospace",
          fontWeight: 700,
          fontSize: "1.1rem",
          mb: 1,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {movie.title}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {movie.genre}
      </Typography>
    </CardContent>
  </CardActionArea>
</Card>
            </Grid>
          ))}
    </Grid>
  </Box>
);

// Enhanced Latest Movies Section
const LatestMoviesSection = ({ movies }) => {
  return (
    <Box sx={{ width: "100%", mb: 6 }}>
      <Typography 
        variant="h3" 
        fontWeight="bold" 
        mb={4}
        sx={{
          textAlign: "center",
          background: "linear-gradient(45deg, #333, #666)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Latest Releases
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          pb: 2,
          px: 1,
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,0.1)",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(45deg, #ff6b35, #ff8c42)",
            borderRadius: 4,
            "&:hover": {
              background: "linear-gradient(45deg, #ff8c42, #ff6b35)",
            },
          },
        }}
      >
        {movies.length === 0
          ? Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton
                key={idx}
                variant="rectangular"
                width={250}
                height={400}
                sx={{ borderRadius: 3, flex: "0 0 auto" }}
              />
            ))
          : movies.map((movie) => (
              <Card
                key={movie.id}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  minWidth: 250,
                  maxWidth: 280,
                  flex: "0 0 auto",
                  scrollSnapAlign: "start",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
                  }
                }}
              >
                <CardActionArea component={Link} to={`/movies/${movie.id}`}>
                  <CardMedia
                    component="img"
                    image={movie.posterUrl || "default.jpeg"}
                    alt={movie.title}
                    height="320"
                    sx={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = movie.posterUrl || "default.jpeg";
                    }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {movie.genre}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
      </Box>
    </Box>
  );
};

const getRandomUnique = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

// Enhanced Home Component
const Home = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [bannerMovies, setBannerMovies] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [latestMovies, setLatestMovies] = useState([]);
  const [bannerPaused, setBannerPaused] = useState(false);

  useEffect(() => {
    getAllMovies()
      .then((res) => {
        const movies = res.data || [];
        setAllMovies(movies);

        // 4 random movies for banner
        setBannerMovies(getRandomUnique(movies, 4));

        // 5 latest movies by releaseDate (desc)
        const latest = [...movies]
          .filter((m) => m.releaseDate)
          .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
          .slice(0, 5);
        setLatestMovies(latest);
      })
      .catch(() => {
        setAllMovies([]);
        setBannerMovies([]);
        setLatestMovies([]);
      });
  }, []);

  // Auto-advance banner every 8 seconds
  useEffect(() => {
  if (bannerMovies.length > 1 && !bannerPaused) {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev === bannerMovies.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }
}, [bannerMovies.length, bannerPaused]);

  useEffect(() => {
  const onFocus = () => setBannerPaused(false);
  window.addEventListener('focus', onFocus);
  return () => window.removeEventListener('focus', onFocus);
}, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Banner Carousel */}
        <Banner 
          movies={bannerMovies} 
          activeIndex={bannerIndex} 
          setActiveIndex={setBannerIndex}
          bannerPaused={bannerPaused}
          setBannerPaused={setBannerPaused}
        />

        {/* Welcome Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography 
            variant="h2" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              background: "linear-gradient(45deg, #333, #666)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            Welcome to CineShowtime!
          </Typography>

          <Typography 
            variant="h5" 
            color="text.secondary" 
            mb={4}
            sx={{ fontWeight: 400, maxWidth: "600px", mx: "auto" }}
          >
            Discover, book and enjoy the latest movies at your favorite theaters!
          </Typography>

          <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={<LocalMoviesIcon />}
            component={Link}
            to="/movies"
            sx={{
              background: "linear-gradient(45deg, #ff6b35, #ff8c42)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.2rem",
              px: 6,
              py: 2,
              borderRadius: 3,
              textTransform: "none",
              boxShadow: "0 8px 16px rgba(255, 107, 53, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(45deg, #ff8c42, #ff6b35)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 24px rgba(255, 107, 53, 0.4)",
              },
            }}
          >
            Book Tickets Now
          </Button>
        </Box>

        {/* Latest Movies Section */}
        <LatestMoviesSection movies={latestMovies} />

        {/* How it works Section */}
<Box sx={{ textAlign: "center", mb: 4 }}>
  <Typography
    variant="h4"
    fontWeight="bold"
    mb={4}
    sx={{
      background: "linear-gradient(45deg, #333, #666)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    How it Works
  </Typography>

  <Box
    sx={{
      maxWidth: 900,
      mx: "auto",
      background: "rgba(255,255,255,0.92)",
      borderRadius: 4,
      p: 4,
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      backdropFilter: "blur(10px)",
    }}
  >
    <Grid
      container
      spacing={3}
      alignItems="stretch"
      justifyContent="center"
    >
      {[
        { step: 1, title: "Browse Movies", desc: "Check out currently running and upcoming movies", icon: "🎬" },
        { step: 2, title: "Select Showtime", desc: "Pick your preferred time and theater", icon: "🕒" },
        { step: 3, title: "Book Your Seats", desc: "Choose your seats and confirm your booking", icon: "🎫" },
        { step: 4, title: "Get Tickets", desc: "Receive tickets through Email", icon: "📧" },
        { step: 5, title: "Enjoy the Show!", desc: "Sit back and enjoy your movie", icon: "🍿" },
      ].map((item) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={item.step}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              width: { xs: "100%", sm: 220, md: 230 },
              minHeight: 170,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.7)",
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            }}
          >
            <Typography variant="h2" sx={{ mb: 1 }}>
              {item.icon}
            </Typography>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {item.step}. {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.desc}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
</Box>
      </Box>
    </Box>
  );
};

export default Home;