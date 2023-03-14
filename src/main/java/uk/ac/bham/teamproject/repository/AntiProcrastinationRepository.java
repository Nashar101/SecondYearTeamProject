package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.AntiProcrastination;

/**
 * Spring Data JPA repository for the AntiProcrastination entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AntiProcrastinationRepository extends JpaRepository<AntiProcrastination, Long> {}
