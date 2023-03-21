package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.ScheduleEvent;

/**
 * Spring Data JPA repository for the ScheduleEvent entity.
 */
@Repository
public interface ScheduleEventRepository extends JpaRepository<ScheduleEvent, Long> {
    @Query("select scheduleEvent from ScheduleEvent scheduleEvent where scheduleEvent.user.login = ?#{principal.username}")
    List<ScheduleEvent> findByUserIsCurrentUser();

    default Optional<ScheduleEvent> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ScheduleEvent> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ScheduleEvent> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct scheduleEvent from ScheduleEvent scheduleEvent left join fetch scheduleEvent.user",
        countQuery = "select count(distinct scheduleEvent) from ScheduleEvent scheduleEvent"
    )
    Page<ScheduleEvent> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct scheduleEvent from ScheduleEvent scheduleEvent left join fetch scheduleEvent.user")
    List<ScheduleEvent> findAllWithToOneRelationships();

    @Query("select scheduleEvent from ScheduleEvent scheduleEvent left join fetch scheduleEvent.user where scheduleEvent.id =:id")
    Optional<ScheduleEvent> findOneWithToOneRelationships(@Param("id") Long id);
}
