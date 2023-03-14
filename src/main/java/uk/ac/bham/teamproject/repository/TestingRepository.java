package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Testing;

/**
 * Spring Data JPA repository for the Testing entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TestingRepository extends JpaRepository<Testing, Long> {}
