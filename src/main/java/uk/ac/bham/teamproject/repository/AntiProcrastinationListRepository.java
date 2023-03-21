package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.AntiProcrastinationList;

/**
 * Spring Data JPA repository for the AntiProcrastinationList entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AntiProcrastinationListRepository extends JpaRepository<AntiProcrastinationList, Long> {}
