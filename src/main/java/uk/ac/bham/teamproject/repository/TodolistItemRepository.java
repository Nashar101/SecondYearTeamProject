package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.TodolistItem;

/**
 * Spring Data JPA repository for the TodolistItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TodolistItemRepository extends JpaRepository<TodolistItem, Long> {}
