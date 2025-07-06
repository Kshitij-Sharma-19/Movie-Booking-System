import { useQuery } from "@tanstack/react-query";
import { getAllMovies } from "../services/movieService";

export const useMovies = () =>
  useQuery({
    queryKey: ["movies"],
    queryFn: getAllMovies,
  });
