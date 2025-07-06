import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import noImage from '../../assets/images/no-image.jpg';
const MovieCard = ({ movie }) => {
  // console.log(movie);
  return (
    <Card sx={{ maxWidth: 300, m: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: "300px", height: "400px", objectFit: "contain" }}
        image={movie.posterUrl || noImage}
        alt={movie.title}
      />
      <CardContent>
        <Typography variant="h6" noWrap>{movie.title} </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.genre} | ⭐ {movie.rating}
        </Typography>
        <Box mt={1}>
          <Button variant="outlined" size="small" component={Link} to={`/movies/${movie.id}`}>
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
