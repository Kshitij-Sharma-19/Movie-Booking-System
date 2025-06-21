import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <Card sx={{ maxWidth: 300, m: 2 }}>
      <CardMedia
        component="img"
        height="300"
        image={movie.poster || "/assets/images/no-image.jpg"}
        alt={movie.title}
      />
      <CardContent>
        <Typography variant="h6">{movie.title}</Typography>
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
