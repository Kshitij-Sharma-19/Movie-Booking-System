package com.movie.moviecatalogservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movie.moviecatalogservice.dto.TheaterDto;
import com.movie.moviecatalogservice.exception.ResourceNotFoundException;
import com.movie.moviecatalogservice.model.Theater;
import com.movie.moviecatalogservice.repository.TheaterRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TheaterService {

    private final TheaterRepository theaterRepository;

    private TheaterDto convertToDto(Theater theater) {
       return TheaterDto.builder()
                .id(theater.getId())
                .name(theater.getName())
                .city(theater.getCity())
                .address(theater.getAddress())
                .totalSeats(theater.getTotalSeats())
                .build();
    }

    private Theater convertToEntity(TheaterDto theaterDto) {
        return Theater.builder()
                .name(theaterDto.getName())
                .city(theaterDto.getCity())
                .address(theaterDto.getAddress())
                .totalSeats(theaterDto.getTotalSeats())
                .build();
    }

    public List<TheaterDto> getAllTheaters() {
        log.info("Fetching all theaters");
        return theaterRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

     public List<TheaterDto> getTheatersByCity(String city) {
        log.info("Fetching theaters in city: {}", city);
        return theaterRepository.findByCityIgnoreCase(city).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TheaterDto getTheaterById(Long id) {
        log.info("Fetching theater by id: {}", id);
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theater", "id", id));
        return convertToDto(theater);
    }

    public TheaterDto addTheater(TheaterDto theaterDto) {
        log.info("Adding new theater: {}", theaterDto.getName());
        Theater theater = convertToEntity(theaterDto);
        Theater savedTheater = theaterRepository.save(theater);
        log.info("Theater added successfully with id: {}", savedTheater.getId());
        return convertToDto(savedTheater);
    }

    public TheaterDto updateTheater(Long id, TheaterDto theaterDto) {
        log.info("Updating theater with id: {}", id);
        Theater existingTheater = theaterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Theater", "id", id));

        existingTheater.setName(theaterDto.getName());
        existingTheater.setCity(theaterDto.getCity());
        existingTheater.setAddress(theaterDto.getAddress());
        existingTheater.setTotalSeats(theaterDto.getTotalSeats());

        Theater updatedTheater = theaterRepository.save(existingTheater);
        log.info("Theater updated successfully for id: {}", id);
        return convertToDto(updatedTheater);
    }

    public void deleteTheater(Long id) {
        log.warn("Attempting to delete theater with id: {}", id);
        if (!theaterRepository.existsById(id)) {
             throw new ResourceNotFoundException("Theater", "id", id);
        }
        theaterRepository.deleteById(id);
        log.info("Theater deleted successfully with id: {}", id);
    }
}